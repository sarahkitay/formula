import type { Payment } from '@/types'

export const mockPayments: Payment[] = []

export function getPaymentsByPlayer(_playerId: string): Payment[] {
  return []
}

export function getRecentPayments(_limit = 10): Payment[] {
  return []
}

export function getTotalRevenue(): number {
  return 0
}
