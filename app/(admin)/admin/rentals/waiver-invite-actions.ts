'use server'

import { revalidatePath } from 'next/cache'
import { createManualWaiverInvite, createPaidInPersonFieldRentalInvite } from '@/lib/rentals/waiver-invites-server'
import { getSiteOrigin } from '@/lib/stripe/server'

function trimStr(formData: FormData, key: string): string {
  const v = formData.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

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

export async function createPaidInPersonFieldRentalInviteAction(
  formData: FormData
): Promise<{ ok: true; waiver_url: string } | { ok: false; message: string }> {
  const expectedRaw = trimStr(formData, 'expectedWaiverCount')
  const expectedWaiverCount = parseInt(expectedRaw, 10)
  const amountUsdRaw = trimStr(formData, 'amountUsd')
  const amountUsd = parseFloat(amountUsdRaw)
  const purchaserName = trimStr(formData, 'purchaserName')
  const purchaserEmail = trimStr(formData, 'purchaserEmail')
  const rentalType = trimStr(formData, 'rentalType')
  const rentalField = trimStr(formData, 'rentalField')
  const slotStart = trimStr(formData, 'slotStart')
  const durationRaw = trimStr(formData, 'durationMinutes')
  const durationMinutes = parseInt(durationRaw, 10)
  const anchorSessionDate = trimStr(formData, 'sessionDate')
  const weeksRaw = trimStr(formData, 'sessionWeeks')
  const sessionWeeks = parseInt(weeksRaw || '1', 10)
  const rentalRef = trimStr(formData, 'rentalRef')
  const notes = trimStr(formData, 'notes')

  if (!Number.isFinite(amountUsd) || amountUsd < 0.5) {
    return { ok: false, message: 'Enter the amount collected (USD), at least $0.50.' }
  }
  const amountTotalCents = Math.round(amountUsd * 100)

  const created = await createPaidInPersonFieldRentalInvite({
    expectedWaiverCount,
    amountTotalCents,
    currency: 'usd',
    purchaserName,
    purchaserEmail: purchaserEmail.length > 0 ? purchaserEmail : null,
    rentalType,
    rentalField,
    slotStart,
    durationMinutes,
    anchorSessionDate,
    sessionWeeks,
    rentalRef: rentalRef.length > 0 ? rentalRef : null,
    notes: notes.length > 0 ? notes : null,
  })

  if (!created.ok) {
    return { ok: false, message: created.message }
  }

  revalidatePath('/admin/rentals')
  revalidatePath('/admin/payments')
  revalidatePath('/admin/revenue-strategy')
  revalidatePath('/admin/overview')
  const origin = getSiteOrigin()
  return { ok: true, waiver_url: `${origin}/rentals/waiver/${created.token}` }
}
