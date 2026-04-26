import { getServiceSupabase } from '@/lib/supabase/service'
import type { RevenueCategoryRow } from '@/lib/mock-data/admin-operating-system'
import { FACILITY_TIMEZONE, formatYmdInTimeZone } from '@/lib/facility/facility-day'
import { OFFLINE_FIELD_RENTAL_SESSION_PREFIX } from '@/lib/stripe/record-purchase'
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

function metaString(m: Record<string, unknown>, key: string): string | undefined {
  const v = m[key]
  return typeof v === 'string' && v.trim() ? v.trim() : undefined
}

/** Human-readable line item for admin / parent ledgers. */
export function checkoutTypeDescription(type: string, metadata: Record<string, unknown>): string {
  const m = metadata ?? {}
  switch (type) {
    case 'field-rental-booking': {
      const field = metaString(m, 'rental_field')
      const weeks = metaString(m, 'rental_weeks')
      const rentalType = metaString(m, 'rental_type')
      const parts = ['Field rental deposit']
      if (rentalType) parts.push(rentalType.replace(/_/g, ' '))
      if (field) parts.push(field.replace(/_/g, ' '))
      if (weeks) parts.push(`${weeks} session(s)`)
      if (metaString(m, 'admin_offline') === 'true') parts.push('in person (admin)')
      return parts.join(' · ')
    }
    case 'party-booking-1k':
      return 'Party deposit ($1k)'
    case 'assessment':
      return 'Skills check / assessment'
    case 'package-5':
      return 'Session package (5)'
    case 'package-10':
      return 'Session package (10)'
    case 'littles-6wk-300': {
      const track = metaString(m, 'littles_track')
      const weeks = metaString(m, 'littles_calendar_weeks')
      const parts = ['Formula Minis 6-week pack ($300)']
      if (track) parts.push(track.replace(/-/g, ' '))
      if (weeks) parts.push(`${weeks} calendar wk`)
      return parts.join(' · ')
    }
    case 'manual-invoice':
      return metaString(m, 'invoice_payee') ? `Custom invoice · ${metaString(m, 'invoice_payee')}` : 'Custom invoice'
    default:
      return type ? type.replace(/-/g, ' ') : 'Checkout'
  }
}

function customerDisplayName(row: StripePurchaseRow): string {
  const m = row.metadata ?? {}
  const email = row.email?.trim()
  if (row.type === 'party-booking-1k') {
    const name = metaString(m, 'party_contact_name')
    if (name) return name
  }
  if (row.type === 'manual-invoice') {
    const payee = metaString(m, 'invoice_payee')
    if (payee) return payee
  }
  if (row.type === 'field-rental-booking') {
    const renter = metaString(m, 'renter_name')
    if (renter) return renter
    const ref = metaString(m, 'rental_ref')
    if (email) return email
    if (ref) return `Booking ${ref.slice(0, 10)}…`
  }
  if (email) return email
  return 'Customer'
}

function inferCheckoutTypeFromMetadata(rowType: string, meta: Record<string, unknown>): string {
  const t = rowType.trim()
  if (t && t !== 'unknown') return t
  if (metaString(meta, 'rental_ref') && (metaString(meta, 'rental_field') || metaString(meta, 'rental_window'))) {
    return 'field-rental-booking'
  }
  return t || 'unknown'
}

function mapRowToPayment(row: StripePurchaseRow): Payment {
  const meta = row.metadata ?? {}
  const effectiveType = inferCheckoutTypeFromMetadata(row.type, meta)
  const rowForDisplay: StripePurchaseRow = { ...row, type: effectiveType }
  const playerId = typeof meta.player_id === 'string' ? meta.player_id : ''
  const playerName = customerDisplayName(rowForDisplay)
  const dollars = row.amount / 100
  const offlineFieldRental =
    row.stripe_session_id.startsWith(OFFLINE_FIELD_RENTAL_SESSION_PREFIX) || metaString(meta, 'admin_offline') === 'true'

  return {
    id: row.id,
    playerId,
    playerName,
    amount: dollars,
    currency: 'USD',
    description: checkoutTypeDescription(effectiveType, meta),
    checkoutType: effectiveType,
    paymentMethod: (offlineFieldRental ? 'cash' : 'card') as PaymentMethod,
    status: mapPaymentStatus(row.payment_status),
    createdAt: row.created_at,
    invoiceNumber: row.stripe_session_id.length > 14 ? `${row.stripe_session_id.slice(0, 14)}…` : row.stripe_session_id,
  }
}

/**
 * Roll up completed Checkout revenue into coarse buckets that align with
 * `computeRevenueThresholds` category name prefixes (Rentals, Youth membership, …).
 */
export function buildStripeRevenueCategoryRows(completed: Payment[]): RevenueCategoryRow[] {
  const total = completed.reduce((s, p) => s + p.amount, 0)
  if (total <= 0) return []

  const sumTypes = (types: Set<string>) =>
    completed.filter(p => p.checkoutType && types.has(p.checkoutType)).reduce((s, p) => s + p.amount, 0)

  const rentals = sumTypes(new Set(['field-rental-booking', 'party-booking-1k']))
  const youthPrograms = sumTypes(new Set(['assessment', 'package-5', 'package-10', 'littles-6wk-300']))
  const custom = sumTypes(new Set(['manual-invoice']))
  const attributed = rentals + youthPrograms + custom
  const other = Math.max(0, total - attributed)

  const mk = (category: string, amount: number): RevenueCategoryRow => ({
    category,
    amount,
    pct: Math.round((amount / total) * 1000) / 10,
  })

  const out: RevenueCategoryRow[] = []
  if (rentals > 0) out.push(mk('Rentals & facility (Stripe)', rentals))
  if (youthPrograms > 0) out.push(mk('Youth membership / Skills + packages (Stripe)', youthPrograms))
  if (custom > 0) out.push(mk('Custom invoices (Stripe)', custom))
  if (other > 0) out.push(mk('Other checkouts (Stripe)', other))

  if (out.length > 0) {
    let sumEarly = 0
    for (let i = 0; i < out.length - 1; i++) sumEarly += out[i].pct
    out[out.length - 1] = { ...out[out.length - 1], pct: Math.round((100 - sumEarly) * 10) / 10 }
  }
  return out
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/** Remove a ledger row (admin). Does not refund in Stripe. */
export async function deleteStripePurchaseById(
  id: string
): Promise<{ ok: true } | { ok: false; message: string; notFound?: boolean }> {
  const trimmed = id.trim()
  if (!UUID_RE.test(trimmed)) {
    return { ok: false, message: 'Invalid payment id.' }
  }
  const sb = getServiceSupabase()
  if (!sb) {
    return { ok: false, message: 'Database not configured.' }
  }
  const { data, error } = await sb.from('stripe_purchases').delete().eq('id', trimmed).select('id')
  if (error) {
    console.warn('[stripe-purchases] delete:', error.message)
    return { ok: false, message: error.message }
  }
  if (!data?.length) {
    return { ok: false, message: 'Payment not found.', notFound: true }
  }
  return { ok: true }
}

function isSameFacilityDay(iso: string, ref: Date): boolean {
  return formatYmdInTimeZone(iso, FACILITY_TIMEZONE) === formatYmdInTimeZone(ref, FACILITY_TIMEZONE)
}

/** Completed Stripe Checkout rows (service role). Amounts are stored in cents. */
export async function listStripePurchasesAsPayments(limit = 500): Promise<Payment[]> {
  const sb = getServiceSupabase()
  if (!sb) return []

  const { data, error } = await sb
    .from('stripe_purchases')
    .select('id, stripe_session_id, stripe_customer_id, email, type, amount, currency, payment_status, metadata, created_at')
    .order('created_at', { ascending: false })
    .limit(Math.min(2000, Math.max(1, limit)))

  if (error) {
    console.warn('[stripe-purchases] list:', error.message)
    return []
  }

  const rows = (data ?? []) as StripePurchaseRow[]
  return rows.map(mapRowToPayment)
}

export async function getStripeRevenueSummary(): Promise<{
  configured: boolean
  totalRevenue: number
  completedCount: number
  pendingCount: number
  recent: Payment[]
  lastCompleted: Payment | undefined
  rowCount: number
  /** Completed revenue grouped for overview / strategy (empty if no data). */
  stripeRevenueByCategory: RevenueCategoryRow[]
  fieldRentalRevenueTotal: number
  fieldRentalRevenueToday: number
  fieldRentalCompletedCount: number
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
      stripeRevenueByCategory: [],
      fieldRentalRevenueTotal: 0,
      fieldRentalRevenueToday: 0,
      fieldRentalCompletedCount: 0,
    }
  }
  const rows = await listStripePurchasesAsPayments(500)
  const completed = rows.filter(r => r.status === 'completed')
  const pending = rows.filter(r => r.status === 'pending')
  const totalRevenue = completed.reduce((s, r) => s + r.amount, 0)
  const fieldRows = completed.filter(p => p.checkoutType === 'field-rental-booking')
  const now = new Date()
  const fieldRentalRevenueToday = fieldRows.filter(p => isSameFacilityDay(p.createdAt, now)).reduce((s, p) => s + p.amount, 0)
  const fieldRentalRevenueTotal = fieldRows.reduce((s, p) => s + p.amount, 0)

  return {
    configured: true,
    totalRevenue,
    completedCount: completed.length,
    pendingCount: pending.length,
    recent: rows.slice(0, 10),
    lastCompleted: completed[0],
    rowCount: rows.length,
    stripeRevenueByCategory: buildStripeRevenueCategoryRows(completed),
    fieldRentalRevenueTotal,
    fieldRentalRevenueToday,
    fieldRentalCompletedCount: fieldRows.length,
  }
}
