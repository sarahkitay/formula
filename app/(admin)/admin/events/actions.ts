'use server'

import { revalidatePath } from 'next/cache'
import { createManualWaiverInvite } from '@/lib/rentals/waiver-invites-server'
import {
  getFacilityEventById,
  insertFacilityEvent,
  updateFacilityEventStatus,
  updateFacilityEventWaiverInvite,
  type FacilityEventFieldScope,
  type FacilityEventStatus,
} from '@/lib/events/facility-events-server'
import { getSiteOrigin } from '@/lib/stripe/server'

function getStr(formData: FormData, key: string): string {
  const v = formData.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

const FIELD_SCOPES = new Set<FacilityEventFieldScope>(['field_1', 'field_2', 'field_3', 'full_facility'])
const STATUSES = new Set<FacilityEventStatus>(['draft', 'requested', 'confirmed', 'cancelled'])

function parseTimeToStartMinute(raw: string): number | null {
  const t = raw.trim()
  const m = /^(\d{1,2}):(\d{2})$/.exec(t)
  if (!m) return null
  const h = parseInt(m[1], 10)
  const min = parseInt(m[2], 10)
  if (!Number.isFinite(h) || !Number.isFinite(min) || h < 0 || h > 23 || min < 0 || min > 59) return null
  return h * 60 + min
}

export type FacilityEventBookState = { ok: boolean; message: string }

const BOOK_INITIAL: FacilityEventBookState = { ok: false, message: '' }

export async function createFacilityEventBookAction(
  _prev: FacilityEventBookState,
  formData: FormData
): Promise<FacilityEventBookState> {
  const title = getStr(formData, 'title')
  const eventDate = getStr(formData, 'eventDate')
  const startTime = getStr(formData, 'startTime')
  const startMinute = parseTimeToStartMinute(startTime)
  const durationMinutes = parseInt(getStr(formData, 'durationMinutes'), 10)
  const fieldScope = getStr(formData, 'fieldScope') as FacilityEventFieldScope
  const statusRaw = getStr(formData, 'status') as FacilityEventStatus
  const status = STATUSES.has(statusRaw) ? statusRaw : 'confirmed'
  const organizerName = getStr(formData, 'organizerName')
  const organizerEmail = getStr(formData, 'organizerEmail')
  const notes = getStr(formData, 'notes')

  if (startMinute == null) {
    return { ok: false, message: 'Start time must be a valid HH:MM (24h).' }
  }
  if (!FIELD_SCOPES.has(fieldScope)) {
    return { ok: false, message: 'Choose Field 1, 2, 3, or full facility.' }
  }

  const ins = await insertFacilityEvent({
    title,
    eventDate,
    startMinute,
    durationMinutes,
    fieldScope,
    status,
    organizerName: organizerName || null,
    organizerEmail: organizerEmail || null,
    notes: notes || null,
  })
  if (!ins.ok) {
    return { ok: false, message: ins.message }
  }
  revalidatePath('/admin/events')
  return {
    ok: true,
    message: 'Event saved. Open Admin → Schedule to place the block on the calendar, then use payment / waiver tools in the table.',
  }
}

export { BOOK_INITIAL }

export async function createFacilityEventWaiverLinkAction(
  formData: FormData
): Promise<{ ok: true; waiver_url: string } | { ok: false; message: string }> {
  const eventId = getStr(formData, 'eventId')
  const expectedRaw = getStr(formData, 'expectedWaiverCount')
  const expectedWaiverCount = parseInt(expectedRaw || '30', 10)

  const ev = await getFacilityEventById(eventId)
  if (!ev) {
    return { ok: false, message: 'Event not found.' }
  }
  if (ev.waiver_invite_id) {
    return { ok: false, message: 'This event already has a waiver roster link.' }
  }

  const notes = `Facility event: ${ev.title} (${ev.id}) · ${ev.event_date} · ${ev.field_scope}`
  const created = await createManualWaiverInvite({
    expectedWaiverCount,
    rentalType: 'general_pickup',
    rentalRef: `event:${ev.id}`,
    notes,
  })
  if (!created.ok) {
    return { ok: false, message: created.message }
  }

  const attached = await updateFacilityEventWaiverInvite(ev.id, created.id)
  if (!attached.ok) {
    return { ok: false, message: attached.message }
  }

  revalidatePath('/admin/events')
  revalidatePath('/admin/rentals')
  const origin = getSiteOrigin()
  return { ok: true, waiver_url: `${origin}/rentals/waiver/${created.token}` }
}

export async function setFacilityEventStatusAction(
  formData: FormData
): Promise<{ ok: true } | { ok: false; message: string }> {
  const eventId = getStr(formData, 'eventId')
  const status = getStr(formData, 'status') as FacilityEventStatus
  if (!STATUSES.has(status)) {
    return { ok: false, message: 'Invalid status.' }
  }
  const r = await updateFacilityEventStatus(eventId, status)
  if (!r.ok) {
    return { ok: false, message: r.message }
  }
  revalidatePath('/admin/events')
  return { ok: true }
}
