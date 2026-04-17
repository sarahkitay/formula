'use client'

import React, { useMemo, useState } from 'react'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { SectionHeader } from '@/components/ui/section-header'
import { CoachFloorSvgMap, type FloorFieldStatus } from '@/components/coach/coach-floor-svg-map'
import {
  FLOOR_PROGRAM_BY_SECTION,
  FLOOR_SECTION_IDS,
  type FloorSectionId,
} from '@/lib/coach/floor-layout'
import { cn } from '@/lib/utils'
import { SITE } from '@/lib/site-config'
import { assignedFloorSection, getCoachSessionForFloorSection } from '@/lib/mock-data/coach-operating'

const PEER_COACHES = ['Staff']

function initialFieldMap<T>(factory: (id: FloorSectionId) => T): Record<FloorSectionId, T> {
  return Object.fromEntries(FLOOR_SECTION_IDS.map(id => [id, factory(id)])) as Record<FloorSectionId, T>
}

export default function CoachFloorPage() {
  const [fieldStatus, setFieldStatus] = useState<Record<FloorSectionId, FloorFieldStatus>>(() =>
  initialFieldMap(() => 'available')
  )
  const [coachOnField, setCoachOnField] = useState<Record<FloorSectionId, string | null>>(() =>
  initialFieldMap(() => null)
  )
  const [lastUpdated, setLastUpdated] = useState<Record<FloorSectionId, string | null>>(() =>
  initialFieldMap(() => null)
  )
  const [selectedId, setSelectedId] = useState<FloorSectionId | null>(null)
  const [actingAs, setActingAs] = useState(PEER_COACHES[0] ?? 'Staff')
  const [log, setLog] = useState<{ time: string; message: string }[]>([
    { time: new Date().toLocaleTimeString(), message: 'Floor map loaded — select a section to update status.' },
  ])

  const selected = selectedId ? FLOOR_PROGRAM_BY_SECTION[selectedId] : null
  const status = selectedId ? fieldStatus[selectedId] : null
  const liveSession = selectedId ? getCoachSessionForFloorSection(selectedId) : undefined

  const counts = useMemo(() => {
  let available = 0
  let occupied = 0
  let checkin = 0
  for (const id of FLOOR_SECTION_IDS) {
  const s = fieldStatus[id]
  if (s === 'available') available++
  else if (s === 'occupied') occupied++
  else checkin++
  }
  return { available, occupied, checkin }
  }, [fieldStatus])

  const pushLog = (message: string) => {
  setLog(prev => [{ time: new Date().toLocaleTimeString(), message }, ...prev].slice(0, 25))
  }

  const touch = (id: FloorSectionId) => {
  setLastUpdated(prev => ({ ...prev, [id]: new Date().toLocaleString() }))
  }

  const checkIn = () => {
  if (!selectedId) return
  if (fieldStatus[selectedId] !== 'available') return
  setFieldStatus(prev => ({ ...prev, [selectedId]: 'checkin' }))
  setCoachOnField(prev => ({ ...prev, [selectedId]: actingAs }))
  touch(selectedId)
  pushLog(`${actingAs} checked in to Field ${selectedId} (${selected?.sectionName ?? ''})`)
  }

  const checkOut = () => {
  if (!selectedId) return
  if (fieldStatus[selectedId] !== 'checkin') return
  const coach = coachOnField[selectedId]
  setFieldStatus(prev => ({ ...prev, [selectedId]: 'occupied' }))
  touch(selectedId)
  pushLog(`${coach ?? 'Coach'} ended check-in on Field ${selectedId} - section marked occupied (session in use)`)
  }

  const setAvailable = () => {
  if (!selectedId) return
  if (fieldStatus[selectedId] !== 'occupied' && fieldStatus[selectedId] !== 'checkin') return
  setFieldStatus(prev => ({ ...prev, [selectedId]: 'available' }))
  setCoachOnField(prev => ({ ...prev, [selectedId]: null }))
  touch(selectedId)
  pushLog(`Field ${selectedId} cleared and set to available`)
  }

  const canCheckIn = selectedId != null && status === 'available'
  const canCheckOut = selectedId != null && status === 'checkin'
  const canClear = selectedId != null && (status === 'occupied' || status === 'checkin')

  return (
  <PageContainer fullWidth>
  <div className="space-y-6">
  <PageHeader
  title="Training floor"
  subtitle={`${SITE.facilityName} · assignment Field ${assignedFloorSection} · tap zones for section context`}
  />

  <div className="flex flex-wrap items-center justify-center gap-4 border border-border bg-surface px-4 py-3 font-mono text-[11px]">
  <span className="flex items-center gap-2">
  <span className="h-2 w-2 rounded-full bg-[#005700]" />
  Available: {counts.available}
  </span>
  <span className="flex items-center gap-2">
  <span className="h-2 w-2 rounded-full bg-red-600" />
  Occupied: {counts.occupied}
  </span>
  <span className="flex items-center gap-2">
  <span className="h-2 w-2 rounded-full bg-amber-500" />
  Staff in: {counts.checkin}
  </span>
  </div>

  <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
  <CoachFloorSvgMap
  fieldStatus={fieldStatus}
  selectedId={selectedId}
  onSelectField={id => setSelectedId(id)}
  assignedSectionId={assignedFloorSection}
  />

  <div className="space-y-4">
  <div className="border border-border bg-card p-5 shadow-[var(--shadow-depth-val)]">
  <SectionHeader title="Section detail" description="Program set by the lead coach for this window" />
  {!selectedId && (
  <p className="mt-4 text-center text-sm text-text-muted">Select a field on the map to view program and check-in actions.</p>
  )}
  {selectedId && selected && (
  <div className="mt-4 space-y-3 text-sm">
  <div className="flex justify-between gap-2 border-b border-border py-2">
  <span className="text-text-muted">Field</span>
  <span className="font-semibold text-text-primary">{selectedId}</span>
  </div>
  <div className="flex justify-between gap-2 border-b border-border py-2">
  <span className="text-text-muted">Section</span>
  <span className="text-right font-medium text-text-primary">{selected.sectionName}</span>
  </div>
  <div className="flex justify-between gap-2 border-b border-border py-2">
  <span className="text-text-muted">Surface</span>
  <span className="text-right text-text-secondary">{selected.surfaceType}</span>
  </div>
  <div className="flex justify-between gap-2 border-b border-border py-2">
  <span className="text-text-muted">Capacity</span>
  <span className="text-right">{selected.capacity}</span>
  </div>
  {liveSession && (
  <>
  <div className="flex justify-between gap-2 border-b border-border py-2">
  <span className="text-text-muted">Program now</span>
  <span className="max-w-[200px] text-right text-text-primary">{liveSession.title}</span>
  </div>
  <div className="flex justify-between gap-2 border-b border-border py-2">
  <span className="text-text-muted">Attendance</span>
  <span className="text-right font-mono text-xs">
  {liveSession.checkedIn}/{liveSession.enrolled} · cap {liveSession.capacity}
  </span>
  </div>
  <div className="flex justify-between gap-2 border-b border-border py-2">
  <span className="text-text-muted">Age</span>
  <span className="text-right">{liveSession.ageLabel}</span>
  </div>
  </>
  )}
  <div className="flex justify-between gap-2 border-b border-border py-2">
  <span className="text-text-muted">Window</span>
  <span className="text-right font-mono text-xs">{selected.window}</span>
  </div>
  <div className="flex justify-between gap-2 border-b border-border py-2">
  <span className="text-text-muted">Group</span>
  <span className="text-right">{selected.groupLabel}</span>
  </div>
  <div className="border-b border-border py-2">
  <p className="text-[10px] font-bold uppercase tracking-wide text-text-muted">Lead program (today)</p>
  <p className="mt-1 text-text-primary">{selected.leadProgram}</p>
  <p className="mt-1 text-xs text-text-muted">
  Lead: {selected.leadCoachName} · Your role:{' '}
  <span className="font-semibold text-[#005700]">{selected.yourRole}</span>
  </p>
  </div>
  <div className="flex justify-between gap-2 py-2">
  <span className="text-text-muted">Map status</span>
  <span
  className={cn(
  'rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase',
  status === 'available' && 'bg-[#005700]/10 text-[#005700]',
  status === 'occupied' && 'bg-red-100 text-red-800',
  status === 'checkin' && 'bg-amber-100 text-amber-900'
  )}
  >
  {status}
  </span>
  </div>
  <div className="flex justify-between gap-2 py-2">
  <span className="text-text-muted">Coach on section</span>
  <span className="text-right">{coachOnField[selectedId] ?? '-'}</span>
  </div>
  <div className="flex justify-between gap-2 py-2">
  <span className="text-text-muted">Last update</span>
  <span className="text-right font-mono text-xs">{lastUpdated[selectedId] ?? '-'}</span>
  </div>

  <div className="space-y-1.5 pt-2">
  <label htmlFor="acting-as" className="text-[10px] font-bold uppercase tracking-wide text-text-muted">
  Check in as
  </label>
  <select
  id="acting-as"
  value={actingAs}
  onChange={e => setActingAs(e.target.value)}
  className="h-10 w-full border border-border bg-card px-3 text-sm text-text-primary focus:border-[#005700] focus:outline-none"
  >
  {PEER_COACHES.map(name => (
  <option key={name} value={name}>
  {name}
  </option>
  ))}
  </select>
  </div>

  <div className="flex flex-wrap gap-2 pt-3">
  <Button variant="primary" size="sm" type="button" onClick={checkIn} disabled={!canCheckIn}>
  Check in to section
  </Button>
  <Button variant="secondary" size="sm" type="button" onClick={checkOut} disabled={!canCheckOut}>
  End check-in (occupied)
  </Button>
  <Button variant="ghost" size="sm" type="button" onClick={setAvailable} disabled={!canClear}>
  Clear to available
  </Button>
  </div>
  <p className="text-[10px] text-text-muted">
  <strong>Check in</strong> marks staff present (gold). <strong>End check-in</strong> moves the space to in-session
  (red). <strong>Clear</strong> resets for the next block.
  </p>
  </div>
  )}
  </div>

  <div className="border border-border bg-card p-5 shadow-[var(--shadow-depth-val)]">
  <SectionHeader title="Activity log" />
  <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto font-mono text-[11px]">
  {log.map((entry, i) => (
  <li key={i} className="border-l-2 border-[#005700]/40 bg-muted/30 px-3 py-2">
  <p className="text-text-muted">{entry.time}</p>
  <p className="text-text-primary">{entry.message}</p>
  </li>
  ))}
  </ul>
  </div>
  </div>
  </div>
  </div>
  </PageContainer>
  )
}
