/**
 * Prevents overlapping field rentals for the same field + date + time window.
 * Uses Supabase when `rental_slot_bookings` exists and service role is set; otherwise an in-process Map (fine for local dev; not for multi-instance production).
 */

import type Stripe from 'stripe'
import { getServiceSupabase } from '@/lib/supabase/service'

export type RentalSlotFields = {
  fieldId: string
  sessionDate: string
  timeSlot: string
  rentalRef: string
}

const PENDING_MINUTES = 30

type MemoryEntry = {
  rentalRef: string
  stripeCheckoutSessionId: string | null
  status: 'pending' | 'confirmed'
  pendingExpiresAt: number
}

const memoryBookings = new Map<string, MemoryEntry>()

function slotKey(fieldId: string, sessionDate: string, timeSlot: string): string {
  return `${fieldId.trim()}|${sessionDate.trim()}|${timeSlot.trim()}`
}

function isPendingExpired(entry: MemoryEntry): boolean {
  return entry.status === 'pending' && Date.now() > entry.pendingExpiresAt
}

export function pruneExpiredMemorySlots(): void {
  for (const [k, v] of memoryBookings.entries()) {
    if (isPendingExpired(v)) {
      memoryBookings.delete(k)
    }
  }
}

/** Slots that are unavailable for booking (confirmed, or pending and not expired). */
export async function listUnavailableSlotsForDate(sessionDate: string): Promise<{ fieldId: string; timeSlot: string }[]> {
  const supabase = getServiceSupabase()
  const nowIso = new Date().toISOString()

  if (supabase) {
    const { data, error } = await supabase
      .from('rental_slot_bookings')
      .select('field_id, time_slot, status, pending_expires_at')
      .eq('session_date', sessionDate)

    if (!error && data != null) {
      return data
        .filter(row => {
          if (row.status === 'confirmed') return true
          if (row.status === 'pending' && row.pending_expires_at && row.pending_expires_at > nowIso) return true
          return false
        })
        .map(row => ({ fieldId: row.field_id as string, timeSlot: row.time_slot as string }))
    }
    if (error) {
      console.warn('[rental-slots] listUnavailable supabase:', error.message)
    }
  }

  pruneExpiredMemorySlots()
  const out: { fieldId: string; timeSlot: string }[] = []
  for (const [key, entry] of memoryBookings.entries()) {
    const parts = key.split('|')
    if (parts.length < 3) continue
    const date = parts[1]
    if (date !== sessionDate) continue
    if (entry.status === 'confirmed' || (entry.status === 'pending' && !isPendingExpired(entry))) {
      out.push({ fieldId: parts[0], timeSlot: parts.slice(2).join('|') })
    }
  }
  return out
}

/** Returns false if the slot is already held or confirmed. */
export async function tryClaimSlotForCheckout(fields: RentalSlotFields): Promise<boolean> {
  const supabase = getServiceSupabase()
  const expiresAt = new Date(Date.now() + PENDING_MINUTES * 60 * 1000).toISOString()

  if (supabase) {
    await supabase
      .from('rental_slot_bookings')
      .delete()
      .eq('field_id', fields.fieldId)
      .eq('session_date', fields.sessionDate)
      .eq('time_slot', fields.timeSlot)
      .eq('status', 'pending')
      .lt('pending_expires_at', new Date().toISOString())

    const { error } = await supabase.from('rental_slot_bookings').insert({
      field_id: fields.fieldId,
      session_date: fields.sessionDate,
      time_slot: fields.timeSlot,
      rental_ref: fields.rentalRef,
      status: 'pending',
      pending_expires_at: expiresAt,
      stripe_checkout_session_id: null,
    })

    if (!error) {
      return true
    }
    if (error.code === '23505') {
      return false
    }
    console.warn('[rental-slots] supabase insert failed, using in-memory fallback:', error.message)
  }

  pruneExpiredMemorySlots()
  const key = slotKey(fields.fieldId, fields.sessionDate, fields.timeSlot)
  const existing = memoryBookings.get(key)
  if (existing && (existing.status === 'confirmed' || !isPendingExpired(existing))) {
    return false
  }
  memoryBookings.set(key, {
    rentalRef: fields.rentalRef,
    stripeCheckoutSessionId: null,
    status: 'pending',
    pendingExpiresAt: Date.now() + PENDING_MINUTES * 60 * 1000,
  })
  return true
}

export async function attachStripeSessionToSlot(fields: RentalSlotFields, stripeSessionId: string): Promise<void> {
  const supabase = getServiceSupabase()
  if (supabase) {
    await supabase
      .from('rental_slot_bookings')
      .update({ stripe_checkout_session_id: stripeSessionId })
      .eq('rental_ref', fields.rentalRef)
      .eq('field_id', fields.fieldId)
      .eq('session_date', fields.sessionDate)
      .eq('time_slot', fields.timeSlot)
    return
  }

  const key = slotKey(fields.fieldId, fields.sessionDate, fields.timeSlot)
  const entry = memoryBookings.get(key)
  if (entry && entry.rentalRef === fields.rentalRef) {
    entry.stripeCheckoutSessionId = stripeSessionId
  }
}

/** Drop a pending hold (e.g. user left checkout before paying). */
export async function releasePendingSlotByRef(rentalRef: string): Promise<void> {
  const supabase = getServiceSupabase()
  if (supabase) {
    await supabase.from('rental_slot_bookings').delete().eq('rental_ref', rentalRef).eq('status', 'pending')
    return
  }

  for (const [key, entry] of memoryBookings.entries()) {
    if (entry.rentalRef === rentalRef && entry.status === 'pending') {
      memoryBookings.delete(key)
    }
  }
}

export async function confirmSlotFromPaidCheckout(session: Stripe.Checkout.Session): Promise<void> {
  const m = session.metadata ?? {}
  if (m.type !== 'field-rental-booking') return

  const fieldId = m.rental_field?.trim()
  const sessionDate = m.rental_date?.trim()
  const timeSlot = m.rental_window?.trim()
  const rentalRef = m.rental_ref?.trim()
  if (!fieldId || !sessionDate || !timeSlot || !rentalRef) return

  const supabase = getServiceSupabase()
  if (supabase) {
    const { error } = await supabase
      .from('rental_slot_bookings')
      .update({
        status: 'confirmed',
        pending_expires_at: null,
        stripe_checkout_session_id: session.id,
      })
      .eq('rental_ref', rentalRef)
      .eq('field_id', fieldId)
      .eq('session_date', sessionDate)
      .eq('time_slot', timeSlot)

    if (error) {
      console.error('[rental-slots] confirm update:', error.message)
    }
    return
  }

  const key = slotKey(fieldId, sessionDate, timeSlot)
  memoryBookings.set(key, {
    rentalRef,
    stripeCheckoutSessionId: session.id,
    status: 'confirmed',
    pendingExpiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000,
  })
}
