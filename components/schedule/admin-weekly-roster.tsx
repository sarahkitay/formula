'use client'

import * as React from 'react'
import type { GeneratedWeek } from '@/types/schedule'
import {
  assetLabelForSlot,
  buildAdminBlockDemo,
  getAdminBlockKey,
  listWeeklyBookableAnchors,
} from '@/lib/schedule/admin-schedule-demo'
import { cn } from '@/lib/utils'
import { DAY_LABELS } from '@/components/schedule/control-schedule-grid'

function formatMinuteRange(start: number, end: number): string {
  const fmt = (m: number) => {
    const h = Math.floor(m / 60)
    const min = m % 60
    const am = h >= 12 ? 'PM' : 'AM'
    const hr = h > 12 ? h - 12 : h === 0 ? 12 : h
    return `${hr}:${min.toString().padStart(2, '0')} ${am}`
  }
  return `${fmt(start)}–${fmt(end)}`
}

export interface AdminWeeklyRosterProps {
  week: GeneratedWeek
  checkedInIds: Set<string>
  onToggleCheckedIn: (rosterId: string) => void
  className?: string
}

export function AdminWeeklyRoster({ week, checkedInIds, onToggleCheckedIn, className }: AdminWeeklyRosterProps) {
  const blocks = React.useMemo(
    () =>
      listWeeklyBookableAnchors(week).map(anchor => ({
        anchor,
        meta: buildAdminBlockDemo(week.weekStart, anchor),
      })),
    [week]
  )

  return (
    <div className={cn('space-y-4', className)}>
      <p className="font-mono text-[10px] leading-relaxed text-text-muted">
        Weekly roster (demo): each block lists enrolled athletes. Check-ins update instantly and match the capacity row
        on the program grid for the same week.
      </p>
      <div className="space-y-5">
        {blocks.map(({ anchor, meta }) => {
          const blockKey = getAdminBlockKey(anchor)
          if (!blockKey) return null
          const checkedCount = meta.players.filter(p => checkedInIds.has(p.rosterId)).length
          return (
            <div
              key={blockKey}
              className={cn(
                'border border-black/10 bg-white',
                meta.soldOut && 'border-red-800/40 bg-red-50/40'
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-black/10 bg-zinc-50 px-4 py-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-text-primary">
                    {DAY_LABELS[anchor.dayIndex]} · {formatMinuteRange(anchor.startMinute, anchor.endMinute)}
                  </p>
                  <p className="mt-0.5 text-[11px] text-text-secondary">
                    {assetLabelForSlot(anchor)} · {anchor.label}
                  </p>
                </div>
                <div className="text-right font-mono text-[10px]">
                  <p className={cn('font-bold', meta.soldOut ? 'text-red-800' : 'text-text-primary')}>
                    {meta.enrolled}/{meta.capacity} booked
                    {meta.soldOut && ' · FULL'}
                  </p>
                  <p className="text-text-muted">
                    {checkedCount}/{meta.enrolled} checked in
                  </p>
                </div>
              </div>
              <ul className="divide-y divide-black/10">
                {meta.players.map(p => {
                  const on = checkedInIds.has(p.rosterId)
                  return (
                    <li key={p.rosterId} className="flex items-center justify-between gap-3 px-4 py-2.5">
                      <span className="text-sm font-medium text-text-primary">{p.name}</span>
                      <button
                        type="button"
                        onClick={() => onToggleCheckedIn(p.rosterId)}
                        className={cn(
                          'shrink-0 rounded border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide transition-colors',
                          on
                            ? 'border-[#005700] bg-[#005700] text-white'
                            : 'border-black/15 bg-white text-text-muted hover:border-black/30 hover:text-text-primary'
                        )}
                      >
                        {on ? 'Checked in' : 'Mark in'}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
