import { NextResponse } from 'next/server'
import { requireStaffRoles } from '@/lib/auth/require-staff-bearer'
import { listWaiverInvitesWithProgress } from '@/lib/rentals/waiver-invites-server'

export const runtime = 'nodejs'

/** Staff: short list of recent field-rental roster invites for schedule / admin pickers. */
export async function GET(_req: Request) {
  const gate = await requireStaffRoles(_req, ['admin', 'staff'])
  if (gate instanceof NextResponse) return gate

  const rows = await listWaiverInvitesWithProgress(60)
  const invites = rows.map(r => {
    const name = (r.purchaser_name ?? '').trim()
    const ref = (r.rental_ref ?? '').trim()
    const parts = [name || null, ref || null, `signed ${r.completed_count}/${r.expected_waiver_count}`].filter(Boolean)
    return {
      id: r.id,
      label: parts.join(' · ').slice(0, 220),
    }
  })
  return NextResponse.json({ invites })
}
