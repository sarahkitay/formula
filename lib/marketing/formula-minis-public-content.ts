/**
 * Static schedule copy for the public Minis page (Children's Programming v4, April 2026).
 * Operational dates — update when a new season is published.
 */

export const FORMULA_MINIS_WEEKDAY_PROGRAM_DATES = {
  seasonLabel: 'May 11 – June 19, 2026',
  mondayNote: 'Monday sessions run through June 22 (seven calendar weeks) to absorb Memorial Day (May 25 — no session).',
} as const

/** Week rows for the weekday table (Monday / Wednesday / Friday). */
export const FORMULA_MINIS_WEEKDAY_CALENDAR_ROWS: { week: string; mon: string; wed: string; fri: string }[] = [
  { week: 'Week 1', mon: 'May 11', wed: 'May 13', fri: 'May 15' },
  { week: 'Week 2', mon: 'May 18', wed: 'May 20', fri: 'May 22' },
  { week: 'Week 3', mon: '— (Memorial Day)', wed: 'May 27', fri: 'May 29' },
  { week: 'Week 4', mon: 'June 1', wed: 'June 3', fri: 'June 5' },
  { week: 'Week 5', mon: 'June 8', wed: 'June 10', fri: 'June 12' },
  { week: 'Week 6', mon: 'June 15', wed: 'June 17', fri: 'June 19' },
  { week: 'Week 7', mon: 'June 22', wed: '—', fri: '—' },
]

export const FORMULA_MINIS_SUNDAY_SEASON_ROWS: { week: string; date: string; notes: string }[] = [
  { week: 'Week 1', date: 'Sunday, May 17, 2026', notes: '—' },
  { week: '—', date: 'Sunday, May 24, 2026', notes: 'Skipped (Memorial Day weekend)' },
  { week: 'Week 2', date: 'Sunday, May 31, 2026', notes: '—' },
  { week: 'Week 3', date: 'Sunday, June 7, 2026', notes: '—' },
  { week: 'Week 4', date: 'Sunday, June 14, 2026', notes: '—' },
  { week: '—', date: 'Sunday, June 21, 2026', notes: "Skipped (Father's Day)" },
  { week: 'Week 5', date: 'Sunday, June 28, 2026', notes: '—' },
  { week: 'Week 6', date: 'Sunday, July 5, 2026', notes: 'July 4th weekend' },
  { week: 'Week 7', date: 'Sunday, July 12, 2026', notes: '—' },
  { week: 'Week 8', date: 'Sunday, July 19, 2026', notes: '—' },
  { week: 'Week 9', date: 'Sunday, July 26, 2026', notes: '—' },
  { week: 'Week 10', date: 'Sunday, August 2, 2026', notes: '—' },
]
