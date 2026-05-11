import { MARKETING_HREF } from '@/lib/marketing/nav'
import { SUMMER_CAMP_2026_MONTH_BUNDLE_CHECKOUT, SUMMER_CAMP_2026_WEEK_CHECKOUT } from '@/lib/marketing/public-pricing'
import { SUMMER_CAMP_2026 } from '@/lib/marketing/summer-camp-2026-data'

/**
 * Live / next offerings: homepage + What Formula Is.
 * Curated to current public paths only; each card is one primary link.
 */
export const WHAT_WE_OFFER_NOW = [
  {
    title: 'Session packages (early bird)',
    body: '5 for $150 or 10 for $250 - valid through June. Start after your assessment.',
    href: MARKETING_HREF.youthMembership,
  },
  {
    title: 'Field rentals',
    body: 'Structured field time: published hourly rate and default 2 hr holds. Match turf or indoor inventory in the booking flow.',
    href: MARKETING_HREF.rentals,
  },
  {
    title: 'Birthday parties & hosted events',
    body: 'Party deposit path with clear windows. Summer camp, friendlies, and other hosted paths: see the Events hub.',
    href: MARKETING_HREF.parties,
  },
  {
    title: 'Summer Camp 2026',
    body: `${SUMMER_CAMP_2026.ageRange} · Mon–Fri ${SUMMER_CAMP_2026.dayHours} · eight themed weeks. $${SUMMER_CAMP_2026_WEEK_CHECKOUT.priceUsd}/week or $${SUMMER_CAMP_2026_MONTH_BUNDLE_CHECKOUT.priceUsd} for a four-week bundle. Pre-pay signup.`,
    href: MARKETING_HREF.summerCamp2026,
  },
  {
    title: 'Assessments',
    body: 'Skills Check booking, guardian contact, field rental deposits, and waiver, all from the public booking hub.',
    href: MARKETING_HREF.bookAssessmentPortal,
  },
  {
    title: 'Friday Friendlies',
    body: 'Coach-run pickup for ages 6–14. Pre-register online; walk-ups OK. Schedule and checkout on the event page.',
    href: MARKETING_HREF.fridayNightFriendlies,
  },
] as const
