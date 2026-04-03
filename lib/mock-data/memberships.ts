// TEMPORARY DATA LAYER (V1) · aligned with Formula Soccer Center membership intake
import { MembershipPlan, MembershipInstance } from '@/types'

export const mockMembershipPlans: MembershipPlan[] = [
  {
  id: 'plan-1',
  name: 'Performance',
  description:
  'Monthly renewal. Up to two sessions per week on your age-group schedule. Unused sessions do not roll week to week.',
  sessionCount: 8,
  validityDays: 30,
  price: 189,
  color: '#005700',
  accentColor: '#f4fe00',
  features: [
  '8 sessions / month (2 per week)',
  'Monthly billing',
  'No week-to-week rollover',
  '~50 spots per age group, then waitlist',
  'Progress visibility in parent portal',
  ],
  },
  {
  id: 'plan-2',
  name: 'Performance Plus',
  description:
  'Second tier · offering details still being defined. Will include added value beyond base Performance.',
  sessionCount: 12,
  validityDays: 30,
  price: 269,
  color: '#15803d',
  accentColor: '#f4fe00',
  features: [
  '12 sessions / month (tier details TBD)',
  'Monthly billing',
  'Priority for clinics & camps (planned)',
  'Coach notes access',
  ],
  popular: true,
  },
  {
  id: 'plan-3',
  name: 'Performance Elite',
  description: 'Earned placement - higher training volume for competitive-path athletes (not purchased outright).',
  sessionCount: 20,
  validityDays: 30,
  price: 389,
  color: '#f4fe00',
  accentColor: '#005700',
  features: [
  '20 sessions / month',
  'Performance assessments',
  'Priority booking',
  'Field rental discount (planned)',
  ],
  },
  {
  id: 'plan-4',
  name: 'Academy Unlimited',
  description: 'Maximum monthly training volume · academy-track players.',
  sessionCount: 'unlimited',
  validityDays: 30,
  price: 449,
  color: '#d6d6d6',
  accentColor: '#f4fe00',
  features: [
  'Unlimited youth-block sessions / month',
  'All age-appropriate groups',
  'Full performance dashboard',
  'Check-in priority',
  ],
  },
]

export const mockMembershipInstances: MembershipInstance[] = [
  { id: 'mem-1', playerId: 'player-1', playerName: 'Ethan Cross', planId: 'plan-2', planName: 'Performance Plus', startDate: '2026-01-10', expiryDate: '2026-04-10', sessionsUsed: 6, sessionsTotal: 12, status: 'active', autoRenew: true },
  { id: 'mem-2', playerId: 'player-2', playerName: 'Sofia Martinez', planId: 'plan-3', planName: 'Performance Elite', startDate: '2025-11-01', expiryDate: '2026-05-01', sessionsUsed: 12, sessionsTotal: 20, status: 'active', autoRenew: false },
  { id: 'mem-3', playerId: 'player-3', playerName: 'Noah Patel', planId: 'plan-2', planName: 'Performance Plus', startDate: '2025-12-15', expiryDate: '2026-03-15', sessionsUsed: 12, sessionsTotal: 12, status: 'expired', autoRenew: false },
  { id: 'mem-4', playerId: 'player-4', playerName: 'Aiden Thompson', planId: 'plan-1', planName: 'Performance', startDate: '2026-02-01', expiryDate: '2026-04-01', sessionsUsed: 2, sessionsTotal: 8, status: 'active', autoRenew: false },
  { id: 'mem-5', playerId: 'player-6', playerName: 'Liam Chen', planId: 'plan-2', planName: 'Performance Plus', startDate: '2026-01-20', expiryDate: '2026-04-20', sessionsUsed: 4, sessionsTotal: 12, status: 'active', autoRenew: true },
  { id: 'mem-6', playerId: 'player-7', playerName: 'Zoe Williams', planId: 'plan-1', planName: 'Performance', startDate: '2026-02-15', expiryDate: '2026-04-15', sessionsUsed: 1, sessionsTotal: 8, status: 'active', autoRenew: false },
  { id: 'mem-7', playerId: 'player-8', playerName: 'Carlos Reyes', planId: 'plan-3', planName: 'Performance Elite', startDate: '2025-09-01', expiryDate: '2026-03-01', sessionsUsed: 14, sessionsTotal: 20, status: 'active', autoRenew: true },
  { id: 'mem-8', playerId: 'player-9', playerName: 'Isabelle Park', planId: 'plan-1', planName: 'Performance', startDate: '2026-03-01', expiryDate: '2026-04-30', sessionsUsed: 4, sessionsTotal: 8, status: 'active', autoRenew: false },
  { id: 'mem-9', playerId: 'player-10', playerName: 'James Okafor', planId: 'plan-4', planName: 'Academy Unlimited', startDate: '2026-03-01', expiryDate: '2026-03-31', sessionsUsed: 9, sessionsTotal: 'unlimited', status: 'active', autoRenew: true },
  { id: 'mem-10', playerId: 'player-11', playerName: 'Alex Nguyen', planId: 'plan-2', planName: 'Performance Plus', startDate: '2026-01-05', expiryDate: '2026-04-05', sessionsUsed: 3, sessionsTotal: 12, status: 'active', autoRenew: false },
  { id: 'mem-11', playerId: 'player-12', playerName: 'Taylor Brooks', planId: 'plan-2', planName: 'Performance Plus', startDate: '2025-12-01', expiryDate: '2026-03-01', sessionsUsed: 12, sessionsTotal: 12, status: 'expired', autoRenew: true },
  { id: 'mem-12', playerId: 'player-13', playerName: 'Kai Hernandez', planId: 'plan-4', planName: 'Academy Unlimited', startDate: '2026-03-01', expiryDate: '2026-03-31', sessionsUsed: 12, sessionsTotal: 'unlimited', status: 'active', autoRenew: true },
  { id: 'mem-13', playerId: 'player-14', playerName: 'Jordan Lee', planId: 'plan-3', planName: 'Performance Elite', startDate: '2025-10-15', expiryDate: '2026-04-15', sessionsUsed: 18, sessionsTotal: 20, status: 'active', autoRenew: false },
  { id: 'mem-14', playerId: 'player-15', playerName: 'Riley Santos', planId: 'plan-3', planName: 'Performance Elite', startDate: '2025-10-01', expiryDate: '2026-04-01', sessionsUsed: 19, sessionsTotal: 20, status: 'active', autoRenew: true },
  { id: 'mem-15', playerId: 'player-16', playerName: 'Oliver Davis', planId: 'plan-2', planName: 'Performance Plus', startDate: '2025-09-15', expiryDate: '2026-03-15', sessionsUsed: 5, sessionsTotal: 12, status: 'active', autoRenew: false },
  { id: 'mem-16', playerId: 'player-17', playerName: 'Ella Moore', planId: 'plan-2', planName: 'Performance Plus', startDate: '2025-09-15', expiryDate: '2026-03-15', sessionsUsed: 7, sessionsTotal: 12, status: 'active', autoRenew: false },
  { id: 'mem-17', playerId: 'player-18', playerName: 'Lucas Wilson', planId: 'plan-3', planName: 'Performance Elite', startDate: '2026-01-12', expiryDate: '2026-07-12', sessionsUsed: 13, sessionsTotal: 20, status: 'active', autoRenew: true },
]

export function getMembershipByPlayer(playerId: string): MembershipInstance | undefined {
  return mockMembershipInstances.find(m => m.playerId === playerId && m.status === 'active')
}

export function getPlanById(id: string): MembershipPlan | undefined {
  return mockMembershipPlans.find(p => p.id === id)
}
