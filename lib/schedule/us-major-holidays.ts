/**
 * US major / federal-style holidays for facility calendar + reminder jobs.
 * Uses the same local calendar-date arithmetic as `isoDateForWeekDay` (noon wall dates).
 *
 * Includes: federal public holidays (with weekend observance rule), Easter Sunday, and Christmas Eve (common closure).
 */

function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}

export function ymdFromLocalDate(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

/** Federal “in lieu”: Saturday → prior Friday; Sunday → following Monday. */
export function observedYmdForFixedDate(year: number, month: number, day: number): string {
  const actual = new Date(year, month - 1, day, 12, 0, 0)
  const dow = actual.getDay()
  const obs = new Date(actual)
  if (dow === 6) obs.setDate(actual.getDate() - 1)
  else if (dow === 0) obs.setDate(actual.getDate() + 1)
  return ymdFromLocalDate(obs)
}

function nthWeekdayOfMonth(year: number, monthIndex: number, weekday: number, n: number): Date {
  const firstDow = new Date(year, monthIndex, 1, 12, 0, 0).getDay()
  const offset = (weekday - firstDow + 7) % 7
  const day = 1 + offset + (n - 1) * 7
  return new Date(year, monthIndex, day, 12, 0, 0)
}

function lastWeekdayOfMonth(year: number, monthIndex: number, weekday: number): Date {
  const lastDayNum = new Date(year, monthIndex + 1, 0, 12, 0, 0).getDate()
  let d = lastDayNum
  while (new Date(year, monthIndex, d, 12, 0, 0).getDay() !== weekday) d--
  return new Date(year, monthIndex, d, 12, 0, 0)
}

/** Western Easter Sunday (Gregorian). */
export function easterSunday(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day, 12, 0, 0)
}

export type NamedHoliday = { ymd: string; name: string; id: string }

/**
 * Holidays anchored to US calendar year `year` (e.g. MLK **of** `year`, Jul 4 **of** `year`).
 * New Year uses Jan 1 of `year`; if that Saturday/Sunday rule moves observance to Dec 31 of the prior year, that YMD is included.
 */
export function holidaysForYearCore(year: number): NamedHoliday[] {
  const out: NamedHoliday[] = []

  out.push({
    ymd: observedYmdForFixedDate(year, 1, 1),
    name: "New Year's Day",
    id: 'new-years',
  })

  out.push({
    ymd: ymdFromLocalDate(nthWeekdayOfMonth(year, 0, 1, 3)),
    name: 'Martin Luther King Jr. Day',
    id: 'mlk',
  })

  out.push({
    ymd: ymdFromLocalDate(nthWeekdayOfMonth(year, 1, 1, 3)),
    name: "Presidents' Day",
    id: 'presidents',
  })

  out.push({
    ymd: ymdFromLocalDate(lastWeekdayOfMonth(year, 4, 1)),
    name: 'Memorial Day',
    id: 'memorial',
  })

  out.push({
    ymd: observedYmdForFixedDate(year, 6, 19),
    name: 'Juneteenth National Independence Day',
    id: 'juneteenth',
  })

  out.push({
    ymd: observedYmdForFixedDate(year, 7, 4),
    name: 'Independence Day',
    id: 'july4',
  })

  out.push({
    ymd: ymdFromLocalDate(nthWeekdayOfMonth(year, 8, 1, 1)),
    name: 'Labor Day',
    id: 'labor',
  })

  out.push({
    ymd: ymdFromLocalDate(nthWeekdayOfMonth(year, 9, 1, 2)),
    name: 'Columbus Day / Indigenous Peoples’ Day',
    id: 'columbus-ipd',
  })

  out.push({
    ymd: observedYmdForFixedDate(year, 11, 11),
    name: 'Veterans Day',
    id: 'veterans',
  })

  const thanksgiving = nthWeekdayOfMonth(year, 10, 4, 4)
  out.push({
    ymd: ymdFromLocalDate(thanksgiving),
    name: 'Thanksgiving Day',
    id: 'thanksgiving',
  })

  const tPlus1 = new Date(thanksgiving)
  tPlus1.setDate(tPlus1.getDate() + 1)
  out.push({
    ymd: ymdFromLocalDate(tPlus1),
    name: 'Day after Thanksgiving',
    id: 'black-friday',
  })

  out.push({
    ymd: ymdFromLocalDate(easterSunday(year)),
    name: 'Easter Sunday',
    id: 'easter',
  })

  out.push({
    ymd: `${year}-12-24`,
    name: 'Christmas Eve',
    id: 'christmas-eve',
  })

  out.push({
    ymd: observedYmdForFixedDate(year, 12, 25),
    name: 'Christmas Day',
    id: 'christmas',
  })

  return out
}

/** @deprecated Use holidaysForYearCore */
export const usMajorHolidaysForYear = holidaysForYearCore

/** Merge overlapping YMDs (same day) into one label. */
export function holidaysBetweenYmdInclusive(startYmd: string, endYmd: string): Record<string, string> {
  const y0 = parseInt(startYmd.slice(0, 4), 10)
  const byYmd = new Map<string, string[]>()

  for (const y of [y0 - 1, y0, y0 + 1]) {
    if (!Number.isFinite(y)) continue
    for (const h of holidaysForYearCore(y)) {
      if (h.ymd >= startYmd && h.ymd <= endYmd) {
        const arr = byYmd.get(h.ymd) ?? []
        if (!arr.includes(h.name)) arr.push(h.name)
        byYmd.set(h.ymd, arr)
      }
    }
  }

  const out: Record<string, string> = {}
  for (const [ymd, names] of byYmd) {
    out[ymd] = names.sort().join(' · ')
  }
  return out
}

/** Today’s calendar date in America/Los_Angeles (YYYY-MM-DD). */
export function ymdTodayInTimeZone(timeZone: string): string {
  return new Date().toLocaleDateString('en-CA', { timeZone })
}

function daysInMonth(y: number, m: number): number {
  return new Date(y, m, 0).getDate()
}

/** Gregorian civil date ± days (stable across server time zones). */
export function addDaysToYmd(ymd: string, deltaDays: number): string {
  const parts = ymd.split('-').map(Number)
  let y = parts[0]!
  let m = parts[1]!
  let d = parts[2]! + deltaDays
  while (d > daysInMonth(y, m)) {
    d -= daysInMonth(y, m)
    m++
    if (m > 12) {
      m = 1
      y++
    }
  }
  while (d < 1) {
    m--
    if (m < 1) {
      m = 12
      y--
    }
    d += daysInMonth(y, m)
  }
  return `${y}-${pad2(m)}-${pad2(d)}`
}

/** Holidays for which `todayYmd` is exactly `leadDays` before the observed holiday (LA date). */
export function holidaysDueForLeadReminder(todayYmd: string, leadDays: number): NamedHoliday[] {
  const y = parseInt(todayYmd.slice(0, 4), 10)
  const due: NamedHoliday[] = []
  const seen = new Set<string>()

  for (const yr of [y - 1, y, y + 1]) {
    for (const h of holidaysForYearCore(yr)) {
      const reminder = addDaysToYmd(h.ymd, -leadDays)
      if (reminder === todayYmd) {
        const key = `${h.id}-${h.ymd}`
        if (!seen.has(key)) {
          seen.add(key)
          due.push(h)
        }
      }
    }
  }
  return due.sort((a, b) => a.ymd.localeCompare(b.ymd))
}
