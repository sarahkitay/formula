import { PROGRAM_UI } from '@/lib/schedule/rules'
import type { ScheduleOverride, ScheduleProgramKind } from '@/types/schedule'

function isScheduleProgramKind(k: string): k is ScheduleProgramKind {
  return Object.prototype.hasOwnProperty.call(PROGRAM_UI, k)
}

/** Published facility schedule knobs (stored in Supabase `facility_schedule_config`). */
export interface FacilitySchedulePublishedConfig {
  currentCycleLabel: string
  weekInCycle: number
  totalWeeksInCycle: number
  nextCycleStartDisplay: string
  overrides: ScheduleOverride[]
  /** ISO YYYY-MM-DD — entire facility closed; all slots removed for that calendar day */
  blockedDates: string[]
}

export const DEFAULT_FACILITY_SCHEDULE_CONFIG: FacilitySchedulePublishedConfig = {
  currentCycleLabel: '2025-Q2-A',
  weekInCycle: 4,
  totalWeeksInCycle: 12,
  nextCycleStartDisplay: 'Jun 02, 2025',
  overrides: [],
  blockedDates: [],
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

function isIsoDate(s: string): boolean {
  return ISO_DATE.test(s)
}

/** Normalize JSON from DB into a safe config object. */
export function normalizeFacilityScheduleConfig(raw: unknown): FacilitySchedulePublishedConfig {
  const base = { ...DEFAULT_FACILITY_SCHEDULE_CONFIG }
  if (!raw || typeof raw !== 'object') return base
  const o = raw as Record<string, unknown>

  if (typeof o.currentCycleLabel === 'string' && o.currentCycleLabel.trim()) {
    base.currentCycleLabel = o.currentCycleLabel.trim().slice(0, 80)
  }
  if (typeof o.nextCycleStartDisplay === 'string' && o.nextCycleStartDisplay.trim()) {
    base.nextCycleStartDisplay = o.nextCycleStartDisplay.trim().slice(0, 80)
  }
  const wic = Number(o.weekInCycle)
  if (Number.isFinite(wic)) base.weekInCycle = Math.min(52, Math.max(1, Math.round(wic)))
  const tw = Number(o.totalWeeksInCycle)
  if (Number.isFinite(tw)) base.totalWeeksInCycle = Math.min(52, Math.max(1, Math.round(tw)))

  const blocked: string[] = []
  if (Array.isArray(o.blockedDates)) {
    for (const x of o.blockedDates) {
      if (typeof x === 'string' && isIsoDate(x)) blocked.push(x)
    }
  }
  base.blockedDates = [...new Set(blocked)].sort()

  const overrides: ScheduleOverride[] = []
  if (Array.isArray(o.overrides)) {
    for (const row of o.overrides) {
      if (!row || typeof row !== 'object') continue
      const r = row as Record<string, unknown>
      const id = typeof r.id === 'string' && r.id.trim() ? r.id.trim().slice(0, 64) : ''
      const date = typeof r.date === 'string' && isIsoDate(r.date) ? r.date : ''
      const assetId = typeof r.assetId === 'string' && r.assetId.trim() ? r.assetId.trim().slice(0, 64) : ''
      const sm = Number(r.startMinute)
      const em = Number(r.endMinute)
      const kindRaw = r.kind
      const label = typeof r.label === 'string' ? r.label.trim().slice(0, 200) : ''
      const mode = r.mode === 'clear' ? 'clear' : 'replace'
      if (!id || !date || !assetId || !Number.isFinite(sm) || !Number.isFinite(em) || em <= sm) continue
      if (typeof kindRaw !== 'string' || !isScheduleProgramKind(kindRaw)) continue
      if (mode === 'replace' && !label) continue
      const ov: ScheduleOverride = {
        id,
        date,
        assetId,
        startMinute: Math.max(0, Math.min(1440, Math.round(sm))),
        endMinute: Math.max(0, Math.min(1440, Math.round(em))),
        kind: kindRaw,
        label: label || '(cleared window)',
        mode,
      }
      if (typeof r.ageBand === 'string' && r.ageBand.trim()) ov.ageBand = r.ageBand as ScheduleOverride['ageBand']
      if (typeof r.youthBlockId === 'string' && r.youthBlockId.trim()) {
        ov.youthBlockId = r.youthBlockId.trim().slice(0, 120)
      }
      overrides.push(ov)
    }
  }
  base.overrides = overrides
  return base
}
