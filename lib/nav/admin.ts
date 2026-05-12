import type { NavItem } from '@/lib/nav/types'

/** Paths counted as Finance in the admin header section select. */
export const adminFinanceSectionPaths = [
  '/admin/finance',
  '/admin/payments',
  '/admin/revenue-strategy',
  '/admin/invoices',
] as const

export const adminScheduleSectionPaths = [
  '/admin/schedule',
  '/admin/check-in',
  '/admin/facility-map',
  '/admin/friday-friendlies',
] as const

export const adminRentalsSectionPaths = ['/admin/rentals', '/admin/field-rentals'] as const

/** Program + facility modules (full grid on Dashboard + `/admin/modules`). */
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
    label: 'Friday Friendlies',
    href: '/admin/friday-friendlies',
    icon: 'Users',
    description: 'Paid pre-reg from the public link · names · waiver follow-up',
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

const financeHrefSet = new Set<string>(adminFinanceSectionPaths)

function isRentalsPath(p: string): boolean {
  return p === '/admin/rentals' || p.startsWith('/admin/rentals/') || p === '/admin/field-rentals'
}

const dashboardSectionExtras = [
  '/admin/modules',
  '/admin/dashboard',
  '/admin/overview',
  '/admin/scalability',
  '/admin/players',
  '/admin/clients',
  '/admin/fpi',
] as const

const dashboardNavSectionPaths: readonly string[] = [
  ...dashboardSectionExtras,
  ...adminModuleDestinations.map(d => d.href).filter(h => !financeHrefSet.has(h) && !isRentalsPath(h)),
]

const financeNav: NavItem = {
  label: 'Finance',
  href: '/admin/finance',
  icon: 'BarChart2',
  description: 'Revenue · payments ledger · FPI',
  gridStatus: 'warning',
  navSectionPaths: adminFinanceSectionPaths,
}

const scheduleNav: NavItem = {
  label: 'Schedule',
  href: '/admin/schedule',
  icon: 'Calendar',
  description: 'Calendar · grid · publish · check-in · facility map',
  gridStatus: 'active',
  navSectionPaths: adminScheduleSectionPaths,
}

const rentalsNav: NavItem = {
  label: 'Rentals',
  href: '/admin/rentals',
  icon: 'Building2',
  description: 'Field rental waivers · packages · field ops',
  gridStatus: 'neutral',
  navSectionPaths: adminRentalsSectionPaths,
}

const dashboardNav: NavItem = {
  label: 'Dashboard',
  href: '/admin/dashboard',
  icon: 'LayoutDashboard',
  description: 'Executive snapshot · all modules · live feed',
  gridStatus: 'neutral',
  navSectionPaths: dashboardNavSectionPaths,
}

/**
 * Formula Admin OS: four header sections (Finance, Schedule, Rentals, Dashboard).
 * Dashboard owns `/admin/modules`, deep module routes, and ops pages (see `navSectionPaths`).
 */
export const adminNav: NavItem[] = [financeNav, scheduleNav, rentalsNav, dashboardNav]

export type AdminPortalSearchLink = { label: string; href: string }

/** All admin destinations for portal search (deduped by href). */
export function getAdminPortalSearchLinks(): AdminPortalSearchLink[] {
  const byHref = new Map<string, AdminPortalSearchLink>()
  for (const item of [...adminNav, ...adminModuleDestinations]) {
    byHref.set(item.href, { label: item.label, href: item.href })
  }
  const extras: AdminPortalSearchLink[] = [
    { label: 'Payments', href: '/admin/payments' },
    { label: 'Facility map', href: '/admin/facility-map' },
    { label: 'Revenue strategy', href: '/admin/revenue-strategy' },
    { label: 'FPI admin', href: '/admin/fpi' },
    { label: 'Overview', href: '/admin/overview' },
    { label: 'Scalability', href: '/admin/scalability' },
    { label: 'Players', href: '/admin/players' },
    { label: 'Client profile', href: '/admin/clients/profile' },
    { label: 'Field rentals (alt)', href: '/admin/field-rentals' },
  ]
  for (const e of extras) {
    if (!byHref.has(e.href)) byHref.set(e.href, e)
  }
  return [...byHref.values()]
}
