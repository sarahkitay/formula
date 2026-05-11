import type { MetadataRoute } from 'next'
import { getSiteOrigin } from '@/lib/site-origin'

export default function robots(): MetadataRoute.Robots {
  const base = getSiteOrigin()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/coach/',
          '/parent/',
          '/organizer/',
          '/login',
          '/api/',
          '/checkout/',
          '/portal-signup',
          '/staff-portal',
          '/parent-portal',
          '/forgot-password',
          '/rentals/waiver/',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
