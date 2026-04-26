/**
 * Single source for post-login and gate redirects.
 * Returns `/login` when the role cannot use a known portal hub.
 *
 * - `admin` → full Admin OS (`/admin/dashboard`), not the lighter staff roster hub.
 * - `staff` → `/staff-portal` (desk / shared tools).
 * - `coach` → Coach execution shell (`/coach/today`).
 */
export type PortalRoute =
  | '/parent/dashboard'
  | '/staff-portal'
  | '/admin/dashboard'
  | '/coach/today'
  | '/login'

export function getPortalRoute(role: string | null | undefined): PortalRoute {
  const r = (role ?? '').toLowerCase().trim()
  if (r === 'parent') return '/parent/dashboard'
  if (r === 'coach') return '/coach/today'
  if (r === 'admin') return '/admin/dashboard'
  if (r === 'staff') return '/staff-portal'
  return '/login'
}
