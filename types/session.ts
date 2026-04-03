export type SessionType = 'training' | 'evaluation' | 'game' | 'camp' | 'private'
export type SessionStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled'

export interface Session {
  id: string
  title: string
  coachId: string
  coachName: string
  groupId: string
  fieldId: string
  fieldName: string
  startTime: string   // ISO 8601
  endTime: string
  capacity: number
  enrolledCount: number
  sessionType: SessionType
  status: SessionStatus
  ageGroups: string[]
  description?: string
}
