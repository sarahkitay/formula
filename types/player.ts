export type AgeGroup = 'U8' | 'U10' | 'U12' | 'U14' | 'U16' | 'U18' | 'Adult'
export type PlayerStatus = 'active' | 'inactive' | 'suspended'
export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD'

export interface PlayerNote {
  id: string
  playerId: string
  coachId: string
  coachName: string
  content: string
  createdAt: string
  sessionId?: string
  tags?: string[]
}

export interface PerformanceSummary {
  speed: number       // 0–100 percentile
  agility: number
  endurance: number
  strength: number
  technicalScore: number
  lastAssessed: string
}

export interface Player {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  ageGroup: AgeGroup
  position: PlayerPosition
  jerseyNumber?: number
  membershipId: string | null
  sessionsRemaining: number
  totalSessionsAttended: number
  parentIds: string[]
  groupIds: string[]
  avatarUrl?: string
  joinedAt: string
  status: PlayerStatus
  performance?: PerformanceSummary
  notes?: PlayerNote[]
}
