/**
 * Interpret wall-clock calendar time in an IANA zone as a UTC `Date` (no extra deps).
 * Used so Vercel (UTC) still seeds Skills Check windows at real facility hours.
 */
export function wallClockToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string
): Date {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  const read = (utcMs: number) => {
    const parts = dtf.formatToParts(new Date(utcMs))
    const n = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === type)?.value ?? NaN)
    return { y: n('year'), mo: n('month'), da: n('day'), h: n('hour'), mi: n('minute') }
  }

  const target = { y: year, mo: month, da: day, h: hour, mi: minute }

  const cmp = (a: typeof target, b: typeof target) =>
    a.y - b.y || a.mo - b.mo || a.da - b.da || a.h - b.h || a.mi - b.mi

  let lo = Date.UTC(year, month - 1, day - 1, 0, 0, 0)
  let hi = Date.UTC(year, month - 1, day + 1, 23, 59, 59)

  for (let i = 0; i < 80 && lo <= hi; i++) {
    const mid = Math.floor((lo + hi) / 2)
    const c = cmp(read(mid), target)
    if (c === 0) return new Date(mid)
    if (c < 0) lo = mid + 1
    else hi = mid - 1
  }

  return new Date(Math.floor((lo + hi) / 2))
}

export function getYmdInTz(instant: Date, timeZone: string): { y: number; mo: number; da: number } {
  const s = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(instant)
  const [y, mo, da] = s.split('-').map(Number)
  return { y, mo, da }
}

export function advanceCalendarDay(y: number, mo: number, da: number, timeZone: string): { y: number; mo: number; da: number } {
  const noon = wallClockToUtc(y, mo, da, 12, 0, timeZone)
  const next = new Date(noon.getTime() + 24 * 60 * 60 * 1000)
  return getYmdInTz(next, timeZone)
}

export function isWeekdayYmd(y: number, mo: number, da: number, timeZone: string): boolean {
  const d = wallClockToUtc(y, mo, da, 12, 0, timeZone)
  const wk = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short' }).format(d)
  return wk !== 'Sat' && wk !== 'Sun'
}
