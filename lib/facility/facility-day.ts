/**
 * Calendar-day boundaries for facility-facing rollups (attendance, “today” lists).
 * Formula Soccer Center is in Los Angeles; default is Pacific. Override with
 * `NEXT_PUBLIC_FACILITY_TIMEZONE` (IANA) if the facility moves.
 */
export const FACILITY_TIMEZONE =
  process.env.NEXT_PUBLIC_FACILITY_TIMEZONE?.trim() || 'America/Los_Angeles'

export function formatYmdInTimeZone(isoOrDate: string | Date, timeZone: string): string {
  const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

export function facilityTodayYmd(ref = new Date(), timeZone = FACILITY_TIMEZONE): string {
  return formatYmdInTimeZone(ref, timeZone)
}

export function isSameFacilityCalendarDay(
  startsAtIso: string,
  ymd: string,
  timeZone = FACILITY_TIMEZONE
): boolean {
  return formatYmdInTimeZone(startsAtIso, timeZone) === ymd
}

/**
 * Rough UTC window around `ref` so DB can pre-filter before comparing calendar day in `timeZone`.
 * Same calendar day in a single-region facility stays within ±14h of local midnight → ±48h is safe.
 */
export function facilityDayQueryUtcBoundsFromRef(ref = new Date()): { fromIso: string; toIso: string } {
  const padMs = 60 * 60 * 1000 * 48
  return {
    fromIso: new Date(ref.getTime() - padMs).toISOString(),
    toIso: new Date(ref.getTime() + padMs).toISOString(),
  }
}
