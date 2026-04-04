'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { MediaOverlayTextPanel } from '@/components/marketing/media-overlay-text-panel'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { MEDIA_SCRIM_BOTTOM, MEDIA_SCRIM_TOP } from '@/lib/marketing/media-scrims'

const VIDEO_SRC = '/IMG_6200_1.mp4'

const overlayTitleClass =
  'font-mono text-[clamp(2rem,6vw,3.25rem)] font-semibold leading-[1.02] tracking-tight text-formula-paper'

/**
 * Homepage: full-bleed Speed Court video with short left-aligned copy (cinematic beat, not a spec sheet).
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

        <div className="absolute inset-0 z-10 flex flex-col justify-end px-6 pb-14 md:px-10 md:pb-20">
          <MediaOverlayTextPanel variant="bare" className="max-w-[34rem]">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-formula-frost/70">
              Cognitive layer
            </p>
            <h3 id="home-speed-court-title" className={`mt-3 ${overlayTitleClass}`}>
              Speed Court
            </h3>
            <p className="mt-5 max-w-[28rem] text-[15px] leading-[1.65] text-formula-paper/85">
              Decision speed is a soccer skill. Reaction time, scanning, and choice density under constraint: the overload
              moments that decide whether a player influences the game or just occupies space.
            </p>
            <Link
              href={MARKETING_HREF.facility}
              className="mt-8 inline-flex font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt opacity-80 transition-opacity hover:opacity-100"
            >
              See it on the facility map →
            </Link>
          </MediaOverlayTextPanel>
        </div>
      </div>
    </section>
  )
}
