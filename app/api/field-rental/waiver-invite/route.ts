import { NextResponse } from 'next/server'
import { countWaiversForInviteId, getWaiverInviteByToken } from '@/lib/rentals/waiver-invites-server'

export const runtime = 'nodejs'

/** Public progress for a roster waiver link (token only; no secrets). */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')?.trim() ?? ''
  const invite = await getWaiverInviteByToken(token)
  if (!invite) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }
  const completed = await countWaiversForInviteId(invite.id)
  const expected = invite.expected_waiver_count
  const remaining = Math.max(0, expected - completed)
  return NextResponse.json({
    expected,
    completed,
    remaining,
    rental_ref: invite.rental_ref,
    rental_type: invite.rental_type,
  })
}
