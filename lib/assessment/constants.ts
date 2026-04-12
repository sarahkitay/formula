/** IANA timezone for Skills Check start times (facility wall clock; avoids UTC server showing 3am). */
export const ASSESSMENT_SLOT_TIMEZONE =
  process.env.NEXT_PUBLIC_ASSESSMENT_SLOTS_TIMEZONE?.trim() ||
  process.env.ASSESSMENT_SLOTS_TIMEZONE?.trim() ||
  'America/Los_Angeles'

/** Total athlete spots per Skills Check window (shared across families). */
export const ASSESSMENT_SLOT_CAPACITY = 4

/** Max kids a single checkout can reserve in one window. */
export const ASSESSMENT_MAX_KIDS_PER_BOOKING = 4
