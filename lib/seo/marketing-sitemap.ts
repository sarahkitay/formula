import { BOOKING_HUB_PUBLIC } from '@/lib/marketing/book-assessment-paths'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import type { MetadataRoute } from 'next'

/** Paths that must not appear in the public sitemap (auth, receipts, dynamic tokens). */
const EXCLUDED_PREFIXES = ['/admin', '/coach', '/parent', '/organizer', '/login', '/api', '/checkout', '/portal-signup', '/staff-portal', '/parent-portal', '/forgot-password', '/rentals/waiver/'] as const

const EXCLUDED_EXACT = new Set<string>(['/portal-signup', '/checkout/success', '/checkout/cancel'])

export type SitemapEntry = { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }

function pathKey(href: string): string {
  const path = href.split('#')[0].trim()
  if (!path.startsWith('/')) return `/${path}`
  return path
}

function isExcluded(path: string): boolean {
  if (EXCLUDED_EXACT.has(path)) return true
  if (path === '/login' || path.startsWith('/login?')) return true
  return EXCLUDED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))
}

function priorityFor(path: string): number {
  if (path === '/') return 1
  if (path === MARKETING_HREF.youthMembership || path === MARKETING_HREF.bookAssessment || path === MARKETING_HREF.whatIsFormula) return 0.95
  if (path === MARKETING_HREF.events || path === MARKETING_HREF.facility || path === MARKETING_HREF.rentals) return 0.9
  return 0.75
}

function changeFrequencyFor(path: string): MetadataRoute.Sitemap[number]['changeFrequency'] {
  if (path === '/' || path === MARKETING_HREF.events || path === MARKETING_HREF.bookAssessment) return 'weekly'
  if (path === MARKETING_HREF.careers || path === MARKETING_HREF.privacy || path === MARKETING_HREF.terms) return 'yearly'
  return 'monthly'
}

/** Indexable marketing URLs for `sitemap.xml` (deduped, no hash fragments). */
export function getMarketingSitemapEntries(): SitemapEntry[] {
  const paths = new Set<string>()

  for (const v of Object.values(MARKETING_HREF)) {
    if (typeof v !== 'string') continue
    paths.add(pathKey(v))
  }
  for (const v of Object.values(BOOKING_HUB_PUBLIC)) {
    if (typeof v !== 'string') continue
    paths.add(pathKey(v))
  }

  const sorted = [...paths].filter((p) => p.length > 0 && !isExcluded(p)).sort((a, b) => {
    if (a === '/') return -1
    if (b === '/') return 1
    return a.localeCompare(b)
  })

  return sorted.map((path) => ({
    path,
    changeFrequency: changeFrequencyFor(path),
    priority: priorityFor(path),
  }))
}
