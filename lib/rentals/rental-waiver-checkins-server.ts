import { listAgreementsForRentalBooking } from '@/lib/rentals/field-rental-agreements-server'
import { isUuid } from '@/lib/rentals/field-rental-waiver-labels'
import { getServiceSupabase } from '@/lib/supabase/service'

export type RentalWaiverCheckinRow = {
  field_rental_agreement_id: string
  checked_in_at: string
  checked_in_by: string | null
}

/** Load check-in rows for one rental slot booking (empty if table missing or none). */
export async function listRentalWaiverCheckinsForBooking(
  rentalSlotBookingId: string
): Promise<RentalWaiverCheckinRow[]> {
  if (!isUuid(rentalSlotBookingId)) return []
  const supabase = getServiceSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('field_rental_slot_waiver_checkins')
    .select('field_rental_agreement_id, checked_in_at, checked_in_by')
    .eq('rental_slot_booking_id', rentalSlotBookingId)
    .order('checked_in_at', { ascending: true })

  if (error) {
    if (
      error.message.includes('field_rental_slot_waiver_checkins') ||
      error.message.includes('schema cache') ||
      error.code === '42P01'
    ) {
      console.warn('[rental-waiver-checkins] table missing — run supabase/field_rental_slot_waiver_checkins.sql')
    } else {
      console.warn('[rental-waiver-checkins] list:', error.message)
    }
    return []
  }
  return (data ?? []) as RentalWaiverCheckinRow[]
}

/** Mark a signer present or clear check-in. Agreement must already match this booking (slot or Stripe). */
export async function setRentalWaiverCheckIn(params: {
  rentalSlotBookingId: string
  fieldRentalAgreementId: string
  checkedIn: boolean
  checkedInBy?: string | null
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const bookingId = params.rentalSlotBookingId.trim()
  const agreementId = params.fieldRentalAgreementId.trim()
  if (!isUuid(bookingId) || !isUuid(agreementId)) {
    return { ok: false, message: 'Invalid booking or waiver id.' }
  }

  const supabase = getServiceSupabase()
  if (!supabase) {
    return { ok: false, message: 'Database not configured.' }
  }

  const { data: booking, error: bErr } = await supabase
    .from('rental_slot_bookings')
    .select('id, field_id, session_date, time_slot, stripe_checkout_session_id')
    .eq('id', bookingId)
    .maybeSingle()

  if (bErr || !booking) {
    return { ok: false, message: 'Rental booking not found.' }
  }

  const agreements = await listAgreementsForRentalBooking(booking)
  const allowed = new Set(agreements.map(a => a.id))
  if (!allowed.has(agreementId)) {
    return { ok: false, message: 'This signed waiver is not on file for this rental slot.' }
  }

  if (params.checkedIn) {
    await supabase
      .from('field_rental_slot_waiver_checkins')
      .delete()
      .eq('rental_slot_booking_id', bookingId)
      .eq('field_rental_agreement_id', agreementId)

    const { error } = await supabase.from('field_rental_slot_waiver_checkins').insert({
      rental_slot_booking_id: bookingId,
      field_rental_agreement_id: agreementId,
      checked_in_at: new Date().toISOString(),
      checked_in_by: params.checkedInBy?.trim() || null,
    })
    if (error) {
      console.error('[rental-waiver-checkins] insert:', error.message)
      if (error.message.includes('field_rental_slot_waiver_checkins') || error.code === '42P01') {
        return {
          ok: false,
          message:
            'Check-in table is missing. Run `supabase/field_rental_slot_waiver_checkins.sql` (or the block in ALL_MIGRATIONS.sql) in Supabase.',
        }
      }
      return { ok: false, message: 'Could not save check-in.' }
    }
    return { ok: true }
  }

  const { error: delErr } = await supabase
    .from('field_rental_slot_waiver_checkins')
    .delete()
    .eq('rental_slot_booking_id', bookingId)
    .eq('field_rental_agreement_id', agreementId)

  if (delErr) {
    console.error('[rental-waiver-checkins] delete:', delErr.message)
    return { ok: false, message: 'Could not clear check-in.' }
  }
  return { ok: true }
}
