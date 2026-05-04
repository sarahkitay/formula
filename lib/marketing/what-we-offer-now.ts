import { MARKETING_HREF } from '@/lib/marketing/nav'

/**
 * Live / next offerings — used on the homepage and What Formula Is.
 * Each row has a single primary destination for the whole card.
 */
export const WHAT_WE_OFFER_NOW = [
  {
    title: 'Session packages (early bird)',
    body: '5 for $150 or 10 for $250 - valid through June. Start after your assessment.',
    href: MARKETING_HREF.youthMembership,
  },
  {
    title: 'Friday Youth Game Circuit',
    body: 'Live now. Structured competitive play.',
    href: MARKETING_HREF.fridayCircuit,
  },
  {
    title: 'Adult programming',
    body: 'Live now. Pickup and leagues.',
    href: MARKETING_HREF.adults,
  },
  {
    title: 'Clinics',
    body: 'Small group, coach-led sessions. Check availability.',
    href: MARKETING_HREF.clinics,
  },
  {
    title: 'Memberships',
    body: 'Coming within the next month. Join the waitlist to get first access.',
    href: MARKETING_HREF.youthMembership,
  },
] as const
