/**
 * Rental booking classification per Formula booking & waiver spec.
 * Inputs: rental type + participant count. Drives tier, blocks, and insurance hints.
 * Availability for a given date/time/field is enforced separately (no overlapping bookings).
 */

export type RentalType = 'club_team_practice' | 'private_semi_private' | 'general_pickup'

export type Classification =
  | { status: 'blocked'; reason: string }
  | { status: 'private_tier1'; label: string; participantCount: number }
  | { status: 'group_training_ok'; label: string; participantCount: number; maxParticipants: number }
  | { status: 'club_ok'; participantCount: number; maxParticipants: number }
  | { status: 'general_ok'; participantCount: number; maxParticipants: number }

const CLUB_MAX = 20
const GENERAL_MAX = 15
const PRIVATE_TIER1_MAX = 4

export function classifyRentalBooking(rentalType: RentalType, participantCount: number): Classification {
  if (!Number.isFinite(participantCount) || participantCount < 1) {
    return { status: 'blocked', reason: 'Enter a valid participant count (at least 1).' }
  }

  const n = Math.floor(participantCount)

  if (rentalType === 'private_semi_private') {
    if (n >= 1 && n <= PRIVATE_TIER1_MAX) {
      return {
        status: 'private_tier1',
        label: `Private Training  -  Tier 1 (Standard) (${n} participant${n === 1 ? '' : 's'}, 1–4)`,
        participantCount: n,
      }
    }
    if (n > CLUB_MAX) {
      return {
        status: 'blocked',
        reason: `This field allows at most ${CLUB_MAX} participants for a group session. Reduce headcount or book an additional field.`,
      }
    }
    return {
      status: 'group_training_ok',
      label: `Group Training / Clinic Use (${n} participants, 5+)`,
      participantCount: n,
      maxParticipants: CLUB_MAX,
    }
  }

  if (rentalType === 'club_team_practice') {
    if (n > CLUB_MAX) {
      return {
        status: 'blocked',
        reason: `Club / Team Practice allows a maximum of ${CLUB_MAX} participants per field. Reduce headcount or book an additional field.`,
      }
    }
    return { status: 'club_ok', participantCount: n, maxParticipants: CLUB_MAX }
  }

  if (rentalType === 'general_pickup') {
    if (n > GENERAL_MAX) {
      return {
        status: 'blocked',
        reason: `General Use / Pick-Up allows a maximum of ${GENERAL_MAX} participants per field. Reduce headcount or adjust rental type.`,
      }
    }
    return { status: 'general_ok', participantCount: n, maxParticipants: GENERAL_MAX }
  }

  return { status: 'blocked', reason: 'Select a rental type.' }
}

export function insuranceMayBeRequired(rentalType: RentalType, classification: Classification): boolean {
  if (classification.status === 'blocked') return false
  if (rentalType === 'club_team_practice' && classification.status === 'club_ok') return true
  if (rentalType === 'private_semi_private' && classification.status === 'group_training_ok') return true
  return false
}

/** Staff approval is not used; conflicts are prevented by slot inventory. */
export function bookingRequiresApproval(_classification: Classification): boolean {
  return false
}

export function bookingCanProceed(classification: Classification): boolean {
  return classification.status !== 'blocked'
}
