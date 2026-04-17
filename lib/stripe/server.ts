import dns from 'node:dns'
import https from 'node:https'
import Stripe from 'stripe'

/** Prefer IPv4 for outbound HTTPS — avoids flaky IPv6 routes that often surface as StripeConnectionError. */
dns.setDefaultResultOrder('ipv4first')

const stripeHttpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 50,
})

/** Base URL for Stripe success/cancel redirects (no trailing slash). */
export function getSiteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit) return explicit.replace(/\/$/, '')
  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) return `https://${vercel.replace(/\/$/, '')}`
  return 'http://localhost:3000'
}

let stripeSingleton: Stripe | null = null

/**
 * Stripe keys must be a single header-safe token. Vercel / shell pastes often add
 * trailing `\n`, `\r`, BOM, or wrapping quotes — Node then throws
 * `TypeError: Invalid character in header content ["Authorization"]` (ERR_INVALID_CHAR).
 */
export function normalizeStripeSecretKey(raw: string): string {
  let k = raw.replace(/^\uFEFF/, '').trim()
  if (
    (k.startsWith('"') && k.endsWith('"') && k.length > 2) ||
    (k.startsWith("'") && k.endsWith("'") && k.length > 2)
  ) {
    k = k.slice(1, -1).trim()
  }
  // No whitespace is valid inside sk_/rk_ secrets; strips accidental newlines anywhere.
  k = k.replace(/\s/g, '')
  return k
}

export type StripeSecretKeyCheck =
  | { ok: true; key: string }
  | { ok: false; reason: 'missing' | 'empty' | 'publishable_key'; message: string }

/** Validates `STRIPE_SECRET_KEY` before instantiating Stripe (wrong key type is a common Vercel mis-paste). */
export function checkStripeServerSecretKey(): StripeSecretKeyCheck {
  const raw = process.env.STRIPE_SECRET_KEY
  if (raw == null || raw === '') {
    return {
      ok: false,
      reason: 'missing',
      message: 'Payments are not configured. Set STRIPE_SECRET_KEY on the server.',
    }
  }
  const key = normalizeStripeSecretKey(String(raw))
  if (!key) {
    return {
      ok: false,
      reason: 'empty',
      message: 'STRIPE_SECRET_KEY is empty after trimming. Check the value in your host environment.',
    }
  }
  if (key.startsWith('pk_live_') || key.startsWith('pk_test_')) {
    return {
      ok: false,
      reason: 'publishable_key',
      message:
        'STRIPE_SECRET_KEY is set to a Publishable key (pk_…). Server routes need the Secret key: Stripe Dashboard → Developers → API keys → Reveal for the key that starts with sk_live_ or sk_test_.',
    }
  }
  return { ok: true, key }
}

export function getStripe(): Stripe | null {
  const check = checkStripeServerSecretKey()
  if (!check.ok) {
    if (check.reason !== 'missing') {
      console.error('[stripe] STRIPE_SECRET_KEY unusable:', check.reason)
    }
    return null
  }
  const key = check.key
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(key, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
      httpAgent: stripeHttpsAgent,
      maxNetworkRetries: 6,
      timeout: 120_000,
    })
  }
  return stripeSingleton
}
