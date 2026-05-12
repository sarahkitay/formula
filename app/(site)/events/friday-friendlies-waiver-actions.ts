'use server'

import { revalidatePath } from 'next/cache'
import { insertFieldRentalAgreement } from '@/lib/rentals/field-rental-agreements-server'
import { PARTICIPANT_SELF_WAIVER_RENTAL_TYPE } from '@/lib/rentals/field-rental-waiver-labels'
import { findPriorSignedAgreementForRsvp, rosterRsvpNamesMatch } from '@/lib/rentals/waiver-roster-rsvp-server'

export type FridayFriendliesWaiverRsvpState = { ok: boolean; message: string }

function getString(formData: FormData, key: string): string {
  const v = formData.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

/**
 * Friday Friendlies: RSVP when a full digital waiver is already on file for this participant email.
 * Inserts a cloned row (no roster invite) so admin can see the attestation alongside Stripe pre-regs.
 */
export async function submitFridayFriendliesWaiverRsvp(
  _prev: FridayFriendliesWaiverRsvpState | undefined,
  formData: FormData
): Promise<FridayFriendliesWaiverRsvpState> {
  const participantName = getString(formData, 'participantName')
  const participantEmail = getString(formData, 'participantEmail')

  if (participantName.length < 2) {
    return { ok: false, message: 'Enter the participant name as it appears on your signed waiver.' }
  }
  if (!participantEmail.includes('@') || !participantEmail.includes('.')) {
    return { ok: false, message: 'Enter a valid email.' }
  }

  const prior = await findPriorSignedAgreementForRsvp(participantEmail)
  if (!prior) {
    return {
      ok: false,
      message:
        'We could not find a signed Formula waiver on file for that email. Use “Sign the waiver now” instead, or complete the public waiver once with this email.',
    }
  }

  if (!rosterRsvpNamesMatch(participantName, prior.participant_name)) {
    return {
      ok: false,
      message: `The name you entered does not match our records for that email (${prior.participant_name}). Fix typos or use the full waiver path.`,
    }
  }

  const rsvpNote = `RSVP - prior signed waiver on file (agreement ${prior.id}${prior.submitted_at ? `, submitted ${prior.submitted_at}` : ''}). Friday Friendlies pre-registration — no new signature.`

  const saved = await insertFieldRentalAgreement({
    rental_type: PARTICIPANT_SELF_WAIVER_RENTAL_TYPE,
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
    waiver_invite_id: null,
    source: 'friday_friendlies_rsvp',
  })

  if (!saved.ok) {
    return { ok: false, message: saved.message }
  }

  revalidatePath('/admin/rentals')
  revalidatePath('/events/friday-night-friendlies')

  return {
    ok: true,
    message: 'RSVP saved for Friday Friendlies. Repeat for each athlete using RSVP, or continue to checkout when everyone is covered.',
  }
}
