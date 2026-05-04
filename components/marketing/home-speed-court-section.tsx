'use client'

import Link from 'next/link'
import { MediaOverlayTextPanel } from '@/components/marketing/media-overlay-text-panel'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { HOME_SPEED_COURT_POSTER, HOME_SPEED_COURT_VIDEO } from '@/lib/marketing/home-video-assets'
import { SITE_VOICE } from '@/lib/marketing/site-voice'
import { useLazyAutoplayVideo } from '@/lib/marketing/use-lazy-autoplay-video'
import { MEDIA_SCRIM_BOTTOM, MEDIA_SCRIM_TOP } from '@/lib/marketing/media-scrims'

/**
 * Homepage: full-bleed Speed Court video; same overlay panel treatment as Speed Track (`MediaOverlayTextPanel`).
 */
export function HomeSpeedCourtSection() {
  const { containerRef, videoRef, ready } = useLazyAutoplayVideo()

  return (
    <section aria-labelledby="home-speed-court-title" className="relative w-full overflow-hidden border-b border-formula-frost/10">
      <div ref={containerRef} className="relative min-h-[min(72vh,780px)] w-full md:min-h-[min(86vh,940px)]">
        {ready ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full scale-[1.01] object-cover"
            poster={HOME_SPEED_COURT_POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-label="Double Speed Court agility and change-of-direction station in action"
          >
            <source src={HOME_SPEED_COURT_VIDEO} type="video/mp4" />
          </video>
        ) : (
          <div className="absolute inset-0 bg-formula-deep" aria-hidden />
        )}

        <div className={MEDIA_SCRIM_TOP} aria-hidden />
        <div className={MEDIA_SCRIM_BOTTOM} aria-hidden />

        <div className="absolute inset-0 z-10 flex flex-col justify-end px-6 pb-12 pt-24 md:px-10 md:pb-16 md:pt-32">
          <div className="mx-auto w-full max-w-[1200px]">
            <MediaOverlayTextPanel className="mr-auto w-full max-w-[min(100%,52rem)]">
              <h2
                id="home-speed-court-title"
                className="font-mono text-2xl font-semibold tracking-tight text-formula-paper md:text-[1.65rem]"
              >
                {SITE_VOICE.homeAgilityTitle}
              </h2>
              <p className="mt-3 max-w-[42rem] text-[15px] leading-relaxed text-formula-paper/95 md:text-[16px] md:leading-relaxed">
                {SITE_VOICE.homeAgilityBody}
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
    </section>
  )
}
