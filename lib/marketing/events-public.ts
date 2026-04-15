/**
 * Public /events hub: “Events” stays out of the header/footer until you add at least one
 * entry to `SUMMER_EVENT_SECTIONS` below. Sub-routes (/events/parties, etc.) stay reachable
 * from their own links elsewhere.
 */
export type SummerEventSection = {
  /** Stable id for keys / future anchors */
  id: string
  title: string
  summary: string
}

/**
 * Add rows here to show “Events” in the marketing header + footer and to render summer cards on /events.
 *
 * @example
 * export const SUMMER_EVENT_SECTIONS: SummerEventSection[] = [
 *   { id: 'camp-week-1', title: 'July skills week', summary: 'Half-day blocks, capped enrollment. Registration opens June 1.' },
 * ]
 */
export const SUMMER_EVENT_SECTIONS: SummerEventSection[] = []

export function isEventsHubPublished(): boolean {
  return SUMMER_EVENT_SECTIONS.length > 0
}
