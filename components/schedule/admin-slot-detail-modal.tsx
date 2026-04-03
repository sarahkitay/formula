'use client'

import * as React from 'react'
import type { ScheduleSlot } from '@/types/schedule'
import {
  assetLabelForSlot,
  getSlotOccurrenceDate,
  scheduleSlotCheckInPhase,
  type AdminBlockDemoMeta,
} from '@/lib/schedule/admin-schedule-demo'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { DAY_LABELS } from '@/components/schedule/control-schedule-grid'
import { cn } from '@/lib/utils'

function formatRange(weekStart: string, slot: ScheduleSlot): string {
  const a = getSlotOccurrenceDate(weekStart, slot, 'start')
  const b = getSlotOccurrenceDate(weekStart, slot, 'end')
  const day = DAY_LABELS[slot.dayIndex]
  const tfmt: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true }
  return `${day} · ${a.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${a.toLocaleTimeString('en-US', tfmt)}–${b.toLocaleTimeString('en-US', tfmt)}`
}

export interface AdminSlotDetailModalProps {
  open: boolean
  onClose: () => void
  weekStart: string
  slot: ScheduleSlot | null
  meta: AdminBlockDemoMeta | null
  checkedInIds: Set<string>
  onToggleCheckedIn: (rosterId: string) => void
}

export function AdminSlotDetailModal({
  open,
  onClose,
  weekStart,
  slot,
  meta,
  checkedInIds,
  onToggleCheckedIn,
}: AdminSlotDetailModalProps) {
  const phase = slot ? scheduleSlotCheckInPhase(weekStart, slot) : 'upcoming'
  const showCheckInColumn = slot != null && (phase === 'live' || phase === 'ended')

  if (!slot) return null

  const checkedCount = meta ? meta.players.filter(p => checkedInIds.has(p.rosterId)).length : 0

  return (
  <Modal open={open} onClose={onClose} title="Slot breakdown" size="md">
  <ModalBody className="space-y-4">
  <div>
  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted">When</p>
  <p className="mt-0.5 text-sm font-semibold text-text-primary">{formatRange(weekStart, slot)}</p>
  </div>
  <div>
  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted">Where · program</p>
  <p className="mt-0.5 text-sm text-text-primary">{assetLabelForSlot(slot)}</p>
  <p className="mt-0.5 text-xs text-text-secondary">{slot.label}</p>
  </div>

  {!meta && (
  <p className="rounded border border-black/10 bg-zinc-50 px-3 py-2 text-xs text-text-secondary">
  No demo roster is attached to this program slot (rentals, flex blocks, etc.). Only enrollable youth,
  preschool, gym youth, and open-gym blocks include a student list.
  </p>
  )}

  {meta && (
  <>
  <div className="flex flex-wrap items-center gap-3 rounded border border-black/10 bg-zinc-50 px-3 py-2 font-mono text-[11px]">
  <span className={cn('font-bold', meta.soldOut ? 'text-red-800' : 'text-text-primary')}>
  {meta.enrolled}/{meta.capacity} booked
  {meta.soldOut ? ' · FULL' : ` · ${meta.capacity - meta.enrolled} open`}
  </span>
  {showCheckInColumn && (
  <span className="text-text-muted">
  {checkedCount}/{meta.enrolled} checked in
  </span>
  )}
  </div>
  <p className="text-xs text-text-muted">
  {phase === 'upcoming' && 'Check-in opens when this block starts. Roster below is who is booked.'}
  {phase === 'live' && 'Block in progress - mark check-ins as athletes arrive.'}
  {phase === 'ended' && 'Past block - audit shows who was checked in vs not (demo state).'}
  </p>
  <ul className="max-h-[min(50vh,22rem)] divide-y divide-border overflow-y-auto border border-border rounded-lg">
  {meta.players.map(p => {
  const inSet = checkedInIds.has(p.rosterId)
  return (
  <li key={p.rosterId} className="flex items-center justify-between gap-3 px-3 py-2.5">
  <span className="text-sm font-medium text-text-primary">{p.name}</span>
  <div className="flex shrink-0 items-center gap-2">
  {showCheckInColumn ? (
  <>
  <span
  className={cn(
  'font-mono text-[10px] font-bold uppercase',
  inSet ? 'text-[#005700]' : 'text-text-muted'
  )}
  >
  {inSet ? 'Checked in' : 'Not checked in'}
  </span>
  <Button variant="secondary" size="sm" type="button" onClick={() => onToggleCheckedIn(p.rosterId)}>
  {inSet ? 'Undo' : 'Check in'}
  </Button>
  </>
  ) : (
  <span className="font-mono text-[10px] text-text-muted">Booked</span>
  )}
  </div>
  </li>
  )
  })}
  </ul>
  </>
  )}
  </ModalBody>
  <ModalFooter>
  <Button variant="primary" size="sm" type="button" onClick={onClose}>
  Close
  </Button>
  </ModalFooter>
  </Modal>
  )
}
