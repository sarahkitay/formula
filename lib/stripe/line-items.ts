import type Stripe from 'stripe'
import {
  FIELD_RENTAL_BOOKING_CHECKOUT,
  FORMULA_SKILLS_CHECK,
  SESSION_PACKAGE_5,
  SESSION_PACKAGE_10,
} from '@/lib/marketing/public-pricing'
import type { CheckoutType } from '@/lib/stripe/checkout-types'

export type LineItemsOptions = {
  /** Skills Check: one line item per athlete (quantity 1–4). */
  assessmentQuantity?: number
  /** Field rental: number of weekly sessions at published per-session price (default 1). */
  fieldRentalSessionWeeks?: number
}

/**
 * Line items for Checkout. Amounts come from published pricing constants only (never from the client).
 */
export function lineItemsForCheckoutType(
  type: CheckoutType,
  options?: LineItemsOptions // only used for `assessment`
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  if (type === 'assessment') {
    const q = Math.min(4, Math.max(1, Math.floor(options?.assessmentQuantity ?? 1)))
    return [
      {
        quantity: q,
        price_data: {
          currency: 'usd',
          tax_behavior: 'exclusive',
          product_data: {
            name: FORMULA_SKILLS_CHECK.name,
            description:
              q === 1
                ? 'Baseline assessment for placement and progression.'
                : `${q} athletes · Skills Check (per-athlete pricing).`,
          },
          unit_amount: Math.round(FORMULA_SKILLS_CHECK.priceUsd * 100),
        },
      },
    ]
  }

  if (type === 'package-5') {
    return [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          tax_behavior: 'exclusive',
          product_data: {
            name: `${SESSION_PACKAGE_5.sessions}-session package (early bird)`,
            description: SESSION_PACKAGE_5.summary,
          },
          unit_amount: Math.round(SESSION_PACKAGE_5.priceUsd * 100),
        },
      },
    ]
  }

  if (type === 'package-10') {
    return [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          tax_behavior: 'exclusive',
          product_data: {
            name: `${SESSION_PACKAGE_10.sessions}-session package (early bird)`,
            description: SESSION_PACKAGE_10.summary,
          },
          unit_amount: Math.round(SESSION_PACKAGE_10.priceUsd * 100),
        },
      },
    ]
  }

  if (type === 'field-rental-booking') {
    const weeks = Math.min(52, Math.max(1, Math.floor(options?.fieldRentalSessionWeeks ?? 1)))
    const unitCents = Math.round(FIELD_RENTAL_BOOKING_CHECKOUT.priceUsd * 100)
    return [
      {
        quantity: weeks,
        price_data: {
          currency: 'usd',
          tax_behavior: 'exclusive',
          product_data: {
            name:
              weeks === 1
                ? FIELD_RENTAL_BOOKING_CHECKOUT.productName
                : `Field rental · ${weeks} weekly sessions`,
            description:
              weeks === 1
                ? FIELD_RENTAL_BOOKING_CHECKOUT.summary
                : `${weeks} sessions (same field & time window · chosen weekly dates) at $${FIELD_RENTAL_BOOKING_CHECKOUT.priceUsd} each. Non-refundable booking hold; staff may reconcile any balance vs published rates.`,
          },
          unit_amount: unitCents,
        },
      },
    ]
  }

  const _exhaustive: never = type
  return _exhaustive
}
