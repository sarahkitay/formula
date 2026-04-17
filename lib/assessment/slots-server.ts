import {
  ASSESSMENT_MAX_KIDS_PER_BOOKING,
  ASSESSMENT_SLOT_CAPACITY,
  ASSESSMENT_SLOT_TIMEZONE,
} from '@/lib/assessment/constants'
import {
  ASSESSMENT_JUNE_PREBOOK_MONTH,
  ASSESSMENT_JUNE_PREBOOK_YEAR,
  buildJunePrebookSlotSpecs,
  isJunePrebookSlotId,
} from '@/lib/assessment/june-2026-slots'
import { getServiceSupabase } from '@/lib/supabase/service'
import { wallClockToUtc } from '@/lib/assessment/zoned-wall-time'

export { ASSESSMENT_MAX_KIDS_PER_BOOKING, ASSESSMENT_SLOT_CAPACITY }

export type AssessmentSlotRow = {
  id: string
  starts_at: string
  capacity: number
  label: string | null
  booked_kids: number
  available: number
}

/** In-process booking totals when Supabase is not configured (local demo only). */
const memoryBookedKidsByJuneSlot = new Map<string, number>()

function juneRangeIsoBounds(timeZone: string = ASSESSMENT_SLOT_TIMEZONE): { start: string; end: string } {
  const start = wallClockToUtc(ASSESSMENT_JUNE_PREBOOK_YEAR, ASSESSMENT_JUNE_PREBOOK_MONTH, 1, 0, 0, timeZone)
  const end = wallClockToUtc(ASSESSMENT_JUNE_PREBOOK_YEAR, ASSESSMENT_JUNE_PREBOOK_MONTH + 1, 1, 0, 0, timeZone)
  return { start: start.toISOString(), end: end.toISOString() }
}

/**
 * Idempotent upsert of June pre-book windows (weekday hourly, 4 kids per hour).
 * Replaces legacy “seed from today” behavior — only June pre-book slots are offered.
 */
export async function ensureJune2026AssessmentSlotsSeeded(): Promise<void> {
  const sb = getServiceSupabase()
  if (!sb) return

  const { start, end } = juneRangeIsoBounds()
  const { count, error: cErr } = await sb
    .from('assessment_slots')
    .select('*', { count: 'exact', head: true })
    .gte('starts_at', start)
    .lt('starts_at', end)

  if (cErr || (count ?? 0) >= 40) return

  const rows = buildJunePrebookSlotSpecs()
  const { error } = await sb.from('assessment_slots').upsert(rows, { onConflict: 'starts_at' })
  if (error) {
    console.warn('[assessment-slots] June pre-book upsert:', error.message)
  }
}

function rowsFromSpecsAndBooked(
  specs: ReturnType<typeof buildJunePrebookSlotSpecs>,
  bookedBySlot: Map<string, number>
): AssessmentSlotRow[] {
  return specs.map(s => {
    const cap = Math.min(Number(s.capacity) || ASSESSMENT_SLOT_CAPACITY, ASSESSMENT_SLOT_CAPACITY)
    const booked = bookedBySlot.get(s.id) ?? 0
    const available = Math.max(0, cap - booked)
    return {
      id: s.id,
      starts_at: s.starts_at,
      capacity: cap,
      label: s.label,
      booked_kids: booked,
      available,
    }
  })
}

/** June pre-book Skills Check windows with booked vs available (4 kids max per hour). */
export async function fetchSlotsWithAvailability(): Promise<AssessmentSlotRow[]> {
  await ensureJune2026AssessmentSlotsSeeded()

  const specs = buildJunePrebookSlotSpecs()
  const { start, end } = juneRangeIsoBounds()
  const nowIso = new Date().toISOString()

  const sb = getServiceSupabase()
  if (!sb) {
    const booked = new Map<string, number>()
    for (const [id, n] of memoryBookedKidsByJuneSlot) {
      booked.set(id, n)
    }
    return rowsFromSpecsAndBooked(specs, booked)
      .filter(r => r.starts_at > nowIso)
      .slice(0, 200)
  }

  const { data: slots, error: slotErr } = await sb
    .from('assessment_slots')
    .select('id, starts_at, capacity, label')
    .gte('starts_at', start)
    .lt('starts_at', end)
    .gt('starts_at', nowIso)
    .order('starts_at', { ascending: true })
    .limit(200)

  if (slotErr || !slots?.length) {
    const booked = new Map<string, number>()
    for (const [id, n] of memoryBookedKidsByJuneSlot) booked.set(id, n)
    return rowsFromSpecsAndBooked(specs, booked)
      .filter(r => r.starts_at > nowIso)
      .slice(0, 200)
  }

  const { data: bookings, error: bookErr } = await sb.from('assessment_bookings').select('assessment_slot_id, num_kids')
  if (bookErr) return []

  const bookedBySlot = new Map<string, number>()
  for (const b of bookings ?? []) {
    const sid = b.assessment_slot_id as string
    const n = Number(b.num_kids)
    bookedBySlot.set(sid, (bookedBySlot.get(sid) ?? 0) + (Number.isFinite(n) ? n : 0))
  }

  return slots.map(s => {
    const cap = Math.min(Number(s.capacity) || ASSESSMENT_SLOT_CAPACITY, ASSESSMENT_SLOT_CAPACITY)
    const booked = bookedBySlot.get(s.id as string) ?? 0
    const available = Math.max(0, cap - booked)
    return {
      id: s.id as string,
      starts_at: s.starts_at as string,
      capacity: cap,
      label: (s.label as string | null) ?? null,
      booked_kids: booked,
      available,
    }
  })
}

export async function slotHasRoom(slotId: string, numKids: number): Promise<boolean> {
  if (!Number.isInteger(numKids) || numKids < 1 || numKids > ASSESSMENT_MAX_KIDS_PER_BOOKING) return false

  const sb = getServiceSupabase()
  if (!sb) {
    if (!isJunePrebookSlotId(slotId)) return false
    const booked = memoryBookedKidsByJuneSlot.get(slotId) ?? 0
    return booked + numKids <= ASSESSMENT_SLOT_CAPACITY
  }

  const { data: slot, error: sErr } = await sb.from('assessment_slots').select('id, capacity').eq('id', slotId).maybeSingle()
  if (sErr || !slot) return false

  const cap = Math.min(Number(slot.capacity) || ASSESSMENT_SLOT_CAPACITY, ASSESSMENT_SLOT_CAPACITY)
  const { data: bookings, error: bErr } = await sb.from('assessment_bookings').select('num_kids').eq('assessment_slot_id', slotId)
  if (bErr) return false
  const booked = (bookings ?? []).reduce((sum, r) => sum + (Number(r.num_kids) || 0), 0)
  return booked + numKids <= cap
}

/** Apply a paid booking to in-memory tallies when Supabase is not configured (demo parity with DB). */
export function applyJunePrebookMemoryBooking(slotId: string, numKids: number): boolean {
  if (!isJunePrebookSlotId(slotId) || numKids < 1 || numKids > ASSESSMENT_MAX_KIDS_PER_BOOKING) return false
  const cur = memoryBookedKidsByJuneSlot.get(slotId) ?? 0
  if (cur + numKids > ASSESSMENT_SLOT_CAPACITY) return false
  memoryBookedKidsByJuneSlot.set(slotId, cur + numKids)
  return true
}
