/**
 * Admin OS types + static copy. Operational numbers come from Supabase / APIs — no fabricated clients.
 */

import type { FpiPillar } from '@/lib/admin/fpi-weights'

export type AssetStatus = 'in-use' | 'available' | 'reserved' | 'closed'
export type AlertSeverity = 'critical' | 'warning' | 'info'

export interface FacilityAlert {
  id: string
  severity: AlertSeverity
  code: string
  message: string
  assetId?: string
  at: string
}

export interface RevenueCategoryRow {
  category: string
  amount: number
  pct: number
}

export interface RevenueThresholdCheck {
  id: string
  label: string
  currentPct: number
  thresholdPct: number
  breached: boolean
}

export interface FacilityAsset {
  id: string
  label: string
  shortLabel: string
  status: AssetStatus
  utilizationPct: number
  currentProgram: string
  nextProgram: string
  /** 0–1 load for heat */
  load: number
}

export interface YouthBlockRow {
  id: string
  window: string
  ageBand: string
  program: string
  coach: string
  capacity: string
  bufferOk: boolean
  onTime: boolean
}

export interface MembershipAgeRow {
  band: string
  active: number
  waitlist: number
  cap: number
  performance: number
  performanceElite: number
  demandIndex: number
}

export interface FridayRosterRow {
  id: string
  ageBand: string
  team: string
  field: string
  window: string
  fpiAvg: number
  coachNotes: string
}

export interface AuditEntry {
  id: string
  at: string
  actor: string
  action: string
  resource: string
}

export const REVENUE_WARNING_THRESHOLDS = {
  rentalPct: 35,
  adultProgrammingPct: 20,
  campsPct: 20,
  youthMembershipFloorPct: 40,
} as const

export const GROWTH_PHASES = [
  { id: 'p1', name: 'Phase 1 - Launch / stabilize', active: true },
  { id: 'p2', name: 'Phase 2 - Optimize', active: false },
  { id: 'p3', name: 'Phase 3 - Replication-ready', active: false },
] as const

export const adminAlerts: FacilityAlert[] = []

export const revenueByCategory: RevenueCategoryRow[] = []

export function computeRevenueThresholds(rows: RevenueCategoryRow[]): RevenueThresholdCheck[] {
  const find = (c: string) => rows.find(r => r.category.startsWith(c))?.pct ?? 0
  const youth = find('Youth membership')
  const rental = find('Rentals')
  const adult = find('Adult programming')
  const camps = rows.find(r => r.category.startsWith('Camps'))?.pct ?? 0
  return [
    {
      id: 'rental',
      label: 'Rental share',
      currentPct: rental,
      thresholdPct: REVENUE_WARNING_THRESHOLDS.rentalPct,
      breached: rental > REVENUE_WARNING_THRESHOLDS.rentalPct,
    },
    {
      id: 'adult',
      label: 'Adult programming share',
      currentPct: adult,
      thresholdPct: REVENUE_WARNING_THRESHOLDS.adultProgrammingPct,
      breached: adult > REVENUE_WARNING_THRESHOLDS.adultProgrammingPct,
    },
    {
      id: 'camps',
      label: 'Camps & events share',
      currentPct: camps,
      thresholdPct: REVENUE_WARNING_THRESHOLDS.campsPct,
      breached: camps > REVENUE_WARNING_THRESHOLDS.campsPct,
    },
    {
      id: 'youth',
      label: 'Youth membership floor',
      currentPct: youth,
      thresholdPct: REVENUE_WARNING_THRESHOLDS.youthMembershipFloorPct,
      breached: youth < REVENUE_WARNING_THRESHOLDS.youthMembershipFloorPct,
    },
  ]
}

export const todaysYouthBlocks: YouthBlockRow[] = []

export const todaysAdultBlocks: {
  window: string
  program: string
  division: string
  registrations: number
  cap: number
}[] = []

export const rentalsClinicsPartiesToday: { type: string; label: string; window: string; asset: string }[] = []

export const checkInAttendanceSnapshot = {
  checkedIn: 0,
  expected: 0,
  noShowRisk: 0,
  lateArrival: 0,
}

export const facilityAssets: FacilityAsset[] = []

export const membershipByAge: MembershipAgeRow[] = []

export const fridayCircuitRosters: FridayRosterRow[] = []

export const adultLeagueSeasons: { name: string; division: string; teams: number; week: number; totalWeeks: number }[] =
  []

export const clinicRows: {
  id: string
  name: string
  type: string
  nextDate: string
  seats: string
  coach: string
  conversion: string
}[] = []

export const rentalPackages: { category: string; active: number; mrr: number }[] = []

export const eventsLayerSummary = {
  camps: { summerWeeks: 0, enrolled: 0, conversionToMembership: '—' },
  tournaments: { perCycle: 0, nextDate: '—', fieldsBooked: 0 },
  parties: { fixedWindows: 0, thisMonth: 0 },
  footbot: { sundayStandalone: false, nextSlot: '—', mode: '—' },
}

export const fpiWorkflowQueue: { id: string; athlete: string; type: string; due: string; pillarGap: FpiPillar }[] = []

export const scalabilityLayer = [
  'Multi-location: tenant + facility_id on all operational entities',
  'Central FPI store: assessment versioning, QC flags, staff-only percentile bands',
  'SOP engine: checklist templates per phase (launch / optimize / replicate)',
  'FPI licensing: partner clubs submit assessments; audit + dispute workflow',
]

export const sampleAuditLog: AuditEntry[] = []

export const scheduleRulesSummary = [
  '55m youth blocks · 10–15m reset buffers enforced in generator',
  'Age-group sit-out: no back-to-back field exposure without rotation path',
  'Adult pickup: Tue/Thu post-youth · pre-registration only',
  'Weekend clinic/party slots: fixed windows; tournament max 1× per 12-week cycle',
  'Field inventory: youth membership primarily station-based; field use gated',
]
