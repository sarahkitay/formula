import type { NavItem } from '@/lib/nav/types'

/** Coach execution portal - not admin, not parent */
export const coachNav: NavItem[] = [
  {
  label: 'Today',
  href: '/coach/today',
  icon: 'Activity',
  description: 'Sessions · block · asset · alerts',
  gridStatus: 'active',
  },
  {
  label: 'Floor',
  href: '/coach/floor',
  icon: 'Map',
  description: 'Live map · your assignment · zone status',
  gridStatus: 'neutral',
  },
  {
  label: 'Check-in',
  href: '/coach/check-in',
  icon: 'UserCheck',
  badge: 'FAST',
  badgeVariant: 'accent',
  description: 'Present · late · absent · capacity',
  gridStatus: 'active',
  },
  {
  label: 'Youth block',
  href: '/coach/block',
  icon: 'Timer',
  description: '25+5+25 · rotation · transition timer',
  gridStatus: 'neutral',
  },
  {
  label: 'Observations',
  href: '/coach/observations',
  icon: 'Target',
  description: 'FPI domains · rubric · internal only',
  gridStatus: 'neutral',
  },
  {
  label: 'Friday',
  href: '/coach/friday',
  icon: 'Trophy',
  description: 'Circuit roster · competitive notes',
  gridStatus: 'neutral',
  },
  {
  label: 'Clinic',
  href: '/coach/clinic',
  icon: 'Zap',
  description: 'Delivery · ratio · follow-up',
  gridStatus: 'neutral',
  },
  {
  label: 'Groups',
  href: '/coach/groups',
  icon: 'Users',
  description: 'Rosters · tablet mode',
  gridStatus: 'neutral',
  },
  {
  label: 'Attendance',
  href: '/coach/attendance',
  icon: 'ClipboardList',
  description: 'Mirror · roster sync',
  gridStatus: 'neutral',
  },
  {
  label: 'Notes',
  href: '/coach/notes',
  icon: 'BookOpen',
  description: 'Drill tags · quick logs',
  gridStatus: 'neutral',
  },
  {
  label: 'Athletes',
  href: '/coach/performance',
  icon: 'BarChart2',
  description: 'Profiles · FPI snapshot',
  gridStatus: 'neutral',
  },
]
