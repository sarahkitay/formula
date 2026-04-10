'use client'

import Link from 'next/link'
import { MediaOverlayTextPanel } from '@/components/marketing/media-overlay-text-panel'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { useLazyAutoplayVideo } from '@/lib/marketing/use-lazy-autoplay-video'
import { MEDIA_SCRIM_BOTTOM, MEDIA_SCRIM_TOP } from '@/lib/marketing/media-scrims'
import { cn } from '@/lib/utils'

const VIDEO_SRC = '/IMG_6200_3.mp4'

const overlaySubtitleClass =
  'font-mono text-[clamp(0.7rem,2vw,0.8125rem)] font-semibold uppercase leading-snug tracking-[0.2em] text-formula-paper/95'

/**
 * Homepage: full-bleed Speed Track video with copy overlaid. Video pauses when `prefers-reduced-motion: reduce`.
 */
export function HomeSpeedTrackSection() {
  const { containerRef, videoRef, ready } = useLazyAutoplayVideo()

  return (
    <section aria-labelledby="home-speed-track-title">
      <div className="relative w-full overflow-hidden border-b border-formula-frost/10">
        <div ref={containerRef} className="relative min-h-[min(78vh,820px)] w-full md:min-h-[min(90vh,960px)]">
          {ready ? (
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full scale-[1.01] object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Athletes on the Speed Track"
            >
              <source src={VIDEO_SRC} type="video/mp4" />
            </video>
          ) : (
            <div className="absolute inset-0 bg-formula-deep" aria-hidden />
          )}
          <div className={MEDIA_SCRIM_TOP} aria-hidden />
          <div className={MEDIA_SCRIM_BOTTOM} aria-hidden />
          <div className="absolute inset-0 z-10 flex flex-col justify-end px-6 pb-12 pt-24 md:px-10 md:pb-16 md:pt-32">
            <div className="mx-auto w-full max-w-[1200px]">
              <MediaOverlayTextPanel className="mr-auto w-full max-w-[min(100%,52rem)]">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-formula-frost/90">Linear speed</p>
                <h2
                  id="home-speed-track-title"
                  className="mt-4 font-mono text-2xl font-semibold tracking-tight text-formula-paper md:text-[1.65rem]"
                >
                  Speed Track
                </h2>
                <p className={cn(overlaySubtitleClass, 'mt-3 max-w-[42rem]')}>Linear acceleration and explosive speed</p>
                <p className="mt-5 max-w-[42rem] text-[15px] leading-relaxed text-formula-paper/95 md:text-[16px] md:leading-relaxed">
                  Linear acceleration and explosive speed, metered and tracked the same way games demand it. First step, separation, and repeat sprint capacity
                  stay tied to how athletes actually close space and recover on the pitch.
                </p>
                <Link
                  href={MARKETING_HREF.facility}
                  className="mt-8 inline-flex font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt transition-opacity hover:opacity-90"
                >
                  Tour the facility →
                </Link>
              </MediaOverlayTextPanel>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
