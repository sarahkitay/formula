import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Server-only Supabase client with the service role. Used for webhooks and other trusted server paths.
 * Returns null if URL or service key is not configured.
 */
export function getServiceSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
