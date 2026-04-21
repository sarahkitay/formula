'use server'

import { revalidatePath } from 'next/cache'
import { escapeHtml, sendAdminNotification } from '@/lib/email/send-admin-notification'
import { insertFieldRentalAgreement } from '@/lib/rentals/field-rental-agreements-server'
import { PARTICIPANT_SELF_WAIVER_RENTAL_TYPE } from '@/lib/rentals/field-rental-waiver-labels'
import { countWaiversForInviteId, getWaiverInviteByToken } from '@/lib/rentals/waiver-invites-server'

export type RentalAgreementState = {
  ok: boolean
  message: string
}

const INITIAL_STATE: RentalAgreementState = {
  ok: false,
  message: '',
}

function getRequiredString(formData: FormData, key: string): string | null {
  const value = formData.get(key)
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

/** Coach / renter booking waiver — must match form values. */
const COACH_BOOKING_RENTAL_TYPES = new Set(['club_team_practice', 'private_semi_private', 'general_pickup'])

export async function submitFieldRentalAgreement(
  _prevState: RentalAgreementState = INITIAL_STATE,
  formData: FormData
): Promise<RentalAgreementState> {
  const waiverInviteToken = getRequiredString(formData, 'waiverInviteToken')
  const waiverFormRole = getRequiredString(formData, 'waiverFormRole')
  const isCoachBookingWaiver = waiverFormRole === 'coach'

  let waiverInviteId: string | null = null
  let rosterExpected: number | null = null
  let rosterTokenForRevalidate: string | null = null
  let rosterInvite: Awaited<ReturnType<typeof getWaiverInviteByToken>> = null

  if (waiverInviteToken) {
    rosterTokenForRevalidate = waiverInviteToken
    rosterInvite = await getWaiverInviteByToken(waiverInviteToken)
    if (!rosterInvite) {
      return { ok: false, message: 'This roster waiver link is invalid or expired. Ask the organizer for a current link.' }
    }
    waiverInviteId = rosterInvite.id
    rosterExpected = rosterInvite.expected_waiver_count
    const done = await countWaiversForInviteId(rosterInvite.id)
    if (done >= rosterInvite.expected_waiver_count) {
      return {
        ok: false,
        message: 'All roster spots for this link are already filled. If you still need to sign, contact the organizer.',
      }
    }
  }

  let rentalType: string
  let participant_count: number | null

  if (waiverInviteToken && rosterInvite) {
    if (rosterInvite.rental_type && COACH_BOOKING_RENTAL_TYPES.has(rosterInvite.rental_type)) {
      rentalType = rosterInvite.rental_type
    } else {
      rentalType = PARTICIPANT_SELF_WAIVER_RENTAL_TYPE
    }
    participant_count = 1
  } else if (isCoachBookingWaiver) {
    const rt = getRequiredString(formData, 'rentalType')
    if (!rt || !COACH_BOOKING_RENTAL_TYPES.has(rt)) {
      return { ok: false, message: 'Choose rental type and headcount for this booking waiver.' }
    }
    rentalType = rt
    const participantCountRaw = getRequiredString(formData, 'participantCount')
    const n = participantCountRaw ? parseInt(participantCountRaw, 10) : NaN
    if (!Number.isFinite(n) || n < 1 || n > 500) {
      return { ok: false, message: 'Enter participant count for this booking (1–500).' }
    }
    participant_count = n
  } else {
    rentalType = PARTICIPANT_SELF_WAIVER_RENTAL_TYPE
    participant_count = null
  }

  const participantName = getRequiredString(formData, 'participantName')
  const participantEmail = getRequiredString(formData, 'participantEmail')
  const participantDob = getRequiredString(formData, 'participantDob')
  const signatureDataUrl = getRequiredString(formData, 'signatureDataUrl')
  const agreementAccepted = formData.get('agreementAccepted') === 'on'
  const riskAccepted = formData.get('riskAccepted') === 'on'
  const rulesAccepted = formData.get('rulesAccepted') === 'on'

  const signatureName = getRequiredString(formData, 'signatureName')
  if (!participantName || !participantEmail || !participantDob || !signatureDataUrl || !signatureName) {
    return {
      ok: false,
      message: 'Missing required fields. Name, email, date of birth, printed signature name, and signature are required.',
    }
  }

  if (!agreementAccepted || !riskAccepted || !rulesAccepted) {
    return {
      ok: false,
      message: 'Please accept all required agreement statements before submitting.',
    }
  }

  const saved = await insertFieldRentalAgreement({
    rental_type: rentalType,
    participant_name: participantName,
    participant_email: participantEmail,
    participant_phone: getRequiredString(formData, 'participantPhone') ?? null,
    participant_dob: participantDob,
    parent_guardian_name: getRequiredString(formData, 'parentGuardianName') ?? null,
    participant_count,
    organization_name: getRequiredString(formData, 'organizationName') ?? null,
    signature_name: signatureName,
    signature_data_url: signatureDataUrl,
    notes: getRequiredString(formData, 'notes') ?? null,
    agreement_accepted: agreementAccepted,
    risk_accepted: riskAccepted,
    rules_accepted: rulesAccepted,
    waiver_invite_id: waiverInviteId,
  })

  if (!saved.ok) {
    return { ok: false, message: saved.message }
  }

  revalidatePath('/admin/rentals')
  if (rosterTokenForRevalidate) {
    revalidatePath(`/rentals/waiver/${rosterTokenForRevalidate}`)
  }

  const rosterLine =
    waiverInviteId && rosterExpected != null
      ? `<li><strong>Roster link</strong>: invite in use · expected ${rosterExpected} waivers (counts in admin Rentals)</li>`
      : ''

  await sendAdminNotification({
    subject: `[Formula] Field rental agreement · ${participantName}`,
    html: `
      <p><strong>Field rental waiver submitted</strong></p>
      <ul>
        <li><strong>Agreement id</strong>: ${escapeHtml(saved.id)}</li>
        <li><strong>Rental type</strong>: ${escapeHtml(rentalType)}</li>
        <li><strong>Participant</strong>: ${escapeHtml(participantName)}</li>
        <li><strong>Email</strong>: ${escapeHtml(participantEmail)}</li>
        <li><strong>DOB</strong>: ${escapeHtml(participantDob)}</li>
        <li><strong>Printed signer</strong>: ${escapeHtml(signatureName)}</li>
        <li><strong>Headcount</strong>: ${participant_count != null ? escapeHtml(String(participant_count)) : '—'}</li>
        ${rosterLine}
      </ul>
      <p>Signature image is stored securely with this waiver for staff review.</p>
    `,
    text: `Field rental agreement saved\nid: ${saved.id}\n${participantName} <${participantEmail}>`,
  })

  return {
    ok: true,
    message: waiverInviteId
      ? 'Waiver saved. The roster count updates on this page — share the same link with anyone who has not signed yet.'
      : 'Agreement saved.',
  }
}
