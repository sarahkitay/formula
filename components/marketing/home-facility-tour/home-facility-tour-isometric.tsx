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

/** Outdoor turf (Field 3): brighter read + dashed border for open-air column. */
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
 */
export function FacilityTourStaticFloor({ hotspots }: { hotspots: ReactNode }) {
  return (
    <div className="relative mx-auto w-full px-2 pb-3.5 pt-1 md:px-3 md:pb-5 md:pt-1.5">
      <div className="relative w-full overflow-hidden max-md:h-[min(44vh,352px)] sm:max-md:h-[min(48vh,388px)] md:h-[min(48vh,424px)] lg:h-[min(52vh,488px)] xl:h-[min(54vh,520px)]">
        <div className="relative flex h-full min-h-0 w-full items-start justify-center overflow-x-auto overflow-y-hidden">
          <div className="relative h-[930px] w-[1240px] max-w-none shrink-0 origin-[50%_18%] will-change-transform motion-reduce:transform-none max-sm:[transform:perspective(1500px)_rotateX(54deg)_rotateZ(-24deg)_scale(0.205)] sm:max-md:[transform:perspective(1650px)_rotateX(56deg)_rotateZ(-26deg)_scale(0.262)] md:max-lg:[transform:perspective(1750px)_rotateX(58deg)_rotateZ(-28deg)_scale(0.445)] lg:[transform:perspective(1800px)_rotateX(58deg)_rotateZ(-28deg)_scale(0.545)]">
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div className="absolute inset-x-[2%] top-[2%] h-[8%] rounded-t-md bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-formula-frost)_10%,transparent),transparent_90%)]" />

              <div className="absolute inset-x-[2%] top-[10%] bottom-[2%] bg-formula-base shadow-2xl" />
              <div className="absolute inset-x-[2%] top-[10%] bottom-[2%] border-[6px] border-formula-frost/22 border-t-formula-frost/14" />

              {/* Double Speed Court */}
              <div className="absolute left-[3%] top-[12%] grid h-[22%] w-[9%] grid-rows-2 gap-[2%]">
                <div className="relative border border-white/20 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
                  <TourFieldPitch />
                </div>
                <div className="relative border border-white/20 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
                  <TourFieldPitch />
                </div>
              </div>

              {/* Speed Track */}
              <div className="absolute left-[3%] top-[35%] h-[35%] w-[9%] bg-[#c92b2b] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]" />

              {/* Field 3 — same footprint as Field 1; outdoor styling */}
              <div className="absolute left-[13%] top-[12%] z-[1] h-[47%] w-[15%] rounded-sm border border-white/30 bg-[#5a6d2e]/95 shadow-[0_10px_24px_rgba(0,0,0,0.1)] ring-1 ring-sky-100/12">
                <TourOutdoorPitch />
              </div>

              {/* Footbot — equal block under Field 3 (green pad + rig) */}
              <div className="absolute left-[13%] top-[59%] z-[1] h-[11%] w-[15%] border border-white/22 shadow-[0_8px_18px_rgba(0,0,0,0.12)]">
                <div className="absolute inset-0 overflow-hidden rounded-[2px]">
                  <TourFieldPitch />
                  <div className="absolute inset-[5%] border border-white/35" />
                </div>
                <div className="absolute left-1/2 top-1/2 h-[55%] w-[58%] -translate-x-1/2 -translate-y-1/2 bg-[#141414] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]">
                  <div className="absolute left-[14%] top-[16%] h-[20%] w-[18%] rounded-sm bg-formula-volt/42" />
                  <div className="absolute right-[14%] top-[16%] h-[20%] w-[18%] rounded-sm bg-formula-volt/28" />
                </div>
              </div>

              {/* Field 1 — matches Field 3 */}
              <div className="absolute left-[29%] top-[12%] h-[47%] w-[15%] border border-white/20 shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
                <TourFieldPitch />
              </div>

              {/* Entrance / lounge — equal block under Field 1 */}
              <div className="absolute left-[29%] top-[59%] h-[11%] w-[15%] border border-white/20 bg-[linear-gradient(180deg,#d8d9d8,#b8bab9)] shadow-[0_6px_16px_rgba(0,0,0,0.08)]">
                <div className="absolute left-[6%] top-[18%] h-[52%] w-[22%] rounded-sm border border-white/40 bg-white/35" />
                <div className="absolute right-[8%] top-[14%] h-[58%] w-[48%] border border-zinc-500/25 bg-zinc-600/20" />
                <div className="absolute bottom-[10%] left-1/2 h-px w-[62%] -translate-x-1/2 bg-zinc-500/25" />
              </div>

              {/* Performance Center */}
              <div className="absolute left-[45%] top-[12%] h-[34%] w-[13%] border border-white/20 shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
                <TourFieldPitch />
                <div className="absolute bottom-0 left-0 top-0 w-[8%] bg-black/18" />
                <div className="absolute inset-y-0 left-[12%] w-px bg-black/30" />
              </div>

              {/* Support cluster */}
              <div className="absolute left-[45%] top-[48%] h-[22%] w-[13%] border border-white/12 bg-[#e8e8e8]/90 shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
                <div className="absolute left-[10%] top-[14%] h-[12%] w-[18%] bg-[#6d7074]/85" />
                <div className="absolute left-[10%] top-[32%] h-[12%] w-[18%] bg-[#6d7074]/85" />
                <div className="absolute right-[8%] top-[14%] h-[72%] w-[32%] bg-[#d0d0d0]" />
              </div>

              {/* Field 2 — full height on the right */}
              <div className="absolute left-[59%] top-[12%] h-[58%] w-[36%] border border-white/20 shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
                <TourFieldPitch />
              </div>
            </div>

            <div className="absolute inset-0 z-20">{hotspots}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
