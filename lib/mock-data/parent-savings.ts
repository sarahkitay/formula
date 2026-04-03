import { mockPlayers } from '@/lib/mock-data/players'
import { getMembershipByPlayer, getPlanById } from '@/lib/mock-data/memberships'
import type { MembershipPlan } from '@/types'

/** Drop-in youth block (55m) if booked without membership bundle (demo rack). */
export const RACK_TRAINING_SESSION_USD = 52

/** Walk-up field rental effective hourly rack vs member rate (demo). */
export const RACK_FIELD_HOUR_USD = 85
export const MEMBER_FIELD_HOUR_USD = 55

function effectiveMembershipPricePerSession(plan: MembershipPlan): number {
  const sc = plan.sessionCount
  if (sc === 'unlimited') return plan.price / 24
  return plan.price / sc
}

/**
 * Estimated savings: (rack per session − membership effective per session) × sessions attended,
 * summed for each child on the account with an active membership.
 */
export function getParentMembershipSessionSavings(playerIds: string[]): number {
  let total = 0
  for (const playerId of playerIds) {
    const player = mockPlayers.find(p => p.id === playerId)
    if (!player) continue
    const mem = getMembershipByPlayer(playerId)
    if (!mem) continue
    const plan = getPlanById(mem.planId)
    if (!plan) continue
    const eff = effectiveMembershipPricePerSession(plan)
    const perSession = Math.max(0, RACK_TRAINING_SESSION_USD - eff)
    total += perSession * player.totalSessionsAttended
  }
  return Math.round(total)
}

/**
 * Demo: savings from member-priced field / rental blocks vs published walk-up rate.
 * Replace with ledger diff when rental line items exist.
 */
export function getParentFieldRentalSavingsDemo(parentId: string): number {
  if (parentId !== 'parent-6') return 0
  const demoFieldHoursBooked = 8
  return demoFieldHoursBooked * (RACK_FIELD_HOUR_USD - MEMBER_FIELD_HOUR_USD)
}

export function getParentTotalSaved(playerIds: string[], parentId: string): number {
  return getParentMembershipSessionSavings(playerIds) + getParentFieldRentalSavingsDemo(parentId)
}
