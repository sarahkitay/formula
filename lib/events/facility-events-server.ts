import { getServiceSupabase } from '@/lib/supabase/service'

export type FacilityEventFieldScope = 'field_1' | 'field_2' | 'field_3' | 'full_facility'
export type FacilityEventStatus = 'draft' | 'requested' | 'confirmed' | 'cancelled'

export type FacilityEventRow = {
  id: string
  created_at: string
  updated_at: string
  title: string
  event_date: string
  start_minute: number
  duration_minutes: number
  field_scope: FacilityEventFieldScope
  status: FacilityEventStatus
  organizer_name: string | null
  organizer_email: string | null
  notes: string | null
  waiver_invite_id: string | null
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const YMD = /^\d{4}-\d{2}-\d{2}$/

const FIELD_SCOPES = new Set<FacilityEventFieldScope>(['field_1', 'field_2', 'field_3', 'full_facility'])
const STATUSES = new Set<FacilityEventStatus>(['draft', 'requested', 'confirmed', 'cancelled'])

export async function listFacilityEvents(limit = 200): Promise<FacilityEventRow[]> {
  const sb = getServiceSupabase()
  if (!sb) return []
  const { data, error } = await sb.from('facility_events').select('*').order('event_date', { ascending: false }).limit(limit)
  if (error || !data) {
    if (error?.code !== '42P01') {
      console.warn('[facility-events] list:', error?.message)
    }
    return []
  }
  return data as FacilityEventRow[]
}

export async function getFacilityEventById(id: string): Promise<FacilityEventRow | null> {
  const tid = id.trim()
  if (!UUID.test(tid)) return null
  const sb = getServiceSupabase()
  if (!sb) return null
  const { data, error } = await sb.from('facility_events').select('*').eq('id', tid).maybeSingle()
  if (error || !data) return null
  return data as FacilityEventRow
}

export async function insertFacilityEvent(params: {
  title: string
  eventDate: string
  startMinute: number
  durationMinutes: number
  fieldScope: FacilityEventFieldScope
  status: FacilityEventStatus
  organizerName?: string | null
  organizerEmail?: string | null
  notes?: string | null
}): Promise<{ ok: true; id: string } | { ok: false; message: string }> {
  const title = params.title.trim()
  if (title.length < 2) {
    return { ok: false, message: 'Title must be at least 2 characters.' }
  }
  const d = params.eventDate.trim()
  if (!YMD.test(d)) {
    return { ok: false, message: 'Event date must be YYYY-MM-DD.' }
  }
  const sm = Math.floor(params.startMinute)
  const dur = Math.floor(params.durationMinutes)
  if (!Number.isFinite(sm) || sm < 0 || sm >= 1440) {
    return { ok: false, message: 'Start time must be a valid minute-of-day (0–1439).' }
  }
  if (!Number.isFinite(dur) || dur < 15 || dur > 960) {
    return { ok: false, message: 'Duration must be between 15 and 960 minutes.' }
  }
  if (!FIELD_SCOPES.has(params.fieldScope)) {
    return { ok: false, message: 'Invalid field selection.' }
  }
  if (!STATUSES.has(params.status)) {
    return { ok: false, message: 'Invalid status.' }
  }

  const sb = getServiceSupabase()
  if (!sb) {
    return { ok: false, message: 'Database not configured.' }
  }

  const { data, error } = await sb
    .from('facility_events')
    .insert({
      title,
      event_date: d,
      start_minute: sm,
      duration_minutes: dur,
      field_scope: params.fieldScope,
      status: params.status,
      organizer_name: params.organizerName?.trim() || null,
      organizer_email: params.organizerEmail?.trim().toLowerCase() || null,
      notes: params.notes?.trim() || null,
    })
    .select('id')
    .single()

  if (error || !data?.id) {
    if (error?.code === '42P01') {
      return {
        ok: false,
        message: 'facility_events table is not installed yet. Apply the facility_events migration in Supabase.',
      }
    }
    console.error('[facility-events] insert:', error?.message)
    return { ok: false, message: 'Could not create event.' }
  }

  return { ok: true, id: data.id as string }
}

export async function updateFacilityEventWaiverInvite(
  eventId: string,
  waiverInviteId: string | null
): Promise<{ ok: true } | { ok: false; message: string }> {
  const eid = eventId.trim()
  if (!UUID.test(eid)) {
    return { ok: false, message: 'Invalid event id.' }
  }
  const sb = getServiceSupabase()
  if (!sb) {
    return { ok: false, message: 'Database not configured.' }
  }
  const wid = waiverInviteId?.trim() || null
  if (wid && !UUID.test(wid)) {
    return { ok: false, message: 'Invalid waiver invite id.' }
  }
  const { error } = await sb
    .from('facility_events')
    .update({ updated_at: new Date().toISOString(), waiver_invite_id: wid })
    .eq('id', eid)
  if (error) {
    console.error('[facility-events] update waiver link:', error.message)
    return { ok: false, message: 'Could not attach waiver link.' }
  }
  return { ok: true }
}

export async function updateFacilityEventStatus(
  eventId: string,
  status: FacilityEventStatus
): Promise<{ ok: true } | { ok: false; message: string }> {
  const eid = eventId.trim()
  if (!UUID.test(eid)) {
    return { ok: false, message: 'Invalid event id.' }
  }
  if (!STATUSES.has(status)) {
    return { ok: false, message: 'Invalid status.' }
  }
  const sb = getServiceSupabase()
  if (!sb) {
    return { ok: false, message: 'Database not configured.' }
  }
  const { error } = await sb
    .from('facility_events')
    .update({ updated_at: new Date().toISOString(), status })
    .eq('id', eid)
  if (error) {
    console.error('[facility-events] update status:', error.message)
    return { ok: false, message: 'Could not update status.' }
  }
  return { ok: true }
}
