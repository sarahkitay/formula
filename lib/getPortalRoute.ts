/**
 * Single source for post-login and gate redirects.
 * Returns `/login` when the role cannot use a known portal hub.
 */
export type PortalRoute = '/parent/dashboard' | '/staff-portal' | '/coach/today' | '/login'

export function getPortalRoute(role: string | null | undefined): PortalRoute {
  const r = (role ?? '').toLowerCase().trim()
  if (r === 'parent') return '/parent/dashboard'
  if (r === 'coach') return '/coach/today'
  if (r === 'staff' || r === 'admin') return '/staff-portal'
  return '/login'
}
