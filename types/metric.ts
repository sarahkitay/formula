/**
 * Performance pipeline: manual coach entry (V1) + machine feeds (V2).
 * Footbot, double speed court, speed track, etc.
 */
export type MetricSource = 'manual' | 'footbot' | 'speed_track' | 'speed_court' | 'coach_input'

export type MetricType =
  | 'speed'
  | 'agility'
  | 'reaction'
  | 'power'
  | 'endurance'
  | 'technical'
  | 'custom'

export interface MetricReading {
  id: string
  playerId: string
  type: MetricType
  value: number
  unit?: string
  source: MetricSource
  recordedAt: string
  /** When true, counts toward official report card */
  countsTowardReportCard?: boolean
}
