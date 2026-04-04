import { createClient } from '@supabase/supabase-js'

/**
 * Browser / client-component client. Set `NEXT_PUBLIC_SUPABASE_URL` and
 * `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel (and `.env.local` for dev).
 *
 * Non-empty fallbacks allow `next build` when env is absent; real requests still need real keys.
 */
const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
  'https://__configure-next-public-supabase-url__.supabase.co'
const anon =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.__configure-anon-key__'

if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn('[supabase] NEXT_PUBLIC_SUPABASE_URL is not set. Configure env for auth to work.')
}

export const supabase = createClient(url, anon)
