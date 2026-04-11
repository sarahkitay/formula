/** Quick-search targets: keywords are matched substring-wise (lowercase). */
export type ParentPortalSearchItem = {
  id: string
  label: string
  description: string
  href: string
  keywords: string[]
}

export const PARENT_PORTAL_SEARCH_ITEMS: ParentPortalSearchItem[] = [
  {
    id: 'home',
    label: 'Home',
    description: 'Family overview and next steps',
    href: '/parent/dashboard',
    keywords: ['home', 'dashboard', 'overview', 'family'],
  },
  {
    id: 'schedule',
    label: 'Schedule & booking',
    description: 'Book youth blocks and view holds',
    href: '/parent/bookings',
    keywords: ['schedule', 'book', 'booking', 'block', 'calendar', 'train', 'session', 'reserve'],
  },
  {
    id: 'assessment',
    label: 'Book an assessment',
    description: 'Skills check and placement',
    href: '/parent/book-assessment',
    keywords: ['assessment', 'skills', 'check', 'evaluate', 'book assessment', 'signup', 'register assessment'],
  },
  {
    id: 'progress',
    label: 'Athlete progress',
    description: 'Scores and staff notes',
    href: '/parent/progress',
    keywords: ['progress', 'development', 'scores', 'notes', 'check progress', 'performance'],
  },
  {
    id: 'fpi',
    label: 'FPI report',
    description: 'Formula Performance Index',
    href: '/parent/fpi-report',
    keywords: ['fpi', 'report', 'index', 'formula performance'],
  },
  {
    id: 'players',
    label: 'My players',
    description: 'Linked athlete profiles',
    href: '/parent/players',
    keywords: ['players', 'athlete', 'kids', 'children', 'profile'],
  },
  {
    id: 'membership',
    label: 'Membership',
    description: 'Packages and tiers',
    href: '/parent/memberships',
    keywords: ['membership', 'package', 'plan', 'tier', 'sessions'],
  },
  {
    id: 'billing',
    label: 'Billing & account',
    description: 'Invoices and receipts',
    href: '/parent/payments',
    keywords: ['billing', 'payment', 'invoice', 'receipt', 'account', 'money', 'card'],
  },
  {
    id: 'register',
    label: 'Register',
    description: 'Friday circuit, clinics, camps',
    href: '/parent/register',
    keywords: ['register', 'friday', 'clinic', 'camp', 'game circuit'],
  },
  {
    id: 'messages',
    label: 'Messages',
    description: 'Reminders and updates',
    href: '/parent/messages',
    keywords: ['messages', 'inbox', 'email', 'reminder'],
  },
  {
    id: 'learn',
    label: 'Learn',
    description: 'How Formula works',
    href: '/parent/learn',
    keywords: ['learn', 'help', 'guide', 'how', 'faq', 'explain'],
  },
]

export function filterParentPortalSearch(query: string): ParentPortalSearchItem[] {
  const q = query.trim().toLowerCase()
  if (!q) return PARENT_PORTAL_SEARCH_ITEMS.slice(0, 8)
  return PARENT_PORTAL_SEARCH_ITEMS.filter(
    item =>
      item.label.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.keywords.some(k => k.includes(q) || q.includes(k))
  ).slice(0, 12)
}
