/** Public marketing site navigation - URLs are stable for SEO and deep links. */

export const MARKETING_HREF = {
  home: '/',
  whatIsFormula: '/what-is-formula',
  youthMembership: '/youth-membership',
  fpi: '/fpi',
  fridayCircuit: '/friday-circuit',
  clinics: '/clinics',
  adults: '/adults',
  rentals: '/rentals',
  camps: '/camps',
  facility: '/facility',
  events: '/events',
  parties: '/events/parties',
  footbot: '/events/footbot',
  tournaments: '/events/tournaments',
  assessment: '/assessment',
} as const

export type MarketingHref = (typeof MARKETING_HREF)[keyof typeof MARKETING_HREF]

/** Header: primary row - deep pages with highest intent. */
export const HEADER_MAIN: { label: string; href: string }[] = [
  { label: 'What Formula Is', href: MARKETING_HREF.whatIsFormula },
  { label: 'Membership', href: MARKETING_HREF.youthMembership },
  { label: 'The Formula', href: MARKETING_HREF.fpi },
  { label: 'Facility', href: MARKETING_HREF.facility },
  { label: 'Assessments', href: MARKETING_HREF.assessment },
]

/** Header: “More” menu - programs & revenue lines. */
export const HEADER_MORE: { label: string; href: string }[] = [
  { label: 'Friday circuit', href: MARKETING_HREF.fridayCircuit },
  { label: 'Clinics', href: MARKETING_HREF.clinics },
  { label: 'Camps', href: MARKETING_HREF.camps },
  { label: 'Adults', href: MARKETING_HREF.adults },
  { label: 'Rentals', href: MARKETING_HREF.rentals },
  { label: 'Events', href: MARKETING_HREF.events },
  { label: 'Parties', href: MARKETING_HREF.parties },
  { label: 'Footbot', href: MARKETING_HREF.footbot },
  { label: 'Tournaments', href: MARKETING_HREF.tournaments },
]

/** Full list for footer / sitemap strip. */
export const PRIMARY_NAV: { label: string; href: string }[] = [...HEADER_MAIN, ...HEADER_MORE]

export const HOME_ANCHORS: { label: string; href: string }[] = [
  { label: 'Programs', href: '#programs' },
  { label: 'Ecosystem', href: '#ecosystem' },
  { label: 'Highlights', href: '#highlights' },
  { label: 'Trust', href: `${MARKETING_HREF.facility}#trust` },
  { label: 'Convert', href: '#convert' },
]
