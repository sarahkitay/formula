/**
 * Demo data for Formula Admin OS - scheduling, FPI, revenue discipline, assets.
 * Production: replace with API + RBAC + audit store.
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

export const adminAlerts: FacilityAlert[] = [
  {
  id: 'a1',
  severity: 'warning',
  code: 'BUFFER',
  message: 'Youth block U12-A end vs U12-B start: 9m gap (target 10–15m protected)',
  at: new Date().toISOString(),
  },
  {
  id: 'a2',
  severity: 'critical',
  code: 'CAPACITY',
  message: 'Field 2 session at 102% roster - manual hold required',
  assetId: 'field-2',
  at: new Date().toISOString(),
  },
  {
  id: 'a3',
  severity: 'info',
  code: 'DATA',
  message: 'FPI reassessment window opens in 12 days - 14 athletes pending baseline',
  at: new Date().toISOString(),
  },
  {
  id: 'a4',
  severity: 'warning',
  code: 'START',
  message: 'Adult pickup Tue block: coach check-in 4m late (flagged for audit)',
  at: new Date().toISOString(),
  },
]

export const revenueByCategory: RevenueCategoryRow[] = [
  { category: 'Youth membership', amount: 428_000, pct: 46 },
  { category: 'Rentals & club packages', amount: 118_000, pct: 12.7 },
  { category: 'Adult programming', amount: 72_000, pct: 7.8 },
  { category: 'Clinics & labs', amount: 54_000, pct: 5.8 },
  { category: 'Camps & events', amount: 198_000, pct: 21.3 },
  { category: 'Other / retail', amount: 58_000, pct: 6.2 },
]

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

export const todaysYouthBlocks: YouthBlockRow[] = [
  {
  id: 'yb1',
  window: '4:00–4:55',
  ageBand: '6–8',
  program: 'Station rotation · Band A',
  coach: 'M. Rivera',
  capacity: '22 / 24',
  bufferOk: true,
  onTime: true,
  },
  {
  id: 'yb2',
  window: '5:10–6:05',
  ageBand: '9–11',
  program: 'Station rotation · Band B',
  coach: 'S. Okonkwo',
  capacity: '24 / 24',
  bufferOk: false,
  onTime: true,
  },
  {
  id: 'yb3',
  window: '6:20–7:15',
  ageBand: '12–14',
  program: 'Application block + FPI touch',
  coach: 'J. Chen',
  capacity: '20 / 22',
  bufferOk: true,
  onTime: false,
  },
]

export const todaysAdultBlocks = [
  { window: '8:15–9:10', program: 'Adult pickup · pre-reg', division: 'Open', registrations: 18, cap: 20 },
  { window: '9:25–10:20', program: 'Adult pickup · pre-reg', division: 'Open', registrations: 14, cap: 20 },
]

export const rentalsClinicsPartiesToday = [
  { type: 'Structured rental', label: 'Club partner · recurring', window: '2:00–3:30', asset: 'Field 3' },
  { type: 'Clinic', label: 'Speed lab · invite', window: '3:45–4:40', asset: 'Speed Track' },
  { type: 'Party', label: 'Birthday · coach-led', window: '6:30–8:00', asset: 'Party Room' },
]

export const checkInAttendanceSnapshot = {
  checkedIn: 86,
  expected: 91,
  noShowRisk: 5,
  lateArrival: 3,
}

export const facilityAssets: FacilityAsset[] = [
  {
  id: 'field-1',
  label: 'Field 1',
  shortLabel: 'F1',
  status: 'in-use',
  utilizationPct: 88,
  currentProgram: 'U11 station rotation',
  nextProgram: 'Buffer / reset',
  load: 0.88,
  },
  {
  id: 'field-2',
  label: 'Field 2',
  shortLabel: 'F2',
  status: 'in-use',
  utilizationPct: 102,
  currentProgram: 'U9 technical block',
  nextProgram: 'U9 application',
  load: 1,
  },
  {
  id: 'field-3',
  label: 'Field 3',
  shortLabel: 'F3',
  status: 'reserved',
  utilizationPct: 0,
  currentProgram: '-',
  nextProgram: 'Club rental 2:00',
  load: 0,
  },
  {
  id: 'performance-center',
  label: 'Performance Center',
  shortLabel: 'Perf',
  status: 'in-use',
  utilizationPct: 76,
  currentProgram: 'Small-sided application',
  nextProgram: 'Friday circuit prep',
  load: 0.76,
  },
  {
  id: 'speed-track',
  label: 'Speed Track',
  shortLabel: 'Spd',
  status: 'in-use',
  utilizationPct: 64,
  currentProgram: 'FPI speed capture',
  nextProgram: 'Clinic block',
  load: 0.64,
  },
  {
  id: 'double-speed-court',
  label: 'Double Speed Court',
  shortLabel: '2Spd',
  status: 'available',
  utilizationPct: 0,
  currentProgram: '-',
  nextProgram: 'Open calibration',
  load: 0,
  },
  {
  id: 'footbot',
  label: 'Footbot',
  shortLabel: 'FB',
  status: 'closed',
  utilizationPct: 0,
  currentProgram: 'Maintenance window',
  nextProgram: 'Sun technical challenge',
  load: 0,
  },
  {
  id: 'support-cluster',
  label: 'Support (gym · flex · party · speed court)',
  shortLabel: 'Sup',
  status: 'in-use',
  utilizationPct: 42,
  currentProgram: 'Mixed support',
  nextProgram: 'Overflow + events',
  load: 0.42,
  },
]

export const membershipByAge: MembershipAgeRow[] = [
  { band: '4–5', active: 28, waitlist: 6, cap: 36, performance: 24, performanceElite: 4, demandIndex: 0.94 },
  { band: '6–8', active: 44, waitlist: 12, cap: 48, performance: 36, performanceElite: 8, demandIndex: 1.12 },
  { band: '9–11', active: 41, waitlist: 8, cap: 48, performance: 33, performanceElite: 8, demandIndex: 1.02 },
  { band: '12–14', active: 38, waitlist: 4, cap: 44, performance: 30, performanceElite: 8, demandIndex: 0.95 },
  { band: '15–19', active: 22, waitlist: 2, cap: 32, performance: 18, performanceElite: 4, demandIndex: 0.75 },
]

export const fridayCircuitRosters: FridayRosterRow[] = [
  {
  id: 'f1',
  ageBand: '9–11',
  team: 'Gold A',
  field: 'Performance Center',
  window: '5:00–5:55',
  fpiAvg: 62,
  coachNotes: 'High competitive - pair with structure',
  },
  {
  id: 'f2',
  ageBand: '12–14',
  team: 'Blue B',
  field: 'Field 1',
  window: '6:10–7:05',
  fpiAvg: 71,
  coachNotes: 'Maturity-balanced roster',
  },
]

export const adultLeagueSeasons = [
  { name: 'Sat Coed · Spring', division: 'Intermediate', teams: 8, week: 4, totalWeeks: 12 },
  { name: 'Sun Open', division: 'Advanced', teams: 6, week: 4, totalWeeks: 12 },
]

export const clinicRows = [
  {
  id: 'c1',
  name: 'Acceleration lab',
  type: 'Standard',
  nextDate: 'Mar 28',
  seats: '6 / 8',
  coach: 'Rivera',
  conversion: '72%',
  },
  {
  id: 'c2',
  name: '1v1 cognitive',
  type: 'Specialty',
  nextDate: 'Apr 4',
  seats: '4 / 6',
  coach: 'Chen',
  conversion: '81%',
  },
]

export const rentalPackages = [
  { category: 'Recurring package', active: 6, mrr: 12400 },
  { category: 'Club package', active: 3, mrr: 8900 },
  { category: 'Private training rental', active: 12, mrr: 0 },
  { category: 'One-off rental', active: 4, mrr: 0 },
]

export const eventsLayerSummary = {
  camps: { summerWeeks: 8, enrolled: 118, conversionToMembership: '19%' },
  tournaments: { perCycle: 1, nextDate: 'May 17', fieldsBooked: 3 },
  parties: { fixedWindows: 4, thisMonth: 7 },
  footbot: { sundayStandalone: true, nextSlot: 'Sun 10:00', mode: 'Technical challenge + rental' },
}

export const fpiWorkflowQueue = [
  { id: 'w1', athlete: 'Player 2041', type: '6-mo reassessment', due: 'Apr 02', pillarGap: 'Cognitive' as FpiPillar },
  { id: 'w2', athlete: 'Player 1988', type: 'Baseline', due: 'Apr 08', pillarGap: 'Technical' as FpiPillar },
  { id: 'w3', athlete: 'Player 2102', type: 'Off-cycle', due: 'Mar 29', pillarGap: 'Speed' as FpiPillar },
]

export const scalabilityLayer = [
  'Multi-location: tenant + facility_id on all operational entities',
  'Central FPI store: assessment versioning, QC flags, staff-only percentile bands',
  'SOP engine: checklist templates per phase (launch / optimize / replicate)',
  'FPI licensing: partner clubs submit assessments; audit + dispute workflow',
]

export const sampleAuditLog: AuditEntry[] = [
  {
  id: 'aud1',
  at: '14:22:08',
  actor: 'admin@formula.sc',
  action: 'OVERRIDE_SCHEDULE',
  resource: 'Field 2 · capacity +2 (reason: director approval #4921)',
  },
  {
  id: 'aud2',
  at: '13:58:41',
  actor: 'lead@formula.sc',
  action: 'FRIDAY_ROSTER_LOCK',
  resource: 'Age 9–11 · Gold A roster frozen',
  },
]

export const scheduleRulesSummary = [
  '55m youth blocks · 10–15m reset buffers enforced in generator',
  'Age-group sit-out: no back-to-back field exposure without rotation path',
  'Adult pickup: Tue/Thu post-youth · pre-registration only',
  'Weekend clinic/party slots: fixed windows; tournament max 1× per 12-week cycle',
  'Field inventory: youth membership primarily station-based; field use gated',
]

export const cycleEngine = {
  currentCycle: '2025-Q2-A',
  weekInCycle: 4,
  totalWeeks: 12,
  nextCycleStart: 'Jun 02, 2025',
}
