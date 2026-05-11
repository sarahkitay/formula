import { NextResponse } from 'next/server'
import { requireStaffRoles } from '@/lib/auth/require-staff-bearer'
import { updateWaiverInviteExpectedWaiverCount } from '@/lib/rentals/waiver-invites-server'

export const runtime = 'nodejs'

/** Admin: set `expected_waiver_count` on a roster invite (cannot go below linked waiver rows). */
export async function PATCH(req: Request) {
  const gate = await requireStaffRoles(req, ['admin', 'staff'])
  if (gate instanceof NextResponse) return gate

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }
  const b = body as Record<string, unknown>
  const id = typeof b.id === 'string' ? b.id : ''
  const raw = b.expectedWaiverCount
  const n = typeof raw === 'number' ? raw : parseInt(String(raw ?? ''), 10)

  const result = await updateWaiverInviteExpectedWaiverCount(id, n)
  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 400 })
  }
  return NextResponse.json({ ok: true })
}
