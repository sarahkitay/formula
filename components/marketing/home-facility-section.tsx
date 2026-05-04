'use client'

import Image from 'next/image'
import { ScrollFadeIn } from '@/components/marketing/scroll-fade-in'
import { HOME_SPLIT_PHOTO_QUALITY_DEFERRED, HOME_SPLIT_PHOTO_SIZES } from '@/lib/marketing/home-marketing-images'
import { SITE_VOICE } from '@/lib/marketing/site-voice'

const FACILITY_PHOTO_SRC = '/8E3A2988.jpg'

/**
 * Homepage facility intro: 50/50 photo + copy on md+, stacked on mobile.
 * No overlay panel. Long-form detail belongs on /facility.
 */
export function HomeFacilitySection() {
  return (
    <section aria-labelledby="home-facility-heading">
      <div className="grid min-h-[min(72vh,780px)] grid-cols-1 md:grid-cols-2 md:min-h-[min(82vh,860px)]">
        <div className="relative min-h-[min(52vh,420px)] overflow-hidden border-b border-formula-frost/10 md:min-h-0 md:border-b-0 md:border-r">
          <Image
            src={FACILITY_PHOTO_SRC}
            alt="Indoor match-grade turf training lane at Formula Soccer Center, viewed through perimeter netting."
            fill
            quality={HOME_SPLIT_PHOTO_QUALITY_DEFERRED}
            sizes={HOME_SPLIT_PHOTO_SIZES}
            decoding="async"
            fetchPriority="low"
            loading="lazy"
            className="object-cover object-[28%_center] transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] md:hover:scale-[1.02]"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-formula-deep/60 to-transparent md:hidden"
            aria-hidden
          />
        </div>

        <div className="flex flex-col justify-center border-b border-formula-frost/10 bg-formula-deep px-8 py-14 md:px-12 md:py-16 lg:px-16">
          <ScrollFadeIn>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-formula-frost/60">What this is</p>

            <h2
              id="home-facility-heading"
              className="sr-only"
            >
              What Formula is
            </h2>

            <p className="mt-6 text-[15px] font-medium leading-[1.65] text-formula-paper/95">{SITE_VOICE.homeWhatThisIsLead}</p>

            <p className="mt-4 text-[15px] leading-[1.65] text-formula-frost/80">{SITE_VOICE.homeWhatThisIsBody}</p>

            <p className="mt-4 text-[15px] leading-[1.65] text-formula-frost/65">{SITE_VOICE.homeWhatThisIsClosing}</p>
          </ScrollFadeIn>
        </div>
      </div>
    </section>
  )
}
