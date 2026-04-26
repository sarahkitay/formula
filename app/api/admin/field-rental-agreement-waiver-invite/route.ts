import { NextResponse } from 'next/server'
import { linkFieldRentalAgreementWaiverInvite } from '@/lib/rentals/field-rental-agreements-server'

export const runtime = 'nodejs'

/** Admin: set `field_rental_agreements.waiver_invite_id` so the waiver counts toward a roster link (or clear it). */
export async function PATCH(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }
  const b = body as { agreementId?: unknown; waiverInviteId?: unknown }
  const agreementId = typeof b.agreementId === 'string' ? b.agreementId : ''
  const rawInvite = b.waiverInviteId
  const waiverInviteId =
    rawInvite === null || rawInvite === undefined || rawInvite === ''
      ? null
      : typeof rawInvite === 'string'
        ? rawInvite
        : null

  const result = await linkFieldRentalAgreementWaiverInvite({ agreementId, waiverInviteId })
  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 400 })
  }
  return NextResponse.json({ ok: true })
}
