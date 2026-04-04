export const CHECKOUT_TYPES = ['assessment', 'package-10'] as const

export type CheckoutType = (typeof CHECKOUT_TYPES)[number]

export function isCheckoutType(value: unknown): value is CheckoutType {
  return typeof value === 'string' && (CHECKOUT_TYPES as readonly string[]).includes(value)
}
