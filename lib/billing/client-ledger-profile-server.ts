import { getServiceSupabase } from '@/lib/supabase/service'
import {
  checkoutTypeDescription,
  inferCheckoutTypeFromMetadata,
} from '@/lib/billing/stripe-purchases-server'
import type { PaymentStatus } from '@/types'

type RawPurchaseRow = {
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

export type LedgerPurchaseDetail = {
  id: string
  stripeSessionId: string
  stripeCustomerId: string | null
  email: string | null
  type: string
  amountUsd: number
  currency: string | null
  paymentStatus: string | null
  status: PaymentStatus
  createdAt: string
  metadata: Record<string, unknown>
  description: string
}

function mapPaymentStatus(stripeStatus: string | null): PaymentStatus {
  const s = (stripeStatus ?? '').toLowerCase()
  if (s === 'paid') return 'completed'
  if (s === 'unpaid' || s === 'no_payment_required') return 'pending'
  if (s === 'canceled' || s === 'cancelled') return 'failed'
  return 'pending'
}

function rowToDetail(row: RawPurchaseRow): LedgerPurchaseDetail {
  const meta = row.metadata ?? {}
  const effectiveType = inferCheckoutTypeFromMetadata(row.type, meta)
  return {
    id: row.id,
    stripeSessionId: row.stripe_session_id,
    stripeCustomerId: row.stripe_customer_id,
    email: row.email?.trim() || null,
    type: effectiveType,
    amountUsd: row.amount / 100,
    currency: row.currency,
    paymentStatus: row.payment_status,
    status: mapPaymentStatus(row.payment_status),
    createdAt: row.created_at,
    metadata: meta as Record<string, unknown>,
    description: checkoutTypeDescription(effectiveType, meta),
  }
}

export type ClientLedgerAnalytics = {
  purchaseCount: number
  completedCount: number
  lifetimeRevenueUsd: number
  firstPurchaseAt: string | null
  lastPurchaseAt: string | null
  byCheckoutType: Record<string, number>
  averageOrderUsd: number
}

export type ClientLedgerProfile = {
  primaryEmail: string | null
  displayName: string
  purchases: LedgerPurchaseDetail[]
  analytics: ClientLedgerAnalytics
}

function buildAnalytics(purchases: LedgerPurchaseDetail[]): ClientLedgerAnalytics {
  if (purchases.length === 0) {
    return {
      purchaseCount: 0,
      completedCount: 0,
      lifetimeRevenueUsd: 0,
      firstPurchaseAt: null,
      lastPurchaseAt: null,
      byCheckoutType: {},
      averageOrderUsd: 0,
    }
  }
  const completed = purchases.filter(p => p.status === 'completed')
  const lifetime = completed.reduce((s, p) => s + p.amountUsd, 0)
  const sorted = [...purchases].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  const byCheckoutType: Record<string, number> = {}
  for (const p of purchases) {
    const k = p.type || 'unknown'
    byCheckoutType[k] = (byCheckoutType[k] ?? 0) + 1
  }
  return {
    purchaseCount: purchases.length,
    completedCount: completed.length,
    lifetimeRevenueUsd: Math.round(lifetime * 100) / 100,
    firstPurchaseAt: sorted[0]?.createdAt ?? null,
    lastPurchaseAt: sorted[sorted.length - 1]?.createdAt ?? null,
    byCheckoutType,
    averageOrderUsd:
      completed.length > 0 ? Math.round((lifetime / completed.length) * 100) / 100 : 0,
  }
}

function displayNameFromPurchases(purchases: LedgerPurchaseDetail[]): string {
  for (const p of purchases) {
    const m = p.metadata
    const g =
      typeof m.fnf_guardian_name === 'string'
        ? m.fnf_guardian_name.trim()
        : typeof m.invoice_payee === 'string'
          ? m.invoice_payee.trim()
          : typeof m.renter_name === 'string'
            ? m.renter_name.trim()
            : typeof m.party_contact_name === 'string'
              ? m.party_contact_name.trim()
              : ''
    if (g.length >= 2) return g
  }
  const em = purchases.find(x => x.email)?.email
  if (em) return em
  return 'Customer'
}

export async function fetchClientLedgerProfile(params: {
  email?: string | null
  purchaseId?: string | null
}): Promise<ClientLedgerProfile | null> {
  const sb = getServiceSupabase()
  if (!sb) return null

  const emailNorm = params.email?.trim().toLowerCase() ?? ''
  const purchaseId = params.purchaseId?.trim() ?? ''

  const rowsMap = new Map<string, LedgerPurchaseDetail>()

  if (purchaseId) {
    const { data: one, error: e1 } = await sb
      .from('stripe_purchases')
      .select(
        'id, stripe_session_id, stripe_customer_id, email, type, amount, currency, payment_status, metadata, created_at'
      )
      .eq('id', purchaseId)
      .maybeSingle()
    if (!e1 && one) {
      const d = rowToDetail(one as RawPurchaseRow)
      rowsMap.set(d.id, d)
      const seedEmail = (d.email ?? '').trim().toLowerCase()
      if (seedEmail && !emailNorm) {
        const { data: byMail, error: e2 } = await sb
          .from('stripe_purchases')
          .select(
            'id, stripe_session_id, stripe_customer_id, email, type, amount, currency, payment_status, metadata, created_at'
          )
          .ilike('email', seedEmail)
          .order('created_at', { ascending: true })
          .limit(500)
        if (!e2 && byMail) {
          for (const r of byMail as RawPurchaseRow[]) {
            const x = rowToDetail(r)
            rowsMap.set(x.id, x)
          }
        }
      }
    }
  }

  if (emailNorm) {
    const { data: byMail, error } = await sb
      .from('stripe_purchases')
      .select(
        'id, stripe_session_id, stripe_customer_id, email, type, amount, currency, payment_status, metadata, created_at'
      )
      .ilike('email', emailNorm)
      .order('created_at', { ascending: true })
      .limit(500)
    if (!error && byMail) {
      for (const r of byMail as RawPurchaseRow[]) {
        const x = rowToDetail(r)
        rowsMap.set(x.id, x)
      }
    }
  }

  if (rowsMap.size === 0) return null

  const purchases = [...rowsMap.values()].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )

  const primaryEmail =
    (emailNorm && purchases.find(p => (p.email ?? '').toLowerCase() === emailNorm)?.email) ??
    purchases.find(p => p.email)?.email ??
    null

  return {
    primaryEmail,
    displayName: displayNameFromPurchases(purchases),
    purchases,
    analytics: buildAnalytics(purchases),
  }
}
