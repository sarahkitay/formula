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
  /** Ops contact - confirm before launch */
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

export type SummerCampThemeTitle = 'Play Sharp' | 'Speed Lab' | 'Finish Strong' | 'Duel & Dominate'

/** Longer theme copy for expandable rows on the Summer Camp 2026 landing (reused when the same theme runs twice). */
export const SUMMER_CAMP_THEME_EXPLANATIONS: Record<SummerCampThemeTitle, string> = {
  'Play Sharp':
    'This week centers first touch under rhythm, clean passing lanes, and scanning before the ball arrives. Athletes rotate through Footbot for high-rep reception and Speed Brain for decision windows so habits transfer into small-sided play by Friday.',
  'Speed Lab':
    'Acceleration, deceleration, and change-of-direction get measured reps—not just sprints. Speed Track work emphasizes posture and first three steps; Double Speed Court layers reactive reads so quickness shows up with the ball, not only in straight lines.',
  'Finish Strong':
    'Striking technique, composure in the box, and rebound finishes are coached in progressions. Performance Center blocks isolate foot choice and body shape, then blend into live sequences so players leave with a repeatable prep touch before they shoot.',
  'Duel & Dominate':
    '1v1 and 2v2 frames teach body position, timing the challenge, and when to jump the pass. Performance Center and small-sided duel grids keep outcomes tight so every player gets high-volume duels with immediate coach feedback.',
}
