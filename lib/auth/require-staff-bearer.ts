import { NextResponse } from 'next/server'
import { getSupabaseUserIdFromAccessToken } from '@/lib/auth/verify-access-token'
import { getServiceSupabase } from '@/lib/supabase/service'

export type StaffPortalRole = 'admin' | 'staff' | 'coach'

export type VerifiedStaffContext = {
  userId: string
  /** Normalized lowercase role from `profiles.role`. */
  role: string
}

/**
 * Validates `Authorization: Bearer <Supabase access_token>` and checks `profiles.role`
 * against the allowed list (server-side; never trust client UI alone).
 */
export async function requireStaffRoles(
  req: Request,
  allowedRoles: readonly StaffPortalRole[]
): Promise<VerifiedStaffContext | NextResponse> {
  const auth = req.headers.get('authorization')
  const token = auth?.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : ''
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = await getSupabaseUserIdFromAccessToken(token)
  if (!userId) {
    return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 })
  }

  const sb = getServiceSupabase()
  if (!sb) {
    return NextResponse.json({ error: 'Server is not configured' }, { status: 503 })
  }

  const { data: row, error } = await sb.from('profiles').select('role').eq('id', userId).maybeSingle()
  if (error || !row) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const role = String((row as { role?: unknown }).role ?? '')
    .toLowerCase()
    .trim()
  const allow = new Set(allowedRoles.map(r => r.toLowerCase()))
  if (!allow.has(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return { userId, role }
}
