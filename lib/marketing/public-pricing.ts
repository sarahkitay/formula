/**
 * Published public pricing and fee notes. Adjust here when rates change; amounts are operational defaults until finance confirms.
 */
/** Early bird window for session packages (marketing + Stripe descriptions). */
export const SESSION_PACKAGE_EARLY_BIRD = {
  headline: 'Early bird pricing',
  /** Shorter line for product names / Stripe */
  validThrough: 'Valid through June only.',
  /** Full sentence for web copy */
  validityNote: 'Early bird pricing is only valid through June; standard rates apply after.',
} as const

/** Prepaid 5-session package (early bird). */
export const SESSION_PACKAGE_5 = {
  sessions: 5,
  priceUsd: 150,
  label: '5-session package',
  summary: `5 sessions for $150. ${SESSION_PACKAGE_EARLY_BIRD.headline} — ${SESSION_PACKAGE_EARLY_BIRD.validThrough}`,
  purchaseNote: `${SESSION_PACKAGE_EARLY_BIRD.validityNote} Purchase online, at the desk, or through your assessment. We confirm scheduling and cadence with you directly.`,
} as const

/**
 * Sessions in the published $300 weekday Minis package: one session per week × 6 weeks.
 * Stripe charges one line item at `priceUsd`; `littles_sessions_in_pack` metadata uses this value.
 */
export const FORMULA_MINIS_SESSIONS_IN_PACK = 6
const FORMULA_MINIS_PACK_PRICE = 300

/** Formula Minis weekday (ages 2–3): Mon / Wed / Fri; Session A 10:00–10:30 AM or Session B 10:45–11:15 AM; 6-week season per v4. */
export const FORMULA_MINIS_SIX_WEEK = {
  priceUsd: FORMULA_MINIS_PACK_PRICE,
  sessionsInPack: FORMULA_MINIS_SESSIONS_IN_PACK,
  /** Aligned with v4: $300 ÷ sessions in pack (single Stripe line item). */
  perSessionUsd: Math.round((FORMULA_MINIS_PACK_PRICE / FORMULA_MINIS_SESSIONS_IN_PACK) * 100) / 100,
  label: 'Formula Minis · 6-week weekday package',
  /** Condensed from Children's Programming Summary v4 (April 2026). */
  summary:
    'Formula Minis (ages 2–3), weekdays: pick one recurring slot on Monday, Wednesday, or Friday — Session A (10:00–10:30 AM) or Session B (10:45–11:15 AM). That slot meets once per week for six weeks (six sessions total) for $300 per participant. Program dates May 11–June 19, 2026; Monday enrollments span seven calendar weeks through June 22 so Memorial Day (May 25) is a built-in skip — still six Monday sessions. Minimum 6 participants per session (below that, sessions may be cancelled or consolidated); maximum 24 per session. Enrollment is by 6-week package only; no drop-ins. Refunds: none after enrollment is confirmed; no formal make-ups — staff may try to place your child in another session the same week if capacity allows (not guaranteed).',
} as const

/** Sunday Weekend Program (ages 2–5): four age-specific sessions; 10 weeks; v4 April 2026. */
export const FORMULA_SUNDAY_CHILD_PROGRAM_10_WK = {
  priceUsd: 500,
  weeksInProgram: 10,
  /** Ten scheduled Sundays in the season (two calendar skips). */
  sessionsInPack: 10,
  perSessionUsd: Math.round((500 / 10) * 100) / 100,
  label: 'Sunday Weekend Program · 10-week package',
  minEnrollment: 6,
  maxCapacity: 25,
  startDateYmd: '2026-05-17',
  endDateYmd: '2026-08-02',
  skippedSundayNotes: ['May 24, 2026 (Memorial Day weekend)', "June 21, 2026 (Father's Day)"] as const,
  summary:
    "Sunday program for ages 2–5: Formula Minis (ages 2 and 3) and Formula Juniors (ages 4 and 5), each in its own weekly time slot. Ten scheduled Sundays from May 17 through August 2, 2026, skipping May 24 (Memorial Day weekend) and June 21 (Father's Day). Minimum 6 participants per session; maximum 25. Enrollment by 10-week package only; no drop-ins. $500 per participant. Same refund / informal accommodation policy as weekday Minis: no refunds after confirmation; no formal make-ups; same-day alternate slot only if space and age-appropriate (not guaranteed).",
} as const

/** Prepaid 10-session package (early bird). */
export const SESSION_PACKAGE_10 = {
  sessions: 10,
  priceUsd: 250,
  label: '10-session package',
  summary: `10 sessions for $250. ${SESSION_PACKAGE_EARLY_BIRD.headline} — ${SESSION_PACKAGE_EARLY_BIRD.validThrough}`,
  purchaseNote: `${SESSION_PACKAGE_EARLY_BIRD.validityNote} Purchase online, at the desk, or through your assessment. We confirm scheduling and cadence with you directly.`,
} as const

export const FORMULA_SKILLS_CHECK = {
  name: 'Formula Skills Check',
  priceUsd: 200,
  waiverSummary: 'The $200 assessment fee is waived when you enroll in a qualifying membership. Terms confirmed at signup.',
  measures: [
    'Speed and explosiveness',
    'Agility and change of direction',
    'Decision-making and cognitive speed',
    'Technical execution',
    'Game application',
    'Consistency and coachability',
  ] as const,
} as const

export const YOUTH_MEMBERSHIP_PRICING = {
  registrationFeeNote:
    'A one-time registration fee applies to memberships. The exact fee is confirmed at signup.',
  rows: [
    { term: '12-month commitment', perMonth8: 225, perMonth12: 275 },
    { term: '6-month commitment', perMonth8: 250, perMonth12: 300 },
    { term: '3-month commitment', perMonth8: 275, perMonth12: 325 },
    { term: '1-month commitment', perMonth8: 300, perMonth12: 350 },
  ] as const,
} as const

/** Field rental checkout uses published hourly rate × (duration in hours); increments are 30 minutes ($90 per half hour at $180/hr). */
export const FIELD_RENTAL_BOOKING_CHECKOUT = {
  /** Kept for backward-compat labels; deposit is derived from duration via `fieldRentalDepositUsd`. */
  priceUsd: 180,
  productName: 'Field rental booking deposit',
  summary:
    'Non-refundable booking deposit for a classified field rental window. Charged in 30-minute increments at the published hourly rate (e.g. 1 hr = $180, 90 min = $270, 2 hr = $360). Staff may reconcile any balance vs package agreements.',
} as const

/** Published field rental hourly rate (same for all windows until ops publishes a change). */
export const FIELD_RENTAL_PUBLISHED_RATES = {
  perHourUsd: 180,
  /** Billable step on the public booking flow (minutes). */
  incrementMinutes: 30,
  packages: 'Package pricing is available with a 3-month minimum commitment.',
} as const

/** Deposit USD for one rental session of `durationMinutes` (must be a multiple of 30). */
export function fieldRentalDepositUsd(
  durationMinutes: number,
  perHourUsd: number = FIELD_RENTAL_PUBLISHED_RATES.perHourUsd
): number {
  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0 || durationMinutes % 30 !== 0) return 0
  return (durationMinutes / 60) * perHourUsd
}

/** Stripe Checkout: hosted party deposit (public parties page). */
export const PARTY_BOOKING_1K_CHECKOUT = {
  priceUsd: 1000,
  productName: 'Hosted birthday party · deposit',
  summary:
    '$1,000 party deposit. Staff confirms date, headcount, and field window after payment; final balance or adjustments per your package agreement.',
} as const

export const PARTIES_PRICING_STATUS =
  'Party deposit $1,000 online (Stripe). Book below — include field rental window so ops can schedule.' as const

export const GENERAL_EVENTS_PRICING_STATUS = 'Hosted event pricing TBA. See parties, Footbot, and tournaments for paths.' as const
