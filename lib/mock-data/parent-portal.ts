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
      { id: 'a2', label: 'Review FPI summary before April reassessment', href: '/parent/fpi-report' },
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
          ? `Review ${primary.firstName}'s FPI summary before April reassessment`
          : `Review FPI summaries for ${names} before April reassessment`,
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
export function buildParentUpcomingEvents(primaryPlayerId: string | null): ParentUpcomingEvent[] {
  const progressHref = primaryPlayerId ? `/parent/progress/${primaryPlayerId}` : '/parent/progress'
  return [
    {
      id: 'e1',
      type: 'reassessment',
      title: 'FPI reassessment window',
      dateLabel: 'Opens Apr 2',
      detail: 'Scheduled 6-month development check - not a test to pass or fail.',
      href: progressHref,
    },
    {
      id: 'e2',
      type: 'clinic',
      title: 'Speed lab · members early access',
      dateLabel: 'Mar 28',
      detail: 'Invitation based on development priorities - limited seats.',
      href: '/parent/register',
    },
    {
      id: 'e3',
      type: 'friday',
      title: 'Friday Youth Game Circuit',
      dateLabel: 'Register by Thu 6pm',
      detail: 'Pre-registered teams · application-focused environment.',
      href: '/parent/register',
    },
    {
      id: 'e4',
      type: 'camp',
      title: 'Summer structure week',
      dateLabel: 'Opens Apr 15',
      detail: 'Capacity-controlled · members notified first.',
      href: '/parent/register',
    },
    {
      id: 'e5',
      type: 'footbot',
      title: 'Footbot technical challenge',
      dateLabel: 'Sun Apr 6',
      detail: 'Optional add-on · sign-up when window opens.',
      href: '/parent/register',
    },
  ]
}

export const parentProgressUpdates: ParentProgressUpdate[] = [
  {
  playerId: 'player-6',
  date: '2026-03-20',
  summary: 'Coach note: first-touch quality trending up; next focus is scanning before receive.',
  },
  {
  playerId: 'player-7',
  date: '2026-03-20',
  summary: 'Acceleration remains a strength; positioning in the final third is the development theme.',
  },
]

export const parentMessages: ParentMessage[] = [
  {
  id: 'm1',
  sentAt: '2026-03-24T08:00:00',
  title: 'Session reminder',
  preview: 'Liam · Thu 5:30pm youth block - arrive 10 minutes early for check-in.',
  category: 'reminder',
  },
  {
  id: 'm2',
  sentAt: '2026-03-23T14:20:00',
  title: 'Schedule update',
  preview: 'Your age band block on Mar 30 moved +5 minutes to protect buffer windows.',
  category: 'change',
  },
  {
  id: 'm3',
  sentAt: '2026-03-22T18:01:00',
  title: 'Check-in confirmed',
  preview: 'Zoe checked in for Mar 22 session.',
  category: 'checkin',
  },
  {
  id: 'm4',
  sentAt: '2026-03-21T09:00:00',
  title: 'Clinic early access',
  preview: 'Based on development profile, Liam is eligible to register 48h before general window.',
  category: 'clinic',
  },
]

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

export const weeklyBlockAllowance = {
  performance: { label: 'Performance', blocksPerWeek: 2 },
  performanceElite: { label: 'Performance Elite', blocksPerWeek: 3 },
} as const

export const fpiReportDemo = {
  compositeLabel: 'Development index',
  compositeValue: 72,
  compositeNarrative:
  'Liam is tracking positively against Formula’s age-band expectations. Scores reflect training habits and application - not a single “good or bad” day.',
  percentileBand: '68th percentile within Formula U12 cohort',
  trendLabel: 'Steady improvement over last 12 weeks',
  domains: [
  { name: 'Speed', value: 74, note: 'Strong first-step habits' },
  { name: 'Agility', value: 71, note: 'Change of direction improving' },
  { name: 'Technical', value: 76, note: 'First touch is a strength' },
  { name: 'Cognitive', value: 64, note: 'Scanning under pressure - priority theme' },
  { name: 'Competitive', value: 69, note: 'Good engagement in small-sided work' },
  ],
  priorities: ['Scan earlier before receiving in pressure', 'Weak-foot receptions in tight spaces', 'Transition defending shape'],
  focus12Week: 'Application: translate technical comfort into faster decisions in overload moments.',
  clinicSuggestions: ['Cognitive overload lab · invite when seats open', '1v1 escape clinic · members early window'],
  supportiveFooter:
  'Development is non-linear. We use FPI to guide coaching - celebrate progress, name the next best focus, and keep the environment supportive.',
}
