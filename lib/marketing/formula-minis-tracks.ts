import { FORMULA_MINIS_SESSIONS_IN_PACK } from '@/lib/marketing/public-pricing'

/**
 * Formula Minis (ages 2–3) 6-week checkout tracks — `youthBlockId` must match `lib/schedule/generator` (`pushFormulaMinis`).
 * Stripe metadata key remains `littles_track` for backward compatibility with existing checkout sessions.
 */
export const FORMULA_MINIS_CHECKOUT_TRACK_IDS = [
  'littles-mon-600',
  'littles-mon-645',
  'littles-wed-600',
  'littles-wed-645',
  'littles-fri-600',
  'littles-fri-645',
] as const

export type FormulaMinisCheckoutTrackId = (typeof FORMULA_MINIS_CHECKOUT_TRACK_IDS)[number]

export function isFormulaMinisCheckoutTrackId(value: string): value is FormulaMinisCheckoutTrackId {
  return (FORMULA_MINIS_CHECKOUT_TRACK_IDS as readonly string[]).includes(value)
}

/** Every pack is `FORMULA_MINIS_SESSIONS_IN_PACK` sessions at the pack price; Monday uses seven calendar weeks to absorb Memorial Day. */
export const FORMULA_MINIS_PACK_SESSIONS = FORMULA_MINIS_SESSIONS_IN_PACK

export function formulaMinisCalendarWeekSpan(trackId: string): 6 | 7 {
  return trackId.startsWith('littles-mon-') ? 7 : 6
}

export const FORMULA_MINIS_CHECKOUT_TRACK_OPTIONS: { id: FormulaMinisCheckoutTrackId; label: string }[] = [
  {
    id: 'littles-mon-600',
    label:
      'Monday · Session A 10:00–10:30 AM · 12-session season package · seven calendar weeks (Memorial Day week) · $300 · Formula Minis (2–3)',
  },
  {
    id: 'littles-mon-645',
    label:
      'Monday · Session B 10:45–11:15 AM · 12-session season package · seven calendar weeks (Memorial Day week) · $300 · Formula Minis (2–3)',
  },
  {
    id: 'littles-wed-600',
    label: 'Wednesday · Session A 10:00–10:30 AM · 12-session season package · six consecutive weeks · $300 · Formula Minis (2–3)',
  },
  {
    id: 'littles-wed-645',
    label: 'Wednesday · Session B 10:45–11:15 AM · 12-session season package · six consecutive weeks · $300 · Formula Minis (2–3)',
  },
  {
    id: 'littles-fri-600',
    label: 'Friday · Session A 10:00–10:30 AM · 12-session season package · six consecutive weeks · $300 · Formula Minis (2–3)',
  },
  {
    id: 'littles-fri-645',
    label: 'Friday · Session B 10:45–11:15 AM · 12-session season package · six consecutive weeks · $300 · Formula Minis (2–3)',
  },
]
