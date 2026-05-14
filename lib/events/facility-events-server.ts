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

function toInt(v: unknown, fallback: number): number {
  if (typeof v === 'number' && Number.isFinite(v)) return Math.floor(v)
  if (typeof v === 'string' && v.trim()) {
    const n = parseInt(v, 10)
    if (Number.isFinite(n)) return n
  }
  return fallback
}

function toStr(v: unknown): string {
  return typeof v === 'string' ? v : v != null ? String(v) : ''
}

/** Coerce Supabase rows to JSON-safe primitives for RSC (avoids bigint / odd types breaking Flight). */
function normalizeFacilityEventRow(raw: Record<string, unknown>): FacilityEventRow | null {
  const id = toStr(raw.id).trim()
  if (!UUID.test(id)) return null

  const fieldRaw = toStr(raw.field_scope).trim()
  const field_scope = (FIELD_SCOPES.has(fieldRaw as FacilityEventFieldScope)
    ? fieldRaw
    : 'field_1') as FacilityEventFieldScope

  const statusRaw = toStr(raw.status).trim()
  const status = (STATUSES.has(statusRaw as FacilityEventStatus) ? statusRaw : 'draft') as FacilityEventStatus

  const sm = toInt(raw.start_minute, 0)
  const dur = toInt(raw.duration_minutes, 120)
  const smClamped = sm >= 0 && sm < 1440 ? sm : 0
  const durClamped = dur >= 15 && dur <= 960 ? dur : 120

  const waiverRaw = raw.waiver_invite_id
  let waiver_invite_id: string | null = null
  if (typeof waiverRaw === 'string' && UUID.test(waiverRaw.trim())) {
    waiver_invite_id = waiverRaw.trim()
  }

  return {
    id,
    created_at: toStr(raw.created_at),
    updated_at: toStr(raw.updated_at),
    title: toStr(raw.title),
    event_date: toStr(raw.event_date).slice(0, 10),
    start_minute: smClamped,
    duration_minutes: durClamped,
    field_scope,
    status,
    organizer_name: raw.organizer_name == null || raw.organizer_name === '' ? null : toStr(raw.organizer_name),
    organizer_email: raw.organizer_email == null || raw.organizer_email === '' ? null : toStr(raw.organizer_email),
    notes: raw.notes == null || raw.notes === '' ? null : toStr(raw.notes),
    waiver_invite_id,
  }
}

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
  const out: FacilityEventRow[] = []
  for (const item of data) {
    if (!item || typeof item !== 'object') continue
    const row = normalizeFacilityEventRow(item as Record<string, unknown>)
    if (row) out.push(row)
  }
  return out
}

/** Batch-load public waiver URLs for events that reference `field_rental_waiver_invites` (keeps admin page off the heavy waiver-invites module). */
export async function buildWaiverUrlsByEventId(
  events: FacilityEventRow[],
  siteOrigin: string
): Promise<Record<string, string>> {
  const origin = siteOrigin.replace(/\/$/, '')
  const pairs: { eventId: string; inviteId: string }[] = []
  for (const ev of events) {
    const wid = ev.waiver_invite_id?.trim()
    if (!wid || !UUID.test(wid)) continue
    pairs.push({ eventId: ev.id, inviteId: wid })
  }
  if (pairs.length === 0) return {}

  const sb = getServiceSupabase()
  if (!sb) return {}

  const inviteIds = [...new Set(pairs.map(p => p.inviteId))]
  const tokenByInviteId = new Map<string, string>()
  const chunkSize = 100
  for (let i = 0; i < inviteIds.length; i += chunkSize) {
    const chunk = inviteIds.slice(i, i + chunkSize)
    const { data, error } = await sb.from('field_rental_waiver_invites').select('id, token').in('id', chunk)
    if (error) {
      console.warn('[facility-events] waiver token batch:', error.message)
      continue
    }
    for (const row of data ?? []) {
      if (!row || typeof row !== 'object') continue
      const rec = row as Record<string, unknown>
      const id = toStr(rec.id).trim()
      const token = toStr(rec.token).trim()
      if (UUID.test(id) && token) tokenByInviteId.set(id, token)
    }
  }

  const out: Record<string, string> = {}
  for (const { eventId, inviteId } of pairs) {
    const token = tokenByInviteId.get(inviteId)
    if (token) out[eventId] = `${origin}/rentals/waiver/${token}`
  }
  return out
}

/** Events whose `event_date` falls in [weekStartYmd, weekEndYmd] inclusive. Excludes cancelled. */
export async function listFacilityEventsInDateRange(weekStartYmd: string, weekEndYmd: string): Promise<FacilityEventRow[]> {
  const sb = getServiceSupabase()
  if (!sb) return []
  const { data, error } = await sb
    .from('facility_events')
    .select('*')
    .gte('event_date', weekStartYmd)
    .lte('event_date', weekEndYmd)
    .order('event_date', { ascending: true })
    .order('start_minute', { ascending: true })
    .limit(500)
  if (error || !data) {
    if (error?.code !== '42P01') {
      console.warn('[facility-events] list in range:', error?.message)
    }
    return []
  }
  const out: FacilityEventRow[] = []
  for (const item of data) {
    if (!item || typeof item !== 'object') continue
    const row = normalizeFacilityEventRow(item as Record<string, unknown>)
    if (row && row.status !== 'cancelled') out.push(row)
  }
  return out
}

export async function getFacilityEventById(id: string): Promise<FacilityEventRow | null> {
  const tid = id.trim()
  if (!UUID.test(tid)) return null
  const sb = getServiceSupabase()
  if (!sb) return null
  const { data, error } = await sb.from('facility_events').select('*').eq('id', tid).maybeSingle()
  if (error || !data || typeof data !== 'object') return null
  return normalizeFacilityEventRow(data as Record<string, unknown>)
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

  return { ok: true, id: String(data.id) }
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
