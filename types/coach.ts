export interface Coach {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  specializations: string[]
  assignedGroups: string[]
  avatarUrl?: string
  bio?: string
  certifications: string[]
  status: 'active' | 'inactive'
  joinedAt: string
}
