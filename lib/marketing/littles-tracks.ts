/**
 * Littles 6-week checkout tracks — must match `youthBlockId` values from `lib/schedule/generator` (`pushLittles`).
 */
export const LITTLES_CHECKOUT_TRACK_IDS = [
  'littles-mon-600',
  'littles-mon-645',
  'littles-wed-600',
  'littles-wed-645',
  'littles-fri-600',
  'littles-fri-645',
] as const

export type LittlesCheckoutTrackId = (typeof LITTLES_CHECKOUT_TRACK_IDS)[number]

export function isLittlesCheckoutTrackId(value: string): value is LittlesCheckoutTrackId {
  return (LITTLES_CHECKOUT_TRACK_IDS as readonly string[]).includes(value)
}

/** Every pack is six sessions ($300); Monday uses seven calendar weeks to absorb Memorial Day. */
export const LITTLES_PACK_SESSIONS = 6 as const

export function littlesCalendarWeekSpan(trackId: string): 6 | 7 {
  return trackId.startsWith('littles-mon-') ? 7 : 6
}

export const LITTLES_CHECKOUT_TRACK_OPTIONS: { id: LittlesCheckoutTrackId; label: string }[] = [
  {
    id: 'littles-mon-600',
    label: 'Monday · 10:00–10:30 · six sessions over seven calendar weeks (Memorial Day week included) · $300',
  },
  {
    id: 'littles-mon-645',
    label: 'Monday · 10:45–11:15 · six sessions over seven calendar weeks (Memorial Day week included) · $300',
  },
  { id: 'littles-wed-600', label: 'Wednesday · 10:00–10:30 · six consecutive weeks · $300' },
  { id: 'littles-wed-645', label: 'Wednesday · 10:45–11:15 · six consecutive weeks · $300' },
  { id: 'littles-fri-600', label: 'Friday · 10:00–10:30 · six consecutive weeks · $300' },
  { id: 'littles-fri-645', label: 'Friday · 10:45–11:15 · six consecutive weeks · $300' },
]
