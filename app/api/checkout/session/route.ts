import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { ASSESSMENT_MAX_KIDS_PER_BOOKING } from '@/lib/assessment/constants'
import { slotHasRoom } from '@/lib/assessment/slots-server'
import { encodeRentalDatesCompact, resolveFieldRentalSessionDatesFromMetadata } from '@/lib/rentals/rental-weekly-dates'
import { attachStripeSessionToSlot, releasePendingSlotByRef, tryClaimRecurringWeeklySlotsForDates } from '@/lib/rentals/rental-slots'
import { isCheckoutType } from '@/lib/stripe/checkout-types'
import { lineItemsForCheckoutType } from '@/lib/stripe/line-items'
import { checkStripeServerSecretKey, getSiteOrigin, getStripe } from '@/lib/stripe/server'

export const runtime = 'nodejs'

const CHECKOUT_SUCCESS_NEXT_ALLOWED = ['portal-assessment', 'field-rental'] as const
type CheckoutSuccessNext = (typeof CHECKOUT_SUCCESS_NEXT_ALLOWED)[number]

function parseSuccessNext(value: unknown): CheckoutSuccessNext | undefined {
  if (typeof value !== 'string') return undefined
  return (CHECKOUT_SUCCESS_NEXT_ALLOWED as readonly string[]).includes(value) ? (value as CheckoutSuccessNext) : undefined
}

/** Stripe metadata values must be strings; drop oversized or empty keys. Never trust client for `twilio_*` keys. */
function sanitizeMetadataExtra(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof k !== 'string' || k.length > 40) continue
    if (k.toLowerCase().startsWith('twilio_')) continue
    if (typeof v !== 'string') continue
    const trimmed = v.trim()
    if (!trimmed || trimmed.length > 500) continue
    out[k] = trimmed
  }
  return out
}

export async function POST(req: Request) {
  const keyCheck = checkStripeServerSecretKey()
  if (!keyCheck.ok) {
    return NextResponse.json({ error: keyCheck.message }, { status: 503 })
  }
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json(
      { error: 'Payments are not configured. Set STRIPE_SECRET_KEY on the server.' },
      { status: 503 }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const type = (body as { type?: unknown }).type
  if (!isCheckoutType(type)) {
    return NextResponse.json({ error: 'Invalid or unsupported checkout type' }, { status: 400 })
  }

  const successNext = parseSuccessNext((body as { successNext?: unknown }).successNext)
  const metadataExtra = sanitizeMetadataExtra((body as { metadata?: unknown }).metadata)
  const smsConsent = (body as { smsConsent?: unknown }).smsConsent === true

  const origin = getSiteOrigin()

  let line_items = lineItemsForCheckoutType(type)
  let fieldRentalWeeks = 1
  let fieldRentalStripeDates: { rental_weeks: string; rental_dates_compact: string; rental_date: string } | null = null
  /** Set for field-rental so attach + Stripe metadata stay aligned after checkout.create. */
  let fieldRentalSessionDatesYmd: string[] | null = null

  if (type === 'assessment') {
    const slotId = metadataExtra.assessment_slot_id?.trim()
    const parentName = metadataExtra.parent_full_name?.trim()
    const numKids = parseInt(metadataExtra.assessment_num_kids ?? '1', 10)
    if (!slotId || !parentName) {
      return NextResponse.json(
        { error: 'Assessment checkout requires metadata: assessment_slot_id, parent_full_name, assessment_num_kids (1–4)' },
        { status: 400 }
      )
    }
    if (!Number.isInteger(numKids) || numKids < 1 || numKids > ASSESSMENT_MAX_KIDS_PER_BOOKING) {
      return NextResponse.json({ error: 'assessment_num_kids must be an integer from 1 to 4' }, { status: 400 })
    }
    const hasRoom = await slotHasRoom(slotId, numKids)
    if (!hasRoom) {
      return NextResponse.json(
        { error: 'Not enough spots left in that window. Choose another time or fewer athletes.' },
        { status: 409 }
      )
    }
    line_items = lineItemsForCheckoutType(type, { assessmentQuantity: numKids })
  }

  const successQuery =
    successNext != null
      ? `session_id={CHECKOUT_SESSION_ID}&next=${encodeURIComponent(successNext)}`
      : 'session_id={CHECKOUT_SESSION_ID}'

  const rentalSlot =
    type === 'field-rental-booking'
      ? {
          ref: metadataExtra.rental_ref,
          field: metadataExtra.rental_field,
          date: metadataExtra.rental_date,
          window: metadataExtra.rental_window,
        }
      : null

  if (type === 'field-rental-booking') {
    if (!rentalSlot?.ref || !rentalSlot.field || !rentalSlot.date || !rentalSlot.window) {
      return NextResponse.json(
        { error: 'Field rental checkout requires metadata: rental_ref, rental_field, rental_date, rental_window' },
        { status: 400 }
      )
    }
    const resolvedDates = resolveFieldRentalSessionDatesFromMetadata(metadataExtra, rentalSlot.date)
    if (!resolvedDates.ok) {
      return NextResponse.json({ error: resolvedDates.message }, { status: 400 })
    }
    const sessionDatesYmd = resolvedDates.dates
    if (sessionDatesYmd.length === 0) {
      return NextResponse.json({ error: 'Select at least one rental session date.' }, { status: 400 })
    }
    fieldRentalSessionDatesYmd = sessionDatesYmd
    fieldRentalWeeks = sessionDatesYmd.length
    line_items = lineItemsForCheckoutType(type, { fieldRentalSessionWeeks: fieldRentalWeeks })
    fieldRentalStripeDates = {
      rental_weeks: String(fieldRentalWeeks),
      rental_dates_compact: encodeRentalDatesCompact(sessionDatesYmd),
      rental_date: sessionDatesYmd[0],
    }
    const claimed = await tryClaimRecurringWeeklySlotsForDates({
      fieldId: rentalSlot.field,
      timeSlot: rentalSlot.window,
      rentalRef: rentalSlot.ref,
      sessionDatesYmd,
    })
    if (!claimed) {
      return NextResponse.json(
        {
          error:
            'One or more weeks in that recurring series are already booked for this field and window. Reduce weeks or pick different dates.',
        },
        { status: 409 }
      )
    }
  }

  const emailHint = metadataExtra.parent_email_hint?.trim().toLowerCase() ?? ''
  const prefillEmail =
    type === 'assessment' && emailHint.length > 3 && emailHint.includes('@') && emailHint.includes('.') ? emailHint : undefined

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${origin}/checkout/success?${successQuery}`,
      cancel_url: `${origin}/checkout/cancel`,
      metadata: {
        type,
        twilio_sms_opt_in: smsConsent ? 'true' : 'false',
        ...metadataExtra,
        ...(fieldRentalStripeDates ?? {}),
      },
      ...(prefillEmail ? { customer_email: prefillEmail } : {}),
      customer_creation: 'always',
      billing_address_collection: 'auto',
    })

    if (!session.url) {
      if (type === 'field-rental-booking' && rentalSlot?.ref) {
        await releasePendingSlotByRef(rentalSlot.ref)
      }
      return NextResponse.json({ error: 'Checkout session missing URL' }, { status: 500 })
    }

    if (type === 'field-rental-booking' && rentalSlot && fieldRentalSessionDatesYmd?.length) {
      await attachStripeSessionToSlot(
        {
          fieldId: rentalSlot.field,
          sessionDate: fieldRentalSessionDatesYmd[0],
          timeSlot: rentalSlot.window,
          rentalRef: rentalSlot.ref,
        },
        session.id
      )
    }

    return NextResponse.json({ url: session.url })
  } catch (e) {
    if (type === 'field-rental-booking' && rentalSlot?.ref) {
      await releasePendingSlotByRef(rentalSlot.ref)
    }
    console.error('[checkout/session]', e)
    if (e instanceof Stripe.errors.StripeAuthenticationError) {
      return NextResponse.json(
        {
          error:
            'Stripe rejected the server API key (401). For checkout, set STRIPE_SECRET_KEY to your standard Secret key (sk_live_… or sk_test_…) from Stripe Dashboard → Developers → API keys — use Reveal secret key, not Publishable. If you intend to use a restricted key (rk_…), it must be valid, not revoked, and allowed to create Checkout Sessions; otherwise Stripe returns invalid key. Details: ' +
            e.message,
        },
        { status: 503 }
      )
    }
    if (e instanceof Stripe.errors.StripeConnectionError) {
      return NextResponse.json(
        {
          error:
            'Payment service could not be reached from the server (network). Wait a minute and try again. If this keeps happening, confirm STRIPE_SECRET_KEY is set on Vercel and the deployment can reach api.stripe.com (firewall / IPv6 issues).',
        },
        { status: 502 }
      )
    }
    const stripeDetail = e instanceof Stripe.errors.StripeError ? e.message : null
    return NextResponse.json(
      { error: stripeDetail ?? 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
