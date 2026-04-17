import { describe, expect, it } from 'vitest'
import { checkStripeServerSecretKey, normalizeStripeSecretKey } from '@/lib/stripe/server'

describe('checkStripeServerSecretKey', () => {
  it('rejects publishable keys', () => {
    const prev = process.env.STRIPE_SECRET_KEY
    process.env.STRIPE_SECRET_KEY = 'pk_test_1234567890'
    const r = checkStripeServerSecretKey()
    process.env.STRIPE_SECRET_KEY = prev
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.reason).toBe('publishable_key')
  })

  it('accepts sk_test shape', () => {
    const prev = process.env.STRIPE_SECRET_KEY
    process.env.STRIPE_SECRET_KEY = 'sk_test_1234567890abcdefghijklmnopqrstuvwxyz'
    const r = checkStripeServerSecretKey()
    process.env.STRIPE_SECRET_KEY = prev
    expect(r.ok).toBe(true)
  })
})

describe('normalizeStripeSecretKey', () => {
  it('strips trailing newline and CR', () => {
    expect(normalizeStripeSecretKey('sk_test_abc\r\n')).toBe('sk_test_abc')
  })

  it('strips BOM and surrounding quotes', () => {
    expect(normalizeStripeSecretKey('\uFEFF"sk_test_xyz"')).toBe('sk_test_xyz')
  })

  it('removes internal whitespace (invalid in Authorization)', () => {
    expect(normalizeStripeSecretKey('sk_test_ab cd')).toBe('sk_test_abcd')
  })
})
