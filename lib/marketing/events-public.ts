/**
 * Public /events hub: upcoming cards + nav visibility.
 * Add rows to `UPCOMING_PUBLIC_EVENTS` to show dated announcements on `/events#upcoming`.
 */

export type PublicUpcomingEvent = {
  /** Stable id for keys / anchors */
  id: string
  title: string
  summary: string
}

/** @deprecated Use UPCOMING_PUBLIC_EVENTS (same array). */
export type SummerEventSection = PublicUpcomingEvent

/**
 * @example
 * export const UPCOMING_PUBLIC_EVENTS: PublicUpcomingEvent[] = [
 *   { id: 'open-house-march', title: 'March open house', summary: 'Tour + Q&A. RSVP opens Feb 1.' },
 * ]
 */
export const UPCOMING_PUBLIC_EVENTS: PublicUpcomingEvent[] = []

/** Backward-compatible alias — edit `UPCOMING_PUBLIC_EVENTS` only. */
export const SUMMER_EVENT_SECTIONS = UPCOMING_PUBLIC_EVENTS

/** Events hub is always published (request form + paths); use `UPCOMING_PUBLIC_EVENTS.length` for empty state UI only. */
export function isEventsHubPublished(): boolean {
  return true
}
