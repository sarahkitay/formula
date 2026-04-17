import type { MembershipInstance, MembershipPlan } from '@/types'

export const mockMembershipPlans: MembershipPlan[] = []

export const mockMembershipInstances: MembershipInstance[] = []

export function getMembershipByPlayer(_playerId: string): MembershipInstance | undefined {
  return undefined
}

export function getPlanById(_id: string): MembershipPlan | undefined {
  return undefined
}
