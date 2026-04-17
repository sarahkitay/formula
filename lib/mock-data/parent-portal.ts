/**
 * Parent-facing copy and demo tiles - clarity without pressure or leaderboard culture.
 */

export interface ParentUpcomingEvent {
  id: string
  type: 'reassessment' | 'clinic' | 'friday' | 'camp' | 'footbot'
  title: string
  dateLabel: string
  detail: string
  href: string
}

export interface ParentRecommendedAction {
  id: string
  label: string
  href: string
}

export interface ParentProgressUpdate {
  date: string
  summary: string
  playerId: string
}

export interface ParentMessage {
  id: string
  sentAt: string
  title: string
  preview: string
  category: 'reminder' | 'change' | 'checkin' | 'reassessment' | 'clinic' | 'announcement'
}

export interface RegistrationSurface {
  id: string
  title: string
  description: string
  status: 'open' | 'waitlist' | 'closed' | 'invite'
  href: string
}

export const parentAttendanceSnapshot = {
  last30Days: 'Live attendance will appear when check-ins sync to your portal',
  streakWeeks: 0,
}

/** Join first names for copy: "Ava", "Ava and Ben", "Ava, Ben, and Cal". */
export function formatAthleteFirstNames(firstNames: string[]): string {
  const n = firstNames.map(s => s.trim()).filter(Boolean)
  if (n.length === 0) return 'your athlete'
  if (n.length === 1) return n[0]!
  if (n.length === 2) return `${n[0]} and ${n[1]}`
  return `${n.slice(0, -1).join(', ')}, and ${n[n.length - 1]}`
}

/**
 * Recommended next steps use real linked athletes (first names), not placeholder demo names.
 */
export function buildParentRecommendedActions(players: { id: string; firstName: string }[]): ParentRecommendedAction[] {
  if (players.length === 0) {
  return [
    { id: 'a1', label: 'Book next youth block', href: '/parent/bookings' },
    { id: 'a2', label: 'Review FPI summary in the portal', href: '/parent/fpi-report' },
    { id: 'a3', label: 'Confirm Friday game registration window', href: '/parent/register' },
  ]
  }

  const names = formatAthleteFirstNames(players.map(p => p.firstName))
  const primary = players[0]!
  const fpiHref = players.length === 1 ? `/parent/fpi-report/${primary.id}` : '/parent/fpi-report'

  return [
    { id: 'a1', label: `Book next youth block for ${names}`, href: '/parent/bookings' },
    {
      id: 'a2',
      label:
        players.length === 1
          ? `Review ${primary.firstName}'s FPI summary in the portal`
          : `Review FPI summaries for ${names} in the portal`,
      href: fpiHref,
    },
    {
      id: 'a3',
      label:
        players.length === 1
          ? `Confirm Friday game registration window for ${primary.firstName}`
          : `Confirm Friday game registration window (${names})`,
      href: '/parent/register',
    },
  ]
}

/** Reassessment tile links to progress (or a specific athlete when `primaryPlayerId` is set). */
export function buildParentUpcomingEvents(_primaryPlayerId: string | null): ParentUpcomingEvent[] {
  return []
}

export const parentProgressUpdates: ParentProgressUpdate[] = []

export const parentMessages: ParentMessage[] = []

export const registrationSurfaces: RegistrationSurface[] = [
  {
  id: 'r1',
  title: 'Youth membership blocks',
  description: 'Book from published blocks for your athlete’s age band - not an open calendar.',
  status: 'open',
  href: '/parent/bookings',
  },
  {
  id: 'r2',
  title: 'Friday Youth Game Circuit',
  description: 'Pre-registration only · balanced teams · application focus.',
  status: 'open',
  href: '/parent/register',
  },
  {
  id: 'r3',
  title: 'Clinics & labs',
  description: 'Members-first windows · FPI-informed recommendations.',
  status: 'waitlist',
  href: '/parent/register',
  },
  {
  id: 'r4',
  title: 'Camps & events',
  description: 'Structured weeks · capacity-limited.',
  status: 'open',
  href: '/parent/register',
  },
  {
  id: 'r5',
  title: 'Assessments',
  description: 'Reassessment scheduling within Formula cadence.',
  status: 'open',
  href: '/parent/progress',
  },
  {
  id: 'r6',
  title: 'Birthday parties',
  description: 'Inquiry form · coach-led packages.',
  status: 'open',
  href: '/parent/register',
  },
  {
  id: 'r7',
  title: 'Footbot',
  description: 'Sunday technical challenges & rentals when published.',
  status: 'open',
  href: '/parent/register',
  },
]

export const parentEducationSections = [
  {
  title: 'Formula complements club soccer',
  body: 'We are a structured development accelerator - not a replacement for your club. Training here should translate to application on your club’s match day.',
  },
  {
  title: 'Capacity-controlled sessions',
  body: 'Youth blocks are intentionally limited. Scheduling is a selection system from published windows - not unlimited drop-in access.',
  },
  {
  title: 'FPI is for clarity',
  body: 'The Formula Performance Index helps coaches and families understand development priorities. It is not a public leaderboard or ranking wall.',
  },
  {
  title: 'Friday games = application',
  body: 'Friday Youth Game Circuit is pre-registered and developmental - not casual pickup or league standings culture.',
  },
  {
  title: 'Serious, youth-sensitive',
  body: 'Expect discipline, structure, and professionalism - delivered in an environment that respects young athletes.',
  },
] as const

export { weeklyBlockAllowance } from '@/lib/parent/block-allowance-config'
export { parentFpiReportEmpty as fpiReportDemo } from '@/lib/parent/fpi-report-shell'
