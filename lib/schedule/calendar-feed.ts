import type { DayIndex, GeneratedWeek, ScheduleSlot } from '@/types/schedule'
import { isoDateForWeekDay } from '@/lib/schedule/generator'
import { fetchFacilityScheduleConfig } from '@/lib/schedule/facility-schedule-config-server'
import { buildPublishedWeek } from '@/lib/schedule/published-week'
import { getServiceSupabase } from '@/lib/supabase/service'
import { parseRentalTimeSlot } from '@/lib/rentals/rental-time-window'
import { decodeRentalDatesCompact, weeklyOccurrenceDatesIso } from '@/lib/rentals/rental-weekly-dates'
import { rentalFieldLabel } from '@/lib/rentals/field-rental-agreement-admin-display'
import { holidaysBetweenYmdInclusive } from '@/lib/schedule/us-major-holidays'

const LA = 'America/Los_Angeles'

export type CalendarFeedCategory =
  | 'youth_program'
  | 'field_rental'
  | 'party'
  | 'assessment'
  | 'rental_booking'
  | 'other_program'

export type CalendarFeedBlock = {
  id: string
  category: CalendarFeedCategory
  label: string
  sublabel?: string
  dayIndex: DayIndex
  startMinute: number
  endMinute: number
  /** Merged youth block: all program slot ids in this group (same `youthBlockId`). */
  programSlotIds?: string[]
  /** DB row when `category === 'rental_booking'` (for drag / detail APIs). */
  rentalBookingId?: string
  /** Generator / template row (not a paid DB party hold, etc.). */
  templateSurface?: boolean
  /** Parent portal enrollments for this youth anchor (`book-${youthBlockId}`). */
  parentEnrollmentCount?: number
  youthBlockId?: string
  /** `assessment_slots.id` when `category === 'assessment'`. */
  assessmentSlotId?: string
  assessmentBookingCount?: number
  /** `party_bookings.id` when this block is a paid party hold from the DB. */
  partyBookingId?: string
  /** Roster invite row when the block is driven by `field_rental_waiver_invites` session snapshot (desk / unpaid / comp). */
  waiverInviteId?: string
}

function ymdInLa(iso: string): string {
  return new Date(iso).toLocaleDateString('en-CA', { timeZone: LA })
}

function wallMinutesInLa(iso: string): number {
  const d = new Date(iso)
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: LA,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(d)
  let h = 0
  let m = 0
  for (const p of parts) {
    if (p.type === 'hour') h = parseInt(p.value, 10) || 0
    if (p.type === 'minute') m = parseInt(p.value, 10) || 0
  }
  return h * 60 + m
}

function slotCategory(s: ScheduleSlot): CalendarFeedCategory {
  if (s.kind === 'party') return 'party'
  if (s.kind === 'field_rental_premium' || s.kind === 'field_rental_nonpremium') return 'field_rental'
  if (s.kind === 'youth_training' || s.kind === 'preschool' || s.kind === 'littles' || s.kind === 'open_gym')
    return 'youth_program'
  return 'other_program'
}

function youthEnrollment(enrollmentBySlotRef: ReadonlyMap<string, number>, youthBlockId: string | undefined): number {
  if (!youthBlockId) return 0
  return enrollmentBySlotRef.get(`book-${youthBlockId}`) ?? 0
}

function singleProgramBlock(
  s: ScheduleSlot,
  enrollmentBySlotRef: ReadonlyMap<string, number>
): CalendarFeedBlock {
  const yid = s.youthBlockId
  const enroll = youthEnrollment(enrollmentBySlotRef, yid)
  return {
    id: `slot-${s.id}`,
    category: slotCategory(s),
    label: s.label,
    sublabel: s.ageBand,
    dayIndex: s.dayIndex,
    startMinute: s.startMinute,
    endMinute: s.endMinute,
    templateSurface: true,
    youthBlockId: yid,
    parentEnrollmentCount: enroll,
  }
}

function safeGroupId(youthBlockId: string): string {
  return youthBlockId.replace(/[^a-zA-Z0-9_-]+/g, '_')
}

/**
 * One calendar card per youth rotation block (PC hub + stations share `youthBlockId`);
 * other program slots stay one row each.
 */
function programBlocksFromWeekCollapsed(
  week: GeneratedWeek,
  enrollmentBySlotRef: ReadonlyMap<string, number>
): CalendarFeedBlock[] {
  const slots = week.slots
  const byYouth = new Map<string, ScheduleSlot[]>()
  for (const s of slots) {
    if (!s.youthBlockId) continue
    if (slotCategory(s) !== 'youth_program') continue
    const arr = byYouth.get(s.youthBlockId) ?? []
    arr.push(s)
    byYouth.set(s.youthBlockId, arr)
  }

  const covered = new Set<string>()
  for (const group of byYouth.values()) {
    for (const s of group) covered.add(s.id)
  }

  const out: CalendarFeedBlock[] = []
  for (const s of slots) {
    if (covered.has(s.id)) continue
    out.push(singleProgramBlock(s, enrollmentBySlotRef))
  }

  for (const [youthBlockId, group] of byYouth) {
    if (group.length === 0) continue
    const rep = group.reduce((a, b) => (a.startMinute <= b.startMinute ? a : b))
    const minStart = Math.min(...group.map(x => x.startMinute))
    const maxEnd = Math.max(...group.map(x => x.endMinute))
    const rotationNote = group.length > 1 ? ` · ${group.length} rotations` : ''
    const shortHead = rep.label.split('//')[0]?.trim() || rep.label
    const enroll = youthEnrollment(enrollmentBySlotRef, youthBlockId)
    out.push({
      id: `slot-group-${safeGroupId(youthBlockId)}`,
      category: 'youth_program',
      label: `${shortHead}${rotationNote}`,
      sublabel: rep.ageBand,
      dayIndex: rep.dayIndex,
      startMinute: minStart,
      endMinute: maxEnd,
      programSlotIds: [...new Set(group.map(x => x.id))].sort(),
      templateSurface: true,
      youthBlockId,
      parentEnrollmentCount: enroll,
    })
  }

  out.sort((a, b) => a.dayIndex - b.dayIndex || a.startMinute - b.startMinute || a.id.localeCompare(b.id))
  return out
}

const YMD = /^\d{4}-\d{2}-\d{2}$/

/** Session dates for a roster invite that fall inside [weekStart, weekEnd] (inclusive, YYYY-MM-DD). */
export function waiverInviteSessionDatesInWeek(
  inv: {
    booking_rental_date: string | null
    booking_rental_dates_compact: string | null
    booking_session_weeks: number | null
  },
  weekStart: string,
  weekEnd: string
): string[] {
  const compact = inv.booking_rental_dates_compact?.trim()
  if (compact) {
    const decoded = decodeRentalDatesCompact(compact)
    return decoded.filter(d => d >= weekStart && d <= weekEnd)
  }
  const anchor = inv.booking_rental_date?.trim()
  if (!anchor || !YMD.test(anchor)) return []
  const wk = inv.booking_session_weeks
  const n =
    wk != null && Number.isFinite(wk) && wk > 0 ? Math.min(52, Math.floor(wk)) : 1
  const series = weeklyOccurrenceDatesIso(anchor, n)
  return series.filter(d => d >= weekStart && d <= weekEnd)
}

export function calendarBlockVisibleInBookingsOnlyView(b: CalendarFeedBlock): boolean {
  if (b.category === 'rental_booking') return true
  if (b.category === 'assessment') return (b.assessmentBookingCount ?? 0) > 0
  if (b.category === 'youth_program') return (b.parentEnrollmentCount ?? 0) > 0
  if (b.category === 'party') return !!(b.partyBookingId && b.templateSurface === false)
  return false
}

export async function buildFacilityCalendarFeed(weekAnchor: Date): Promise<{
  week: GeneratedWeek
  blocks: CalendarFeedBlock[]
  /** YYYY-MM-DD → holiday label(s) for admin calendar column styling */
  holidays: Record<string, string>
}> {
  const config = await fetchFacilityScheduleConfig()
  const week = buildPublishedWeek(weekAnchor, config)
  const holidays = holidaysBetweenYmdInclusive(week.weekStart, week.weekEnd)

  const enrollmentBySlotRef = new Map<string, number>()
  const sb = getServiceSupabase()

  if (sb) {
    const { data: yc, error: yce } = await sb.rpc('youth_block_booking_counts', { p_week_start: week.weekStart })
    if (!yce && Array.isArray(yc)) {
      for (const row of yc as { slot_ref?: string; enrolled?: number | string | bigint }[]) {
        const ref = row.slot_ref
        if (!ref) continue
        enrollmentBySlotRef.set(ref, Number(row.enrolled) || 0)
      }
    }
  }

  const blocks: CalendarFeedBlock[] = [...programBlocksFromWeekCollapsed(week, enrollmentBySlotRef)]

  const sun = new Date(`${week.weekStart}T12:00:00`)
  const weekEnd = new Date(sun)
  weekEnd.setDate(sun.getDate() + 7)

  if (sb) {
    const { data: slots, error: se } = await sb
      .from('assessment_slots')
      .select('id, starts_at, capacity, label')
      .gte('starts_at', sun.toISOString())
      .lt('starts_at', weekEnd.toISOString())
      .order('starts_at', { ascending: true })
      .limit(400)

    const assessmentBookingCount = new Map<string, number>()
    if (!se && slots?.length) {
      const slotIds = slots.map(r => r.id as string)
      const { data: books } = await sb.from('assessment_bookings').select('assessment_slot_id').in('assessment_slot_id', slotIds)
      for (const row of books ?? []) {
        const sid = row.assessment_slot_id as string
        assessmentBookingCount.set(sid, (assessmentBookingCount.get(sid) ?? 0) + 1)
      }

      for (const row of slots) {
        const iso = row.starts_at as string
        const ymd = ymdInLa(iso)
        let dayIndex: DayIndex | null = null
        for (let d = 0; d < 7; d++) {
          if (isoDateForWeekDay(week.weekStart, d as DayIndex) === ymd) {
            dayIndex = d as DayIndex
            break
          }
        }
        if (dayIndex == null) continue
        const sm = wallMinutesInLa(iso)
        const em = sm + 60
        const sid = row.id as string
        blocks.push({
          id: `asmt-${sid}`,
          category: 'assessment',
          label: (row.label as string) || 'Skills check',
          sublabel: `${row.capacity ?? 4} cap`,
          dayIndex,
          startMinute: sm,
          endMinute: Math.min(24 * 60, em),
          templateSurface: false,
          assessmentSlotId: sid,
          assessmentBookingCount: assessmentBookingCount.get(sid) ?? 0,
        })
      }
    }

    const { data: parties, error: pe } = await sb
      .from('party_bookings')
      .select(
        'id, contact_name, rental_organization, rental_session_date, rental_time_slot, rental_headcount, rental_field_id'
      )
      .gte('rental_session_date', week.weekStart)
      .lte('rental_session_date', week.weekEnd)
      .limit(200)

    if (!pe && parties?.length) {
      for (const row of parties) {
        const sd = row.rental_session_date as string
        let dayIndex: DayIndex | null = null
        for (let d = 0; d < 7; d++) {
          if (isoDateForWeekDay(week.weekStart, d as DayIndex) === sd) {
            dayIndex = d as DayIndex
            break
          }
        }
        if (dayIndex == null) continue
        const rawSlot = typeof row.rental_time_slot === 'string' ? row.rental_time_slot : ''
        const parsed = parseRentalTimeSlot(rawSlot)
        if (!parsed) {
          console.warn('[calendar-feed] skip party row: unparsable rental_time_slot', row.id, rawSlot)
          continue
        }
        const startMinute = Math.max(0, Math.min(24 * 60 - 1, parsed.startMinutes))
        const endMinute = Math.max(startMinute + 15, Math.min(24 * 60, parsed.endMinutes))
        const org = (row.rental_organization as string)?.trim()
        const contact = (row.contact_name as string)?.trim() || 'Party'
        const label = org ? `Party · ${contact} (${org})` : `Party · ${contact}`
        blocks.push({
          id: `partyb-${row.id}`,
          category: 'party',
          label,
          sublabel: `${row.rental_field_id as string} · HC ${row.rental_headcount ?? '—'}`,
          dayIndex,
          startMinute,
          endMinute,
          templateSurface: false,
          partyBookingId: row.id as string,
        })
      }
    }

    const { data: rentals, error: re } = await sb
      .from('rental_slot_bookings')
      .select('id, field_id, session_date, time_slot, status')
      .gte('session_date', week.weekStart)
      .lte('session_date', week.weekEnd)
      .in('status', ['confirmed', 'pending'])
      .limit(500)

    const rentalHoldKeys = new Set<string>()

    if (!re && rentals?.length) {
      for (const row of rentals) {
        const sd = row.session_date as string
        let dayIndex: DayIndex | null = null
        for (let d = 0; d < 7; d++) {
          if (isoDateForWeekDay(week.weekStart, d as DayIndex) === sd) {
            dayIndex = d as DayIndex
            break
          }
        }
        if (dayIndex == null) continue
        const rawSlot = typeof row.time_slot === 'string' ? row.time_slot : ''
        const parsed = parseRentalTimeSlot(rawSlot)
        if (!parsed) {
          console.warn('[calendar-feed] skip rental row: unparsable time_slot', row.id, rawSlot)
          continue
        }
        const startMinute = Math.max(0, Math.min(24 * 60 - 1, parsed.startMinutes))
        const endMinute = Math.max(startMinute + 15, Math.min(24 * 60, parsed.endMinutes))
        const fid = row.field_id as string
        rentalHoldKeys.add(`${fid}|${sd}|${rawSlot.trim()}`)
        blocks.push({
          id: `rent-${row.id}`,
          category: 'rental_booking',
          label: `Field rental · ${fid}`,
          sublabel: rawSlot,
          dayIndex,
          startMinute,
          endMinute,
          rentalBookingId: row.id as string,
          templateSurface: false,
        })
      }
    }

    const { data: rosterInvites, error: rie } = await sb
      .from('field_rental_waiver_invites')
      .select(
        'id, purchaser_name, purchaser_email, checkout_amount_total_cents, booking_rental_field, booking_rental_window, booking_rental_date, booking_rental_dates_compact, booking_session_weeks'
      )
      .order('created_at', { ascending: false })
      .limit(400)

    if (!rie && rosterInvites?.length) {
      for (const inv of rosterInvites as {
        id: string
        purchaser_name: string | null
        purchaser_email: string | null
        checkout_amount_total_cents: number | null
        booking_rental_field: string | null
        booking_rental_window: string | null
        booking_rental_date: string | null
        booking_rental_dates_compact: string | null
        booking_session_weeks: number | null
      }[]) {
        const fieldId = inv.booking_rental_field?.trim()
        const rawWin = typeof inv.booking_rental_window === 'string' ? inv.booking_rental_window.trim() : ''
        if (!fieldId || !rawWin) continue

        const sessionDates = waiverInviteSessionDatesInWeek(inv, week.weekStart, week.weekEnd)
        if (sessionDates.length === 0) continue

        const parsed = parseRentalTimeSlot(rawWin)
        if (!parsed) {
          console.warn('[calendar-feed] skip roster invite: unparsable window', inv.id, rawWin)
          continue
        }
        const startMinute = Math.max(0, Math.min(24 * 60 - 1, parsed.startMinutes))
        const endMinute = Math.max(startMinute + 15, Math.min(24 * 60, parsed.endMinutes))

        const org =
          inv.purchaser_name?.trim() ||
          inv.purchaser_email?.trim().split('@')[0]?.trim() ||
          'Rental'
        const fieldHuman = rentalFieldLabel(fieldId)
        const paidTag =
          inv.checkout_amount_total_cents != null && inv.checkout_amount_total_cents > 0
            ? ''
            : ' · comp / unpaid'

        for (const ymd of sessionDates) {
          const holdKey = `${fieldId}|${ymd}|${rawWin}`
          if (rentalHoldKeys.has(holdKey)) continue
          let dayIndex: DayIndex | null = null
          for (let d = 0; d < 7; d++) {
            if (isoDateForWeekDay(week.weekStart, d as DayIndex) === ymd) {
              dayIndex = d as DayIndex
              break
            }
          }
          if (dayIndex == null) continue
          blocks.push({
            id: `waiver-inv-${inv.id}-${ymd}`,
            category: 'rental_booking',
            label: `${org} · ${fieldHuman}${paidTag}`,
            sublabel: rawWin,
            dayIndex,
            startMinute,
            endMinute,
            templateSurface: false,
            waiverInviteId: inv.id,
          })
        }
      }
    }
  }

  blocks.sort((a, b) => a.dayIndex - b.dayIndex || a.startMinute - b.startMinute || a.id.localeCompare(b.id))

  return { week, blocks, holidays }
}
