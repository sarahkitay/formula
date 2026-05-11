import { SITE } from '@/lib/site-config'
import { getSiteOrigin } from '@/lib/site-origin'

/** Machine-readable venue + site graph for Google and AI crawlers (JSON-LD). */
export function MarketingSiteJsonLd() {
  const origin = getSiteOrigin()
  const payload = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'SportsActivityLocation'],
        '@id': `${origin}/#organization`,
        name: SITE.facilityName,
        url: origin,
        telephone: SITE.publicPhoneTel,
        description: SITE.tagline,
        address: {
          '@type': 'PostalAddress',
          streetAddress: '15001 Calvert Street',
          addressLocality: 'Van Nuys',
          addressRegion: 'CA',
          postalCode: '91411',
          addressCountry: 'US',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        name: SITE.facilityName,
        url: origin,
        inLanguage: 'en-US',
        publisher: { '@id': `${origin}/#organization` },
      },
    ],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }} />
}
