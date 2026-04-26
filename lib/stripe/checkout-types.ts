export const CHECKOUT_TYPES = [
  'assessment',
  'package-5',
  'package-10',
  'littles-6wk-300',
  'field-rental-booking',
  'party-booking-1k',
] as const

export type CheckoutType = (typeof CHECKOUT_TYPES)[number]

export function isCheckoutType(value: unknown): value is CheckoutType {
  return typeof value === 'string' && (CHECKOUT_TYPES as readonly string[]).includes(value)
}
