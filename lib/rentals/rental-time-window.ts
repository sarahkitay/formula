import {
  FIELD_RENTAL_DURATION_OPTIONS_MINUTES,
  FIELD_RENTAL_SLOT_STARTS,
  FIELD_RENTAL_WINDOW_CLOSE_MINUTES,
} from '@/lib/rentals/field-rental-picker-constants'

/** Minutes from midnight for a US 12h label like `6:00 AM` or `12:30 PM`. */
export function parseUsTimeToMinutesFromMidnight(time: string): number | null {
  const t = time.trim().toUpperCase().replace(/\s+/g, ' ')
  const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/)
  if (!m) return null
  let hour = parseInt(m[1], 10)
  const minute = parseInt(m[2], 10)
  const ap = m[3]
  if (minute >= 60 || hour < 1 || hour > 12) return null
  if (ap === 'AM') {
    if (hour === 12) hour = 0
  } else if (hour !== 12) {
    hour += 12
  }
  return hour * 60 + minute
}

export function formatMinutesAsUsTime(totalMinutes: number): string {
  const h24 = Math.floor(totalMinutes / 60) % 24
  const min = totalMinutes % 60
  const ap = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${min.toString().padStart(2, '0')} ${ap}`
}

export type ParsedRentalWindow = { startMinutes: number; endMinutes: number; durationMinutes: number; raw: string }

/** Supports canonical `Start|minutes` (field rental) or legacy `Start - End` (e.g. party one-hour windows). */
export function parseRentalTimeSlot(raw: string): ParsedRentalWindow | null {
  const s = raw.trim()
  const pipe = s.match(/^(.+)\|(\d+)$/)
  if (pipe) {
    const startLabel = pipe[1].trim()
    const durationMinutes = parseInt(pipe[2], 10)
    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) return null
    const startMinutes = parseUsTimeToMinutesFromMidnight(startLabel)
    if (startMinutes == null) return null
    return {
      startMinutes,
      endMinutes: startMinutes + durationMinutes,
      durationMinutes,
      raw: s,
    }
  }
  const parts = s.split(/\s*-\s*/)
  if (parts.length === 2) {
    const startMinutes = parseUsTimeToMinutesFromMidnight(parts[0].trim())
    const endMinutes = parseUsTimeToMinutesFromMidnight(parts[1].trim())
    if (startMinutes == null || endMinutes == null || endMinutes <= startMinutes) return null
    return {
      startMinutes,
      endMinutes,
      durationMinutes: endMinutes - startMinutes,
      raw: s,
    }
  }
  return null
}

export function rentalWindowsOverlap(aRaw: string, bRaw: string): boolean {
  const a = parseRentalTimeSlot(aRaw)
  const b = parseRentalTimeSlot(bRaw)
  if (!a || !b) return false
  return a.startMinutes < b.endMinutes && b.startMinutes < a.endMinutes
}

export function encodeRentalWindow(startLabel: string, durationMinutes: number): string {
  return `${startLabel.trim()}|${durationMinutes}`
}

export function humanRentalWindowSummary(raw: string): string {
  const p = parseRentalTimeSlot(raw)
  if (!p) return raw
  return `${formatMinutesAsUsTime(p.startMinutes)}–${formatMinutesAsUsTime(p.endMinutes)} (${p.durationMinutes} min)`
}

export function isValidFieldRentalWindow(windowRaw: string): boolean {
  const m = windowRaw.trim().match(/^(.+)\|(\d+)$/)
  if (!m) return false
  const startLabel = m[1].trim()
  const durationMinutes = parseInt(m[2], 10)
  if (!FIELD_RENTAL_SLOT_STARTS.includes(startLabel)) return false
  if (!(FIELD_RENTAL_DURATION_OPTIONS_MINUTES as readonly number[]).includes(durationMinutes)) return false
  const startM = parseUsTimeToMinutesFromMidnight(startLabel)
  if (startM == null) return false
  if (startM + durationMinutes > FIELD_RENTAL_WINDOW_CLOSE_MINUTES) return false
  return true
}
