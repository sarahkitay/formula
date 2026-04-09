/**
 * Published public pricing and fee notes. Adjust here when rates change; amounts are operational defaults until finance confirms.
 */
/** Prepaid session package (public). Monthly membership tiers are paused until launched. */
export const SESSION_PACKAGE_10 = {
  sessions: 10,
  priceUsd: 300,
  label: '10-session package',
  summary: '10 sessions for $300: our current package offering.',
  /** Hero / inline layouts where the numerals are shown separately */
  purchaseNote:
    'Our current training package, available now. Purchase online, at the desk, or through your assessment. We confirm scheduling and cadence with you directly.',
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

export const FIELD_RENTAL_PUBLISHED_RATES = {
  peak: {
    label: 'Peak hours',
    detail: 'Monday–Friday 4–9pm, plus weekends',
    perHourUsd: 180,
  },
  offPeak: {
    label: 'Non-peak hours',
    perHourLowUsd: 150,
    perHourHighUsd: 160,
  },
  packages: 'Package pricing is available with a 3-month minimum commitment.',
} as const

export const PARTIES_PRICING_STATUS = 'Pricing TBA. Inquire for packages and availability.' as const

export const GENERAL_EVENTS_PRICING_STATUS = 'Hosted event pricing TBA. See parties, Footbot, and tournaments for paths.' as const
