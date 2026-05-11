/** Public marketing site navigation - URLs are stable for SEO and deep links. */

import { BOOKING_HUB_PUBLIC } from '@/lib/marketing/book-assessment-paths'

/** Element `id` on the booking hub + hash for deep links (`/book-assessment#…`). */
export const BOOKING_HUB_DIRECTORY_ID = 'booking-hub-directory' as const

export const MARKETING_HREF = {
  home: '/',
  whatIsFormula: '/what-is-formula',
  youthMembership: '/youth-membership',
  /** Formula Minis (ages 2–5) — section on youth membership; `/minis` redirects here. */
  minis: '/youth-membership#formula-minis',
  fpi: '/fpi',
  fridayCircuit: '/friday-circuit',
  clinics: '/clinics',
  adults: '/adults',
  rentals: '/rentals',
  camps: '/camps',
  facility: '/facility',
  events: '/events',
  fridayNightFriendlies: '/events/friday-night-friendlies',
  summerCamp2026: '/events/summer-camp-2026',
  parties: '/events/parties',
  footbot: '/events/footbot',
  tournaments: '/events/tournaments',
  assessment: '/assessment',
  careers: '/careers',
  privacy: '/privacy',
  terms: '/terms',
  /** Public booking hub (landing + links into split flows). */
  bookAssessment: '/book-assessment',
  /** Booking hub landing - public (legacy hash URLs still scroll to `#${BOOKING_HUB_DIRECTORY_ID}` on that page). */
  bookAssessmentDirectory: `/book-assessment#${BOOKING_HUB_DIRECTORY_ID}`,
  /** Parent booking hub landing. */
  parentBookAssessmentDirectory: `/parent/book-assessment#${BOOKING_HUB_DIRECTORY_ID}`,
  /** Primary CTA: booking hub home. */
  bookAssessmentPortal: '/book-assessment',
} as const

export type MarketingHref = (typeof MARKETING_HREF)[keyof typeof MARKETING_HREF]

/** Header “Book” mega-menu: landing + how the flow runs (slot → waiver/RSVP → pay). */
export type HeaderBookMenuItem = {
  id: string
  label: string
  href: string
  steps: string
}

export function getHeaderBookMenu(): HeaderBookMenuItem[] {
  return [
    {
      id: 'assessment',
      label: 'Skills check / assessment',
      href: BOOKING_HUB_PUBLIC.skillsCheck,
      steps:
        'Choose a published date and time, add guardian + athlete details, sign acknowledgements in the checkout flow if prompted, then pay to confirm your spot.',
    },
    {
      id: 'field-rental',
      label: 'Field rental',
      href: MARKETING_HREF.rentals,
      steps:
        'Pick your package and field window, complete the rental agreement (or RSVP if your group already has a waiver on file), then pay the deposit at checkout.',
    },
    {
      id: 'events',
      label: 'Event booking',
      href: MARKETING_HREF.events,
      steps:
        'Open the event you want, follow that page’s register path (RSVP or waiver if the event requires it), then finish payment when checkout is offered.',
    },
    {
      id: 'parties',
      label: 'Birthday parties',
      href: MARKETING_HREF.parties,
      steps:
        'Read policies on the parties page, then use the booking hub party deposit when you’re ready: choose window details, sign or confirm waivers as asked, pay the deposit last.',
    },
    {
      id: 'age-slots',
      label: 'Age group slots',
      href: BOOKING_HUB_PUBLIC.youthBlocks,
      steps:
        'Preview published youth blocks, pick the week and slot that fits your age group, sign any required holds or waivers, then pay if that path opens checkout.',
    },
    {
      id: 'packages',
      label: 'Package purchasing',
      href: `${MARKETING_HREF.youthMembership}#programs-catalog`,
      steps:
        'Choose a session package or add-on from programs & pricing, walk through acknowledgements, then pay at the end of checkout.',
    },
  ]
}

/** Header: primary row - deep pages with highest intent. */
export const HEADER_MAIN: { label: string; href: string }[] = [
  { label: 'What Formula Is', href: MARKETING_HREF.whatIsFormula },
  { label: 'Membership', href: MARKETING_HREF.youthMembership },
  { label: 'The Formula', href: MARKETING_HREF.fpi },
  { label: 'Facility', href: MARKETING_HREF.facility },
  { label: 'Events', href: MARKETING_HREF.events },
  { label: 'Assessments', href: MARKETING_HREF.assessment },
  { label: 'Careers', href: MARKETING_HREF.careers },
]

/** Header: “More” menu - programs & revenue lines. */
export const HEADER_MORE: { label: string; href: string }[] = [
  { label: 'Summer Camp 2026', href: MARKETING_HREF.summerCamp2026 },
  { label: 'Friday Friendlies', href: MARKETING_HREF.fridayNightFriendlies },
  { label: 'Friday circuit', href: MARKETING_HREF.fridayCircuit },
  { label: 'Clinics', href: MARKETING_HREF.clinics },
  { label: 'Camps', href: MARKETING_HREF.camps },
  { label: 'Adults', href: MARKETING_HREF.adults },
  { label: 'Parties', href: MARKETING_HREF.parties },
  { label: 'Footbot', href: MARKETING_HREF.footbot },
  { label: 'Tournaments', href: MARKETING_HREF.tournaments },
]

export function getHeaderMoreNav(): { label: string; href: string }[] {
  return [...HEADER_MORE]
}

export function getSiteHeaderPrimaryNav(): { label: string; href: string }[] {
  return [...HEADER_MAIN]
}

/** Full list for footer / sitemap strip. */
export function getPrimaryNav(): { label: string; href: string }[] {
  return [...HEADER_MAIN, ...getHeaderMoreNav()]
}

/** In-page homepage anchors (optional deep links). Mobile header uses `getSiteHeaderPrimaryNav()` for parity with desktop. */
export const HOME_ANCHORS: { label: string; href: string }[] = [
  { label: 'Next step', href: '#next-steps' },
  { label: 'Programs', href: `${MARKETING_HREF.youthMembership}#programs-catalog` },
  { label: 'Trust', href: `${MARKETING_HREF.facility}#trust` },
]
