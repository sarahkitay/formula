'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Radio } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { TabSwitcher } from '@/components/ui/tab-switcher'
import { ControlScheduleGrid, DAY_LABELS } from '@/components/schedule/control-schedule-grid'
import { AdminWeeklyRoster } from '@/components/schedule/admin-weekly-roster'
import { AdminSlotDetailModal } from '@/components/schedule/admin-slot-detail-modal'
import { generateWeeklySchedule, startOfScheduleWeek } from '@/lib/schedule/generator'
import type { DayIndex, ScheduleSlot } from '@/types/schedule'
import { buildAdminBlockMap, getAdminBlockKey, listWeeklyBookableAnchors } from '@/lib/schedule/admin-schedule-demo'
import { cn } from '@/lib/utils'
import { cycleEngine, scheduleRulesSummary } from '@/lib/mock-data/admin-operating-system'

export default function SchedulePage() {
  const [baseDate, setBaseDate] = useState(() => new Date())
  const [dayIndex, setDayIndex] = useState<DayIndex>(() => new Date().getDay() as DayIndex)
  const [activeTab, setActiveTab] = useState<'grid' | 'weekly'>('grid')
  const [checkedInIds, setCheckedInIds] = useState<Set<string>>(() => new Set())
  const [detailSlot, setDetailSlot] = useState<ScheduleSlot | null>(null)

  const week = useMemo(() => {
    const sun = startOfScheduleWeek(baseDate)
    const wix = Math.floor(sun.getTime() / (7 * 86400000)) % 52
    return generateWeeklySchedule(baseDate, [], wix)
  }, [baseDate])

  const blockMap = useMemo(() => buildAdminBlockMap(week), [week])
  const weeklyBlockCount = useMemo(() => listWeeklyBookableAnchors(week).length, [week])

  useEffect(() => {
    const initial = new Set<string>()
    for (const meta of blockMap.values()) {
      for (const p of meta.players) {
        if (p.checkedInDefault) initial.add(p.rosterId)
      }
    }
    setCheckedInIds(initial)
  }, [blockMap])

  const sun = useMemo(() => startOfScheduleWeek(baseDate), [baseDate])

  const shiftWeek = (dir: -1 | 1) => {
    const d = new Date(baseDate)
    d.setDate(d.getDate() + dir * 7)
    setBaseDate(d)
  }

  const goToday = () => {
    const t = new Date()
    setBaseDate(t)
    setDayIndex(t.getDay() as DayIndex)
  }

  const toggleCheckedIn = (rosterId: string) => {
    setCheckedInIds(prev => {
      const next = new Set(prev)
      if (next.has(rosterId)) next.delete(rosterId)
      else next.add(rosterId)
      return next
    })
  }

  const detailMeta = useMemo(() => {
    if (!detailSlot) return null
    const key = getAdminBlockKey(detailSlot)
    if (!key) return null
    return blockMap.get(key) ?? null
  }, [detailSlot, blockMap])

  const adminSlotFill = (slot: ScheduleSlot) => {
    const key = getAdminBlockKey(slot)
    if (!key) return null
    const meta = blockMap.get(key)
    if (!meta) return null
    const checkedIn = meta.players.filter(p => checkedInIds.has(p.rosterId)).length
    return {
      capacity: meta.capacity,
      enrolled: meta.enrolled,
      checkedIn,
      soldOut: meta.soldOut,
    }
  }

  return (
    <PageContainer fullWidth>
      <div className="space-y-5">
        <PageHeader
          title="Schedule operations"
          subtitle="55m youth blocks · protected buffers · overrides require audit (demo)"
          actions={
            <a
              href="/api/schedule/generate"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-7 items-center gap-1.5 border border-border bg-muted px-2.5 text-xs font-medium text-text-primary hover:border-border-bright hover:bg-elevated"
            >
              API: /api/schedule/generate
            </a>
          }
        />

        <div className="grid grid-cols-1 gap-3 border border-white/10 bg-[#0f0f0f] p-4 font-mono text-[11px] text-zinc-300 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">12-week cycle</p>
            <p className="mt-1 text-zinc-100">
              {cycleEngine.currentCycle} · week {cycleEngine.weekInCycle}/{cycleEngine.totalWeeks}
            </p>
            <p className="mt-1 text-zinc-500">Next cycle: {cycleEngine.nextCycleStart}</p>
          </div>
          <ul className="list-inside list-disc space-y-1 text-zinc-500">
            {scheduleRulesSummary.slice(0, 4).map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>

        <div className="border-b border-black">
          <TabSwitcher
            variant="underline"
            tabs={[
              { id: 'grid', label: 'Program grid' },
              { id: 'weekly', label: 'Weekly roster', count: weeklyBlockCount },
            ]}
            activeTab={activeTab}
            onChange={id => setActiveTab(id as 'grid' | 'weekly')}
          />
        </div>

        <div className="flex flex-col gap-3 border border-black/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => shiftWeek(-1)}
              className="flex h-8 w-8 items-center justify-center border border-black/10 bg-[#f9f9f9] text-text-secondary hover:border-black hover:text-text-primary"
              aria-label="Previous week"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => shiftWeek(1)}
              className="flex h-8 w-8 items-center justify-center border border-black/10 bg-[#f9f9f9] text-text-secondary hover:border-black hover:text-text-primary"
              aria-label="Next week"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="ml-1 font-mono text-xs text-[#1a1a1a]">
              <span className="font-bold">SUN</span> {week.weekStart}
              <span className="mx-1 text-zinc-500">→</span>
              <span className="font-bold">SAT</span> {week.weekEnd}
            </div>
          </div>
          <button
            type="button"
            onClick={goToday}
            className="self-start text-left font-mono text-[10px] font-bold uppercase tracking-wider text-[#005700] hover:underline sm:self-auto"
          >
            Jump to today
          </button>
        </div>

        {activeTab === 'grid' && (
          <>
            <div className="flex flex-wrap gap-1 border border-black/10 bg-zinc-50 p-2">
              {([0, 1, 2, 3, 4, 5, 6] as const).map(i => {
                const di = i as DayIndex
                const dayDate = new Date(sun)
                dayDate.setDate(sun.getDate() + i)
                const iso = toISODateLocal(dayDate)
                const isToday = iso === toISODateLocal(new Date())
                return (
                  <button
                    key={di}
                    type="button"
                    onClick={() => setDayIndex(di)}
                    className={cn(
                      'min-w-[3.25rem] border px-2 py-2 font-mono text-[10px] font-bold uppercase transition-colors',
                      dayIndex === di
                        ? 'border-black bg-black text-white'
                        : 'border-black/10 bg-white text-zinc-600 hover:border-black',
                      isToday && dayIndex !== di && 'ring-1 ring-[#005700]'
                    )}
                  >
                    {DAY_LABELS[di]}
                    <span className="mt-0.5 block text-[9px] font-normal opacity-80">{dayDate.getDate()}</span>
                  </button>
                )
              })}
            </div>

            <div className="flex items-start gap-2 border border-[#005700]/30 bg-[#005700]/5 p-3 font-mono text-[10px] text-zinc-700">
              <Radio className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#005700]" />
              <p>
                Schedule is <strong>generated</strong> from static rules. Click any block for roster / capacity detail.
                Capacity and rosters are <strong>demo data</strong>; check-ins sync with the Weekly roster tab and the
                grid counts.
              </p>
            </div>

            <div className="overflow-x-auto pb-4">
              <ControlScheduleGrid
                week={week}
                dayIndex={dayIndex}
                adminSlotFill={adminSlotFill}
                onSlotClick={s => setDetailSlot(s)}
              />
            </div>
          </>
        )}

        {activeTab === 'weekly' && (
          <AdminWeeklyRoster week={week} checkedInIds={checkedInIds} onToggleCheckedIn={toggleCheckedIn} />
        )}

        <AdminSlotDetailModal
          open={detailSlot != null}
          onClose={() => setDetailSlot(null)}
          weekStart={week.weekStart}
          slot={detailSlot}
          meta={detailMeta}
          checkedInIds={checkedInIds}
          onToggleCheckedIn={toggleCheckedIn}
        />
      </div>
    </PageContainer>
  )
}

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

function toISODateLocal(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
