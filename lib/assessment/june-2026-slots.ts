import { createHash } from 'node:crypto'
import { ASSESSMENT_SLOT_CAPACITY, ASSESSMENT_SLOT_TIMEZONE } from '@/lib/assessment/constants'
import { isWeekdayYmd, wallClockToUtc } from '@/lib/assessment/zoned-wall-time'

/** Public Skills Check pre-book window (facility calendar). */
export const ASSESSMENT_JUNE_PREBOOK_YEAR = 2026
export const ASSESSMENT_JUNE_PREBOOK_MONTH = 6

export const ASSESSMENT_JUNE_PREBOOK_LABEL =
  'Formula Skills Check · June pre-book (~60 min)'

/**
 * Deterministic UUID so upserts and in-memory API responses stay aligned with DB rows.
 * (SHA-256 → UUID-shaped string.)
 */
export function assessmentSlotIdForStartsAtIso(isoUtc: string): string {
  const hash = createHash('sha256').update(`formula:assessment_slot:${isoUtc}`).digest()
  const bytes = Uint8Array.from(hash.subarray(0, 16))
  bytes[6] = (bytes[6]! & 0x0f) | 0x40
  bytes[8] = (bytes[8]! & 0x3f) | 0x80
  const hex = Buffer.from(bytes).toString('hex')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
}

/** Weekday hourly windows (8:00–16:00 local) for June pre-book year/month. */
export function buildJunePrebookSlotSpecs(
  year: number = ASSESSMENT_JUNE_PREBOOK_YEAR,
  month: number = ASSESSMENT_JUNE_PREBOOK_MONTH,
  timeZone: string = ASSESSMENT_SLOT_TIMEZONE
): { id: string; starts_at: string; capacity: number; label: string }[] {
  const daysInMonth = new Date(year, month, 0).getDate()
  const rows: { id: string; starts_at: string; capacity: number; label: string }[] = []
  for (let da = 1; da <= daysInMonth; da++) {
    if (!isWeekdayYmd(year, month, da, timeZone)) continue
    for (let h = 8; h <= 16; h++) {
      const inst = wallClockToUtc(year, month, da, h, 0, timeZone)
      const starts_at = inst.toISOString()
      rows.push({
        id: assessmentSlotIdForStartsAtIso(starts_at),
        starts_at,
        capacity: ASSESSMENT_SLOT_CAPACITY,
        label: ASSESSMENT_JUNE_PREBOOK_LABEL,
      })
    }
  }
  return rows.sort((a, b) => a.starts_at.localeCompare(b.starts_at))
}

let cachedJuneIds: Set<string> | null = null

export function junePrebookSlotIdSet(): Set<string> {
  if (!cachedJuneIds) {
    cachedJuneIds = new Set(buildJunePrebookSlotSpecs().map(r => r.id))
  }
  return cachedJuneIds
}

export function isJunePrebookSlotId(slotId: string): boolean {
  return junePrebookSlotIdSet().has(slotId.trim())
}
