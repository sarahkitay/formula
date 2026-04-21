/** Shared with field rental + party booking flows (marketing). */

/** Legacy one-hour windows (party deposit flow still validates against this list). */
export const RENTAL_TIME_SLOTS = [
  '6:00 AM - 7:00 AM',
  '7:15 AM - 8:15 AM',
  '8:30 AM - 9:30 AM',
  '9:45 AM - 10:45 AM',
  '11:00 AM - 12:00 PM',
  '12:15 PM - 1:15 PM',
  '1:30 PM - 2:30 PM',
  '2:45 PM - 3:45 PM',
  '4:00 PM - 5:00 PM',
  '5:15 PM - 6:15 PM',
  '6:30 PM - 7:30 PM',
  '7:45 PM - 8:45 PM',
] as const

function formatStartLabel(totalMinutes: number): string {
  const h24 = Math.floor(totalMinutes / 60) % 24
  const min = totalMinutes % 60
  const ap = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${min.toString().padStart(2, '0')} ${ap}`
}

/** Field rental: start every 30 minutes from 6:00 AM through 9:30 PM (local labels). */
export const FIELD_RENTAL_SLOT_STARTS: readonly string[] = (() => {
  const out: string[] = []
  for (let mins = 6 * 60; mins <= 21 * 60 + 30; mins += 30) {
    out.push(formatStartLabel(mins))
  }
  return out
})()

/** Allowed rental lengths on the public field flow (30 min steps). */
export const FIELD_RENTAL_DURATION_OPTIONS_MINUTES = [30, 60, 90, 120, 150, 180, 210, 240] as const

/** Initial duration in the public field-rental checkout flow (2 hours). */
export const FIELD_RENTAL_DEFAULT_DURATION_MINUTES = 120

/** Bookings must end by this minute-of-day (22:00 = 10:00 PM). */
export const FIELD_RENTAL_WINDOW_CLOSE_MINUTES = 22 * 60

export const RENTAL_FIELD_OPTIONS = [
  { value: 'field_a', label: 'Field A (turf)' },
  { value: 'field_b', label: 'Field B (turf)' },
  { value: 'field_indoor', label: 'Indoor / small-sided' },
] as const
