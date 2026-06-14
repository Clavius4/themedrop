import { Theme, OSDownload, Category } from '@/types'
import { THEMES } from './themes'

const CONFIGURED = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToTheme(row: Record<string, any>): Theme {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description,
    longDescription: row.long_description,
    category: row.category as Category,
    tags: row.tags ?? [],
    wallpaperCount: row.wallpaper_count ?? 10,
    color: row.color ?? '#C8A030',
    featured: row.featured ?? false,
    releaseDate: row.release_date ?? new Date().toISOString().split('T')[0],
    totalDownloads: row.total_downloads ?? 0,
    rating: Number(row.rating ?? 5.0),
    ratingCount: row.rating_count ?? 0,
    previews: row.previews ?? [],
    downloads: (row.downloads ?? []) as OSDownload[],
  }
}

async function admin() {
  const { getSupabaseAdmin } = await import('./supabase')
  return getSupabaseAdmin()
}

export async function getThemes(): Promise<Theme[]> {
  if (!CONFIGURED) return THEMES
  try {
    const db = await admin()
    const { data, error } = await db.from('themes').select('*').order('created_at', { ascending: false })
    if (error || !data?.length) return THEMES
    const dbThemes = data.map(rowToTheme)
    const dbSlugs = new Set(dbThemes.map(t => t.slug))
    return [...dbThemes, ...THEMES.filter(t => !dbSlugs.has(t.slug))]
  } catch (e) {
    console.error('getThemes:', e)
    return THEMES
  }
}

export async function getTheme(slug: string): Promise<Theme | undefined> {
  if (!CONFIGURED) return THEMES.find(t => t.slug === slug)
  try {
    const db = await admin()
    const { data } = await db.from('themes').select('*').eq('slug', slug).single()
    if (data) return rowToTheme(data)
  } catch {}
  return THEMES.find(t => t.slug === slug)
}

export async function getDBThemes(): Promise<Theme[]> {
  if (!CONFIGURED) return []
  try {
    const db = await admin()
    const { data } = await db.from('themes').select('*').order('created_at', { ascending: false })
    return (data ?? []).map(rowToTheme)
  } catch {
    return []
  }
}

export interface ThemeInput {
  slug: string
  name: string
  description: string
  long_description: string
  category: string
  tags: string[]
  wallpaper_count: number
  color: string
  featured: boolean
  release_date: string
  previews: string[]
  downloads: OSDownload[]
}

export async function createTheme(input: ThemeInput): Promise<{ error?: string }> {
  try {
    const db = await admin()
    const { error } = await db.from('themes').insert({
      ...input,
      total_downloads: 0,
      rating: 5.0,
      rating_count: 0,
    })
    if (error) return { error: error.message }
    return {}
  } catch (e) {
    return { error: String(e) }
  }
}

export async function updateTheme(slug: string, input: Partial<ThemeInput>): Promise<{ error?: string }> {
  try {
    const db = await admin()
    const { error } = await db.from('themes').update({ ...input, updated_at: new Date().toISOString() }).eq('slug', slug)
    if (error) return { error: error.message }
    return {}
  } catch (e) {
    return { error: String(e) }
  }
}

export async function deleteTheme(slug: string): Promise<{ error?: string }> {
  try {
    const db = await admin()
    const { error } = await db.from('themes').delete().eq('slug', slug)
    if (error) return { error: error.message }
    return {}
  } catch (e) {
    return { error: String(e) }
  }
}

export async function getSignedUploadUrl(
  bucket: string,
  path: string,
): Promise<{ signedUrl: string; publicUrl: string }> {
  // Local Docker / self-hosted: use MinIO via AWS S3 SDK
  if (process.env.S3_ENDPOINT) {
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3')
    const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner')
    const client = new S3Client({
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION ?? 'us-east-1',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID ?? 'minioadmin',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? 'minioadmin',
      },
      forcePathStyle: true,
    })
    const internalUrl = await getSignedUrl(
      client,
      new PutObjectCommand({ Bucket: bucket, Key: path }),
      { expiresIn: 3600 },
    )
    // Replace internal Docker hostname with the public-facing endpoint
    const publicEndpoint = process.env.S3_PUBLIC_ENDPOINT ?? process.env.S3_ENDPOINT
    const signedUrl = internalUrl.replace(process.env.S3_ENDPOINT, publicEndpoint)
    const publicUrl = `${publicEndpoint}/${bucket}/${path}`
    return { signedUrl, publicUrl }
  }

  // Production (Vercel): use Supabase Storage
  const db = await admin()
  const { data, error } = await db.storage.from(bucket).createSignedUploadUrl(path)
  if (error || !data) throw new Error(error?.message ?? 'Signed URL failed')
  const { data: pub } = db.storage.from(bucket).getPublicUrl(path)
  return { signedUrl: data.signedUrl, publicUrl: pub.publicUrl }
}
