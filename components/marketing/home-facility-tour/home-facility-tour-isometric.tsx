import type { ReactNode } from 'react'

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

/** Outdoor turf (Field 3): slightly brighter read vs indoor bays. */
function TourOutdoorPitch() {
  return (
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#6a7d38,#4a5a24)]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,transparent_45%)]" />
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
 */
export function FacilityTourStaticFloor({ hotspots }: { hotspots: ReactNode }) {
  return (
    <div className="relative mx-auto w-full px-2 pb-3.5 pt-1 md:px-3 md:pb-5 md:pt-1.5">
      <div className="relative w-full overflow-hidden max-md:h-[min(44vh,352px)] sm:max-md:h-[min(48vh,388px)] md:h-[min(48vh,424px)] lg:h-[min(52vh,488px)] xl:h-[min(54vh,520px)]">
        <div className="relative flex h-full min-h-0 w-full items-start justify-center overflow-x-auto overflow-y-hidden">
          <div className="relative h-[930px] w-[1240px] max-w-none shrink-0 origin-[50%_18%] will-change-transform motion-reduce:transform-none max-sm:[transform:perspective(1500px)_rotateX(54deg)_rotateZ(-24deg)_scale(0.205)] sm:max-md:[transform:perspective(1650px)_rotateX(56deg)_rotateZ(-26deg)_scale(0.262)] md:max-lg:[transform:perspective(1750px)_rotateX(58deg)_rotateZ(-28deg)_scale(0.445)] lg:[transform:perspective(1800px)_rotateX(58deg)_rotateZ(-28deg)_scale(0.545)]">
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              {/* Open / outdoor band above the enclosed slab */}
              <div className="absolute inset-x-[2%] top-[2%] h-[10%] rounded-t-md bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-formula-frost)_12%,transparent),transparent_85%)]" />

              {/* Main building footprint (indoor shell) */}
              <div className="absolute inset-x-[2%] top-[12%] bottom-[2%] bg-formula-base shadow-2xl" />
              <div className="absolute inset-x-[2%] top-[12%] bottom-[2%] border-[6px] border-formula-frost/22 border-t-formula-frost/12" />

              {/* Field 3 — outdoor, above the main block */}
              <div className="absolute left-[9%] top-[0.5%] z-[1] h-[10.5%] w-[22%] rounded-sm border border-white/35 bg-[#5a6d2e]/95 shadow-[0_8px_22px_rgba(0,0,0,0.12)] ring-1 ring-sky-200/15">
                <TourOutdoorPitch />
              </div>

              {/* Double Speed Court */}
              <div className="absolute left-[3%] top-[14%] grid h-[22%] w-[11%] grid-rows-2 gap-[2%]">
                <div className="relative border border-white/20 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
                  <TourFieldPitch />
                </div>
                <div className="relative border border-white/20 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
                  <TourFieldPitch />
                </div>
              </div>

              {/* Speed Track */}
              <div className="absolute left-[3%] top-[38%] h-[55%] w-[11%] bg-[#c92b2b] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]" />

              {/* Field 1 */}
              <div className="absolute left-[15%] top-[13.5%] h-[36%] w-[30%] border border-white/20 shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
                <TourFieldPitch />
              </div>

              {/* Entrance / front desk */}
              <div className="absolute left-[15%] top-[51%] h-[9.5%] w-[30%] border border-white/18 bg-[linear-gradient(180deg,#2a2d2c,#1e2120)] shadow-[0_6px_16px_rgba(0,0,0,0.1)]">
                <div className="absolute left-[8%] top-[22%] h-[35%] w-[18%] rounded-sm bg-formula-volt/25 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />
                <div className="absolute right-[10%] top-[18%] h-[50%] w-[38%] border border-white/12 bg-black/35" />
                <div className="absolute bottom-[12%] left-1/2 h-px w-[55%] -translate-x-1/2 bg-white/15" />
              </div>

              {/* Performance Center */}
              <div className="absolute left-[46.5%] top-[13.5%] h-[36%] w-[14%] border border-white/20 shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
                <TourFieldPitch />
                <div className="absolute bottom-0 left-0 top-0 w-[8%] bg-black/18" />
                <div className="absolute inset-y-0 left-[12%] w-px bg-black/30" />
              </div>

              {/* Support cluster */}
              <div className="absolute left-[46.5%] top-[51%] h-[42%] w-[14%] border border-white/12 bg-[#e8e8e8]/90 shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
                <div className="absolute left-[10%] top-[12%] h-[8%] w-[14%] bg-[#6d7074]/85" />
                <div className="absolute left-[10%] top-[26%] h-[8%] w-[14%] bg-[#6d7074]/85" />
                <div className="absolute left-[10%] top-[40%] h-[8%] w-[14%] bg-[#6d7074]/85" />
                <div className="absolute right-[8%] top-[12%] h-[76%] w-[28%] bg-[#d0d0d0]" />
              </div>

              {/* Field 2 — same width as Field 1, longer run */}
              <div className="absolute left-[62%] top-[13.5%] h-[48%] w-[30%] border border-white/20 shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
                <TourFieldPitch />
              </div>

              {/* Footbot — small rig on a green block at base of Field 2 */}
              <div className="absolute left-[68%] top-[63%] z-[1] h-[12%] w-[18%] border border-white/25 shadow-[0_10px_22px_rgba(0,0,0,0.12)]">
                <div className="absolute inset-0 overflow-hidden rounded-[2px]">
                  <TourFieldPitch />
                  <div className="absolute inset-[6%] border border-white/40" />
                </div>
                <div className="absolute left-1/2 top-[52%] h-[38%] w-[52%] -translate-x-1/2 -translate-y-1/2 bg-[#141414] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]">
                  <div className="absolute left-[12%] top-[18%] h-[18%] w-[16%] rounded-sm bg-formula-volt/40" />
                  <div className="absolute right-[12%] top-[18%] h-[18%] w-[16%] rounded-sm bg-formula-volt/28" />
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
