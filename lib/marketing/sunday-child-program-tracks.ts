import { FORMULA_SUNDAY_CHILD_PROGRAM_10_WK } from '@/lib/marketing/public-pricing'

/**
 * Sunday Weekend Program (ages 2–5): one track per birth-year session; Stripe metadata `sunday_child_track`.
 */
export const SUNDAY_CHILD_PROGRAM_CHECKOUT_TRACK_IDS = [
  'weekend-sun-minis-2',
  'weekend-sun-minis-3',
  'weekend-sun-juniors-4',
  'weekend-sun-juniors-5',
] as const

export type SundayChildProgramCheckoutTrackId = (typeof SUNDAY_CHILD_PROGRAM_CHECKOUT_TRACK_IDS)[number]

export function isSundayChildProgramCheckoutTrackId(value: string): value is SundayChildProgramCheckoutTrackId {
  return (SUNDAY_CHILD_PROGRAM_CHECKOUT_TRACK_IDS as readonly string[]).includes(value)
}

/** Matches `FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.sessionsInPack` (one scheduled Sunday per week). */
export const SUNDAY_CHILD_PROGRAM_PACK_SESSIONS = FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.sessionsInPack

export const SUNDAY_CHILD_PROGRAM_CHECKOUT_TRACK_OPTIONS: { id: SundayChildProgramCheckoutTrackId; label: string }[] = [
  {
    id: 'weekend-sun-minis-2',
    label:
      'Formula Minis (age 2) · Sunday 9:00–9:30 AM · 30 minutes · 10-week package ($500) · May 17–Aug 2, 2026 (skips May 24 & Jun 21)',
  },
  {
    id: 'weekend-sun-minis-3',
    label:
      'Formula Minis (age 3) · Sunday 9:45–10:15 AM · 30 minutes · 10-week package ($500) · May 17–Aug 2, 2026 (skips May 24 & Jun 21)',
  },
  {
    id: 'weekend-sun-juniors-4',
    label:
      'Formula Juniors (age 4) · Sunday 10:30–11:15 AM · 45 minutes · 10-week package ($500) · May 17–Aug 2, 2026 (skips May 24 & Jun 21)',
  },
  {
    id: 'weekend-sun-juniors-5',
    label:
      'Formula Juniors (age 5) · Sunday 11:30 AM–12:15 PM · 45 minutes · 10-week package ($500) · May 17–Aug 2, 2026 (skips May 24 & Jun 21)',
  },
]
