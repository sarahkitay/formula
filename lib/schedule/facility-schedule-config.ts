import { PROGRAM_UI } from '@/lib/schedule/rules'
import type { ScheduleOverride, ScheduleProgramKind } from '@/types/schedule'

const LA = 'America/Los_Angeles'

function isScheduleProgramKind(k: string): k is ScheduleProgramKind {
  return Object.prototype.hasOwnProperty.call(PROGRAM_UI, k)
}

function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const

/** Civil calendar day difference (ymd strings, UTC noon anchor — safe for whole days). */
function civilDaysBetweenUtc(fromYmd: string, toYmd: string): number {
  const [fy, fm, fd] = fromYmd.split('-').map(Number)
  const [ty, tm, td] = toYmd.split('-').map(Number)
  const a = Date.UTC(fy!, fm! - 1, fd!, 12, 0, 0)
  const b = Date.UTC(ty!, tm! - 1, td!, 12, 0, 0)
  return Math.round((b - a) / 86400000)
}

function quarterFromMonth(month1to12: number): number {
  return Math.ceil(month1to12 / 3)
}

function quarterStartYmd(year: number, quarter: number): string {
  const m = (quarter - 1) * 3 + 1
  return `${year}-${pad2(m)}-01`
}

function nextQuarterStartYmd(year: number, quarter: number): string {
  if (quarter >= 4) return `${year + 1}-01-01`
  return quarterStartYmd(year, quarter + 1)
}

function formatCycleDateDisplay(ymd: string): string {
  const [y, m, d] = ymd.split('-').map(Number)
  return `${MONTH_SHORT[m! - 1]} ${pad2(d!)}, ${y}`
}

/**
 * Cycle label + week + “next cycle” copy from **America/Los_Angeles** civil calendar (today).
 * Used whenever Supabase payload omits these fields so admin/parent UI does not show stale years.
 */
export function publishedCycleFieldsLosAngeles(now: Date = new Date()): Pick<
  FacilitySchedulePublishedConfig,
  'currentCycleLabel' | 'weekInCycle' | 'nextCycleStartDisplay'
> {
  const ymdNow = now.toLocaleDateString('en-CA', { timeZone: LA })
  const [yStr, mStr] = ymdNow.split('-')
  const year = parseInt(yStr!, 10)
  const month = parseInt(mStr!, 10)
  const quarter = quarterFromMonth(month)
  const currentCycleLabel = `${year}-Q${quarter}-A`
  const qStart = quarterStartYmd(year, quarter)
  const nextStart = nextQuarterStartYmd(year, quarter)
  const totalWeeks = DEFAULT_FACILITY_SCHEDULE_CONFIG.totalWeeksInCycle
  const weekInCycle = Math.min(
    totalWeeks,
    Math.max(1, Math.floor(civilDaysBetweenUtc(qStart, ymdNow) / 7) + 1)
  )
  return {
    currentCycleLabel,
    weekInCycle,
    nextCycleStartDisplay: formatCycleDateDisplay(nextStart),
  }
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

/** Static fallback when merging; cycle copy is overwritten by `publishedCycleFieldsLosAngeles()` in `normalizeFacilityScheduleConfig`. */
export const DEFAULT_FACILITY_SCHEDULE_CONFIG: FacilitySchedulePublishedConfig = {
  currentCycleLabel: '2026-Q2-A',
  weekInCycle: 4,
  totalWeeksInCycle: 12,
  nextCycleStartDisplay: 'Jul 01, 2026',
  overrides: [],
  blockedDates: [],
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

function isIsoDate(s: string): boolean {
  return ISO_DATE.test(s)
}

/** Normalize JSON from DB into a safe config object. */
export function normalizeFacilityScheduleConfig(raw: unknown): FacilitySchedulePublishedConfig {
  const base: FacilitySchedulePublishedConfig = {
    ...DEFAULT_FACILITY_SCHEDULE_CONFIG,
    ...publishedCycleFieldsLosAngeles(),
  }
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
