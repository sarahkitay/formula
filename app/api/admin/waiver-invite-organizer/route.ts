import { NextResponse } from 'next/server'
import { updateWaiverInviteOrganizer } from '@/lib/rentals/waiver-invites-server'

export const runtime = 'nodejs'

/** Admin: set `purchaser_name` / `purchaser_email` on a roster waiver invite. */
export async function PATCH(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }
  const b = body as { id?: unknown; purchaserName?: unknown; purchaserEmail?: unknown }
  const id = typeof b.id === 'string' ? b.id : ''
  const purchaserName = typeof b.purchaserName === 'string' ? b.purchaserName : ''
  const purchaserEmail = typeof b.purchaserEmail === 'string' ? b.purchaserEmail : ''
  const result = await updateWaiverInviteOrganizer({ id, purchaserName, purchaserEmail })
  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 400 })
  }
  return NextResponse.json({ ok: true })
}
