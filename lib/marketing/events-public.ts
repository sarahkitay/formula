/**
 * Public /events hub: upcoming cards + nav visibility.
 * Add rows to `UPCOMING_PUBLIC_EVENTS` to show dated announcements on `/events#upcoming`.
 */

import { MARKETING_HREF } from '@/lib/marketing/nav'
import { SUMMER_CAMP_2026_MONTH_BUNDLE_CHECKOUT, SUMMER_CAMP_2026_WEEK_CHECKOUT } from '@/lib/marketing/public-pricing'
import { SUMMER_CAMP_2026 } from '@/lib/marketing/summer-camp-2026-data'

export type PublicUpcomingEvent = {
  /** Stable id for keys / anchors */
  id: string
  title: string
  summary: string
  /** When set, the hub shows a CTA link (e.g. full event landing + checkout). */
  href?: string
  ctaLabel?: string
}

/** @deprecated Use UPCOMING_PUBLIC_EVENTS (same array). */
export type SummerEventSection = PublicUpcomingEvent

/**
 * @example
 * export const UPCOMING_PUBLIC_EVENTS: PublicUpcomingEvent[] = [
 *   { id: 'open-house-march', title: 'March open house', summary: 'Tour + Q&A. RSVP opens Feb 1.' },
 * ]
 */
export const UPCOMING_PUBLIC_EVENTS: PublicUpcomingEvent[] = [
  {
    id: 'summer-camp-2026',
    title: 'Summer Camp 2026',
    summary: `${SUMMER_CAMP_2026.ageRange} · Mon–Fri 9:00 AM–2:30 PM · eight themed weeks. $${SUMMER_CAMP_2026_WEEK_CHECKOUT.priceUsd}/week or $${SUMMER_CAMP_2026_MONTH_BUNDLE_CHECKOUT.priceUsd} for a four-week bundle (weeks 1–4 or 5–8).`,
    href: MARKETING_HREF.summerCamp2026,
    ctaLabel: 'See themes & register',
  },
  {
    id: 'friday-night-friendlies-may-2026',
    title: 'Friday Friendlies',
    summary:
      'Coach-run pickup for ages 6–13. First night Friday May 8, 2026 — 5:30 arrival, games 6:00–7:30 PM. $20 per player; walk-ups OK. Pre-register online.',
    href: MARKETING_HREF.fridayNightFriendlies,
    ctaLabel: 'See details & save your spot',
  },
]

/** Backward-compatible alias — edit `UPCOMING_PUBLIC_EVENTS` only. */
export const SUMMER_EVENT_SECTIONS = UPCOMING_PUBLIC_EVENTS

/** Events hub is always published (request form + paths); use `UPCOMING_PUBLIC_EVENTS.length` for empty state UI only. */
export function isEventsHubPublished(): boolean {
  return true
}
