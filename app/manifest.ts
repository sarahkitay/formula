import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site-config'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.facilityName,
    short_name: SITE.orgShortName,
    description: SITE.tagline,
    start_url: '/',
    display: 'browser',
    background_color: '#1a1d1c',
    theme_color: '#232323',
    lang: 'en',
    orientation: 'portrait-primary',
    categories: ['sports', 'education', 'fitness'],
  }
}
