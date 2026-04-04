'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, Pause, Play } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { FACILITY_TOUR_LAYOUT } from '@/lib/marketing/facility-tour-layout'
import { FACILITY_ZONES, type PublicFacilityZoneId } from '@/lib/marketing/facility-zones'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { SITE } from '@/lib/site-config'
import { cn } from '@/lib/utils'
import { FacilityTourStaticFloor } from '@/components/marketing/home-facility-tour/home-facility-tour-isometric'
import { facilityZoneEyebrow } from '@/components/marketing/home-facility-tour/zone-eyebrow'

type TourStop = {
  id: PublicFacilityZoneId
  name: string
  label: string
  eyebrow: string
  description: string
  delay: number
  left: string
  top: string
  width: string
  height: string
  /** Second line under caps label (e.g. Application layer) */
  subCaption?: string
}

function tourPct(value: string) {
  return Number.parseFloat(value.replace('%', '')) || 0
}

function tourArea(stop: TourStop) {
  return tourPct(stop.width) * tourPct(stop.height)
}

/** Large zones first, small zones last so overlapping rects prefer the more specific hit target. */
function sortStopsForHitOrder(stops: TourStop[]) {
  return [...stops].sort((a, b) => tourArea(b) - tourArea(a))
}

function buildTourStops(): TourStop[] {
  return FACILITY_TOUR_LAYOUT.map((entry, i) => {
    const zone = FACILITY_ZONES.find(z => z.id === entry.id)
    if (!zone) {
      throw new Error(`Missing FACILITY_ZONES entry for tour layout: ${entry.id}`)
    }
    return {
      id: entry.id,
      name: entry.short,
      label: entry.label,
      eyebrow: facilityZoneEyebrow(zone),
      description: zone.copy,
      delay: i,
      left: entry.left,
      top: entry.top,
      width: entry.width,
      height: entry.height,
      subCaption: zone.sub,
    }
  })
}

function TourHotspot({
  stop,
  active,
  onClick,
}: {
  stop: TourStop
  active: boolean
  onClick: (id: PublicFacilityZoneId) => void
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: stop.delay * 0.06 }}
      onClick={() => onClick(stop.id)}
      aria-label={`${stop.name}: ${stop.label}`}
      aria-pressed={active}
      className={cn(
        'absolute z-40 cursor-pointer border text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-formula-volt/60',
        active
          ? 'border-white/40 bg-white/[0.05]'
          : 'border-transparent hover:border-white/30 hover:bg-white/[0.04]'
      )}
      style={{ left: stop.left, top: stop.top, width: stop.width, height: stop.height }}
    >
      <span
        className={cn(
          'pointer-events-none absolute inset-x-0 top-2 text-center font-mono text-[9px] uppercase leading-tight tracking-[0.26em] sm:text-[10px] sm:tracking-[0.3em]',
          stop.id === 'footbot' && 'text-white/92',
          stop.id === 'support-cluster' && 'text-zinc-800/90',
          stop.id !== 'footbot' && stop.id !== 'support-cluster' && 'text-white/88'
        )}
      >
        {stop.label}
      </span>
      {stop.subCaption ? (
        <span
          className={cn(
            'pointer-events-none absolute inset-x-0 top-7 text-center font-mono text-[8px] uppercase tracking-[0.24em] sm:top-8 sm:text-[9px] sm:tracking-[0.26em]',
            stop.id === 'support-cluster' ? 'text-zinc-700/85' : 'text-white/50'
          )}
        >
          {stop.subCaption}
        </span>
      ) : null}
    </motion.button>
  )
}

function TourDot({
  stop,
  active,
  onClick,
}: {
  stop: TourStop
  active: boolean
  onClick: (id: PublicFacilityZoneId) => void
}) {
  return (
    <button type="button" onClick={() => onClick(stop.id)} className="group flex items-center gap-3 text-left">
      <span
        className={cn(
          'relative flex h-3.5 w-3.5 items-center justify-center rounded-full border transition-all duration-300',
          active ? 'border-white bg-white' : 'border-white/40 bg-transparent'
        )}
      >
        {active ? <span className="h-1.5 w-1.5 rounded-full bg-black" /> : null}
      </span>
      <span
        className={cn(
          'text-sm transition-colors duration-300',
          active ? 'text-white' : 'text-white/60 group-hover:text-white/85'
        )}
      >
        {stop.name}
      </span>
    </button>
  )
}

export function HomeFacilityTour() {
  const tourStops = useMemo(() => buildTourStops(), [])
  const hotspotsOrdered = useMemo(() => sortStopsForHitOrder(tourStops), [tourStops])
  const [activeId, setActiveId] = useState<PublicFacilityZoneId>('field-1')
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return
    const interval = setInterval(() => {
      setActiveId(current => {
        const index = tourStops.findIndex(s => s.id === current)
        return tourStops[(index + 1) % tourStops.length]!.id
      })
    }, 3200)
    return () => clearInterval(interval)
  }, [autoPlay, tourStops])

  const active = useMemo(() => tourStops.find(s => s.id === activeId) ?? tourStops[0]!, [activeId, tourStops])

  return (
    <section
      className="relative overflow-hidden bg-[linear-gradient(180deg,var(--color-formula-deep)_0%,var(--color-formula-base)_38%,#1a1d1c_100%)] text-formula-paper"
      aria-label="Interactive facility tour"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,color-mix(in_srgb,var(--color-formula-frost)_14%,transparent),transparent_32%),radial-gradient(circle_at_78%_12%,color-mix(in_srgb,var(--color-formula-volt)_8%,transparent),transparent_26%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--color-formula-frost)_10%)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--color-formula-frost)_10%)_1px,transparent_1px)] bg-[length:44px_44px] opacity-[0.22]" />
      <div className="absolute inset-x-0 bottom-0 h-[30vh] bg-gradient-to-t from-formula-deep/50 to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1680px] flex-col gap-8 px-5 pb-12 pt-10 md:gap-10 md:px-8 md:pb-14 md:pt-12 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-[480px] shrink-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-formula-mist">{SITE.facilityName}</p>
            <h2 className="mt-3 max-w-[16ch] text-[clamp(2.2rem,5vw,3.75rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-formula-paper">
              Tour the facility before you step inside.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-formula-frost/80">
              This isometric view follows the floor plan layout; zone copy matches the interactive map on the{' '}
              <Link href={MARKETING_HREF.facility} className="font-medium text-formula-volt/90 underline-offset-4 hover:underline">
                Facility
              </Link>{' '}
              page.
            </p>
          </div>

          <div className="flex shrink-0 rounded-full border border-formula-frost/15 bg-formula-paper/[0.06] p-1 shadow-[0_12px_35px_rgba(0,0,0,0.25)] backdrop-blur-md sm:mt-1">
            <button
              type="button"
              onClick={() => setAutoPlay(v => !v)}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-formula-frost/90 transition hover:bg-formula-paper/[0.08]"
            >
              {autoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {autoPlay ? 'Pause tour' : 'Play tour'}
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="relative isolate mx-auto w-full max-w-[1600px] overflow-x-auto overflow-y-visible rounded-[1.35rem] border border-formula-frost/12 bg-formula-deep/65 shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
        >
          <p className="sr-only">
            Click a zone on the map or choose a stop below. The selected area is highlighted on the floor plan.
          </p>
          <FacilityTourStaticFloor
            hotspots={
              <>
                {hotspotsOrdered.map(stop => (
                  <TourHotspot key={stop.id} stop={stop} active={stop.id === activeId} onClick={setActiveId} />
                ))}
              </>
            }
          />
        </motion.div>

        <div className="relative z-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div className="flex max-h-[200px] flex-wrap content-start items-center gap-x-6 gap-y-3 overflow-y-auto rounded-[1.4rem] border border-white/12 bg-black/38 px-5 py-4 backdrop-blur-md md:max-h-none md:overflow-visible">
            {tourStops.map(stop => (
              <TourDot
                key={stop.id}
                stop={stop}
                active={stop.id === activeId}
                onClick={id => {
                  setAutoPlay(false)
                  setActiveId(id)
                }}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="rounded-[1.6rem] border border-white/12 bg-black/48 p-5 shadow-[0_30px_70px_rgba(0,0,0,0.28)] backdrop-blur-md"
            >
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">{active.eyebrow}</p>
              <h3 className="mt-2 text-[clamp(1.5rem,2.4vw,2.4rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-white">
                {active.name}
              </h3>
              <p className="mt-3 max-w-[38ch] text-sm leading-6 text-white/72">{active.description}</p>
              <Link
                href={MARKETING_HREF.facility}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/8 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/14"
              >
                Open facility map
                <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
