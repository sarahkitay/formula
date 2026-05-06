import { supabase } from '@/lib/supabase'

/**
 * Same as `fetch`, but attaches `Authorization: Bearer <Supabase access_token>` when a session exists.
 * Use for staff/admin API routes that call `requireStaffRoles`.
 */
export async function staffApiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    console.warn('[staffApiFetch] getSession:', error.message)
  }
  const token = data.session?.access_token
  const headers = new Headers(init?.headers ?? undefined)
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  return fetch(input, { ...init, headers })
}
