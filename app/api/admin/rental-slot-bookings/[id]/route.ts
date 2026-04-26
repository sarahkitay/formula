import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase/service'
import { encodeRentalWindow, formatMinutesAsUsTime, parseRentalTimeSlot } from '@/lib/rentals/rental-time-window'

export const runtime = 'nodejs'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function clampDayMinutes(m: number): number {
  return Math.max(0, Math.min(24 * 60 - 1, m))
}

function sessionDateString(v: unknown): string {
  if (typeof v === 'string') return v.slice(0, 10)
  return ''
}

/**
 * Adjust a field rental hold window (same encoding as checkout / `parseRentalTimeSlot`).
 * Body: `{ "startMinute": number, "endMinute": number }` (facility wall clock, minutes from midnight).
 */
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await ctx.params
  const id = rawId?.trim() ?? ''
  if (!UUID.test(id)) {
    return NextResponse.json({ error: 'Invalid booking id' }, { status: 400 })
  }
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const b = body as { startMinute?: unknown; endMinute?: unknown }
  const startMinute = typeof b.startMinute === 'number' ? b.startMinute : parseInt(String(b.startMinute), 10)
  const endMinute = typeof b.endMinute === 'number' ? b.endMinute : parseInt(String(b.endMinute), 10)
  if (!Number.isFinite(startMinute) || !Number.isFinite(endMinute) || endMinute <= startMinute) {
    return NextResponse.json({ error: 'startMinute and endMinute must be valid wall times' }, { status: 400 })
  }
  const dur = endMinute - startMinute
  if (dur < 30 || dur > 24 * 60) {
    return NextResponse.json({ error: 'Duration must be between 30 minutes and 24 hours' }, { status: 400 })
  }
  const sm = clampDayMinutes(Math.round(startMinute / 15) * 15)
  const em = clampDayMinutes(Math.round(endMinute / 15) * 15)
  if (em <= sm) {
    return NextResponse.json({ error: 'Invalid range after snapping' }, { status: 400 })
  }
  const startLabel = formatMinutesAsUsTime(sm)
  const time_slot = encodeRentalWindow(startLabel, em - sm)
  if (!parseRentalTimeSlot(time_slot)) {
    return NextResponse.json({ error: 'Could not encode time_slot' }, { status: 400 })
  }

  const sb = getServiceSupabase()
  if (!sb) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  const { data: row, error: rowErr } = await sb
    .from('rental_slot_bookings')
    .select('id, field_id, session_date, time_slot')
    .eq('id', id)
    .maybeSingle()

  if (rowErr || !row) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  const sessionDate = sessionDateString(row.session_date)
  const fieldId = String(row.field_id)

  const { data: conflict } = await sb
    .from('rental_slot_bookings')
    .select('id')
    .neq('id', id)
    .eq('field_id', fieldId)
    .eq('session_date', sessionDate)
    .eq('time_slot', time_slot)
    .maybeSingle()

  if (conflict) {
    return NextResponse.json(
      { error: 'Another booking already uses this field, date, and window. Nudge to a slightly different time.' },
      { status: 409 }
    )
  }

  const { error: upErr } = await sb.from('rental_slot_bookings').update({ time_slot }).eq('id', id)
  if (upErr) {
    if (upErr.code === '23505') {
      return NextResponse.json({ error: 'Unique slot conflict for this field/date/window.' }, { status: 409 })
    }
    console.error('[rental-slot-bookings PATCH]', upErr.message)
    return NextResponse.json({ error: upErr.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, time_slot })
}
