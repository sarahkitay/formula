/**
 * Canonical public origin for metadata, sitemaps, Stripe redirects, and share URLs.
 * Set `NEXT_PUBLIC_SITE_URL` in production (e.g. https://formulasoccer.com).
 */
export function getSiteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit) return explicit.replace(/\/$/, '')
  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) return `https://${vercel.replace(/\/$/, '')}`
  return 'http://localhost:3000'
}
