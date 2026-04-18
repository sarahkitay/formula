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

/** Flat Stripe Checkout amount for a standard field rental booking hold (public site flow). */
export const FIELD_RENTAL_BOOKING_CHECKOUT = {
  priceUsd: 180,
  productName: 'Field rental booking deposit',
  summary:
    'Non-refundable booking deposit for a classified field rental window. Staff confirms inventory and may apply published hourly or package rates to any balance.',
} as const

/** Published field rental hourly rate (same for all windows until ops publishes a change). */
export const FIELD_RENTAL_PUBLISHED_RATES = {
  perHourUsd: 180,
  packages: 'Package pricing is available with a 3-month minimum commitment.',
} as const

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
