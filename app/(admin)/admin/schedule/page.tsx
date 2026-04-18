'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Radio } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { TabSwitcher } from '@/components/ui/tab-switcher'
import { ControlScheduleGrid, DAY_LABELS } from '@/components/schedule/control-schedule-grid'
import { AdminWeeklyRoster } from '@/components/schedule/admin-weekly-roster'
import { AdminSlotDetailModal } from '@/components/schedule/admin-slot-detail-modal'
import { buildPublishedWeek } from '@/lib/schedule/published-week'
import { isoDateForWeekDay, startOfScheduleWeek, toISODateLocal } from '@/lib/schedule/generator'
import type { DayIndex, ScheduleOverride, ScheduleSlot } from '@/types/schedule'
import {
  buildAdminBlockMap,
  getAdminBlockKey,
  listWeeklyBookableAnchors,
  type AdminRosterPlayerDemo,
} from '@/lib/schedule/admin-schedule-demo'
import { cn } from '@/lib/utils'
import { scheduleRulesSummary } from '@/lib/mock-data/admin-operating-system'
import type { FacilitySchedulePublishedConfig } from '@/lib/schedule/facility-schedule-config'
import { FacilityScheduleEditor } from '@/components/admin/facility-schedule-editor'
import { loadFacilityScheduleConfigAction, saveFacilityScheduleConfigAction } from './actions'
import { Button } from '@/components/ui/button'
import { FacilityWeekCalendar } from '@/components/schedule/facility-week-calendar'
import { AdminCalendarFeedModal } from '@/components/schedule/admin-calendar-feed-modal'
import type { CalendarFeedBlock } from '@/lib/schedule/calendar-feed'

export default function SchedulePage() {
  const [baseDate, setBaseDate] = useState(() => new Date())
  const [dayIndex, setDayIndex] = useState<DayIndex>(() => new Date().getDay() as DayIndex)
  const [activeTab, setActiveTab] = useState<'calendar' | 'grid' | 'weekly' | 'publish'>('calendar')
  const [checkedInIds, setCheckedInIds] = useState<Set<string>>(() => new Set())
  const [detailSlot, setDetailSlot] = useState<ScheduleSlot | null>(null)

  const [facilityConfig, setFacilityConfig] = useState<FacilitySchedulePublishedConfig | null>(null)
  const [configLoadError, setConfigLoadError] = useState<string | null>(null)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'ok' | 'err'>('idle')
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [calendarBlocks, setCalendarBlocks] = useState<CalendarFeedBlock[]>([])
  const [calendarError, setCalendarError] = useState<string | null>(null)
  const [feedDetailBlock, setFeedDetailBlock] = useState<CalendarFeedBlock | null>(null)

  const reloadConfig = useCallback(async () => {
    setConfigLoadError(null)
    try {
      const c = await loadFacilityScheduleConfigAction()
      setFacilityConfig(c)
    } catch (e) {
      setConfigLoadError(e instanceof Error ? e.message : 'Failed to load schedule config')
    }
  }, [])

  useEffect(() => {
    void reloadConfig()
  }, [reloadConfig])

  const week = useMemo(() => {
    if (!facilityConfig) return null
    return buildPublishedWeek(baseDate, facilityConfig)
  }, [baseDate, facilityConfig])

  useEffect(() => {
    if (!week?.weekStart) return
    let cancelled = false
    setCalendarError(null)
    ;(async () => {
      try {
        const res = await fetch(`/api/schedule/calendar-feed?weekStart=${encodeURIComponent(week.weekStart)}`)
        const body = (await res.json()) as { blocks?: CalendarFeedBlock[]; error?: string }
        if (!res.ok) throw new Error(body.error ?? 'Failed to load calendar')
        if (!cancelled) setCalendarBlocks(body.blocks ?? [])
      } catch (e) {
        if (!cancelled) {
          setCalendarBlocks([])
          setCalendarError(e instanceof Error ? e.message : 'Failed to load calendar')
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [week?.weekStart])

  const blockMap = useMemo(() => (week ? buildAdminBlockMap(week) : new Map()), [week])
  const weeklyBlockCount = useMemo(() => (week ? listWeeklyBookableAnchors(week).length : 0), [week])

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
    if (!detailSlot || !week) return null
    const key = getAdminBlockKey(detailSlot)
    if (!key) return null
    return blockMap.get(key) ?? null
  }, [detailSlot, blockMap, week])

  const adminSlotFill = (slot: ScheduleSlot) => {
    const key = getAdminBlockKey(slot)
    if (!key) return null
    const meta = blockMap.get(key)
    if (!meta) return null
    const checkedIn = meta.players.filter((p: AdminRosterPlayerDemo) => checkedInIds.has(p.rosterId)).length
    return {
      capacity: meta.capacity,
      enrolled: meta.enrolled,
      checkedIn,
      soldOut: meta.soldOut,
    }
  }

  const appendOverrideFromCalendar = useCallback(
    ({ dayIndex, startMinute, endMinute }: { dayIndex: DayIndex; startMinute: number; endMinute: number }) => {
      if (!facilityConfig || !week) return
      const id = `ov-cal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      const date = isoDateForWeekDay(week.weekStart, dayIndex)
      const row: ScheduleOverride = {
        id,
        date,
        assetId: 'performance-center',
        startMinute,
        endMinute,
        kind: 'flex_ops',
        label: 'Calendar override',
        mode: 'replace',
      }
      setFacilityConfig({ ...facilityConfig, overrides: [...facilityConfig.overrides, row] })
      setActiveTab('publish')
    },
    [facilityConfig, week]
  )

  const onSavePublish = async () => {
    if (!facilityConfig) return
    setSaveState('saving')
    setSaveMessage(null)
    const r = await saveFacilityScheduleConfigAction(facilityConfig)
    if (r.ok) {
      setSaveState('ok')
      setSaveMessage('Published. The parent portal and public site pick up changes on their next refresh.')
    } else {
      setSaveState('err')
      setSaveMessage(r.error)
    }
  }

  return (
    <PageContainer fullWidth>
      <div className="space-y-5">
        <PageHeader
          title="Schedule operations"
          subtitle="Facility calendar + published program · assessments, rentals, parties, and age-group blocks"
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/events/parties"
                className="inline-flex h-7 items-center gap-1.5 border border-fuchsia-500/35 bg-fuchsia-950/35 px-2.5 text-xs font-medium text-fuchsia-100 transition-colors hover:border-fuchsia-400/50"
              >
                Book party
              </Link>
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={!facilityConfig || saveState === 'saving'}
                onClick={() => void onSavePublish()}
              >
                {saveState === 'saving' ? 'Publishing…' : 'Publish changes'}
              </Button>
              <a
                href="/api/schedule/generate?weeks=12"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-7 items-center gap-1.5 border border-formula-frost/16 bg-formula-paper/[0.06] px-2.5 text-xs font-medium text-formula-paper transition-colors hover:border-formula-volt/35"
              >
                12-week schedule export
              </a>
            </div>
          }
        />

        {configLoadError && (
          <p className="border border-amber-500/30 bg-amber-950/30 px-3 py-2 font-mono text-xs text-amber-100">
            {configLoadError}
          </p>
        )}
        {saveMessage && (
          <p
            className={cn(
              'border px-3 py-2 font-mono text-xs',
              saveState === 'err'
                ? 'border-red-500/40 bg-red-950/30 text-red-100'
                : 'border-formula-volt/30 bg-formula-volt/10 text-formula-paper'
            )}
          >
            {saveMessage}
          </p>
        )}

        {!facilityConfig || !week ? (
          <p className="font-mono text-sm text-formula-mist">Loading facility schedule…</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 border border-formula-frost/12 bg-formula-paper/[0.04] p-4 font-mono text-[11px] text-formula-frost/90 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)] lg:grid-cols-[1fr_2fr]">
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-formula-mist">12-week cycle (published)</p>
                <p className="mt-1 text-formula-paper">
                  {facilityConfig.currentCycleLabel} · week {facilityConfig.weekInCycle}/{facilityConfig.totalWeeksInCycle}
                </p>
                <p className="mt-1 text-formula-mist">Next cycle: {facilityConfig.nextCycleStartDisplay}</p>
              </div>
              <ul className="list-inside list-disc space-y-1 text-formula-mist">
                {scheduleRulesSummary.slice(0, 4).map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>

            <div className="border-b border-formula-frost/12">
              <TabSwitcher
                variant="underline"
                tabs={[
                  { id: 'calendar', label: 'Full calendar' },
                  { id: 'grid', label: 'Program grid' },
                  { id: 'weekly', label: 'Weekly roster', count: weeklyBlockCount },
                  { id: 'publish', label: 'Publish & overrides' },
                ]}
                activeTab={activeTab}
                onChange={id => setActiveTab(id as 'calendar' | 'grid' | 'weekly' | 'publish')}
              />
            </div>

            {activeTab === 'calendar' && week && (
              <div className="space-y-2">
                {calendarError ? (
                  <p className="font-mono text-xs text-amber-200/90">{calendarError}</p>
                ) : null}
                <FacilityWeekCalendar
                  weekStart={week.weekStart}
                  blocks={calendarBlocks}
                  week={week}
                  onProgramSlotClick={s => {
                    setFeedDetailBlock(null)
                    setDetailSlot(s)
                  }}
                  onFeedBlockClick={b => {
                    setDetailSlot(null)
                    setFeedDetailBlock(b)
                  }}
                  onEmptySlotClick={appendOverrideFromCalendar}
                />
              </div>
            )}

            {activeTab === 'publish' && (
              <FacilityScheduleEditor
                config={facilityConfig}
                onChange={setFacilityConfig}
                weekStart={week.weekStart}
                baseDate={baseDate}
              />
            )}

            <div className="flex flex-col gap-3 border border-formula-frost/12 bg-formula-paper/[0.04] p-4 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => shiftWeek(-1)}
                  className="flex h-8 w-8 items-center justify-center border border-formula-frost/16 bg-formula-paper/[0.06] text-formula-frost/90 transition-colors hover:border-formula-volt/35 hover:text-formula-paper"
                  aria-label="Previous week"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => shiftWeek(1)}
                  className="flex h-8 w-8 items-center justify-center border border-formula-frost/16 bg-formula-paper/[0.06] text-formula-frost/90 transition-colors hover:border-formula-volt/35 hover:text-formula-paper"
                  aria-label="Next week"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="ml-1 font-mono text-xs text-formula-paper">
                  <span className="font-bold">SUN</span> {week.weekStart}
                  <span className="mx-1 text-formula-mist">→</span>
                  <span className="font-bold">SAT</span> {week.weekEnd}
                </div>
              </div>
              <button
                type="button"
                onClick={goToday}
                className="self-start text-left font-mono text-[10px] font-bold uppercase tracking-wider text-formula-volt hover:underline sm:self-auto"
              >
                Jump to today
              </button>
            </div>

            {activeTab === 'grid' && (
              <>
                <div className="flex flex-wrap gap-1 border border-formula-frost/12 bg-formula-deep/30 p-2">
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
                            ? 'border-formula-volt/50 bg-formula-volt text-formula-base'
                            : 'border-formula-frost/14 bg-formula-paper/[0.05] text-formula-frost/85 hover:border-formula-volt/30',
                          isToday && dayIndex !== di && 'ring-1 ring-formula-volt/40',
                          facilityConfig.blockedDates.includes(iso) && 'opacity-60 ring-1 ring-red-500/40'
                        )}
                      >
                        {DAY_LABELS[di]}
                        <span className="mt-0.5 block text-[9px] font-normal opacity-80">{dayDate.getDate()}</span>
                      </button>
                    )
                  })}
                </div>

                <div className="flex items-start gap-2 border border-formula-volt/20 bg-formula-volt/[0.06] p-3 font-mono text-[10px] text-formula-frost/90">
                  <Radio className="mt-0.5 h-3.5 w-3.5 shrink-0 text-formula-volt" />
                  <p>
                    This grid matches the same published week families see in the parent portal. Open the{' '}
                    <strong className="text-formula-paper">Full calendar</strong> tab for assessments, rentals, parties, and
                    programs together. Use <strong className="text-formula-paper">Publish & overrides</strong> to edit what is
                    published site-wide.
                  </p>
                </div>

                <div className="overflow-x-auto pb-4">
                  <ControlScheduleGrid
                    week={week}
                    dayIndex={dayIndex}
                    adminSlotFill={adminSlotFill}
                    onSlotClick={s => {
                      setFeedDetailBlock(null)
                      setDetailSlot(s)
                    }}
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

            <AdminCalendarFeedModal
              open={feedDetailBlock != null}
              onClose={() => setFeedDetailBlock(null)}
              weekStart={week.weekStart}
              block={feedDetailBlock}
              onOpenPublishTab={() => {
                setFeedDetailBlock(null)
                setActiveTab('publish')
              }}
            />
          </>
        )}
      </div>
    </PageContainer>
  )
}
