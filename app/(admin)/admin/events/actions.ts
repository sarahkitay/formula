'use server'

import { revalidatePath } from 'next/cache'
import { createManualWaiverInvite } from '@/lib/rentals/waiver-invites-server'
import {
  getFacilityEventById,
  insertFacilityEvent,
  updateFacilityEventStatus,
  updateFacilityEventWaiverInvite,
  type FacilityEventFieldScope,
  type FacilityEventStatus,
} from '@/lib/events/facility-events-server'
import { parseUsdToCents } from '@/lib/stripe/parse-usd-to-cents'
import { getSiteOrigin } from '@/lib/site-origin'

function getStr(formData: FormData, key: string): string {
  const v = formData.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

const FIELD_SCOPES = new Set<FacilityEventFieldScope>(['field_1', 'field_2', 'field_3', 'full_facility'])
const STATUSES = new Set<FacilityEventStatus>(['draft', 'requested', 'confirmed', 'cancelled'])

/** Browsers often submit `HH:MM:SS` from `<input type="time">`; accept optional seconds (ignored for minute-of-day). */
function parseTimeToStartMinute(raw: string): number | null {
  const t = raw.trim()
  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(t)
  if (!m) return null
  const h = parseInt(m[1], 10)
  const min = parseInt(m[2], 10)
  const sec = m[3] != null ? parseInt(m[3], 10) : 0
  if (
    !Number.isFinite(h) ||
    !Number.isFinite(min) ||
    !Number.isFinite(sec) ||
    h < 0 ||
    h > 23 ||
    min < 0 ||
    min > 59 ||
    sec < 0 ||
    sec > 59
  ) {
    return null
  }
  return h * 60 + min
}

export type FacilityEventBookState = {
  ok: boolean
  message: string
  /** Set after a successful save so the UI can scroll to the new row. */
  createdEventId?: string
  /** Populated when "Create waiver on save" succeeds in the same submit. */
  waiverUrl?: string
  /** Populated when "Create payment link on save" succeeds in the same submit. */
  paymentUrl?: string
}

const BOOK_INITIAL: FacilityEventBookState = { ok: false, message: '' }

export async function createFacilityEventBookAction(
  _prev: FacilityEventBookState,
  formData: FormData
): Promise<FacilityEventBookState> {
  try {
    const title = getStr(formData, 'title')
    const eventDate = getStr(formData, 'eventDate')
    const startTime = getStr(formData, 'startTime')
    const startMinute = parseTimeToStartMinute(startTime)
    const durationMinutes = parseInt(getStr(formData, 'durationMinutes'), 10)
    const fieldScope = getStr(formData, 'fieldScope') as FacilityEventFieldScope
    const statusRaw = getStr(formData, 'status') as FacilityEventStatus
    const status = STATUSES.has(statusRaw) ? statusRaw : 'confirmed'
    const organizerName = getStr(formData, 'organizerName')
    const organizerEmail = getStr(formData, 'organizerEmail')
    const notes = getStr(formData, 'notes')

    if (startMinute == null) {
      return { ok: false, message: 'Start time must be valid 24h time (HH:MM or HH:MM:SS).' }
    }
    if (!Number.isFinite(durationMinutes) || durationMinutes < 15 || durationMinutes > 960) {
      return { ok: false, message: 'Duration must be between 15 and 960 minutes.' }
    }
    if (!FIELD_SCOPES.has(fieldScope)) {
      return { ok: false, message: 'Choose Field 1, 2, 3, or full facility.' }
    }

    const wantWaiverOnSave = formData.get('bookCreateWaiver') === 'on'
    const wantPaymentOnSave = formData.get('bookCreatePayment') === 'on'
    const bookExpectedWaiverCount = parseInt(getStr(formData, 'bookExpectedWaiverCount') || '30', 10)
    const bookAmountUsd = getStr(formData, 'bookAmountUsd')
    const bookPaymentMemo = getStr(formData, 'bookPaymentMemo')

    if (wantWaiverOnSave) {
      if (!Number.isFinite(bookExpectedWaiverCount) || bookExpectedWaiverCount < 1 || bookExpectedWaiverCount > 500) {
        return { ok: false, message: 'Expected signers (on save) must be between 1 and 500.' }
      }
    }
    if (wantPaymentOnSave) {
      const payeeCandidate = (organizerName || title).trim()
      if (payeeCandidate.length < 2) {
        return {
          ok: false,
          message:
            'To create a payment link on save, add an organizer name (or a longer event title) so Stripe has a bill-to name.',
        }
      }
      const amt = parseUsdToCents(bookAmountUsd)
      if (!amt.ok) {
        return { ok: false, message: `Payment on save: ${amt.message}` }
      }
    }

    const ins = await insertFacilityEvent({
      title,
      eventDate,
      startMinute,
      durationMinutes,
      fieldScope,
      status,
      organizerName: organizerName || null,
      organizerEmail: organizerEmail || null,
      notes: notes || null,
    })
    if (!ins.ok) {
      return { ok: false, message: ins.message }
    }

    const origin = getSiteOrigin()
    const extras: string[] = []
    let waiverUrl: string | undefined
    let paymentUrl: string | undefined
    let waiverInviteIdForPayment: string | undefined

    const evFresh = await getFacilityEventById(ins.id)
    if (!evFresh && (wantWaiverOnSave || wantPaymentOnSave)) {
      extras.push('Could not reload the new event to create links on save — use the list below.')
    }
    if (wantWaiverOnSave && evFresh) {
      const wNotes = `Facility event: ${evFresh.title} (${evFresh.id}) · ${evFresh.event_date} · ${evFresh.field_scope}`
      const created = await createManualWaiverInvite({
        expectedWaiverCount: bookExpectedWaiverCount,
        rentalType: 'general_pickup',
        rentalRef: `event:${evFresh.id}`,
        notes: wNotes,
      })
      if (!created.ok) {
        extras.push(`Waiver link was not created: ${created.message}`)
      } else {
        const attached = await updateFacilityEventWaiverInvite(evFresh.id, created.id)
        if (!attached.ok) {
          extras.push(`Waiver invite created but not attached to event: ${attached.message}`)
        } else {
          waiverUrl = `${origin}/rentals/waiver/${created.token}`
          waiverInviteIdForPayment = created.id
        }
      }
    }

    if (wantPaymentOnSave && evFresh) {
      const { createManualInvoiceCheckoutUrl } = await import('@/lib/stripe/manual-invoice-checkout')
      const payee = (organizerName || title).trim()
      const defaultMemo = [
        `Event: ${title}`,
        `Date: ${eventDate}`,
        `Event id: ${ins.id}`,
        `${origin}/admin/events`,
      ].join(' · ')
      const memo = bookPaymentMemo || defaultMemo
      const pay = await createManualInvoiceCheckoutUrl({
        payeeName: payee,
        amountUsd: bookAmountUsd,
        memo,
        customerEmail: organizerEmail || undefined,
        waiverInviteId: waiverInviteIdForPayment ?? evFresh.waiver_invite_id,
      })
      if (!pay.ok) {
        extras.push(`Payment link was not created: ${pay.message}`)
      } else {
        paymentUrl = pay.url
      }
    }

    try {
      revalidatePath('/admin/events')
      revalidatePath('/admin/rentals')
    } catch (revalidateErr) {
      console.warn('[admin/events] revalidatePath:', revalidateErr)
    }

    let message = 'Event saved. Add the block on Admin → Schedule when ready.'
    if (extras.length) {
      message += ` ${extras.join(' ')}`
    }
    if (waiverUrl || paymentUrl) {
      message += ' Copy new links under the form.'
    } else if (!extras.length) {
      message += ' Use "Links for this event" in the list for waiver and Stripe checkout.'
    }

    return {
      ok: true,
      message,
      createdEventId: ins.id,
      ...(waiverUrl ? { waiverUrl } : {}),
      ...(paymentUrl ? { paymentUrl } : {}),
    }
  } catch (e) {
    console.error('[admin/events] createFacilityEventBookAction:', e)
    return { ok: false, message: 'Something went wrong while saving. Try again or check server logs.' }
  }
}

export { BOOK_INITIAL }

export async function createFacilityEventWaiverLinkAction(
  formData: FormData
): Promise<{ ok: true; waiver_url: string } | { ok: false; message: string }> {
  const eventId = getStr(formData, 'eventId')
  const expectedRaw = getStr(formData, 'expectedWaiverCount')
  const expectedWaiverCount = parseInt(expectedRaw || '30', 10)

  const ev = await getFacilityEventById(eventId)
  if (!ev) {
    return { ok: false, message: 'Event not found.' }
  }
  if (ev.waiver_invite_id) {
    return { ok: false, message: 'This event already has a waiver roster link.' }
  }

  const notes = `Facility event: ${ev.title} (${ev.id}) · ${ev.event_date} · ${ev.field_scope}`
  const created = await createManualWaiverInvite({
    expectedWaiverCount,
    rentalType: 'general_pickup',
    rentalRef: `event:${ev.id}`,
    notes,
  })
  if (!created.ok) {
    return { ok: false, message: created.message }
  }

  const attached = await updateFacilityEventWaiverInvite(ev.id, created.id)
  if (!attached.ok) {
    return { ok: false, message: attached.message }
  }

  try {
    revalidatePath('/admin/events')
    revalidatePath('/admin/rentals')
  } catch (revalidateErr) {
    console.warn('[admin/events] revalidatePath:', revalidateErr)
  }
  const origin = getSiteOrigin()
  return { ok: true, waiver_url: `${origin}/rentals/waiver/${created.token}` }
}

export async function setFacilityEventStatusAction(
  formData: FormData
): Promise<{ ok: true } | { ok: false; message: string }> {
  const eventId = getStr(formData, 'eventId')
  const status = getStr(formData, 'status') as FacilityEventStatus
  if (!STATUSES.has(status)) {
    return { ok: false, message: 'Invalid status.' }
  }
  const r = await updateFacilityEventStatus(eventId, status)
  if (!r.ok) {
    return { ok: false, message: r.message }
  }
  try {
    revalidatePath('/admin/events')
  } catch (revalidateErr) {
    console.warn('[admin/events] revalidatePath:', revalidateErr)
  }
  return { ok: true }
}
