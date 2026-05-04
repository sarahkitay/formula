'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ScrollFadeIn } from '@/components/marketing/scroll-fade-in'
import { HOME_SPLIT_PHOTO_QUALITY_DEFERRED, HOME_SPLIT_PHOTO_SIZES } from '@/lib/marketing/home-marketing-images'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { SITE_VOICE } from '@/lib/marketing/site-voice'

const FIELDS_PHOTO_SRC = '/8E3A3278.jpg'

/**
 * Homepage: match-grade fields, 50/50 photo + copy (md+). No full-bleed essay on the image.
 * Alt text stays on `<Image>` only (never duplicated as body copy).
 */
export function HomeFieldsFormulaSection() {
  return (
    <section id="fields-formula" aria-labelledby="fields-formula-heading">
      <div className="grid min-h-[min(72vh,760px)] grid-cols-1 md:grid-cols-2 md:min-h-[min(82vh,860px)]">
        <div className="relative min-h-[min(52vh,420px)] overflow-hidden border-b border-formula-frost/10 md:min-h-0 md:border-b-0 md:border-r">
          <Image
            src={FIELDS_PHOTO_SRC}
            alt="Athlete strikes a ball on an indoor turf field partitioned by netting, with additional training lanes visible in the background."
            fill
            quality={HOME_SPLIT_PHOTO_QUALITY_DEFERRED}
            sizes={HOME_SPLIT_PHOTO_SIZES}
            decoding="async"
            fetchPriority="low"
            loading="lazy"
            className="object-cover object-[center_35%] transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] md:hover:scale-[1.02]"
            priority={false}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-formula-deep/60 to-transparent md:hidden"
            aria-hidden
          />
        </div>

        <div className="flex flex-col justify-center border-b border-formula-frost/10 bg-formula-deep px-8 py-14 md:px-12 md:py-16 lg:px-16">
          <ScrollFadeIn>
            <h2
              id="fields-formula-heading"
              className="font-mono text-[clamp(1.6rem,3.2vw,2.4rem)] font-semibold leading-[1.05] tracking-tight text-formula-paper"
            >
              {SITE_VOICE.homeBallControlTitle}
            </h2>

            <p className="mt-6 text-[15px] leading-[1.65] text-formula-frost/80">{SITE_VOICE.homeBallControlBody}</p>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
              <Link
                href={MARKETING_HREF.footbot}
                className="inline-flex font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt transition-opacity hover:opacity-90"
              >
                Footbot →
              </Link>
              <Link
                href={MARKETING_HREF.fpi}
                className="inline-flex font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-frost/80 transition-colors hover:text-formula-volt"
              >
                The Formula →
              </Link>
            </div>
          </ScrollFadeIn>
        </div>
      </div>
    </section>
  )
}
