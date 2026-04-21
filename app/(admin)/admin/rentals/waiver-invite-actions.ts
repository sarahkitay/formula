'use server'

import { revalidatePath } from 'next/cache'
import { createManualWaiverInvite } from '@/lib/rentals/waiver-invites-server'
import { getSiteOrigin } from '@/lib/stripe/server'

export async function createManualWaiverInviteAction(formData: FormData): Promise<{ ok: true; waiver_url: string } | { ok: false; message: string }> {
  const raw = formData.get('expectedWaiverCount')
  const expectedWaiverCount = typeof raw === 'string' ? parseInt(raw.trim(), 10) : NaN
  const rentalType = typeof formData.get('rentalType') === 'string' ? String(formData.get('rentalType')).trim() : ''
  const rentalRef = typeof formData.get('rentalRef') === 'string' ? String(formData.get('rentalRef')).trim() : ''
  const notes = typeof formData.get('notes') === 'string' ? String(formData.get('notes')).trim() : ''

  const validTypes = new Set(['', 'club_team_practice', 'private_semi_private', 'general_pickup'])
  if (!validTypes.has(rentalType)) {
    return { ok: false, message: 'Invalid rental type.' }
  }

  const created = await createManualWaiverInvite({
    expectedWaiverCount,
    rentalType: rentalType.length > 0 ? rentalType : null,
    rentalRef: rentalRef.length > 0 ? rentalRef : null,
    notes: notes.length > 0 ? notes : null,
  })

  if (!created.ok) {
    return { ok: false, message: created.message }
  }

  revalidatePath('/admin/rentals')
  const origin = getSiteOrigin()
  return { ok: true, waiver_url: `${origin}/rentals/waiver/${created.token}` }
}
