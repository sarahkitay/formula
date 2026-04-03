export type UserRole = 'admin' | 'coach' | 'parent'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  avatarUrl?: string
  linkedPlayerIds?: string[]  // for parents
  coachId?: string            // for coaches
  createdAt: string
  lastLoginAt?: string
}
