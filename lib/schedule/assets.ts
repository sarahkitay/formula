import type { ScheduleAsset } from '@/types/schedule'

/** Facility asset registry: order = default vertical order in control UI */
export const SCHEDULE_ASSETS: ScheduleAsset[] = [
  { id: 'field-1', label: 'Field 1', category: 'field', allowsYouthTraining: false },
  { id: 'field-2', label: 'Field 2', category: 'field', allowsYouthTraining: false },
  { id: 'field-3', label: 'Field 3', category: 'field', allowsYouthTraining: false },
  { id: 'match-arena', label: 'Match Arena', category: 'training', allowsYouthTraining: true },
  { id: 'speed-track', label: 'Speed Track', category: 'training', allowsYouthTraining: true },
  { id: 'double-speed-court', label: 'Double Speed Court', category: 'training', allowsYouthTraining: true },
  { id: 'speed-court', label: 'Speed Court', category: 'training', allowsYouthTraining: true },
  { id: 'footbot', label: 'Footbot', category: 'training', allowsYouthTraining: true },
  { id: 'gym', label: 'Gym', category: 'training', allowsYouthTraining: true },
  { id: 'party-room', label: 'Party Room', category: 'other', allowsYouthTraining: false },
  { id: 'flex-room', label: 'Flex Room', category: 'other', allowsYouthTraining: false },
]

export const STATION_ASSET_IDS = [
  'speed-track',
  'double-speed-court',
  'speed-court',
  'footbot',
] as const

export function getAssetById(id: string): ScheduleAsset | undefined {
  return SCHEDULE_ASSETS.find(a => a.id === id)
}
