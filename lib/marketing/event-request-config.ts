/** Options for the public /events request form (labels stable for ops inbox). */

/** Field rental checkout is its own flow (`/rentals`, booking hub); parties use the party deposit path — keep types distinct for ops. */
export const EVENT_REQUEST_TYPES = [
  { value: 'corporate', label: 'Corporate / team building' },
  { value: 'hosted_birthday_party', label: 'Hosted birthday party (party deposit — not field rental checkout)' },
  { value: 'field_rental_block', label: 'Field rental window (book on Rentals · default 2 hr — not event pricing)' },
  { value: 'club', label: 'Club / team event' },
  { value: 'tournament', label: 'Tournament / showcase' },
  { value: 'camp_clinic', label: 'Camp or clinic block' },
  { value: 'other', label: 'Other (describe in notes)' },
] as const

export type EventRequestTypeValue = (typeof EVENT_REQUEST_TYPES)[number]['value']

export const EVENT_BUDGET_RANGES = [
  { value: '1000_2499', label: '$1,000 – $2,499' },
  { value: '2500_4999', label: '$2,500 – $4,999' },
  { value: '5000_7499', label: '$5,000 – $7,499' },
  { value: '7500_10000', label: '$7,500 – $10,000' },
  { value: '10000_plus', label: '$10,000+ (e.g. full build-out)' },
] as const

export type EventBudgetRangeValue = (typeof EVENT_BUDGET_RANGES)[number]['value']

/** Space intent: single primary choice + notes for combinations. */
export const EVENT_SPACE_PRESETS = [
  { value: 'full_facility', label: 'Full facility (max footprint / premium)' },
  { value: 'field_1', label: 'Field 1' },
  { value: 'field_2', label: 'Field 2' },
  { value: 'field_3', label: 'Field 3 (outdoor)' },
  { value: 'multi_mixed', label: 'Multiple areas (detail in notes)' },
  { value: 'unsure', label: 'Not sure — recommend for us' },
] as const

export type EventSpacePresetValue = (typeof EVENT_SPACE_PRESETS)[number]['value']
