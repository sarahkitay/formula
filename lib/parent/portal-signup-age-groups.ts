import type { AgeGroup } from '@/types/player'

/** Age bands parents choose at portal signup; must match `schedule` / booking logic. */
export const PORTAL_SIGNUP_AGE_GROUPS: { value: AgeGroup; label: string }[] = [
  { value: 'U8', label: 'U8' },
  { value: 'U10', label: 'U10' },
  { value: 'U12', label: 'U12' },
  { value: 'U14', label: 'U14' },
  { value: 'U16', label: 'U16' },
  { value: 'U18', label: 'U18' },
  { value: 'Adult', label: 'Adult' },
]

const ALLOWED = new Set<string>(PORTAL_SIGNUP_AGE_GROUPS.map((x) => x.value))

export function isValidPortalSignupAgeGroup(v: string): v is AgeGroup {
  return ALLOWED.has(v)
}
