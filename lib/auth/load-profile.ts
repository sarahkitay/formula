import { getPortalRoute } from '@/lib/getPortalRoute'
import { supabase } from '@/lib/supabase'
import type { ProfileRow } from '@/types/profile'

export async function loadProfileForUser(userId: string): Promise<{ profile: ProfileRow | null; error: Error | null }> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

  if (error) {
    return { profile: null, error: new Error(error.message) }
  }

  return { profile: data as ProfileRow, error: null }
}

/** Hub route for this role, or `null` if invalid (use `getPortalRoute` when you need `/login`). */
export function portalRouteForRole(
  role: string | null | undefined
): '/parent/dashboard' | '/staff-portal' | '/admin/dashboard' | '/coach/today' | null {
  const r = getPortalRoute(role)
  return r === '/login' ? null : r
}

export function staffDashboardHref(role: string | null | undefined): string {
  const r = (role ?? '').toLowerCase()
  if (r === 'coach') return '/coach/today'
  return '/admin/dashboard'
}
