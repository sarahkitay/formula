/** Minutes in [0, 24 * 60) for one facility calendar day. */
const DAY = 24 * 60

export function clampDayMinutes(m: number): number {
  let x = Math.floor(m) % DAY
  if (x < 0) x += DAY
  return x
}

/** Friendly 12h string for override inputs, e.g. `8:00 pm` (1200 → 8:00 pm). */
export function formatWallTimeForInput(minutes: number): string {
  const mm = clampDayMinutes(minutes)
  const h24 = Math.floor(mm / 60)
  const mi = mm % 60
  const pm = h24 >= 12
  let h12 = h24 % 12
  if (h12 === 0) h12 = 12
  return `${h12}:${mi.toString().padStart(2, '0')} ${pm ? 'pm' : 'am'}`
}

function from12hClock(hour12: number, minute: number, ap: 'am' | 'pm'): number | null {
  if (minute < 0 || minute > 59 || hour12 < 1 || hour12 > 12) return null
  let h24: number
  if (ap === 'am') h24 = hour12 === 12 ? 0 : hour12
  else h24 = hour12 === 12 ? 12 : hour12 + 12
  return clampDayMinutes(h24 * 60 + minute)
}

/**
 * Parses human wall times: `6:30pm`, `6:30 pm`, `18:30`, `630pm`, `6 pm`.
 * Returns minutes from midnight, or null if unrecognized.
 */
export function parseWallTimeToMinutes(raw: string): number | null {
  let s = raw.trim().toLowerCase().replace(/\./g, '')
  if (!s) return null
  s = s.replace(/\s+/g, ' ')

  // 24-hour H:mm or HH:mm (no am/pm)
  if (!/\b(am|pm)\b/.test(s) && !/(am|pm)\s*$/.test(s)) {
    const m24 = s.match(/^(\d{1,2}):(\d{2})$/)
    if (m24) {
      const hh = parseInt(m24[1]!, 10)
      const mm = parseInt(m24[2]!, 10)
      if (hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59) return hh * 60 + mm
    }
  }

  // h:mm with optional space before am/pm
  let m = s.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/)
  if (m) {
    const r = from12hClock(parseInt(m[1]!, 10), parseInt(m[2]!, 10), m[3] as 'am' | 'pm')
    return r
  }
  m = s.match(/^(\d{1,2}):(\d{2})(am|pm)$/)
  if (m) {
    return from12hClock(parseInt(m[1]!, 10), parseInt(m[2]!, 10), m[3] as 'am' | 'pm')
  }

  // h:mm am (space required between minute and am for this branch — already covered)

  // Compact HMMam e.g. 630pm, 1030am (no colon)
  m = s.match(/^(\d{1,2})(\d{2})(am|pm)$/)
  if (m) {
    const hh = parseInt(m[1]!, 10)
    const mm = parseInt(m[2]!, 10)
    if (mm > 59) return null
    return from12hClock(hh, mm, m[3] as 'am' | 'pm')
  }

  // Hour only: 6 pm, 6pm, 12 am
  m = s.match(/^(\d{1,2})\s*(am|pm)$/)
  if (m) {
    return from12hClock(parseInt(m[1]!, 10), 0, m[2] as 'am' | 'pm')
  }
  m = s.match(/^(\d{1,2})(am|pm)$/)
  if (m) {
    return from12hClock(parseInt(m[1]!, 10), 0, m[2] as 'am' | 'pm')
  }

  return null
}
