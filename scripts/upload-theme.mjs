// Usage: node scripts/upload-theme.mjs
// Uploads the Peaky Blinders theme to the live Vercel+Supabase deployment

import fs from 'fs'
import path from 'path'

const BASE = 'https://themedrop-henna.vercel.app'
const ASSETS = path.join(process.cwd(), 'public')

// ── 1. Login ─────────────────────────────────────────────────────────────────
async function login() {
  const res = await fetch(`${BASE}/api/admin/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'ThemeDrop' }),
  })
  if (!res.ok) throw new Error(`Login failed: ${res.status}`)
  const setCookie = res.headers.get('set-cookie') ?? ''
  const match = setCookie.match(/themedrop-admin=([^;]+)/)
  if (!match) throw new Error('No auth cookie in response')
  console.log('✓ Logged in')
  return `themedrop-admin=${match[1]}`
}

// ── 2. Get signed upload URL ──────────────────────────────────────────────────
async function getSignedUrl(cookie, bucket, filePath) {
  const res = await fetch(`${BASE}/api/admin/upload-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({ bucket, path: filePath }),
  })
  if (!res.ok) throw new Error(`upload-url failed: ${res.status} ${await res.text()}`)
  return res.json()
}

// ── 3. PUT file to signed URL ─────────────────────────────────────────────────
async function uploadFile(signedUrl, localPath, label) {
  const data = fs.readFileSync(localPath)
  const contentType = localPath.endsWith('.zip')
    ? 'application/zip'
    : localPath.endsWith('.jpg') ? 'image/jpeg' : 'application/octet-stream'

  const res = await fetch(signedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: data,
  })
  if (res.ok) {
    console.log(`  ✓ ${label}`)
  } else {
    const body = await res.text().catch(() => '')
    throw new Error(`Upload failed [${res.status}] ${label}: ${body.slice(0, 200)}`)
  }
}

// ── 4. Create theme record ────────────────────────────────────────────────────
async function createTheme(cookie, themeData) {
  const res = await fetch(`${BASE}/api/admin/themes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify(themeData),
  })
  const body = await res.json()
  if (!res.ok) throw new Error(`createTheme failed: ${JSON.stringify(body)}`)
  return body
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\nThemeDrop — Uploading Peaky Blinders theme\n')

  const cookie = await login()
  const previewUrls = []
  const downloads = []

  // Upload previews
  console.log('\nUploading preview images...')
  for (let i = 1; i <= 3; i++) {
    const storagePath = `peaky-blinders/${i}.jpg`
    const localFile   = path.join(ASSETS, 'previews', `peaky-blinders-${i}.jpg`)
    const { signedUrl, publicUrl } = await getSignedUrl(cookie, 'previews', storagePath)
    await uploadFile(signedUrl, localFile, `Preview ${i}`)
    previewUrls.push(publicUrl)
  }

  // Upload downloads
  console.log('\nUploading download ZIPs...')
  const osList = [
    { os: 'windows', label: 'Windows', icon: '🪟' },
    { os: 'macos',   label: 'macOS',   icon: '🍎' },
    { os: 'ubuntu',  label: 'Ubuntu',  icon: '🐧' },
    { os: 'kde',     label: 'KDE',     icon: '🔷' },
  ]
  for (const { os, label } of osList) {
    const storagePath = `peaky-blinders/${os}.zip`
    const localFile   = path.join(ASSETS, 'downloads', `peaky-blinders-${os}.zip`)
    const { signedUrl, publicUrl } = await getSignedUrl(cookie, 'downloads', storagePath)
    await uploadFile(signedUrl, localFile, `${label} ZIP`)
    downloads.push({ os, label, url: publicUrl, size: `${(fs.statSync(localFile).size / 1024).toFixed(0)} KB` })
  }

  // Create theme record
  console.log('\nCreating theme record in Supabase...')
  const theme = {
    slug:             'peaky-blinders',
    name:             'Peaky Blinders',
    description:      'A dark, moody theme inspired by the Shelby gang — muted golds, deep charcoals, and industrial Birmingham grit.',
    long_description: 'Step into the fog-drenched streets of 1920s Birmingham. The Peaky Blinders theme wraps your desktop in deep charcoal backgrounds, muted brass accents, and weathered textures that evoke the Shelby family\'s iron-fisted world. Every wallpaper is sourced from cinematic stills and custom-designed art that captures the drama, power, and raw elegance of the show. Whether you\'re running Windows, macOS, GNOME, or KDE — your desktop will look like it belongs in the Garrison Tavern.',
    category:         'tv-shows',
    tags:             ['dark', 'cinematic', 'moody', 'british', 'period', 'crime'],
    wallpaper_count:  12,
    color:            '#C8A030',
    featured:         true,
    release_date:     new Date().toISOString().split('T')[0],
    previews:         previewUrls,
    downloads,
  }

  await createTheme(cookie, theme)
  console.log('  ✓ Theme record created')

  console.log('\n✅ Done! Peaky Blinders theme is now live.')
  console.log(`   Public: ${BASE}/theme/peaky-blinders`)
  console.log(`   Admin:  ${BASE}/admin`)
}

main().catch(err => { console.error('\n✗ Error:', err.message); process.exit(1) })
