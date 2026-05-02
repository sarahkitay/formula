import type Stripe from 'stripe'
import {
  FIELD_RENTAL_BOOKING_CHECKOUT,
  FORMULA_SKILLS_CHECK,
  FORMULA_MINIS_SIX_WEEK,
  FORMULA_SUNDAY_CHILD_PROGRAM_10_WK,
  FRIDAY_NIGHT_FRIENDLIES_CHECKOUT,
  SUMMER_CAMP_2026_MONTH_BUNDLE_CHECKOUT,
  SUMMER_CAMP_2026_WEEK_CHECKOUT,
  PARTY_BOOKING_1K_CHECKOUT,
  SESSION_PACKAGE_5,
  SESSION_PACKAGE_10,
} from '@/lib/marketing/public-pricing'
import type { CheckoutType } from '@/lib/stripe/checkout-types'

export type LineItemsOptions = {
  /** Skills Check: one line item per athlete (quantity 1–4). */
  assessmentQuantity?: number
  /** Friday Friendlies: number of players (quantity 1–8). */
  fridayFriendliesPlayerCount?: number
  /** Field rental: number of weekly sessions (quantity). */
  fieldRentalSessionWeeks?: number
  /** Field rental: Stripe unit_amount (cents) for one session deposit (duration-priced on server). */
  fieldRentalUnitAmountCents?: number
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

  if (type === 'littles-6wk-300') {
    return [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          tax_behavior: 'exclusive',
          product_data: {
            name: FORMULA_MINIS_SIX_WEEK.label,
            description: FORMULA_MINIS_SIX_WEEK.summary,
          },
          unit_amount: Math.round(FORMULA_MINIS_SIX_WEEK.priceUsd * 100),
        },
      },
    ]
  }

  if (type === 'sunday-child-10wk-500') {
    return [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          tax_behavior: 'exclusive',
          product_data: {
            name: FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.label,
            description: FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.summary,
          },
          unit_amount: Math.round(FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.priceUsd * 100),
        },
      },
    ]
  }

  if (type === 'party-booking-1k') {
    return [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          tax_behavior: 'exclusive',
          product_data: {
            name: PARTY_BOOKING_1K_CHECKOUT.productName,
            description: PARTY_BOOKING_1K_CHECKOUT.summary,
          },
          unit_amount: Math.round(PARTY_BOOKING_1K_CHECKOUT.priceUsd * 100),
        },
      },
    ]
  }

  if (type === 'summer-camp-week-495') {
    return [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          tax_behavior: 'exclusive',
          product_data: {
            name: SUMMER_CAMP_2026_WEEK_CHECKOUT.productName,
            description: SUMMER_CAMP_2026_WEEK_CHECKOUT.summary,
          },
          unit_amount: Math.round(SUMMER_CAMP_2026_WEEK_CHECKOUT.priceUsd * 100),
        },
      },
    ]
  }

  if (type === 'summer-camp-month-1780') {
    return [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          tax_behavior: 'exclusive',
          product_data: {
            name: SUMMER_CAMP_2026_MONTH_BUNDLE_CHECKOUT.productName,
            description: SUMMER_CAMP_2026_MONTH_BUNDLE_CHECKOUT.summary,
          },
          unit_amount: Math.round(SUMMER_CAMP_2026_MONTH_BUNDLE_CHECKOUT.priceUsd * 100),
        },
      },
    ]
  }

  if (type === 'friday-friendlies-player') {
    const q = Math.min(
      FRIDAY_NIGHT_FRIENDLIES_CHECKOUT.maxPlayers,
      Math.max(1, Math.floor(options?.fridayFriendliesPlayerCount ?? 1))
    )
    return [
      {
        quantity: q,
        price_data: {
          currency: 'usd',
          tax_behavior: 'exclusive',
          product_data: {
            name: FRIDAY_NIGHT_FRIENDLIES_CHECKOUT.productName,
            description:
              q === 1
                ? FRIDAY_NIGHT_FRIENDLIES_CHECKOUT.summary
                : `${q} players · ${FRIDAY_NIGHT_FRIENDLIES_CHECKOUT.summary}`,
          },
          unit_amount: Math.round(FRIDAY_NIGHT_FRIENDLIES_CHECKOUT.pricePerPlayerUsd * 100),
        },
      },
    ]
  }

  if (type === 'field-rental-booking') {
    const weeks = Math.min(52, Math.max(1, Math.floor(options?.fieldRentalSessionWeeks ?? 1)))
    const unitCents = Math.round(
      Math.max(1, options?.fieldRentalUnitAmountCents ?? FIELD_RENTAL_BOOKING_CHECKOUT.priceUsd * 100)
    )
    const perSessionUsd = unitCents / 100
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
                : `${weeks} weekly session(s), same field & window · $${perSessionUsd.toFixed(0)} deposit per session (30 min increments at published hourly rate). Non-refundable booking hold; staff may reconcile any balance vs published rates.`,
          },
          unit_amount: unitCents,
        },
      },
    ]
  }

  const _exhaustive: never = type
  return _exhaustive
}
