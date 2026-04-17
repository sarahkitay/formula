import type { Coach } from '@/types'

export const mockCoaches: Coach[] = []

export function getCoachById(id: string): Coach | undefined {
  return mockCoaches.find(c => c.id === id)
}
