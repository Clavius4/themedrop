import { NextResponse } from 'next/server'
import { getSignedUploadUrl } from '@/lib/db'

export async function POST(request: Request) {
  const { bucket, path } = await request.json()
  if (!bucket || !path) return NextResponse.json({ error: 'bucket and path required' }, { status: 400 })

  if (!['previews', 'downloads'].includes(bucket)) {
    return NextResponse.json({ error: 'Invalid bucket' }, { status: 400 })
  }

  try {
    const urls = await getSignedUploadUrl(bucket, path)
    return NextResponse.json(urls)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
