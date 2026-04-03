import type { NavItem } from '@/lib/nav/types'

/** Parent portal - clarity, structure, trust; no leaderboard culture */
export const parentNav: NavItem[] = [
  {
  label: 'Home',
  href: '/parent/dashboard',
  icon: 'LayoutDashboard',
  description: 'Family overview · next steps',
  gridStatus: 'neutral',
  },
  {
  label: 'Schedule',
  href: '/parent/bookings',
  icon: 'Calendar',
  description: 'Structured blocks · allowances',
  gridStatus: 'active',
  },
  {
  label: 'Progress',
  href: '/parent/progress',
  icon: 'TrendingUp',
  description: 'Attendance · development themes',
  gridStatus: 'neutral',
  },
  {
  label: 'FPI report',
  href: '/parent/fpi-report',
  icon: 'Gauge',
  description: 'Formula Performance Index',
  gridStatus: 'neutral',
  },
  {
  label: 'Membership',
  href: '/parent/memberships',
  icon: 'CreditCard',
  description: 'Tier · benefits · reassessment',
  gridStatus: 'neutral',
  },
  {
  label: 'Register',
  href: '/parent/register',
  icon: 'ClipboardList',
  description: 'Friday · clinics · camps · more',
  gridStatus: 'neutral',
  },
  {
  label: 'Messages',
  href: '/parent/messages',
  icon: 'MessageCircle',
  description: 'Reminders · changes · invites',
  gridStatus: 'neutral',
  },
  {
  label: 'Learn',
  href: '/parent/learn',
  icon: 'BookOpen',
  description: 'How Formula fits your journey',
  gridStatus: 'neutral',
  },
  {
  label: 'Players',
  href: '/parent/players',
  icon: 'Users',
  description: 'Athlete profiles',
  gridStatus: 'neutral',
  },
  {
  label: 'Billing',
  href: '/parent/payments',
  icon: 'DollarSign',
  description: 'Invoices · payment method',
  gridStatus: 'neutral',
  },
]
