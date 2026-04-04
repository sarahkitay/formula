/**
 * Single source for post-login and gate redirects.
 * Returns `/login` when the role cannot use either portal hub.
 */
export function getPortalRoute(role: string | null | undefined): '/parent-portal' | '/staff-portal' | '/login' {
  const r = (role ?? '').toLowerCase().trim()
  if (r === 'parent') return '/parent-portal'
  if (r === 'staff' || r === 'admin' || r === 'coach') return '/staff-portal'
  return '/login'
}
