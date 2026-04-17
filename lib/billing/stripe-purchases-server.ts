import { getServiceSupabase } from '@/lib/supabase/service'
import type { Payment, PaymentMethod, PaymentStatus } from '@/types'

type StripePurchaseRow = {
  id: string
  stripe_session_id: string
  stripe_customer_id: string | null
  email: string | null
  type: string
  amount: number
  currency: string | null
  payment_status: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

function mapPaymentStatus(stripeStatus: string | null): PaymentStatus {
  const s = (stripeStatus ?? '').toLowerCase()
  if (s === 'paid') return 'completed'
  if (s === 'unpaid' || s === 'no_payment_required') return 'pending'
  if (s === 'canceled' || s === 'cancelled') return 'failed'
  return 'pending'
}

function mapRowToPayment(row: StripePurchaseRow): Payment {
  const meta = row.metadata ?? {}
  const playerId = typeof meta.player_id === 'string' ? meta.player_id : ''
  const playerName =
    typeof meta.player_name === 'string' && meta.player_name.trim()
      ? meta.player_name.trim()
      : row.email?.trim() || 'Customer'

  const dollars = row.amount / 100

  return {
    id: row.id,
    playerId,
    playerName,
    amount: dollars,
    currency: 'USD',
    description: row.type.replace(/-/g, ' '),
    paymentMethod: 'card' as PaymentMethod,
    status: mapPaymentStatus(row.payment_status),
    createdAt: row.created_at,
    invoiceNumber: row.stripe_session_id.length > 14 ? `${row.stripe_session_id.slice(0, 14)}…` : row.stripe_session_id,
  }
}

/** Completed Stripe Checkout rows (service role). Amounts are stored in cents. */
export async function listStripePurchasesAsPayments(limit = 200): Promise<Payment[]> {
  const sb = getServiceSupabase()
  if (!sb) return []

  const { data, error } = await sb
    .from('stripe_purchases')
    .select('id, stripe_session_id, stripe_customer_id, email, type, amount, currency, payment_status, metadata, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !data?.length) return []

  return (data as StripePurchaseRow[]).map(mapRowToPayment)
}

export async function getStripeRevenueSummary(): Promise<{
  configured: boolean
  totalRevenue: number
  completedCount: number
  pendingCount: number
  recent: Payment[]
  lastCompleted: Payment | undefined
  rowCount: number
}> {
  const sb = getServiceSupabase()
  if (!sb) {
    return {
      configured: false,
      totalRevenue: 0,
      completedCount: 0,
      pendingCount: 0,
      recent: [],
      lastCompleted: undefined,
      rowCount: 0,
    }
  }
  const rows = await listStripePurchasesAsPayments(500)
  const completed = rows.filter(r => r.status === 'completed')
  const pending = rows.filter(r => r.status === 'pending')
  const totalRevenue = completed.reduce((s, r) => s + r.amount, 0)
  return {
    configured: true,
    totalRevenue,
    completedCount: completed.length,
    pendingCount: pending.length,
    recent: rows.slice(0, 10),
    lastCompleted: completed[0],
    rowCount: rows.length,
  }
}
