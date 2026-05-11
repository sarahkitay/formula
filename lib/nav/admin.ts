import type { NavItem } from '@/lib/nav/types'

/** Program + facility modules (top nav: “Modules” → `/admin/modules`). */
export const adminModuleDestinations: NavItem[] = [
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

const scheduleNav: NavItem = {
  label: 'Schedule',
  href: '/admin/schedule',
  icon: 'Calendar',
  description: 'Calendar · grid · publish · ops map below',
  gridStatus: 'active',
}

const checkInNav: NavItem = {
  label: 'Check-In',
  href: '/admin/check-in',
  icon: 'UserCheck',
  badge: 'LIVE',
  badgeVariant: 'accent',
  description: 'Attendance · roster + clients',
  gridStatus: 'active',
}

const financeNav: NavItem = {
  label: 'Finance',
  href: '/admin/finance',
  icon: 'BarChart2',
  description: 'Revenue · payments ledger · FPI',
  gridStatus: 'warning',
}

const modulesHubNavItem: NavItem = {
  label: 'Modules',
  href: '/admin/modules',
  icon: 'LayoutGrid',
  description: 'Memberships · programming · rentals · mail · settings',
  gridStatus: 'neutral',
}

const dashboardNav: NavItem = {
  label: 'Dashboard',
  href: '/admin/dashboard',
  icon: 'LayoutDashboard',
  description: 'Executive snapshot + module grid',
  gridStatus: 'neutral',
}

/**
 * Formula Admin OS — short primary header nav only.
 * Other destinations: `/admin/modules`, header search, and pinned dashboard tiles.
 */
export const adminNav: NavItem[] = [
  dashboardNav,
  scheduleNav,
  checkInNav,
  financeNav,
  modulesHubNavItem,
]

/** Dashboard home grid: four entry points (everything else via Modules + search). */
export const adminDashboardPinnedTiles: NavItem[] = [
  scheduleNav,
  checkInNav,
  financeNav,
  modulesHubNavItem,
]

export type AdminPortalSearchLink = { label: string; href: string }

/** All admin destinations for portal search (deduped by href). */
export function getAdminPortalSearchLinks(): AdminPortalSearchLink[] {
  const byHref = new Map<string, AdminPortalSearchLink>()
  for (const item of [...adminNav, ...adminModuleDestinations]) {
    byHref.set(item.href, { label: item.label, href: item.href })
  }
  return [...byHref.values()]
}
