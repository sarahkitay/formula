const MIN_USD = 0.5
const MAX_USD = 100_000

/** Pure USD parsing for validation (no Stripe / network). */
export function parseUsdToCents(raw: unknown): { ok: true; cents: number } | { ok: false; message: string } {
  if (raw == null) return { ok: false, message: 'amount is required' }
  let n: number
  if (typeof raw === 'number') {
    if (!Number.isFinite(raw)) return { ok: false, message: 'amount must be a number' }
    n = raw
  } else if (typeof raw === 'string') {
    const cleaned = raw.replace(/[$,\s]/g, '').trim()
    if (!cleaned) return { ok: false, message: 'amount is required' }
    n = parseFloat(cleaned)
    if (!Number.isFinite(n)) return { ok: false, message: 'amount must be a valid number' }
  } else {
    return { ok: false, message: 'amount must be a string or number' }
  }

  if (n < MIN_USD) return { ok: false, message: `Minimum charge is $${MIN_USD} USD` }
  if (n > MAX_USD) return { ok: false, message: `Maximum charge is $${MAX_USD.toLocaleString()} USD` }

  const cents = Math.round(n * 100)
  if (cents < Math.round(MIN_USD * 100)) return { ok: false, message: `Minimum charge is $${MIN_USD} USD` }
  return { ok: true, cents }
}
