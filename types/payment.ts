export type PaymentMethod = 'card' | 'cash' | 'bank-transfer' | 'comp'
export type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded'

export interface Payment {
  id: string
  playerId: string
  playerName: string
  parentId?: string
  amount: number
  currency: 'USD'
  description: string
  paymentMethod: PaymentMethod
  status: PaymentStatus
  createdAt: string
  membershipId?: string
  invoiceNumber: string
}
