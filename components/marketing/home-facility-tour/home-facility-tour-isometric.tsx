'use client'

import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  facilityTourViewportTransform,
  zoneFocusOriginPercents,
  zoneFocusScaleMultiplier,
} from '@/lib/marketing/facility-tour-map-geometry'
import { FACILITY_ZONES_BY_ID, type PublicFacilityZoneId } from '@/lib/marketing/facility-zones'

/** Full pitch markings (green fields). */
function TourFieldPitch() {
  return (
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#5f6f2f,#3e4b1f)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.05),transparent_40%)] opacity-30" />
      <div className="absolute inset-[6%] border border-white/70" />
      <div className="absolute bottom-[6%] left-1/2 top-[6%] w-px -translate-x-1/2 bg-white/60" />
      <div className="absolute left-1/2 top-1/2 h-[18%] w-[18%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60" />
    </div>
  )
}

/** Outdoor turf (Field 3): small pad above the speed column, outside the main slab line. */
function TourOutdoorPitch() {
  return (
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#6a7d38,#4a5a24)]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-[5%] border border-dashed border-white/55" />
      <div className="absolute inset-x-[5%] top-1/3 h-px bg-white/45" />
      <div className="absolute inset-x-[5%] top-2/3 h-px bg-white/45" />
      <div className="absolute bottom-[5%] left-1/2 top-[5%] w-px -translate-x-1/2 bg-white/35" />
    </div>
  )
}

/**
 * Isometric facility plate (1240×930 logical space, scaled for viewport).
 * Decoration aligns with `FACILITY_ZONES` tour percentages (same as hotspots).
 * `activeZoneId` drives transform-origin + scale so the map eases toward the selected zone.
 */
export function FacilityTourStaticFloor({
  hotspots,
  activeZoneId,
}: {
  hotspots: ReactNode
  activeZoneId: PublicFacilityZoneId
}) {
  const [viewportW, setViewportW] = useState(1024)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const onResize = () => setViewportW(window.innerWidth)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const zone = FACILITY_ZONES_BY_ID[activeZoneId]
  const { ox, oy } = useMemo(() => zoneFocusOriginPercents(zone.tour), [zone.tour])

  const tf = useMemo(() => facilityTourViewportTransform(viewportW), [viewportW])
  const zoomMul = reduceMotion ? 1 : zoneFocusScaleMultiplier(activeZoneId)
  const scale = tf.baseScale * zoomMul

  const transform = `perspective(${tf.perspective}px) rotateX(${tf.rotateX}deg) rotateZ(${tf.rotateZ}deg) scale(${scale})`
  const origin = reduceMotion ? '50% 18%' : `${ox}% ${oy}%`
  const transition = reduceMotion
    ? undefined
    : 'transform 0.62s cubic-bezier(0.22, 1, 0.36, 1), transform-origin 0.52s cubic-bezier(0.22, 1, 0.36, 1)'

  return (
    <div className="relative mx-auto w-full px-2 pb-2.5 pt-1 md:px-3 md:pb-3.5 md:pt-1.5">
      <div className="relative w-full overflow-hidden max-md:h-[min(44vh,352px)] sm:max-md:h-[min(48vh,388px)] md:h-[min(48vh,424px)] lg:h-[min(52vh,488px)] xl:h-[min(54vh,520px)]">
        <div className="relative flex h-full min-h-0 w-full items-start justify-center overflow-x-auto overflow-y-hidden">
          <div
            className="relative h-[930px] w-[1240px] max-w-none shrink-0 will-change-transform"
            style={{
              transform,
              transformOrigin: origin,
              transition,
            }}
          >
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div className="absolute inset-x-[2%] top-[2%] h-[6%] rounded-t-md bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-formula-frost)_8%,transparent),transparent_92%)]" />

              {/* Slab: darker toward bottom so less flat grey shows under entrance / flex / Footbot row */}
              <div className="absolute inset-x-[2%] top-[9%] bottom-[2%] bg-[linear-gradient(180deg,var(--color-formula-base)_0%,color-mix(in_srgb,var(--color-formula-deep)_38%,var(--color-formula-base))_52%,color-mix(in_srgb,var(--color-formula-deep)_72%,var(--color-formula-base))_100%)] shadow-2xl" />
              <div className="absolute inset-x-[2%] top-[9%] bottom-[2%] border-[6px] border-formula-frost/22 border-t-formula-frost/14" />
              <div className="pointer-events-none absolute inset-x-[2%] top-[68%] bottom-[2%] bg-gradient-to-b from-transparent via-formula-deep/25 to-formula-deep/55" />

              {/* Field 3: outdoor, above Double Speed column (outside top edge) */}
              <div className="absolute left-[2.5%] top-[0.5%] z-[2] h-[8%] w-[9%] rounded-sm border border-white/35 bg-[#5a6d2e]/95 shadow-[0_6px_18px_rgba(0,0,0,0.12)] ring-1 ring-sky-100/12">
                <TourOutdoorPitch />
              </div>

              {/* Double Speed Court */}
              <div className="absolute left-[2.5%] top-[10%] grid h-[21%] w-[9%] grid-rows-2 gap-[2%]">
                <div className="relative border border-white/20 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
                  <TourFieldPitch />
                </div>
                <div className="relative border border-white/20 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
                  <TourFieldPitch />
                </div>
              </div>

              {/* Speed Track */}
              <div className="absolute left-[2.5%] top-[32%] h-[26%] w-[9%] bg-[#c92b2b] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]" />

              {/* Field 1 */}
              <div className="absolute left-[12.5%] top-[10%] h-[48%] w-[30%] border border-white/20 shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
                <TourFieldPitch />
              </div>

              {/* Entrance / front desk — warmer slab, less flat grey */}
              <div className="absolute left-[12.5%] top-[59%] h-[11%] w-[30%] border border-white/18 bg-[linear-gradient(180deg,#aeb5a8,#7d8478)] shadow-[0_6px_16px_rgba(0,0,0,0.12)]">
                <div className="absolute left-[6%] top-[18%] h-[52%] w-[22%] rounded-sm border border-white/35 bg-white/28" />
                <div className="absolute right-[8%] top-[14%] h-[58%] w-[48%] border border-zinc-700/30 bg-zinc-800/25" />
                <div className="absolute bottom-[10%] left-1/2 h-px w-[62%] -translate-x-1/2 bg-zinc-700/30" />
              </div>

              {/* Performance Center: tall strip between Field 1 and Field 2 */}
              <div className="absolute left-[43.5%] top-[10%] h-[48%] w-[13%] border border-white/20 shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
                <TourFieldPitch />
                <div className="absolute bottom-0 left-0 top-0 w-[8%] bg-black/18" />
                <div className="absolute inset-y-0 left-[12%] w-px bg-black/30" />
              </div>

              {/* Support / gym / flex — muted sage, not bright grey */}
              <div className="absolute left-[43.5%] top-[59%] h-[11%] w-[13%] border border-white/14 bg-[linear-gradient(180deg,#9aa396,#6f756b)] shadow-[0_8px_20px_rgba(0,0,0,0.1)]">
                <div className="absolute left-[10%] top-[18%] h-[28%] w-[22%] bg-[#4a5048]/90" />
                <div className="absolute left-[10%] top-[52%] h-[28%] w-[22%] bg-[#4a5048]/90" />
                <div className="absolute right-[8%] top-[14%] h-[72%] w-[34%] bg-[#5c6258]/95" />
              </div>

              {/* Field 2, same size as Field 1 (not full-height to bottom) */}
              <div className="absolute left-[57.5%] top-[10%] h-[48%] w-[30%] border border-white/20 shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
                <TourFieldPitch />
              </div>

              {/* Footbot: turf block + rig */}
              <div className="absolute left-[57.5%] top-[59%] z-[1] h-[11%] w-[30%] border border-white/25 shadow-[0_8px_18px_rgba(0,0,0,0.12)]">
                <div className="absolute inset-0 overflow-hidden rounded-[2px]">
                  <TourFieldPitch />
                  <div className="absolute inset-[5%] border border-white/40" />
                </div>
                <div className="absolute left-1/2 top-1/2 h-[58%] w-[22%] -translate-x-1/2 -translate-y-1/2 bg-[#141414] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]">
                  <div className="absolute left-[12%] top-[14%] h-[22%] w-[22%] rounded-sm bg-formula-volt/42" />
                  <div className="absolute right-[12%] top-[14%] h-[22%] w-[22%] rounded-sm bg-formula-volt/28" />
                </div>
              </div>
            </div>

            <div className="absolute inset-0 z-20">{hotspots}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
