// TEMPORARY DATA LAYER (V1)
import { Payment } from '@/types'

const TODAY = new Date().toISOString().split('T')[0]

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

export const mockPayments: Payment[] = [
  { id: 'pay-1', playerId: 'player-2', playerName: 'Sofia Martinez', parentId: 'parent-2', amount: 650, currency: 'USD', description: 'Elite Membership · 24 sessions (6 months)', paymentMethod: 'card', status: 'completed', createdAt: daysAgo(143), membershipId: 'mem-2', invoiceNumber: 'INV-20251101' },
  { id: 'pay-2', playerId: 'player-13', playerName: 'Kai Hernandez', parentId: 'parent-12', amount: 299, currency: 'USD', description: 'Unlimited Membership · March 2026', paymentMethod: 'card', status: 'completed', createdAt: daysAgo(23), membershipId: 'mem-12', invoiceNumber: 'INV-20260301' },
  { id: 'pay-3', playerId: 'player-1', playerName: 'Ethan Cross', parentId: 'parent-1', amount: 360, currency: 'USD', description: 'Development Membership · 12 sessions', paymentMethod: 'card', status: 'completed', createdAt: daysAgo(73), membershipId: 'mem-1', invoiceNumber: 'INV-20260110' },
  { id: 'pay-4', playerId: 'player-9', playerName: 'Isabelle Park', parentId: 'parent-8', amount: 175, currency: 'USD', description: 'Starter Pack · 5 sessions', paymentMethod: 'card', status: 'completed', createdAt: daysAgo(23), membershipId: 'mem-8', invoiceNumber: 'INV-20260301' },
  { id: 'pay-5', playerId: 'player-10', playerName: 'James Okafor', parentId: 'parent-9', amount: 299, currency: 'USD', description: 'Unlimited Membership · March 2026', paymentMethod: 'card', status: 'completed', createdAt: daysAgo(23), membershipId: 'mem-9', invoiceNumber: 'INV-20260301-B' },
  { id: 'pay-6', playerId: 'player-4', playerName: 'Aiden Thompson', parentId: 'parent-4', amount: 175, currency: 'USD', description: 'Starter Pack · 5 sessions', paymentMethod: 'cash', status: 'completed', createdAt: daysAgo(51), membershipId: 'mem-4', invoiceNumber: 'INV-20260201' },
  { id: 'pay-7', playerId: 'player-18', playerName: 'Lucas Wilson', parentId: 'parent-16', amount: 650, currency: 'USD', description: 'Elite Membership · 24 sessions', paymentMethod: 'card', status: 'completed', createdAt: daysAgo(71), membershipId: 'mem-17', invoiceNumber: 'INV-20260112' },
  { id: 'pay-8', playerId: 'player-5', playerName: 'Maya Johnson', parentId: 'parent-5', amount: 175, currency: 'USD', description: 'Starter Pack · 5 sessions', paymentMethod: 'card', status: 'pending', createdAt: daysAgo(1), invoiceNumber: 'INV-20260323' },
  { id: 'pay-9', playerId: 'player-3', playerName: 'Noah Patel', parentId: 'parent-3', amount: 360, currency: 'USD', description: 'Development Membership · Renewal', paymentMethod: 'card', status: 'pending', createdAt: `${TODAY}T10:30:00Z`, invoiceNumber: 'INV-20260324' },
  { id: 'pay-10', playerId: 'player-6', playerName: 'Liam Chen', parentId: 'parent-6', amount: 360, currency: 'USD', description: 'Development Membership · 12 sessions', paymentMethod: 'card', status: 'completed', createdAt: daysAgo(63), membershipId: 'mem-5', invoiceNumber: 'INV-20260120' },
  { id: 'pay-11', playerId: 'player-7', playerName: 'Zoe Williams', parentId: 'parent-6', amount: 175, currency: 'USD', description: 'Starter Pack · 5 sessions', paymentMethod: 'card', status: 'completed', createdAt: daysAgo(37), membershipId: 'mem-6', invoiceNumber: 'INV-20260215' },
  { id: 'pay-12', playerId: 'player-12', playerName: 'Taylor Brooks', parentId: 'parent-11', amount: 360, currency: 'USD', description: 'Development Membership · Renewal', paymentMethod: 'bank-transfer', status: 'pending', createdAt: `${TODAY}T09:15:00Z`, invoiceNumber: 'INV-20260324-B' },
]

export function getPaymentsByPlayer(playerId: string): Payment[] {
  return mockPayments.filter(p => p.playerId === playerId)
}

export function getRecentPayments(limit = 10): Payment[] {
  return [...mockPayments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

export function getTotalRevenue(): number {
  return mockPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)
}
