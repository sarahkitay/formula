export type MembershipStatus = 'active' | 'expired' | 'cancelled' | 'paused'

export interface MembershipPlan {
  id: string
  name: string
  description: string
  sessionCount: number | 'unlimited'
  validityDays: number
  price: number
  color: string   // tailwind color class
  accentColor: string
  features: string[]
  popular?: boolean
}

export interface MembershipInstance {
  id: string
  playerId: string
  playerName: string
  planId: string
  planName: string
  startDate: string
  expiryDate: string
  sessionsUsed: number
  sessionsTotal: number | 'unlimited'
  status: MembershipStatus
  autoRenew: boolean
}
