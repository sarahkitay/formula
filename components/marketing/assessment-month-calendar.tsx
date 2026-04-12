'use client'

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

const LA = 'America/Los_Angeles'

export type AssessmentCalendarSlot = {
  id: string
  starts_at: string
  available: number
  capacity: number
  booked_kids: number
  label: string | null
}

function dateKeyLa(iso: string): string {
  return new Date(iso).toLocaleDateString('en-CA', { timeZone: LA })
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

type Props = {
  slots: AssessmentCalendarSlot[]
  selectedId: string | null
  onSelectId: (id: string | null) => void
  formatWhen: (iso: string) => string
}

export function AssessmentMonthCalendar({ slots, selectedId, onSelectId, formatWhen }: Props) {
  const slotsByDay = useMemo(() => {
    const m = new Map<string, AssessmentCalendarSlot[]>()
    for (const s of slots) {
      const k = dateKeyLa(s.starts_at)
      const list = m.get(k) ?? []
      list.push(s)
      m.set(k, list)
    }
    for (const [, list] of m) {
      list.sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())
    }
    return m
  }, [slots])

  const todayKey = useMemo(() => new Date().toLocaleDateString('en-CA', { timeZone: LA }), [])

  const initial = useMemo(() => {
    const [y, mo] = todayKey.split('-').map(Number)
    return { y, m: mo }
  }, [todayKey])

  const [viewY, setViewY] = useState(initial.y)
  const [viewM, setViewM] = useState(initial.m)

  const { year, monthIndex, daysInMonth, startWeekdaySun0 } = useMemo(() => {
    const monthIndex = viewM - 1
    const daysInMonth = new Date(viewY, viewM, 0).getDate()
    const startWeekdaySun0 = new Date(viewY, monthIndex, 1).getDay()
    return { year: viewY, monthIndex, daysInMonth, startWeekdaySun0 }
  }, [viewY, viewM])

  const monthLabel = new Date(year, monthIndex, 1).toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: LA })

  const cells = useMemo(() => {
    const out: ({ key: string; inMonth: boolean; dayNum: number } | null)[] = []
    for (let i = 0; i < startWeekdaySun0; i++) out.push(null)
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${String(viewM).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      out.push({ key, inMonth: true, dayNum: d })
    }
    while (out.length % 7 !== 0) out.push(null)
    return out
  }, [year, viewM, daysInMonth, startWeekdaySun0])

  const [pickedDayKey, setPickedDayKey] = useState<string | null>(null)

  const shiftMonth = (delta: number) => {
    const d = new Date(viewY, viewM - 1 + delta, 1)
    setViewY(d.getFullYear())
    setViewM(d.getMonth() + 1)
    setPickedDayKey(null)
    onSelectId(null)
  }

  const daySlots = pickedDayKey ? (slotsByDay.get(pickedDayKey) ?? []) : []

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Skills Check calendar</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="border border-formula-frost/20 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-formula-paper hover:border-formula-volt/35"
            aria-label="Previous month"
          >
            ←
          </button>
          <span className="min-w-[10rem] text-center font-mono text-sm font-semibold text-formula-paper">{monthLabel}</span>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="border border-formula-frost/20 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-formula-paper hover:border-formula-volt/35"
            aria-label="Next month"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px border border-formula-frost/12 bg-formula-frost/12">
        {WEEKDAYS.map((w) => (
          <div key={w} className="bg-formula-deep px-1 py-2 text-center font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-formula-mist">
            {w}
          </div>
        ))}
        {cells.map((cell, i) => {
          if (!cell) {
            return <div key={`empty-${i}`} className="min-h-[4.25rem] bg-formula-deep/40" />
          }
          const list = slotsByDay.get(cell.key) ?? []
          const open = list.filter((s) => s.available > 0).length
          const isToday = cell.key === todayKey
          const picked = pickedDayKey === cell.key
          return (
            <button
              key={cell.key}
              type="button"
              onClick={() => {
                setPickedDayKey(cell.key)
                onSelectId(null)
              }}
              className={cn(
                'flex min-h-[4.25rem] flex-col border border-transparent bg-formula-deep/90 p-1.5 text-left transition-colors hover:bg-formula-paper/[0.04]',
                isToday && 'ring-1 ring-formula-volt/35',
                picked && 'border-formula-volt/40 bg-formula-volt/[0.06]'
              )}
            >
              <span className="font-mono text-[11px] font-semibold text-formula-paper">{cell.dayNum}</span>
              {list.length > 0 ? (
                <span className="mt-auto font-mono text-[8px] uppercase leading-tight tracking-[0.08em] text-formula-volt/90">
                  {open > 0 ? `${open} open` : 'Full'}
                </span>
              ) : (
                <span className="mt-auto font-mono text-[8px] text-formula-mist/60">—</span>
              )}
            </button>
          )
        })}
      </div>

      {pickedDayKey ? (
        <div className="rounded-sm border border-formula-frost/14 bg-formula-paper/[0.03] p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">
            {new Date(`${pickedDayKey}T12:00:00`).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              timeZone: LA,
            })}
          </p>
          {daySlots.length === 0 ? (
            <p className="mt-3 text-sm text-formula-frost/70">No published windows this day.</p>
          ) : (
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {daySlots.map((slot) => {
                const full = slot.available <= 0
                const active = selectedId === slot.id
                return (
                  <li key={slot.id}>
                    <button
                      type="button"
                      disabled={full}
                      onClick={() => !full && onSelectId(slot.id)}
                      className={cn(
                        'w-full border p-3 text-left transition-colors',
                        full
                          ? 'cursor-not-allowed border-formula-frost/8 bg-formula-paper/[0.02] opacity-50'
                          : active
                            ? 'border-formula-volt/45 bg-formula-volt/[0.08] ring-1 ring-formula-volt/25'
                            : 'border-formula-frost/14 bg-formula-deep/50 hover:border-formula-frost/24'
                      )}
                    >
                      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-formula-frost/55">
                        {slot.label ?? 'Formula Skills Check'}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-formula-paper">{formatWhen(slot.starts_at)}</p>
                      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-formula-volt/85">
                        {full ? 'Full' : `${slot.booked_kids}/${slot.capacity} booked · ${slot.available} open`}
                      </p>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      ) : (
        <p className="text-sm text-formula-frost/65">Select a date to see open Skills Check times.</p>
      )}
    </div>
  )
}
