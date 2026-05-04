'use client'

import { ScrollFadeIn } from '@/components/marketing/scroll-fade-in'
import { SITE_VOICE } from '@/lib/marketing/site-voice'

/**
 * Homepage: short intro before ball control / agility / speed bands.
 */
export function HomeWhatWeTrainIntro() {
  return (
    <section aria-labelledby="home-what-we-train-heading" className="border-b border-formula-frost/10 bg-formula-deep">
      <div className="mx-auto max-w-[1200px] px-8 py-12 md:px-12 md:py-14 lg:px-16">
        <ScrollFadeIn>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-formula-frost/60">What we train</p>
          <h2
            id="home-what-we-train-heading"
            className="mt-4 max-w-[40ch] font-mono text-[clamp(1.35rem,2.8vw,1.85rem)] font-semibold leading-snug tracking-tight text-formula-paper"
          >
            {SITE_VOICE.homeWhatWeTrainHeadline}
          </h2>
        </ScrollFadeIn>
      </div>
    </section>
  )
}
