'use client'

import Link from 'next/link'
import { MediaOverlayTextPanel } from '@/components/marketing/media-overlay-text-panel'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { useLazyAutoplayVideo } from '@/lib/marketing/use-lazy-autoplay-video'
import { MEDIA_SCRIM_BOTTOM, MEDIA_SCRIM_TOP } from '@/lib/marketing/media-scrims'
import { cn } from '@/lib/utils'

const VIDEO_SRC = '/IMG_6200_4.mp4'

const overlaySubtitleClass =
  'font-mono text-[clamp(0.7rem,2vw,0.8125rem)] font-semibold uppercase leading-snug tracking-[0.2em] text-formula-paper/95'

/**
 * Homepage: full-bleed assessment video; overlay explains Skills Check → scores → program placement.
 */
export function HomeAssessmentVideoSection() {
  const { containerRef, videoRef, ready } = useLazyAutoplayVideo()

  return (
    <section aria-labelledby="home-assessment-video-title" className="relative w-full overflow-hidden border-b border-formula-frost/10">
      <div ref={containerRef} className="relative min-h-[min(72vh,780px)] w-full md:min-h-[min(86vh,940px)]">
        {ready ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full scale-[1.01] object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-label="Athletes during a Formula assessment on the training floor"
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
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-formula-frost/90">Assessment & placement</p>
              <h2
                id="home-assessment-video-title"
                className="mt-4 font-mono text-2xl font-semibold tracking-tight text-formula-paper md:text-[1.65rem]"
              >
                Start with the data, not a guess
              </h2>
              <p className={cn(overlaySubtitleClass, 'mt-3 max-w-[42rem]')}>
                Same structured Skills Check for every athlete, then programming built to the player
              </p>
              <p className="mt-5 max-w-[42rem] text-[15px] leading-relaxed text-formula-paper/95 md:text-[16px] md:leading-relaxed">
                Every young athlete runs the same standardized assessment: speed, agility, decision-making, technique, how skills show up in play, and how they
                respond under fatigue. Our systems capture the numbers; coaches interpret them. Families leave with objective scores, not a vague “looks good out
                there.”
              </p>
              <p className="mt-4 max-w-[42rem] text-[15px] leading-relaxed text-formula-paper/95 md:text-[16px] md:leading-relaxed">
                Those results drive placement. We match kids to training emphasis, session types, and progression paths that fit what they actually need, so time on
                the floor reinforces the right gaps instead of repeating what they already do well.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
                <Link
                  href={MARKETING_HREF.bookAssessmentPortal}
                  className="inline-flex font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt transition-opacity hover:opacity-90"
                >
                  Book an assessment →
                </Link>
                <Link
                  href={MARKETING_HREF.assessment}
                  className="inline-flex font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-paper/80 transition-opacity hover:opacity-100"
                >
                  How assessments work →
                </Link>
              </div>
            </MediaOverlayTextPanel>
          </div>
        </div>
      </div>
    </section>
  )
}
