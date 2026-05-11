import type { NavItem } from '@/lib/nav/types'

/**
 * Formula Admin OS — consolidated top nav (Finance groups revenue + payments + FPI).
 * Ops map and player/client registries surface inside Schedule and Check-In pages.
 */
export const adminNav: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: 'LayoutDashboard',
    description: 'Executive snapshot + module grid',
    gridStatus: 'neutral',
  },
  {
    label: 'Schedule',
    href: '/admin/schedule',
    icon: 'Calendar',
    description: 'Calendar · grid · publish · ops map below',
    gridStatus: 'active',
  },
  {
    label: 'Check-In',
    href: '/admin/check-in',
    icon: 'UserCheck',
    badge: 'LIVE',
    badgeVariant: 'accent',
    description: 'Attendance · roster + clients',
    gridStatus: 'active',
  },
  {
    label: 'Finance',
    href: '/admin/finance',
    icon: 'BarChart2',
    description: 'Revenue · payments ledger · FPI',
    gridStatus: 'warning',
  },
  {
    label: 'Memberships',
    href: '/admin/memberships',
    icon: 'CreditCard',
    description: 'Age bands · tiers · waitlist · scarcity',
    gridStatus: 'neutral',
  },
  {
    label: 'Friday circuit',
    href: '/admin/friday-circuit',
    icon: 'Trophy',
    description: 'Pre-reg · rosters · observation · no pickup culture',
    gridStatus: 'neutral',
  },
  {
    label: 'Adult',
    href: '/admin/adult-programming',
    icon: 'CalendarClock',
    description: 'Pickup · leagues · caps vs youth identity',
    gridStatus: 'neutral',
  },
  {
    label: 'Clinics',
    href: '/admin/clinics',
    icon: 'ClipboardList',
    description: 'Scarce labs · FPI-driven access · outcomes',
    gridStatus: 'neutral',
  },
  {
    label: 'Rentals',
    href: '/admin/rentals',
    icon: 'Building2',
    description: 'Structured packages · prime/off-peak · alignment',
    gridStatus: 'neutral',
  },
  {
    label: 'Events',
    href: '/admin/events-layer',
    icon: 'Flame',
    description: 'Camps · tournaments · Friday Friendlies sign-ups · parties',
    gridStatus: 'neutral',
  },
  {
    label: 'Careers',
    href: '/admin/careers',
    icon: 'Briefcase',
    description: 'Front desk + coach applications from /careers',
    gridStatus: 'neutral',
  },
  {
    label: 'Invoices',
    href: '/admin/invoices',
    icon: 'Receipt',
    description: 'Mail / Messages deep links',
    gridStatus: 'neutral',
  },
  {
    label: 'Performance',
    href: '/admin/performance',
    icon: 'TrendingUp',
    description: 'Athlete views · machine feeds',
    gridStatus: 'neutral',
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: 'Settings',
    description: 'RBAC · integrations · facility profile',
    gridStatus: 'neutral',
  },
]
