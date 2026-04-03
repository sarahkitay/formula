export interface Group {
  id: string
  name: string
  ageGroup: string
  coachId: string
  coachName: string
  playerIds: string[]
  description?: string
  color: string   // hex for visual differentiation
  schedule: string
  status: 'active' | 'inactive'
}
