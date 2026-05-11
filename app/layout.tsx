import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ShellRoot } from '@/components/shell/shell-root'
import { SITE } from '@/lib/site-config'
import { getSiteOrigin } from '@/lib/site-origin'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-inter',
  display: 'swap',
  adjustFontFallback: true,
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
  adjustFontFallback: true,
})

const siteOrigin = getSiteOrigin()
const defaultDescription =
  'Serious soccer training at Formula Soccer Center in Los Angeles: structured youth blocks, assessments (FPI), field rentals, events, and capacity-controlled programming.'

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: SITE.facilityName,
    template: `%s | ${SITE.facilityName}`,
  },
  description: defaultDescription,
  applicationName: SITE.facilityName,
  referrer: 'origin-when-cross-origin',
  authors: [{ name: SITE.facilityName, url: siteOrigin }],
  creator: SITE.facilityName,
  publisher: SITE.facilityName,
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: SITE.facilityName,
    title: SITE.facilityName,
    description: defaultDescription,
    images: [
      {
        url: '/formula-logo.png',
        width: 512,
        height: 512,
        alt: `${SITE.facilityName} logo`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.facilityName,
    description: defaultDescription,
    images: ['/formula-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'sports',
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim()
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION.trim() } }
    : {}),
}

export const viewport: Viewport = {
  themeColor: '#232323',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
  <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
  <body className="h-full font-sans text-foreground">
  <ShellRoot>{children}</ShellRoot>
  </body>
  </html>
  )
}
