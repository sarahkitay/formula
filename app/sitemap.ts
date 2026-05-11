import type { MetadataRoute } from 'next'
import { getMarketingSitemapEntries } from '@/lib/seo/marketing-sitemap'
import { getSiteOrigin } from '@/lib/site-origin'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteOrigin()
  return getMarketingSitemapEntries().map(({ path, changeFrequency, priority }) => ({
    url: `${base}${path}`,
    changeFrequency,
    priority,
  }))
}
