// Run once to create Supabase storage buckets and verify the themes table.
// Usage: SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_KEY=... node scripts/setup-supabase.mjs
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing env vars: SUPABASE_URL and SUPABASE_SERVICE_KEY are required')
  console.error('  SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_KEY=eyJ... node scripts/setup-supabase.mjs')
  process.exit(1)
}

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function run() {
  console.log('ThemeDrop — Supabase Setup\n')

  // ── 1. Storage buckets ─────────────────────────────────────────
  console.log('Creating storage buckets...')
  for (const name of ['previews', 'downloads']) {
    const { error } = await admin.storage.createBucket(name, {
      public: true,
      allowedMimeTypes: name === 'previews'
        ? ['image/jpeg', 'image/png', 'image/webp']
        : ['application/zip', 'application/octet-stream'],
      fileSizeLimit: name === 'downloads' ? 104857600 : 10485760, // 100MB / 10MB
    })
    if (error && !error.message.toLowerCase().includes('already')) {
      console.error(`  ✗ ${name}: ${error.message}`)
    } else {
      console.log(`  ✓ bucket '${name}' ready`)
    }
  }

  // ── 2. Check themes table ───────────────────────────────────────
  console.log('\nChecking themes table...')
  const { error: tblErr } = await admin.from('themes').select('id').limit(1)
  if (tblErr && tblErr.message.includes('relation "themes" does not exist')) {
    console.log('  ✗ themes table not found — run the SQL in scripts/supabase-setup.sql')
    console.log(`    https://supabase.com/dashboard/project/${SUPABASE_URL.split('.')[0].replace('https://', '')}/sql/new`)
  } else if (tblErr) {
    console.error(`  ✗ Unexpected error: ${tblErr.message}`)
  } else {
    console.log('  ✓ themes table exists and is accessible')
  }

  // ── 3. Verify service role can write ─────────────────────────
  console.log('\nVerifying write access...')
  const { error: pingErr } = await admin.from('themes').select('count').limit(0)
  if (!pingErr) console.log('  ✓ service role can read/write themes')

  console.log('\nSetup complete.')
}

run().catch(err => { console.error(err); process.exit(1) })
