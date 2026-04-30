import { NextResponse } from 'next/server'
import { listAgreementsForWaiverInvite } from '@/lib/rentals/field-rental-agreements-server'
import { getWaiverInviteById } from '@/lib/rentals/waiver-invites-server'

export const runtime = 'nodejs'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/** Admin calendar: roster invite snapshot + signed waivers linked to that invite. */
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id')?.trim() ?? ''
  if (!UUID.test(id)) {
    return NextResponse.json({ error: 'Invalid invite id' }, { status: 400 })
  }
  const invite = await getWaiverInviteById(id)
  if (!invite) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  const agreements = await listAgreementsForWaiverInvite(id)
  return NextResponse.json({ invite, agreements })
}
