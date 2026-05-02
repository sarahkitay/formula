/**
 * Summer Camp 2026 · public marketing + checkout metadata validation.
 * Dates and themes are operational defaults until scheduling confirms.
 */

export const SUMMER_CAMP_2026 = {
  seasonLabel: 'Summer Camp 2026',
  ageRange: 'Ages 6–13',
  /** Mon–Fri day window shown to parents */
  dayHours: '9:00 AM – 2:30 PM',
  /** Published capacity note */
  capacityNote: 'Up to 54 athletes per week (subject to final staffing ratios).',
  /** Ops contact — confirm before launch */
  inquiriesEmail: 'info@formulasoccercenter.com',
} as const

export type SummerCampMonthBundleId = 'weeks-1-4' | 'weeks-5-8'

export const SUMMER_CAMP_MONTH_BUNDLE_IDS: readonly SummerCampMonthBundleId[] = ['weeks-1-4', 'weeks-5-8']

export function isSummerCampMonthBundleId(value: string): value is SummerCampMonthBundleId {
  return (SUMMER_CAMP_MONTH_BUNDLE_IDS as readonly string[]).includes(value)
}

export type SummerCampWeekRow = {
  week: number
  /** Mon–Fri range */
  datesLabel: string
  themeTitle: string
  themeTagline: string
  /** Training emphasis (short) */
  primaryAssets: string
}

/** Eight themed weeks (each theme runs twice). */
export const SUMMER_CAMP_2026_WEEKS: readonly SummerCampWeekRow[] = [
  {
    week: 1,
    datesLabel: 'Jun 15–19, 2026',
    themeTitle: 'Play Sharp',
    themeTagline: 'Touch, pass & think',
    primaryAssets: 'Footbot · Speed Brain',
  },
  {
    week: 2,
    datesLabel: 'Jun 22–26, 2026',
    themeTitle: 'Speed Lab',
    themeTagline: 'Explosive movement & quickness',
    primaryAssets: 'Speed Track · Double Speed Court',
  },
  {
    week: 3,
    datesLabel: 'Jun 29 – Jul 3, 2026',
    themeTitle: 'Finish Strong',
    themeTagline: 'Shooting & clinical finishing',
    primaryAssets: 'Performance Center',
  },
  {
    week: 4,
    datesLabel: 'Jul 6–10, 2026',
    themeTitle: 'Duel & Dominate',
    themeTagline: '1v1 / 2v2 mastery',
    primaryAssets: 'Performance Center · small-sided duels',
  },
  {
    week: 5,
    datesLabel: 'Jul 13–17, 2026',
    themeTitle: 'Play Sharp',
    themeTagline: 'Touch, pass & think',
    primaryAssets: 'Footbot · Speed Brain',
  },
  {
    week: 6,
    datesLabel: 'Jul 20–24, 2026',
    themeTitle: 'Speed Lab',
    themeTagline: 'Explosive movement & quickness',
    primaryAssets: 'Speed Track · Double Speed Court',
  },
  {
    week: 7,
    datesLabel: 'Jul 27–31, 2026',
    themeTitle: 'Finish Strong',
    themeTagline: 'Shooting & clinical finishing',
    primaryAssets: 'Performance Center',
  },
  {
    week: 8,
    datesLabel: 'Aug 3–7, 2026',
    themeTitle: 'Duel & Dominate',
    themeTagline: '1v1 / 2v2 mastery',
    primaryAssets: 'Performance Center · small-sided duels',
  },
] as const

export function getSummerCampWeekRow(week: number): SummerCampWeekRow | undefined {
  return SUMMER_CAMP_2026_WEEKS.find(w => w.week === week)
}

export function isSummerCampWeekNumber(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 8
}
