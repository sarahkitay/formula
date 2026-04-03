/**
 * Published public pricing and fee notes. Adjust here when rates change; amounts are operational defaults until finance confirms.
 */
export const FORMULA_SKILLS_CHECK = {
  name: 'Formula Skills Check',
  priceUsd: 200,
  waiverSummary: 'The $200 assessment fee may be waived when you sign up for a minimum 6-month membership.',
  measures: [
    'Passing',
    'Ball control',
    'Decision making',
    'Speed',
    'Strength',
    'Agility',
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
