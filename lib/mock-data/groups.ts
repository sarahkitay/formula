// TEMPORARY DATA LAYER (V1) · youth blocks: 55 min sessions, 15 min turnover; 20–24 athletes / 4 coach pods
import { Group } from '@/types'

export const mockGroups: Group[] = [
  {
    id: 'group-1',
    name: 'Elite U14 · Alpha',
    ageGroup: 'U14',
    coachId: 'coach-1',
    coachName: 'Marcus Rivera',
    playerIds: ['player-1', 'player-2', 'player-3', 'player-4', 'player-5'],
    description: 'Advanced technical development for U14 players.',
    color: '#005700',
    schedule: 'Mon / Wed / Fri · 55m blocks · evening youth lane',
    status: 'active',
  },
  {
    id: 'group-2',
    name: 'Development U12 · Beta',
    ageGroup: 'U12',
    coachId: 'coach-1',
    coachName: 'Marcus Rivera',
    playerIds: ['player-6', 'player-7', 'player-8', 'player-9'],
    description: 'Foundational skills · four coach-led pods per block (5–6 players each at full capacity).',
    color: '#f4fe00',
    schedule: 'Tue / Thu · 55m blocks · first afternoon slot from 3:30 PM on weekdays',
    status: 'active',
  },
  {
    id: 'group-3',
    name: 'GK Academy U16',
    ageGroup: 'U16',
    coachId: 'coach-2',
    coachName: 'Elena Vasquez',
    playerIds: ['player-10', 'player-11', 'player-12'],
    description: 'Goalkeeper development · shot-stopping, distribution, positioning.',
    color: '#15803d',
    schedule: 'Mon / Wed · 55m blocks',
    status: 'active',
  },
  {
    id: 'group-4',
    name: 'Elite U18 · Varsity',
    ageGroup: 'U18',
    coachId: 'coach-2',
    coachName: 'Elena Vasquez',
    playerIds: ['player-13', 'player-14', 'player-15'],
    description: 'Competitive and collegiate pathway prep. Latest evening slot when no adult programming.',
    color: '#d6d6d6',
    schedule: 'Tue / Thu / Sat · weekday PM + weekend mornings',
    status: 'active',
  },
  {
    id: 'group-5',
    name: 'Little Strikers U10',
    ageGroup: 'U10',
    coachId: 'coach-3',
    coachName: 'Jordan Kim',
    playerIds: ['player-16', 'player-17', 'player-18'],
    description: 'First touch and movement · weekend morning blocks prioritized.',
    color: '#22c55e',
    schedule: 'Sat / Sun · morning youth blocks',
    status: 'active',
  },
  {
    id: 'group-6',
    name: 'Pre-School · Daytime',
    ageGroup: 'Pre-K',
    coachId: 'coach-3',
    coachName: 'Jordan Kim',
    playerIds: [],
    description: 'Daytime motor skills and play-based intro · separate from core youth membership ladder.',
    color: '#f4fe00',
    schedule: 'Weekday mornings · daytime programming',
    status: 'active',
  },
]

export function getGroupById(id: string): Group | undefined {
  return mockGroups.find(g => g.id === id)
}

export function getGroupsByCoach(coachId: string): Group[] {
  return mockGroups.filter(g => g.coachId === coachId)
}
