/**
 * Single source for post-login and gate redirects.
 * Returns `/login` when the role cannot use either portal hub.
 */
export type PortalRoute = '/parent/dashboard' | '/staff-portal' | '/login'

export function getPortalRoute(role: string | null | undefined): PortalRoute {
  const r = (role ?? '').toLowerCase().trim()
  if (r === 'parent') return '/parent/dashboard'
  if (r === 'staff' || r === 'admin' || r === 'coach') return '/staff-portal'
  return '/login'
}
