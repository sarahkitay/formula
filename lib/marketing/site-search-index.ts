import { MARKETING_HREF, getHeaderMoreNav, getSiteHeaderPrimaryNav } from '@/lib/marketing/nav'

export type SiteSearchItem = {
  id: string
  label: string
  description: string
  href: string
  keywords: string[]
}

const EXTRA: SiteSearchItem[] = [
  {
    id: 'book-hub',
    label: 'Book · assessment hub',
    description: 'Choose Formula Skills Check, youth block, or other booking paths',
    href: MARKETING_HREF.bookAssessmentPortal,
    keywords: ['book', 'hub', 'directory', 'signup', 'register', 'appointment', 'skills check', 'placement'],
  },
  {
    id: 'parent-login',
    label: 'Parent portal sign-in',
    description: 'Schedules, payments, and athlete progress',
    href: '/login?role=parent',
    keywords: ['parent', 'portal', 'login', 'account', 'guardian', 'family'],
  },
  {
    id: 'field-rental-waiver',
    label: 'Field rentals & waivers',
    description: 'Book space and roster waiver links',
    href: MARKETING_HREF.rentals,
    keywords: ['rental', 'rentals', 'field', 'turf', 'waiver', 'team', 'practice', 'club', 'organizer', 'golazo'],
  },
  {
    id: 'minis-pricing',
    label: 'Formula Minis · weekday pack',
    description: 'Ages 2–3 · six-week weekday sessions · $300',
    href: `${MARKETING_HREF.minis}#weekday-package`,
    keywords: ['minis', 'littles', 'toddler', 'preschool', '2-3', 'weekday', '300', 'six week', 'package'],
  },
  {
    id: 'sunday-weekend',
    label: 'Sunday weekend program',
    description: 'Ages 2–5 · scheduled Sundays · $500',
    href: `${MARKETING_HREF.minis}#sunday-weekend`,
    keywords: ['sunday', 'weekend', '500', 'juniors', 'ages 2-5'],
  },
  {
    id: 'events-request',
    label: 'Host an event',
    description: 'Corporate, team building, and private events',
    href: `${MARKETING_HREF.events}#event-request`,
    keywords: ['event', 'events', 'corporate', 'private', 'host', 'request', 'inquiry'],
  },
  {
    id: 'friday-night-friendlies',
    label: 'Friday Night Friendlies',
    description: 'Coach-run pickup ages 6–13 · May 8, 2026 · $20 pre-register',
    href: MARKETING_HREF.fridayNightFriendlies,
    keywords: ['friday', 'friendlies', 'pickup', 'kids', 'youth', 'night', 'king of the hill', '6-13', 'may 8'],
  },
  {
    id: 'summer-camp-2026',
    label: 'Summer Camp 2026',
    description: 'Day camp ages 6–13 · Mon–Fri 9–2:30 · $495/week or $1780 four-week bundle',
    href: MARKETING_HREF.summerCamp2026,
    keywords: ['summer', 'camp', '2026', 'june', 'july', 'august', 'footbot', 'speed brain', 'kids', 'youth', '495', '1780'],
  },
]

function navDerived(): SiteSearchItem[] {
  const seen = new Set<string>()
  const out: SiteSearchItem[] = []
  for (const { label, href } of [...getSiteHeaderPrimaryNav(), ...getHeaderMoreNav()]) {
    if (seen.has(href)) continue
    seen.add(href)
    const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, ' ')
    out.push({
      id: `nav-${href}`,
      label,
      description: `Site · ${href}`,
      href,
      keywords: [slug, href.replace(/^\//, '').replace(/\//g, ' ')],
    })
  }
  return out
}

/** Full index for the public marketing site (deduped by `id`). */
export const SITE_SEARCH_INDEX: SiteSearchItem[] = (() => {
  const byId = new Map<string, SiteSearchItem>()
  for (const item of [...navDerived(), ...EXTRA]) {
    byId.set(item.id, item)
  }
  return [...byId.values()]
})()

const DEFAULT_IDS = ['book-hub', 'nav-/minis', 'nav-/youth-membership', 'field-rental-waiver', 'nav-/events', 'nav-/facility']

export function defaultSiteSearchResults(): SiteSearchItem[] {
  const list: SiteSearchItem[] = []
  for (const id of DEFAULT_IDS) {
    const hit = SITE_SEARCH_INDEX.find(x => x.id === id)
    if (hit) list.push(hit)
  }
  return list.length > 0 ? list : SITE_SEARCH_INDEX.slice(0, 8)
}

function scoreItem(item: SiteSearchItem, tokens: string[]): number {
  if (tokens.length === 0) return 0
  const label = item.label.toLowerCase()
  const desc = item.description.toLowerCase()
  const kw = item.keywords.map(k => k.toLowerCase())
  const blob = `${label} ${desc} ${kw.join(' ')}`
  let total = 0
  for (const t of tokens) {
    let best = 0
    if (label.includes(t)) best = Math.max(best, label.startsWith(t) ? 10 : 6)
    for (const k of kw) {
      if (k.includes(t)) best = Math.max(best, 5)
    }
    if (desc.includes(t)) best = Math.max(best, 2)
    if (best === 0 && blob.includes(t)) best = 1
    if (best === 0) return 0
    total += best
  }
  return total
}

/**
 * Keyword-aware search: multi-word queries rank rows that match more terms higher;
 * label and keyword matches score above description-only hits.
 */
export function searchSitePages(query: string, limit = 14): SiteSearchItem[] {
  const tokens = query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(t => t.length > 0)
  if (tokens.length === 0) return defaultSiteSearchResults()

  const ranked = SITE_SEARCH_INDEX.map(item => ({ item, s: scoreItem(item, tokens) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s || a.item.label.localeCompare(b.item.label))

  return ranked.slice(0, limit).map(x => x.item)
}
