import { getServiceSupabase } from '@/lib/supabase/service'
import type { RevenueCategoryRow } from '@/lib/mock-data/admin-operating-system'
import { FACILITY_TIMEZONE, formatYmdInTimeZone } from '@/lib/facility/facility-day'
import { OFFLINE_FIELD_RENTAL_SESSION_PREFIX, recordOfflineFieldRentalPurchase } from '@/lib/stripe/record-purchase'
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
    case 'sunday-child-10wk-500': {
      const track = metaString(m, 'sunday_child_track')
      const parts = ['Sunday Weekend Program 10-week ($500)']
      if (track) parts.push(track.replace(/-/g, ' '))
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
  if (metaString(meta, 'sunday_child_track')) {
    return 'sunday-child-10wk-500'
  }
  return t || 'unknown'
}

/** Snapshot from `field_rental_waiver_invites` for syncing Admin → Rentals payment edits into `stripe_purchases`. */
export type FieldRentalInviteLedgerPayload = {
  id: string
  stripe_checkout_session_id: string | null
  checkout_amount_total_cents: number | null
  checkout_currency: string | null
  checkout_completed_at: string | null
  purchaser_email: string | null
  purchaser_name: string | null
  rental_ref: string | null
  rental_type: string | null
  booking_rental_field: string | null
  booking_rental_window: string | null
  booking_rental_date: string | null
  booking_rental_dates_compact: string | null
  booking_session_weeks: number | null
  expected_waiver_count: number
}

/**
 * Keeps `stripe_purchases` (Payments ledger + revenue rollups) aligned with roster invite payment fields.
 * - Stripe checkouts: row matched by `stripe_session_id` = `cs_*`.
 * - In-person / manual: matched by synthetic `offline_fr_*` on invite, or `metadata.waiver_invite_id`.
 * - If no row exists and amount ≥ $0.50, inserts an offline field-rental row (same shape as paid-in-person flow).
 */
export async function syncFieldRentalInviteToStripePurchasesLedger(inv: FieldRentalInviteLedgerPayload): Promise<void> {
  const sb = getServiceSupabase()
  if (!sb) return

  const sid = (inv.stripe_checkout_session_id ?? '').trim()
  const centsRaw = inv.checkout_amount_total_cents
  const cents = centsRaw != null && Number.isFinite(centsRaw) ? Math.round(centsRaw) : null
  const currency = (inv.checkout_currency ?? 'usd').toLowerCase().slice(0, 8)
  const email = inv.purchaser_email?.trim() || null

  const buildMetadata = (): Record<string, string> => ({
    type: 'field-rental-booking',
    waiver_invite_id: inv.id,
    rental_ref: inv.rental_ref?.trim() || '',
    rental_field: inv.booking_rental_field?.trim() || '',
    rental_window: inv.booking_rental_window?.trim() || '',
    rental_date: inv.booking_rental_date?.trim() || '',
    rental_dates_compact: inv.booking_rental_dates_compact?.trim() || '',
    rental_weeks: inv.booking_session_weeks != null ? String(inv.booking_session_weeks) : '',
    rental_participants: String(inv.expected_waiver_count ?? 1),
    rental_type: inv.rental_type?.trim() || '',
    renter_name: inv.purchaser_name?.trim() || '',
    admin_offline: 'true',
  })

  type LedgerRow = { id: string; stripe_session_id: string; metadata: Record<string, unknown> | null }
  let purchase: LedgerRow | null = null

  if (sid.startsWith('cs_') || sid.startsWith(OFFLINE_FIELD_RENTAL_SESSION_PREFIX)) {
    const { data, error } = await sb
      .from('stripe_purchases')
      .select('id, stripe_session_id, metadata')
      .eq('stripe_session_id', sid)
      .maybeSingle()
    if (!error && data) {
      purchase = data as LedgerRow
    }
  }

  if (!purchase) {
    const { data: rows, error: metaErr } = await sb
      .from('stripe_purchases')
      .select('id, stripe_session_id, metadata')
      .eq('type', 'field-rental-booking')
      .contains('metadata', { waiver_invite_id: inv.id })
      .limit(2)
    if (!metaErr && rows?.length) {
      purchase = rows[0] as LedgerRow
    }
  }

  const clearLedger = cents == null || cents === 0
  if (clearLedger) {
    if (purchase?.stripe_session_id?.startsWith(OFFLINE_FIELD_RENTAL_SESSION_PREFIX)) {
      await sb.from('stripe_purchases').delete().eq('id', purchase.id)
      await sb.from('field_rental_waiver_invites').update({ stripe_checkout_session_id: null }).eq('id', inv.id)
    }
    return
  }

  if (!Number.isFinite(cents) || cents < 50) {
    return
  }

  if (purchase) {
    const prevMeta = (purchase.metadata ?? {}) as Record<string, unknown>
    const isOfflineRow =
      purchase.stripe_session_id.startsWith(OFFLINE_FIELD_RENTAL_SESSION_PREFIX) ||
      metaString(prevMeta as Record<string, unknown>, 'admin_offline') === 'true'

    let merged: Record<string, unknown>
    if (isOfflineRow) {
      merged = { ...prevMeta, ...buildMetadata() }
    } else {
      merged = {
        ...prevMeta,
        waiver_invite_id: inv.id,
        renter_name: inv.purchaser_name?.trim() || metaString(prevMeta, 'renter_name') || '',
        rental_field: inv.booking_rental_field?.trim() || metaString(prevMeta, 'rental_field') || '',
        rental_window: inv.booking_rental_window?.trim() || metaString(prevMeta, 'rental_window') || '',
        rental_date: inv.booking_rental_date?.trim() || metaString(prevMeta, 'rental_date') || '',
        rental_dates_compact: inv.booking_rental_dates_compact?.trim() || metaString(prevMeta, 'rental_dates_compact') || '',
        rental_weeks:
          inv.booking_session_weeks != null
            ? String(inv.booking_session_weeks)
            : metaString(prevMeta, 'rental_weeks') || '',
        rental_ref: inv.rental_ref?.trim() || metaString(prevMeta, 'rental_ref') || '',
        rental_type: inv.rental_type?.trim() || metaString(prevMeta, 'rental_type') || '',
        rental_participants: String(inv.expected_waiver_count ?? 1),
      }
    }

    const { error: upErr } = await sb
      .from('stripe_purchases')
      .update({
        amount: cents,
        currency,
        email,
        payment_status: 'paid',
        metadata: merged as Record<string, unknown>,
      })
      .eq('id', purchase.id)

    if (upErr) {
      console.error('[stripe-purchases] sync invite → update ledger:', upErr.message)
    }
    return
  }

  if (sid.startsWith('cs_')) {
    console.warn('[stripe-purchases] sync invite: no ledger row for Checkout session', sid)
    return
  }

  const recorded = await recordOfflineFieldRentalPurchase({
    amountCents: cents,
    currency,
    email,
    metadata: buildMetadata(),
  })
  if (!recorded.ok) {
    console.error('[stripe-purchases] sync invite → insert ledger:', recorded.message)
    return
  }

  if (!sid.startsWith('cs_')) {
    const { error: linkErr } = await sb
      .from('field_rental_waiver_invites')
      .update({ stripe_checkout_session_id: recorded.stripe_session_id })
      .eq('id', inv.id)
    if (linkErr) {
      console.warn('[stripe-purchases] sync invite → link synthetic session id:', linkErr.message)
    }
  }
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
  const youthPrograms = sumTypes(
    new Set(['assessment', 'package-5', 'package-10', 'littles-6wk-300', 'sunday-child-10wk-500'])
  )
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
