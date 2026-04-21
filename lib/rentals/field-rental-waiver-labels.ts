/** Human-readable labels for `field_rental_agreements.rental_type` (matches public form values). */
/** Saved when a participant signs via public site or roster link (no coach booking classification). */
export const PARTICIPANT_SELF_WAIVER_RENTAL_TYPE = 'participant_self_waiver' as const

export function formatRentalTypeForDisplay(code: string): string {
  const map: Record<string, string> = {
    club_team_practice: 'Club / Team Practice',
    private_semi_private: 'Private / Semi-Private Training',
    general_pickup: 'General Use / Pick-Up Play',
    [PARTICIPANT_SELF_WAIVER_RENTAL_TYPE]: 'Participant waiver (public or roster link)',
  }
  return map[code] ?? code.replace(/_/g, ' ')
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isUuid(value: string): boolean {
  return UUID_RE.test(value)
}
