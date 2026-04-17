'use client'

import * as React from 'react'
import { isoDateForWeekDay, startOfScheduleWeek } from '@/lib/schedule/generator'
import { PROGRAM_UI } from '@/lib/schedule/rules'
import { SCHEDULE_ASSETS } from '@/lib/schedule/assets'
import type { DayIndex, ScheduleOverride, ScheduleProgramKind } from '@/types/schedule'
import type { FacilitySchedulePublishedConfig } from '@/lib/schedule/facility-schedule-config'
import { DAY_LABELS } from '@/components/schedule/control-schedule-grid'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const PROGRAM_KINDS = Object.keys(PROGRAM_UI) as ScheduleProgramKind[]

function toggleBlockedDate(config: FacilitySchedulePublishedConfig, iso: string): FacilitySchedulePublishedConfig {
  const set = new Set(config.blockedDates)
  if (set.has(iso)) set.delete(iso)
  else set.add(iso)
  return { ...config, blockedDates: [...set].sort() }
}

function removeOverride(config: FacilitySchedulePublishedConfig, id: string): FacilitySchedulePublishedConfig {
  return { ...config, overrides: config.overrides.filter(o => o.id !== id) }
}

function addOverrideRow(config: FacilitySchedulePublishedConfig, weekStart: string): FacilitySchedulePublishedConfig {
  const id = `ov-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  const row: ScheduleOverride = {
    id,
    date: weekStart,
    assetId: 'performance-center',
    startMinute: 16 * 60,
    endMinute: 17 * 60,
    kind: 'flex_ops',
    label: 'Staff hold',
    mode: 'replace',
  }
  return { ...config, overrides: [...config.overrides, row] }
}

function patchOverride(
  config: FacilitySchedulePublishedConfig,
  id: string,
  patch: Partial<ScheduleOverride>
): FacilitySchedulePublishedConfig {
  return {
    ...config,
    overrides: config.overrides.map(o => (o.id === id ? { ...o, ...patch } : o)),
  }
}

export interface FacilityScheduleEditorProps {
  config: FacilitySchedulePublishedConfig
  onChange: (next: FacilitySchedulePublishedConfig) => void
  /** Sunday ISO for the week being edited (blackout toggles + default new override date) */
  weekStart: string
  baseDate: Date
}

export function FacilityScheduleEditor({ config, onChange, weekStart, baseDate }: FacilityScheduleEditorProps) {
  const sun = React.useMemo(() => startOfScheduleWeek(baseDate), [baseDate])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 border border-formula-frost/12 bg-formula-paper/[0.04] p-4 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)] lg:grid-cols-2">
        <div className="space-y-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-formula-mist">12-week cycle (published)</p>
          <label className="block font-mono text-[10px] text-formula-mist">
            Cycle label
            <input
              className="mt-1 w-full border border-formula-frost/14 bg-formula-deep/30 px-2 py-1.5 text-sm text-formula-paper"
              value={config.currentCycleLabel}
              onChange={e => onChange({ ...config, currentCycleLabel: e.target.value })}
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="block font-mono text-[10px] text-formula-mist">
              Week in cycle (1–12)
              <input
                type="number"
                min={1}
                max={12}
                className="mt-1 w-full border border-formula-frost/14 bg-formula-deep/30 px-2 py-1.5 text-sm text-formula-paper"
                value={config.weekInCycle}
                onChange={e => onChange({ ...config, weekInCycle: Math.min(12, Math.max(1, parseInt(e.target.value, 10) || 1)) })}
              />
            </label>
            <label className="block font-mono text-[10px] text-formula-mist">
              Total weeks
              <input
                type="number"
                min={1}
                max={52}
                className="mt-1 w-full border border-formula-frost/14 bg-formula-deep/30 px-2 py-1.5 text-sm text-formula-paper"
                value={config.totalWeeksInCycle}
                onChange={e =>
                  onChange({ ...config, totalWeeksInCycle: Math.min(52, Math.max(1, parseInt(e.target.value, 10) || 12)) })
                }
              />
            </label>
          </div>
          <label className="block font-mono text-[10px] text-formula-mist">
            Next cycle starts (display)
            <input
              className="mt-1 w-full border border-formula-frost/14 bg-formula-deep/30 px-2 py-1.5 text-sm text-formula-paper"
              value={config.nextCycleStartDisplay}
              onChange={e => onChange({ ...config, nextCycleStartDisplay: e.target.value })}
            />
          </label>
        </div>
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-formula-mist">Facility blackout days</p>
          <p className="mt-1 font-mono text-[10px] text-formula-frost/80">
            Toggle dates in the visible week. Blackouts remove all programs for that calendar day everywhere the
            published schedule is shown.
          </p>
          <div className="mt-3 flex flex-wrap gap-1">
            {([0, 1, 2, 3, 4, 5, 6] as const).map(di => {
              const d = di as DayIndex
              const iso = isoDateForWeekDay(weekStart, d)
              const blocked = config.blockedDates.includes(iso)
              const dayDate = new Date(sun)
              dayDate.setDate(sun.getDate() + d)
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => onChange(toggleBlockedDate(config, iso))}
                  className={cn(
                    'min-w-[4.5rem] border px-2 py-2 text-left font-mono text-[9px] font-bold uppercase transition-colors',
                    blocked
                      ? 'border-red-500/50 bg-red-950/40 text-red-200'
                      : 'border-formula-frost/14 bg-formula-paper/[0.05] text-formula-frost/85 hover:border-formula-volt/30'
                  )}
                >
                  {DAY_LABELS[d]}
                  <span className="mt-0.5 block text-[8px] font-normal opacity-90">{dayDate.getDate()}</span>
                  <span className="mt-1 block text-[7px] font-bold">{blocked ? 'Closed' : 'Open'}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="border border-formula-frost/12 bg-formula-paper/[0.04] p-4 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-formula-mist">Slot overrides</p>
            <p className="mt-1 max-w-xl font-mono text-[10px] text-formula-frost/80">
              Replace or clear generated windows on a specific date + asset. Use <strong className="text-formula-paper">clear</strong>{' '}
              to punch a hole without inserting a replacement block. Youth bookings keep working when{' '}
              <code className="text-formula-volt">youthBlockId</code> matches existing anchors.
            </p>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={() => onChange(addOverrideRow(config, weekStart))}>
            Add override
          </Button>
        </div>

        {config.overrides.length === 0 ? (
          <p className="mt-4 font-mono text-[11px] text-formula-mist">No overrides — generator defaults only.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {config.overrides.map(o => (
              <li
                key={o.id}
                className="grid grid-cols-1 gap-2 border border-formula-frost/10 bg-formula-deep/25 p-3 font-mono text-[11px] md:grid-cols-[1fr_1fr_1fr_auto]"
              >
                <label className="text-formula-mist">
                  Date (YYYY-MM-DD)
                  <input
                    className="mt-0.5 w-full border border-formula-frost/14 bg-formula-base/40 px-1.5 py-1 text-formula-paper"
                    value={o.date}
                    onChange={e => onChange(patchOverride(config, o.id, { date: e.target.value }))}
                  />
                </label>
                <label className="text-formula-mist">
                  Asset
                  <select
                    className="mt-0.5 w-full border border-formula-frost/14 bg-formula-base/40 px-1 py-1 text-formula-paper"
                    value={o.assetId}
                    onChange={e => onChange(patchOverride(config, o.id, { assetId: e.target.value }))}
                  >
                    {SCHEDULE_ASSETS.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-formula-mist">
                  Mode
                  <select
                    className="mt-0.5 w-full border border-formula-frost/14 bg-formula-base/40 px-1 py-1 text-formula-paper"
                    value={o.mode}
                    onChange={e =>
                      onChange(patchOverride(config, o.id, { mode: e.target.value === 'clear' ? 'clear' : 'replace' }))
                    }
                  >
                    <option value="replace">Replace window</option>
                    <option value="clear">Clear only</option>
                  </select>
                </label>
                <div className="flex items-end justify-end">
                  <Button type="button" variant="ghost" size="sm" onClick={() => onChange(removeOverride(config, o.id))}>
                    Remove
                  </Button>
                </div>
                <label className="text-formula-mist md:col-span-1">
                  Start minute (0–1440)
                  <input
                    type="number"
                    className="mt-0.5 w-full border border-formula-frost/14 bg-formula-base/40 px-1.5 py-1 text-formula-paper"
                    value={o.startMinute}
                    onChange={e =>
                      onChange(patchOverride(config, o.id, { startMinute: parseInt(e.target.value, 10) || 0 }))
                    }
                  />
                </label>
                <label className="text-formula-mist md:col-span-1">
                  End minute
                  <input
                    type="number"
                    className="mt-0.5 w-full border border-formula-frost/14 bg-formula-base/40 px-1.5 py-1 text-formula-paper"
                    value={o.endMinute}
                    onChange={e => onChange(patchOverride(config, o.id, { endMinute: parseInt(e.target.value, 10) || 0 }))}
                  />
                </label>
                <label className="text-formula-mist md:col-span-1">
                  Program kind
                  <select
                    className="mt-0.5 w-full border border-formula-frost/14 bg-formula-base/40 px-1 py-1 text-formula-paper"
                    value={o.kind}
                    onChange={e =>
                      onChange(patchOverride(config, o.id, { kind: e.target.value as ScheduleProgramKind }))
                    }
                  >
                    {PROGRAM_KINDS.map(k => (
                      <option key={k} value={k}>
                        {PROGRAM_UI[k].key}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-formula-mist md:col-span-3">
                  Label
                  <input
                    className="mt-0.5 w-full border border-formula-frost/14 bg-formula-base/40 px-1.5 py-1 text-formula-paper"
                    value={o.label}
                    onChange={e => onChange(patchOverride(config, o.id, { label: e.target.value }))}
                  />
                </label>
                <label className="text-formula-mist md:col-span-2">
                  youthBlockId (optional, preserve bookings)
                  <input
                    className="mt-0.5 w-full border border-formula-frost/14 bg-formula-base/40 px-1.5 py-1 text-formula-paper"
                    value={o.youthBlockId ?? ''}
                    onChange={e =>
                      onChange(
                        patchOverride(config, o.id, {
                          youthBlockId: e.target.value.trim() || undefined,
                        })
                      )
                    }
                  />
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
