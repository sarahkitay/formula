import { ASSESSMENT_MAX_KIDS_PER_BOOKING, ASSESSMENT_SLOT_CAPACITY } from '@/lib/assessment/constants'
import { getServiceSupabase } from '@/lib/supabase/service'

export { ASSESSMENT_MAX_KIDS_PER_BOOKING, ASSESSMENT_SLOT_CAPACITY }

function nextWeekdaySlotStarts(count: number): Date[] {
  const out: Date[] = []
  const cursor = new Date()
  cursor.setMilliseconds(0)
  cursor.setSeconds(0)
  cursor.setMinutes(0)
  cursor.setHours(0, 0, 0, 0)
  cursor.setDate(cursor.getDate() + 1)

  while (out.length < count) {
    const dow = cursor.getDay()
    if (dow !== 0 && dow !== 6) {
      for (const hour of [10, 15]) {
        if (out.length >= count) break
        const t = new Date(cursor)
        t.setHours(hour, 0, 0, 0)
        if (t.getTime() > Date.now()) {
          out.push(t)
        }
      }
    }
    cursor.setDate(cursor.getDate() + 1)
    if (cursor.getTime() > Date.now() + 120 * 24 * 60 * 60 * 1000) break
  }
  return out.slice(0, count)
}

/** Seed upcoming weekday slots if the table is empty (dev / first deploy). */
export async function ensureAssessmentSlotsSeeded(): Promise<void> {
  const sb = getServiceSupabase()
  if (!sb) return

  const { count, error: countErr } = await sb.from('assessment_slots').select('*', { count: 'exact', head: true })
  if (countErr || (count ?? 0) > 0) return

  const starts = nextWeekdaySlotStarts(8)
  const rows = starts.map(starts_at => ({
    starts_at: starts_at.toISOString(),
    capacity: ASSESSMENT_SLOT_CAPACITY,
    label: 'Formula Skills Check · ~60 min',
  }))

  await sb.from('assessment_slots').insert(rows)
}

export type AssessmentSlotRow = {
  id: string
  starts_at: string
  capacity: number
  label: string | null
  booked_kids: number
  available: number
}

export async function fetchSlotsWithAvailability(): Promise<AssessmentSlotRow[]> {
  await ensureAssessmentSlotsSeeded()
  const sb = getServiceSupabase()
  if (!sb) return []

  const now = new Date().toISOString()
  const { data: slots, error: slotErr } = await sb
    .from('assessment_slots')
    .select('id, starts_at, capacity, label')
    .gt('starts_at', now)
    .order('starts_at', { ascending: true })
    .limit(48)

  if (slotErr || !slots?.length) return []

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
    const booked = bookedBySlot.get(s.id) ?? 0
    const available = Math.max(0, cap - booked)
    return {
      id: s.id,
      starts_at: s.starts_at as string,
      capacity: cap,
      label: (s.label as string | null) ?? null,
      booked_kids: booked,
      available,
    }
  })
}

export async function slotHasRoom(slotId: string, numKids: number): Promise<boolean> {
  const sb = getServiceSupabase()
  if (!sb) return false
  const { data: slot, error: sErr } = await sb.from('assessment_slots').select('id, capacity').eq('id', slotId).maybeSingle()
  if (sErr || !slot) return false

  const cap = Math.min(Number(slot.capacity) || ASSESSMENT_SLOT_CAPACITY, ASSESSMENT_SLOT_CAPACITY)
  const { data: bookings, error: bErr } = await sb.from('assessment_bookings').select('num_kids').eq('assessment_slot_id', slotId)
  if (bErr) return false
  const booked = (bookings ?? []).reduce((sum, r) => sum + (Number(r.num_kids) || 0), 0)
  return booked + numKids <= cap
}
