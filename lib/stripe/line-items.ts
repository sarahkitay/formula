import type Stripe from 'stripe'
import { FIELD_RENTAL_BOOKING_CHECKOUT, FORMULA_SKILLS_CHECK, SESSION_PACKAGE_10 } from '@/lib/marketing/public-pricing'
import type { CheckoutType } from '@/lib/stripe/checkout-types'

/**
 * Line items for Checkout. Amounts come from published pricing constants only (never from the client).
 */
export function lineItemsForCheckoutType(type: CheckoutType): Stripe.Checkout.SessionCreateParams.LineItem[] {
  if (type === 'assessment') {
    return [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          product_data: {
            name: FORMULA_SKILLS_CHECK.name,
            description: 'Baseline assessment for placement and progression.',
          },
          unit_amount: Math.round(FORMULA_SKILLS_CHECK.priceUsd * 100),
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
          product_data: {
            name: `${SESSION_PACKAGE_10.sessions}-session package`,
            description: SESSION_PACKAGE_10.summary,
          },
          unit_amount: Math.round(SESSION_PACKAGE_10.priceUsd * 100),
        },
      },
    ]
  }

  if (type === 'field-rental-booking') {
    return [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          product_data: {
            name: FIELD_RENTAL_BOOKING_CHECKOUT.productName,
            description: FIELD_RENTAL_BOOKING_CHECKOUT.summary,
          },
          unit_amount: Math.round(FIELD_RENTAL_BOOKING_CHECKOUT.priceUsd * 100),
        },
      },
    ]
  }

  const _exhaustive: never = type
  return _exhaustive
}
