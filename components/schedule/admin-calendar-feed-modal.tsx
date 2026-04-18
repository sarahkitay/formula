'use client'

import * as React from 'react'
import type { CalendarFeedBlock } from '@/lib/schedule/calendar-feed'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { DAY_LABELS } from '@/components/schedule/control-schedule-grid'

function formatHm(minute: number) {
  const h = Math.floor(minute / 60)
  const m = minute % 60
  const am = h >= 12 ? 'p' : 'a'
  const hr = h > 12 ? h - 12 : h === 0 ? 12 : h
  return m === 0 ? `${hr}${am}` : `${hr}:${m.toString().padStart(2, '0')}${am}`
}

export interface AdminCalendarFeedModalProps {
  open: boolean
  onClose: () => void
  weekStart: string
  block: CalendarFeedBlock | null
  onOpenPublishTab: () => void
}

export function AdminCalendarFeedModal({
  open,
  onClose,
  weekStart,
  block,
  onOpenPublishTab,
}: AdminCalendarFeedModalProps) {
  if (!block) return null

  const day = DAY_LABELS[block.dayIndex]

  return (
    <Modal open={open} onClose={onClose} title="Calendar entry" size="sm">
      <ModalBody className="space-y-3">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted">When</p>
          <p className="mt-0.5 text-sm font-semibold text-text-primary">
            {day} · week of {weekStart} · {formatHm(block.startMinute)}–{formatHm(block.endMinute)}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted">Source</p>
          <p className="mt-0.5 text-sm text-text-primary">{block.label}</p>
          {block.sublabel ? <p className="mt-0.5 text-xs text-text-secondary">{block.sublabel}</p> : null}
        </div>
        <p className="rounded border border-formula-frost/12 bg-formula-paper/[0.05] px-3 py-2 text-xs text-text-secondary shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]">
          This block is not a generated program slot (assessment, rental, agreement, etc.). Edit underlying records in
          admin tools, or add a <strong className="text-text-primary">schedule override</strong> on the Publish tab to
          reshape generated programs.
        </p>
      </ModalBody>
      <ModalFooter className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={onOpenPublishTab}>
          Publish & overrides
        </Button>
        <Button type="button" variant="primary" size="sm" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )
}
