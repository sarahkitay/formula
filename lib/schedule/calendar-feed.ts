import type { DayIndex, GeneratedWeek, ScheduleSlot } from '@/types/schedule'
import { isoDateForWeekDay } from '@/lib/schedule/generator'
import { fetchFacilityScheduleConfig } from '@/lib/schedule/facility-schedule-config-server'
import { buildPublishedWeek } from '@/lib/schedule/published-week'
import { getServiceSupabase } from '@/lib/supabase/service'
import { listFieldRentalAgreementsRecent } from '@/lib/rentals/field-rental-agreements-server'

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
  if (s.kind === 'youth_training' || s.kind === 'preschool' || s.kind === 'open_gym') return 'youth_program'
  return 'other_program'
}

function programBlocksFromWeek(week: GeneratedWeek): CalendarFeedBlock[] {
  return week.slots.map(s => ({
    id: `slot-${s.id}`,
    category: slotCategory(s),
    label: s.label,
    sublabel: s.ageBand,
    dayIndex: s.dayIndex,
    startMinute: s.startMinute,
    endMinute: s.endMinute,
  }))
}

export async function buildFacilityCalendarFeed(weekAnchor: Date): Promise<{ week: GeneratedWeek; blocks: CalendarFeedBlock[] }> {
  const config = await fetchFacilityScheduleConfig()
  const week = buildPublishedWeek(weekAnchor, config)
  const blocks: CalendarFeedBlock[] = [...programBlocksFromWeek(week)]

  const sun = new Date(`${week.weekStart}T12:00:00`)
  const weekEnd = new Date(sun)
  weekEnd.setDate(sun.getDate() + 7)

  const sb = getServiceSupabase()
  if (sb) {
    const { data: slots, error: se } = await sb
      .from('assessment_slots')
      .select('id, starts_at, capacity, label')
      .gte('starts_at', sun.toISOString())
      .lt('starts_at', weekEnd.toISOString())
      .order('starts_at', { ascending: true })
      .limit(400)

    if (!se && slots?.length) {
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
        blocks.push({
          id: `asmt-${row.id}`,
          category: 'assessment',
          label: (row.label as string) || 'Skills check',
          sublabel: `${row.capacity ?? 4} cap`,
          dayIndex,
          startMinute: sm,
          endMinute: Math.min(24 * 60, em),
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
        blocks.push({
          id: `rent-${row.id}`,
          category: 'rental_booking',
          label: `Field rental · ${row.field_id as string}`,
          sublabel: row.time_slot as string,
          dayIndex,
          startMinute: 10 * 60,
          endMinute: 11 * 60,
        })
      }
    }
  }

  const agreements = await listFieldRentalAgreementsRecent(80)
  for (const a of agreements) {
    const submitted = a.submitted_at
    if (!submitted) continue
    const ymd = ymdInLa(submitted)
    let dayIndex: DayIndex | null = null
    for (let d = 0; d < 7; d++) {
      if (isoDateForWeekDay(week.weekStart, d as DayIndex) === ymd) {
        dayIndex = d as DayIndex
        break
      }
    }
    if (dayIndex == null) continue
    blocks.push({
      id: `fra-${a.id}`,
      category: 'field_rental',
      label: `Rental agreement · ${a.rental_type}`,
      sublabel: a.participant_name,
      dayIndex,
      startMinute: 11 * 60 + 30,
      endMinute: 12 * 60,
    })
  }

  return { week, blocks }
}
