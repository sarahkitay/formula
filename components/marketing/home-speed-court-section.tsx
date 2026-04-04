'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { MediaOverlayTextPanel } from '@/components/marketing/media-overlay-text-panel'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { MEDIA_SCRIM_BOTTOM, MEDIA_SCRIM_TOP } from '@/lib/marketing/media-scrims'
import { cn } from '@/lib/utils'

const VIDEO_SRC = '/IMG_6200_1.mp4'

const overlaySubtitleClass =
  'font-mono text-[clamp(0.7rem,2vw,0.8125rem)] font-semibold uppercase leading-snug tracking-[0.2em] text-formula-paper/95'

/**
 * Homepage: full-bleed Speed Court video — same overlay panel treatment as Speed Track (`MediaOverlayTextPanel`).
 */
export function HomeSpeedCourtSection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      if (mq.matches) {
        el.pause()
      } else {
        void el.play().catch(() => {})
      }
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return (
    <section aria-labelledby="home-speed-court-title" className="relative w-full overflow-hidden border-b border-formula-frost/10">
      <div className="relative min-h-[min(72vh,780px)] w-full md:min-h-[min(86vh,940px)]">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full scale-[1.01] object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Speed Court cognitive training station in action"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>

        <div className={MEDIA_SCRIM_TOP} aria-hidden />
        <div className={MEDIA_SCRIM_BOTTOM} aria-hidden />

        <div className="absolute inset-0 z-10 flex flex-col justify-end px-6 pb-12 pt-24 md:px-10 md:pb-16 md:pt-32">
          <div className="mx-auto w-full max-w-[1200px]">
            <MediaOverlayTextPanel className="mr-auto w-full max-w-[min(100%,52rem)]">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-formula-frost/90">Cognitive layer</p>
              <h2
                id="home-speed-court-title"
                className="mt-4 font-mono text-2xl font-semibold tracking-tight text-formula-paper md:text-[1.65rem]"
              >
                Speed Court
              </h2>
              <p className={cn(overlaySubtitleClass, 'mt-3 max-w-[42rem]')}>Reaction · scan · choose under pressure</p>
              <p className="mt-5 max-w-[42rem] text-[15px] leading-relaxed text-formula-paper/95 md:text-[16px] md:leading-relaxed">
                Decision speed is a soccer skill. Reaction time, scanning, and choice density under constraint: the overload moments that decide whether a
                player influences the game or just occupies space.
              </p>
              <Link
                href={MARKETING_HREF.facility}
                className="mt-8 inline-flex font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt transition-opacity hover:opacity-90"
              >
                See it on the facility map →
              </Link>
            </MediaOverlayTextPanel>
          </div>
        </div>
      </div>
    </section>
  )
}
