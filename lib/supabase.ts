import { createClient } from '@supabase/supabase-js'

const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
// Server-side: use internal Docker network URL if available (faster, no port-mapping hop)
const serverUrl = process.env.SUPABASE_INTERNAL_URL ?? publicUrl
const anonKey   = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

// Browser/client-side client — always uses the public URL
export const supabase = createClient(publicUrl, anonKey)

// Server-side admin client — uses internal URL in Docker, public URL on Vercel
export function getSupabaseAdmin() {
  if (!serverUrl || !serviceKey) throw new Error('Supabase admin credentials not configured')
  return createClient(serverUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
