import { getServiceSupabase } from '@/lib/supabase/service'

/** Field-rental rows from `stripe_purchases` for self-serve organizer hub (service role). */
export type OrganizerFieldRentalPurchaseRow = {
  stripe_session_id: string
  created_at: string
  amount: number
  currency: string | null
  payment_status: string | null
  metadata: Record<string, string>
}

function normalizeMetadata(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== 'object') return {}
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof v === 'string') out[k] = v
    else if (v != null && (typeof v === 'number' || typeof v === 'boolean')) out[k] = String(v)
  }
  return out
}

/** Paid field-rental ledger rows where checkout email matches (same normalization as waiver invites). */
export async function listFieldRentalPurchasesForOrganizerEmail(
  email: string
): Promise<OrganizerFieldRentalPurchaseRow[]> {
  const norm = email.trim().toLowerCase()
  if (!norm.includes('@')) return []
  const sb = getServiceSupabase()
  if (!sb) return []

  const { data, error } = await sb
    .from('stripe_purchases')
    .select('stripe_session_id, created_at, amount, currency, payment_status, metadata, email')
    .eq('type', 'field-rental-booking')
    .ilike('email', norm)

  if (error) {
    console.warn('[organizer-portal] stripe_purchases list:', error.message)
    return []
  }

  const rows = (data ?? []).filter(
    r => ((r as { email?: string | null }).email ?? '').trim().toLowerCase() === norm
  )

  const out: OrganizerFieldRentalPurchaseRow[] = rows.map(r => {
    const row = r as {
      stripe_session_id: string
      created_at: string
      amount: number
      currency: string | null
      payment_status: string | null
      metadata: unknown
    }
    return {
      stripe_session_id: row.stripe_session_id,
      created_at: row.created_at,
      amount: row.amount,
      currency: row.currency,
      payment_status: row.payment_status,
      metadata: normalizeMetadata(row.metadata),
    }
  })

  out.sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
  return out
}

/** One-line summary for organizer UI from purchase metadata. */
export function summarizeFieldRentalPurchaseMetadata(meta: Record<string, string>): string {
  const field = (meta.rental_field ?? '').trim()
  const window = (meta.rental_window ?? '').trim()
  const date = (meta.rental_date ?? meta.rental_dates_compact ?? '').trim()
  const parts = [field, window, date].filter(Boolean)
  return parts.length ? parts.join(' · ') : 'Field rental'
}
