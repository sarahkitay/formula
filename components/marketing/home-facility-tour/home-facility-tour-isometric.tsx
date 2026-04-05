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

/**
 * Isometric facility plate (1240×930 logical space, scaled for viewport).
 * Decoration aligns with `FACILITY_ZONES` tour percentages (same as homepage hotspots).
 */
export function FacilityTourStaticFloor({ hotspots }: { hotspots: ReactNode }) {
  return (
    <div className="relative mx-auto w-full px-2 pb-3.5 pt-1 md:px-3 md:pb-5 md:pt-1.5">
      <div className="relative w-full overflow-hidden max-md:h-[min(44vh,352px)] sm:max-md:h-[min(48vh,388px)] md:h-[min(48vh,424px)] lg:h-[min(52vh,488px)] xl:h-[min(54vh,520px)]">
        <div className="relative flex h-full min-h-0 w-full items-start justify-center overflow-x-auto overflow-y-hidden">
          <div className="relative h-[930px] w-[1240px] max-w-none shrink-0 origin-[50%_14%] will-change-transform motion-reduce:transform-none max-sm:[transform:perspective(1500px)_rotateX(54deg)_rotateZ(-24deg)_scale(0.205)] sm:max-md:[transform:perspective(1650px)_rotateX(56deg)_rotateZ(-26deg)_scale(0.262)] md:max-lg:[transform:perspective(1750px)_rotateX(58deg)_rotateZ(-28deg)_scale(0.445)] lg:[transform:perspective(1800px)_rotateX(58deg)_rotateZ(-28deg)_scale(0.545)]">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-[2%] bg-formula-base shadow-2xl" />
          <div className="absolute inset-[2%] border-[6px] border-formula-frost/22" />

          {/* Left stack: Field 3 */}
          <div className="absolute left-[3.5%] top-[5%] h-[20%] w-[12.5%] border border-white/20 bg-[#55662a] shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
            <div className="absolute inset-[5%] border border-white/50" />
            <div className="absolute inset-x-[5%] top-1/3 h-px bg-white/50" />
            <div className="absolute inset-x-[5%] top-2/3 h-px bg-white/50" />
            <div className="absolute bottom-[5%] left-1/2 top-[5%] w-px -translate-x-1/2 bg-white/35" />
          </div>

          {/* Double Speed Court / two bays */}
          <div className="absolute left-[3.5%] top-[27%] grid h-[24%] w-[12.5%] grid-rows-2 gap-[2%]">
            <div className="relative border border-white/20 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
              <TourFieldPitch />
            </div>
            <div className="relative border border-white/20 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
              <TourFieldPitch />
            </div>
          </div>

          {/* Speed Track / vertical lane */}
          <div className="absolute left-[3.5%] top-[53%] h-[40%] w-[12.5%] bg-[#c92b2b] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]" />

          {/* Field 1 / center block */}
          <div className="absolute left-[17%] top-[5%] h-[88%] w-[33%] border border-white/20 shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
            <TourFieldPitch />
          </div>

          {/* Performance Center */}
          <div className="absolute left-[51.5%] top-[5%] h-[47%] w-[17%] border border-white/20 shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
            <TourFieldPitch />
            <div className="absolute bottom-0 left-0 top-0 w-[8%] bg-black/18" />
            <div className="absolute inset-y-0 left-[12%] w-px bg-black/30" />
          </div>

          {/* Support cluster / subdued slab */}
          <div className="absolute left-[51.5%] top-[54%] h-[39%] w-[17%] border border-white/12 bg-[#e8e8e8]/90 shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
            <div className="absolute left-[10%] top-[12%] h-[8%] w-[14%] bg-[#6d7074]/85" />
            <div className="absolute left-[10%] top-[26%] h-[8%] w-[14%] bg-[#6d7074]/85" />
            <div className="absolute left-[10%] top-[40%] h-[8%] w-[14%] bg-[#6d7074]/85" />
            <div className="absolute right-[8%] top-[12%] h-[76%] w-[28%] bg-[#d0d0d0]" />
          </div>

          {/* Field 2 */}
          <div className="absolute left-[70%] top-[5%] h-[40%] w-[27%] border border-white/20 shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
            <TourFieldPitch />
          </div>

          {/* Footbot */}
          <div className="absolute left-[70%] top-[47%] h-[46%] w-[27%] bg-[#1a1a1a] shadow-[0_12px_28px_rgba(0,0,0,0.14)]">
            <div className="absolute inset-[6%] border border-white/10" />
            <div className="absolute left-[12%] top-[18%] h-[6%] w-[10%] rounded-sm bg-formula-volt/35" />
            <div className="absolute right-[12%] top-[18%] h-[6%] w-[10%] rounded-sm bg-formula-volt/25" />
          </div>
        </div>

          <div className="absolute inset-0 z-20">{hotspots}</div>
        </div>
      </div>
      </div>
    </div>
  )
}
