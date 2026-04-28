'use server'

import { revalidatePath } from 'next/cache'
import { escapeHtml, sendAdminNotification } from '@/lib/email/send-admin-notification'
import { insertFieldRentalAgreement, type FieldRentalAgreementSource } from '@/lib/rentals/field-rental-agreements-server'
import {
  loadFieldRentalCheckoutSnapshot,
  mergeWaiverInviteIntoCheckoutSnapshot,
  type FieldRentalAgreementCheckoutSnapshot,
} from '@/lib/rentals/field-rental-checkout-snapshot'
import { PARTICIPANT_SELF_WAIVER_RENTAL_TYPE } from '@/lib/rentals/field-rental-waiver-labels'
import {
  findPriorSignedAgreementForRsvp,
  rosterInviteHasEmail,
  rosterRsvpNamesMatch,
} from '@/lib/rentals/waiver-roster-rsvp-server'
import { countWaiversForInviteId, getWaiverInviteByToken } from '@/lib/rentals/waiver-invites-server'

const COACH_BOOKING_RENTAL_TYPES = new Set(['club_team_practice', 'private_semi_private', 'general_pickup'])

export type WaiverRsvpState = { ok: boolean; message: string }

function getString(formData: FormData, key: string): string {
  const v = formData.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

/**
 * Roster link RSVP: name + email only, when a prior digital waiver exists for that email.
 * Inserts a new agreement row linked to the invite (counts like a full sign) and reuses signature snapshot from the prior row.
 */
export async function submitWaiverInviteRsvp(_prev: WaiverRsvpState | undefined, formData: FormData): Promise<WaiverRsvpState> {
  const token = getString(formData, 'waiverInviteToken')
  const participantName = getString(formData, 'participantName')
  const participantEmail = getString(formData, 'participantEmail')

  if (!token || token.length < 16) {
    return { ok: false, message: 'Invalid roster link.' }
  }
  if (participantName.length < 2) {
    return { ok: false, message: 'Enter the participant name as it appears on your signed waiver.' }
  }
  if (!participantEmail.includes('@') || !participantEmail.includes('.')) {
    return { ok: false, message: 'Enter a valid email.' }
  }

  const invite = await getWaiverInviteByToken(token)
  if (!invite) {
    return { ok: false, message: 'This roster link is invalid or expired.' }
  }

  const done = await countWaiversForInviteId(invite.id)
  if (done >= invite.expected_waiver_count) {
    return { ok: false, message: 'This roster is already full.' }
  }

  if (await rosterInviteHasEmail(invite.id, participantEmail)) {
    return {
      ok: false,
      message: 'This email is already counted on this roster link. If you need help, contact the coach or organizer.',
    }
  }

  const prior = await findPriorSignedAgreementForRsvp(participantEmail)
  if (!prior) {
    return {
      ok: false,
      message:
        'We could not find a signed Formula waiver on file for that email. Use “Sign the waiver” instead, or sign once on the public form with this email so staff can match you next time.',
    }
  }

  if (!rosterRsvpNamesMatch(participantName, prior.participant_name)) {
    return {
      ok: false,
      message: `The name you entered does not match our records for that email (${prior.participant_name}). Fix typos or use the full waiver path.`,
    }
  }

  let checkoutSnapshot: FieldRentalAgreementCheckoutSnapshot | null = null
  if (invite.stripe_checkout_session_id && invite.stripe_checkout_session_id.length > 0) {
    checkoutSnapshot = await loadFieldRentalCheckoutSnapshot(invite.stripe_checkout_session_id)
  }
  const base: FieldRentalAgreementCheckoutSnapshot = checkoutSnapshot ?? {
    stripe_checkout_session_id: null,
    checkout_amount_total_cents: null,
    checkout_currency: null,
    booking_rental_field: null,
    booking_rental_window: null,
    booking_rental_date: null,
    booking_rental_dates_compact: null,
    booking_session_weeks: null,
    booking_headcount_at_checkout: null,
  }
  checkoutSnapshot = mergeWaiverInviteIntoCheckoutSnapshot(invite, base)

  const rentalType =
    invite.rental_type && COACH_BOOKING_RENTAL_TYPES.has(invite.rental_type) ? invite.rental_type : PARTICIPANT_SELF_WAIVER_RENTAL_TYPE

  const rsvpNote = `RSVP — prior signed waiver on file (agreement ${prior.id}${prior.submitted_at ? `, submitted ${prior.submitted_at}` : ''}). Counts toward roster without a new signature.`

  const source: FieldRentalAgreementSource = 'roster_rsvp'

  const saved = await insertFieldRentalAgreement({
    rental_type: rentalType,
    participant_name: participantName,
    participant_email: participantEmail.trim().toLowerCase(),
    participant_phone: prior.participant_phone,
    participant_address: prior.participant_address,
    participant_dob: prior.participant_dob,
    parent_guardian_name: prior.parent_guardian_name,
    participant_count: 1,
    organization_name: prior.organization_name,
    emergency_contact: prior.emergency_contact,
    signature_name: prior.signature_name,
    signature_data_url: prior.signature_data_url,
    notes: rsvpNote,
    agreement_accepted: true,
    risk_accepted: true,
    rules_accepted: true,
    waiver_invite_id: invite.id,
    source,
    ...(checkoutSnapshot ?? {}),
  })

  if (!saved.ok) {
    return { ok: false, message: saved.message }
  }

  revalidatePath('/admin/rentals')
  revalidatePath(`/rentals/waiver/${token}`)

  await sendAdminNotification({
    subject: `[Formula] Roster RSVP (prior waiver) · ${participantName}`,
    html: `
      <p><strong>Roster RSVP</strong> — prior digital waiver matched</p>
      <ul>
        <li><strong>New row id</strong>: ${escapeHtml(saved.id)}</li>
        <li><strong>Prior waiver id</strong>: ${escapeHtml(prior.id)}</li>
        <li><strong>Participant</strong>: ${escapeHtml(participantName)}</li>
        <li><strong>Email</strong>: ${escapeHtml(participantEmail)}</li>
        <li><strong>Roster token</strong>: ${escapeHtml(token.slice(0, 12))}…</li>
      </ul>
    `,
    text: `Roster RSVP\n${participantName} <${participantEmail}>\nPrior: ${prior.id}`,
  })

  return {
    ok: true,
    message: 'You are on the roster. This page will refresh — the count above includes your RSVP.',
  }
}
