// TEMPORARY DATA LAYER (V1)
// Scheduling: 55-minute blocks, 15-minute turnover (Formula Soccer Center intake)
import { Session } from '@/types'

const TODAY = new Date()
const todayStr = TODAY.toISOString().split('T')[0]

const SESSION_MIN = 55

function makeTime(dateStr: string, hour: number, minute = 0): string {
  const d = new Date(`${dateStr}T00:00:00`)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

function endAfterStart(startIso: string): string {
  const d = new Date(startIso)
  d.setMinutes(d.getMinutes() + SESSION_MIN)
  return d.toISOString()
}

function block(dateStr: string, hour: number, minute: number): { start: string; end: string } {
  const start = makeTime(dateStr, hour, minute)
  return { start, end: endAfterStart(start) }
}

const tmrw = new Date(TODAY)
tmrw.setDate(tmrw.getDate() + 1)
const tmrwStr = tmrw.toISOString().split('T')[0]

const d2 = new Date(TODAY)
d2.setDate(d2.getDate() + 2)
const d2Str = d2.toISOString().split('T')[0]

const yest = new Date(TODAY)
yest.setDate(yest.getDate() - 1)
const yestStr = yest.toISOString().split('T')[0]

const FIELD_MAIN = 'Field A · Main · Formula Soccer Center'
const FIELD_GRID = 'Field B · Training grid · Formula Soccer Center'
const FIELD_GK = 'Field C · GK zone · Formula Soccer Center'
const FIELD_MINI = 'Field D · Mini pitch · Formula Soccer Center'

export const mockSessions: Session[] = [
  // ── TODAY (weekday youth block: first slot 3:30 PM, 55m + 15m gaps) ──
  (() => {
    const { start, end } = block(todayStr, 7, 0)
    return {
      id: 'session-1',
      title: 'Elite U14 · Technical block',
      coachId: 'coach-1',
      coachName: 'Marcus Rivera',
      groupId: 'group-1',
      fieldId: 'field-a',
      fieldName: FIELD_MAIN,
      startTime: start,
      endTime: end,
      capacity: 22,
      enrolledCount: 14,
      sessionType: 'training',
      status: 'completed',
      ageGroups: ['U14'],
    } as Session
  })(),
  (() => {
    const { start, end } = block(todayStr, 15, 30)
    return {
      id: 'session-2',
      title: 'Development U12 · Four-coach block',
      coachId: 'coach-1',
      coachName: 'Marcus Rivera',
      groupId: 'group-2',
      fieldId: 'field-b',
      fieldName: FIELD_GRID,
      startTime: start,
      endTime: end,
      capacity: 22,
      enrolledCount: 17,
      sessionType: 'training',
      status: 'in-progress',
      ageGroups: ['U12'],
    } as Session
  })(),
  (() => {
    const { start, end } = block(todayStr, 16, 40)
    return {
      id: 'session-3',
      title: 'GK Academy U16 · Shot stopping',
      coachId: 'coach-2',
      coachName: 'Elena Vasquez',
      groupId: 'group-3',
      fieldId: 'field-c',
      fieldName: FIELD_GK,
      startTime: start,
      endTime: end,
      capacity: 22,
      enrolledCount: 8,
      sessionType: 'training',
      status: 'scheduled',
      ageGroups: ['U16'],
    } as Session
  })(),
  (() => {
    const { start, end } = block(todayStr, 17, 50)
    return {
      id: 'session-4',
      title: 'Elite U18 · Match prep',
      coachId: 'coach-2',
      coachName: 'Elena Vasquez',
      groupId: 'group-4',
      fieldId: 'field-a',
      fieldName: FIELD_MAIN,
      startTime: start,
      endTime: end,
      capacity: 22,
      enrolledCount: 16,
      sessionType: 'training',
      status: 'scheduled',
      ageGroups: ['U18'],
    } as Session
  })(),
  (() => {
    const { start, end } = block(todayStr, 19, 0)
    return {
      id: 'session-5',
      title: 'Little Strikers U10 · Fundamentals',
      coachId: 'coach-3',
      coachName: 'Jordan Kim',
      groupId: 'group-5',
      fieldId: 'field-d',
      fieldName: FIELD_MINI,
      startTime: start,
      endTime: end,
      capacity: 22,
      enrolledCount: 12,
      sessionType: 'training',
      status: 'scheduled',
      ageGroups: ['U10'],
    } as Session
  })(),

  // ── TOMORROW (morning weekend-style blocks) ──
  (() => {
    const { start, end } = block(tmrwStr, 9, 0)
    return {
      id: 'session-6',
      title: 'Elite U14 · Game tactics',
      coachId: 'coach-1',
      coachName: 'Marcus Rivera',
      groupId: 'group-1',
      fieldId: 'field-a',
      fieldName: FIELD_MAIN,
      startTime: start,
      endTime: end,
      capacity: 22,
      enrolledCount: 13,
      sessionType: 'training',
      status: 'scheduled',
      ageGroups: ['U14'],
    } as Session
  })(),
  (() => {
    const { start, end } = block(tmrwStr, 10, 10)
    return {
      id: 'session-7',
      title: 'U16 · Performance assessment',
      coachId: 'coach-2',
      coachName: 'Elena Vasquez',
      groupId: 'group-3',
      fieldId: 'field-b',
      fieldName: FIELD_GRID,
      startTime: start,
      endTime: end,
      capacity: 22,
      enrolledCount: 10,
      sessionType: 'evaluation',
      status: 'scheduled',
      ageGroups: ['U16'],
    } as Session
  })(),

  // ── DAY AFTER TOMORROW ──
  (() => {
    const { start, end } = block(d2Str, 11, 0)
    return {
      id: 'session-8',
      title: 'Development U12 · Finishing',
      coachId: 'coach-1',
      coachName: 'Marcus Rivera',
      groupId: 'group-2',
      fieldId: 'field-b',
      fieldName: FIELD_GRID,
      startTime: start,
      endTime: end,
      capacity: 22,
      enrolledCount: 11,
      sessionType: 'training',
      status: 'scheduled',
      ageGroups: ['U12'],
    } as Session
  })(),
  (() => {
    const { start, end } = block(d2Str, 16, 0)
    return {
      id: 'session-9',
      title: 'Elite U18 · Scrimmage',
      coachId: 'coach-2',
      coachName: 'Elena Vasquez',
      groupId: 'group-4',
      fieldId: 'field-a',
      fieldName: FIELD_MAIN,
      startTime: start,
      endTime: end,
      capacity: 24,
      enrolledCount: 19,
      sessionType: 'game',
      status: 'scheduled',
      ageGroups: ['U18'],
    } as Session
  })(),

  // ── YESTERDAY ──
  (() => {
    const { start, end } = block(yestStr, 7, 0)
    return {
      id: 'session-10',
      title: 'Elite U14 · Technical block',
      coachId: 'coach-1',
      coachName: 'Marcus Rivera',
      groupId: 'group-1',
      fieldId: 'field-a',
      fieldName: FIELD_MAIN,
      startTime: start,
      endTime: end,
      capacity: 22,
      enrolledCount: 15,
      sessionType: 'training',
      status: 'completed',
      ageGroups: ['U14'],
    } as Session
  })(),
]

export function getSessionById(id: string): Session | undefined {
  return mockSessions.find(s => s.id === id)
}

export function getTodaysSessions(): Session[] {
  return mockSessions.filter(s => s.startTime.startsWith(todayStr))
}

export function getUpcomingSessions(): Session[] {
  const now = new Date()
  return mockSessions
    .filter(s => new Date(s.startTime) > now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
}

export function getSessionsByGroup(groupId: string): Session[] {
  return mockSessions.filter(s => s.groupId === groupId)
}
