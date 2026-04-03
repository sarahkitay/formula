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
 * Decoration is non-interactive; hotspots render in a sibling layer.
 */
export function FacilityTourStaticFloor({ hotspots }: { hotspots: ReactNode }) {
  return (
    <div className="relative flex min-h-[min(520px,70vh)] w-full items-center justify-center overflow-x-auto overflow-y-visible py-6 md:min-h-[min(640px,78vh)] md:py-8 lg:min-h-[min(720px,82vh)]">
      <div className="relative h-[930px] w-[1240px] max-w-none shrink-0 origin-center max-md:[transform:perspective(1800px)_rotateX(60deg)_rotateZ(-30deg)_scale(0.46)] md:max-lg:[transform:perspective(1800px)_rotateX(60deg)_rotateZ(-30deg)_scale(0.62)] lg:[transform:perspective(1800px)_rotateX(60deg)_rotateZ(-30deg)_scale(0.82)]">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-[2%] bg-formula-base shadow-2xl" />
          <div className="absolute inset-[2%] border-[6px] border-formula-frost/22" />

          <div className="absolute left-[8.1%] top-[19%] h-[43.6%] w-[6.2%] bg-[#c92b2b] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]" />

          <div className="absolute left-[15.7%] top-[23.1%] grid h-[27.5%] w-[13.1%] grid-rows-2 gap-[1.8%]">
            <div className="relative border border-white/20 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
              <TourFieldPitch />
            </div>
            <div className="relative border border-white/20 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
              <TourFieldPitch />
            </div>
          </div>

          <div className="absolute left-[24.8%] top-[5.1%] h-[14.3%] w-[21.8%] border border-white/20 shadow-[0_8px_22px_rgba(0,0,0,0.08)]">
            <TourFieldPitch />
          </div>

          <div className="absolute left-[30.1%] top-[22.1%] h-[45.2%] w-[20.8%] border border-white/20 shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
            <TourFieldPitch />
          </div>

          <div className="absolute left-[51.8%] top-[22.1%] h-[33.4%] w-[13.3%] border border-white/20 bg-[#55662a] shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
            <div className="absolute inset-[5%] border border-white/50" />
            <div className="absolute inset-x-[5%] top-1/3 h-px bg-white/50" />
            <div className="absolute inset-x-[5%] top-2/3 h-px bg-white/50" />
            <div className="absolute bottom-[5%] left-1/2 top-[5%] w-px -translate-x-1/2 bg-white/35" />
          </div>

          <div className="absolute left-[68.2%] top-[18.2%] h-[45.8%] w-[22.7%] border border-white/20 shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
            <TourFieldPitch />
            <div className="absolute bottom-0 left-0 top-0 w-[6%] bg-black/20" />
            <div className="absolute inset-y-0 left-[8%] w-px bg-black/35" />
            <div className="absolute inset-y-0 left-[22%] w-px bg-black/25" />
          </div>

          <div className="absolute left-[76.6%] top-[66%] h-[23.5%] w-[17.5%] border border-white/20 shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
            <TourFieldPitch />
          </div>

          <div className="absolute left-[56.8%] top-[66.5%] h-[20.8%] w-[18.8%] bg-[#d9d9d9] shadow-[0_12px_24px_rgba(0,0,0,0.08)]">
            <div className="absolute left-[16%] top-[16%] h-[10%] w-[16%] bg-[#6d7074]" />
            <div className="absolute left-[39%] top-[16%] h-[10%] w-[16%] bg-[#6d7074]" />
            <div className="absolute left-[22%] top-[42%] h-[11%] w-[44%] bg-[#d6a447]" />
            <div className="absolute left-[16%] top-[68%] h-[10%] w-[20%] bg-[#6d7074]" />
            <div className="absolute left-[46%] top-[68%] h-[10%] w-[20%] bg-[#6d7074]" />
          </div>

          <div className="absolute left-[5.8%] top-[63.5%] h-[18.4%] w-[18.2%] bg-[#1f1f1f] shadow-[0_12px_28px_rgba(0,0,0,0.12)]" />

          <div className="absolute left-[37.6%] top-[74.5%] h-[11.6%] w-[16.5%] bg-[#f0f0f0] shadow-[0_10px_20px_rgba(0,0,0,0.08)]">
            <div className="absolute left-[12%] top-[18%] h-[10%] w-[16%] bg-white/90" />
            <div className="absolute left-[12%] top-[37%] h-[10%] w-[16%] bg-white/90" />
            <div className="absolute left-[12%] top-[56%] h-[10%] w-[16%] bg-white/90" />
            <div className="absolute right-[10%] top-[18%] h-[54%] w-[22%] bg-[#d9d9d9]" />
          </div>
        </div>

        <div className="absolute inset-0 z-20">{hotspots}</div>
      </div>
    </div>
  )
}
