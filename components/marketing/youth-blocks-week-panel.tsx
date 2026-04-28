'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DAY_LABELS } from '@/components/schedule/control-schedule-grid'
import { PackageGateModal } from '@/components/marketing/package-gate-modal'
import { readHasYouthTrainingPackage } from '@/lib/booking/package-gate'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { cn } from '@/lib/utils'
import type { ScheduleAgeBand } from '@/types/schedule'

const LA = 'America/Los_Angeles'

type SerializedSlot = {
  id: string
  youthBlockId: string
  dayIndex: number
  weekStart: string
  startMinute: number
  endMinute: number
  ageBand: ScheduleAgeBand
  label: string
  capacity: number
  enrolled: number
}

const BAND_TABS: { band: ScheduleAgeBand; label: string; hint: string }[] = [
  {
    band: '2-3',
    label: '2–3',
    hint: 'Formula Minis · weekday $300 pack · Sunday weekend ages 2–5 ($500) — see Minis page',
  },
  {
    band: '4-5',
    label: '4–5',
    hint: 'Formula Juniors · Sunday weekend $500 (ages 4–5) — weekday block TBA · see Minis page',
  },
  { band: '6-8', label: '6–8', hint: 'U8 roster ages' },
  { band: '9-11', label: '9–11', hint: 'U10–U11' },
  { band: '12-14', label: '12–14', hint: 'U12–U14' },
  { band: '15-19', label: '15–19', hint: 'U16–U18' },
]

function formatEndMinute(minute: number) {
  const h = Math.floor(minute / 60)
  const mm = minute % 60
  const am = h >= 12 ? 'PM' : 'AM'
  const hr = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hr}:${mm.toString().padStart(2, '0')} ${am}`
}

function formatBlockWhen(weekStart: string, dayIndex: number, startMinute: number): string {
  const sun = new Date(`${weekStart}T12:00:00`)
  const d = new Date(sun)
  d.setDate(sun.getDate() + dayIndex)
  const h = Math.floor(startMinute / 60)
  const m = startMinute % 60
  d.setHours(h, m, 0, 0)
  return d.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: LA,
  })
}

function addDaysToWeekStart(weekStart: string, deltaWeeks: number): string {
  const sun = new Date(`${weekStart}T12:00:00`)
  sun.setDate(sun.getDate() + deltaWeeks * 7)
  const y = sun.getFullYear()
  const mo = String(sun.getMonth() + 1).padStart(2, '0')
  const da = String(sun.getDate()).padStart(2, '0')
  return `${y}-${mo}-${da}`
}

export function YouthBlocksWeekPanel() {
  const router = useRouter()
  const [weekStart, setWeekStart] = useState<string | null>(null)
  const [band, setBand] = useState<ScheduleAgeBand>('12-14')
  const [rows, setRows] = useState<SerializedSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [hasPackage, setHasPackage] = useState(false)
  const [gateOpen, setGateOpen] = useState(false)
  const [gateBand, setGateBand] = useState<{ label: string; hint: string } | null>(null)
  const [publishedCycle, setPublishedCycle] = useState<{
    currentCycleLabel: string
    weekInCycle: number
    totalWeeksInCycle: number
    nextCycleStartDisplay: string
  } | null>(null)

  useEffect(() => {
    setHasPackage(readHasYouthTrainingPackage())
  }, [])

  const load = useCallback(async (ws: string | null) => {
    setLoading(true)
    setErr(null)
    try {
      const q = ws ? `?weekStart=${encodeURIComponent(ws)}` : ''
      const res = await fetch(`/api/schedule/published-blocks${q}`)
      const data = (await res.json()) as {
        weekStart?: string
        bands?: Record<string, SerializedSlot[]>
        cycle?: {
          currentCycleLabel: string
          weekInCycle: number
          totalWeeksInCycle: number
          nextCycleStartDisplay: string
        }
        error?: string
      }
      if (!res.ok) throw new Error(data.error ?? 'Failed to load')
      if (data.weekStart) {
        setWeekStart(data.weekStart)
      }
      setPublishedCycle(data.cycle ?? null)
      const list = data.bands?.[band] ?? []
      setRows(list)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Failed to load')
      setRows([])
      setPublishedCycle(null)
    } finally {
      setLoading(false)
    }
  }, [band])

  useEffect(() => {
    void load(weekStart)
  }, [load, weekStart])

  const tabMeta = useMemo(() => BAND_TABS.find((t) => t.band === band) ?? BAND_TABS[0]!, [band])

  const onBlockClick = () => {
    if (hasPackage) {
      router.push('/parent/bookings')
      return
    }
    setGateBand({ label: tabMeta.label, hint: tabMeta.hint })
    setGateOpen(true)
  }

  return (
    <section id="youth-training-blocks" className="space-y-6 scroll-mt-28" aria-labelledby="youth-blocks-heading">
      <div className="rounded-sm border border-formula-frost/14 bg-formula-paper/[0.03] p-5 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_.04)]">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h3 id="youth-blocks-heading" className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">
            Youth training blocks
          </h3>
          {weekStart ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWeekStart((w) => (w ? addDaysToWeekStart(w, -1) : w))}
                className="border border-formula-frost/20 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-formula-paper hover:border-formula-volt/35"
              >
                ← Week
              </button>
              <span className="font-mono text-[10px] text-formula-frost/70">Week of {weekStart}</span>
              <button
                type="button"
                onClick={() => setWeekStart((w) => (w ? addDaysToWeekStart(w, 1) : w))}
                className="border border-formula-frost/20 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-formula-paper hover:border-formula-volt/35"
              >
                Week →
              </button>
            </div>
          ) : null}
        </div>

        {publishedCycle ? (
          <p className="mt-3 font-mono text-[10px] text-formula-frost/75">
            <span className="text-formula-mist">12-week cycle · </span>
            {publishedCycle.currentCycleLabel} · week {publishedCycle.weekInCycle}/{publishedCycle.totalWeeksInCycle}
            <span className="text-formula-mist"> · next </span>
            {publishedCycle.nextCycleStartDisplay}
          </p>
        ) : null}

        <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-formula-frost/80">
          Blocks reflect the published Performance Center ladder for each band. Selecting a block without a package opens age confirmation, then sends you to
          packages. With a package on file (confirm below after purchase), use the parent portal to finalize holds.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {BAND_TABS.map((t) => (
            <button
              key={t.band}
              type="button"
              onClick={() => setBand(t.band)}
              className={cn(
                'border px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors',
                band === t.band
                  ? 'border-formula-volt/45 bg-formula-volt/12 text-formula-paper'
                  : 'border-formula-frost/14 text-formula-frost/80 hover:border-formula-frost/28 hover:text-formula-paper'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {!hasPackage ? (
          <p className="mt-4 rounded-sm border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-xs text-formula-frost/90">
            Package not marked on this device — block picks open the confirmation flow. After you buy a package, use &quot;I purchased a package&quot; on the{' '}
            <Link href={MARKETING_HREF.minis} className="font-semibold text-formula-volt underline underline-offset-2 hover:underline">
              Minis page
            </Link>{' '}
            for published Formula Minis / Sunday pricing, or the{' '}
            <Link href={MARKETING_HREF.youthMembership} className="font-semibold text-formula-volt underline underline-offset-2 hover:underline">
              programs page
            </Link>{' '}
            for older-youth session packages — then use &quot;I purchased a package&quot; to unlock portal-first booking.
          </p>
        ) : (
          <p className="mt-4 rounded-sm border border-formula-volt/25 bg-formula-volt/10 px-3 py-2 text-xs text-formula-paper">
            Package flag set — book blocks in the{' '}
            <Link href="/parent/bookings" className="font-semibold text-formula-volt underline-offset-2 hover:underline">
              parent portal schedule
            </Link>
            .
          </p>
        )}

        {loading ? (
          <p className="mt-4 font-mono text-[10px] text-formula-frost/50">Loading published blocks…</p>
        ) : err ? (
          <p className="mt-4 text-sm text-amber-200/90">{err}</p>
        ) : rows.length === 0 ? (
          <p className="mt-4 text-sm text-formula-frost/70">No generated blocks for this band this week.</p>
        ) : (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {rows.map((slot) => (
              <li key={slot.id}>
                <button
                  type="button"
                  onClick={onBlockClick}
                  className="w-full border border-formula-frost/14 bg-formula-deep/50 p-4 text-left text-formula-paper transition-colors hover:border-formula-volt/30 hover:bg-formula-paper/[0.04]"
                >
                  <p className="font-semibold text-formula-paper">{slot.label}</p>
                  <p className="mt-1 text-xs text-formula-frost/80">
                    {DAY_LABELS[slot.dayIndex] ?? 'Day'}{' '}
                    {formatBlockWhen(slot.weekStart, slot.dayIndex, slot.startMinute)} · ends {formatEndMinute(slot.endMinute)}
                  </p>
                  <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-formula-volt/80">
                    Band {slot.ageBand} · {slot.enrolled}/{slot.capacity} roster spots filled
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {gateOpen && gateBand ? (
        <PackageGateModal
          open
          onClose={() => {
            setGateOpen(false)
            setGateBand(null)
          }}
          bandLabel={gateBand.label}
          rosterAgeHint={gateBand.hint}
          scheduleAgeBand={band}
        />
      ) : null}
    </section>
  )
}
