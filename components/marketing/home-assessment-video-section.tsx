'use client'

import Link from 'next/link'
import { MediaOverlayTextPanel } from '@/components/marketing/media-overlay-text-panel'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { HOME_ASSESSMENT_POSTER, HOME_ASSESSMENT_VIDEO } from '@/lib/marketing/home-video-assets'
import { SITE_VOICE } from '@/lib/marketing/site-voice'
import { useLazyAutoplayVideo } from '@/lib/marketing/use-lazy-autoplay-video'
import { MEDIA_SCRIM_BOTTOM, MEDIA_SCRIM_TOP } from '@/lib/marketing/media-scrims'

/**
 * Homepage: full-bleed assessment video; overlay is the “How it works” step grid.
 */
export function HomeAssessmentVideoSection() {
  const { containerRef, videoRef, ready } = useLazyAutoplayVideo()

  return (
    <section aria-labelledby="home-how-it-works-heading" className="relative w-full border-b border-formula-frost/10">
      {/*
        Copy sits in normal flow with mt-auto so tall panels grow the section instead of overflowing upward
        into overflow-hidden (which clipped the top of the headline against the teamwork band above).
      */}
      <div
        ref={containerRef}
        className="relative flex min-h-[min(72vh,780px)] w-full flex-col md:min-h-[min(86vh,940px)]"
      >
        <div className="absolute inset-0 overflow-hidden">
          {ready ? (
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full scale-[1.01] object-cover"
              poster={HOME_ASSESSMENT_POSTER}
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              aria-label="Athletes during a Formula assessment on the training floor"
            >
              <source src={HOME_ASSESSMENT_VIDEO} type="video/mp4" />
            </video>
          ) : (
            <div className="absolute inset-0 bg-formula-deep" aria-hidden />
          )}

          <div className={MEDIA_SCRIM_TOP} aria-hidden />
          <div className={MEDIA_SCRIM_BOTTOM} aria-hidden />
        </div>

        <div className="relative z-10 mt-auto flex w-full flex-col px-6 pb-12 pt-28 md:px-10 md:pb-16 md:pt-36">
          <div className="mx-auto w-full max-w-[1200px]">
            <MediaOverlayTextPanel className="mr-auto w-full max-w-[min(100%,52rem)]">
              <h2
                id="home-how-it-works-heading"
                className="font-mono text-2xl font-semibold tracking-tight text-formula-paper md:text-[1.65rem]"
              >
                How it works
              </h2>
              <ul className="mt-6 grid list-none gap-5 p-0 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6">
                {SITE_VOICE.homeHowItWorksSteps.map(step => (
                  <li key={step.title}>
                    <p className="font-mono text-[11px] font-semibold tracking-[0.06em] text-formula-paper">{step.title}</p>
                    <p className="mt-2 text-[15px] leading-relaxed text-formula-paper/95 md:text-[16px] md:leading-relaxed">{step.body}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href={MARKETING_HREF.bookAssessmentPortal}
                  className="inline-flex h-11 w-fit items-center border border-formula-volt/50 bg-formula-volt px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-base transition-[filter] duration-300 hover:brightness-105"
                >
                  Book an Assessment
                </Link>
              </div>
            </MediaOverlayTextPanel>
          </div>
        </div>
      </div>
    </section>
  )
}
