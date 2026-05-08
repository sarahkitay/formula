export type PaymentMethod = 'card' | 'cash' | 'bank-transfer' | 'comp'
export type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded'

export interface Payment {
  id: string
  playerId: string
  playerName: string
  /** Stripe / ledger receipt email when present (for admin client profile links). */
  customerEmail?: string | null
  /** Full Stripe Checkout or synthetic session id. */
  stripeSessionId?: string
  parentId?: string
  amount: number
  currency: 'USD'
  description: string
  /** Stripe Checkout `metadata.type` (e.g. `field-rental-booking`, `assessment`). */
  checkoutType?: string
  paymentMethod: PaymentMethod
  status: PaymentStatus
  createdAt: string
  membershipId?: string
  invoiceNumber: string
}
