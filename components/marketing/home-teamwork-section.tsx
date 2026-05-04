'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ScrollFadeIn } from '@/components/marketing/scroll-fade-in'
import { HOME_SPLIT_PHOTO_QUALITY, HOME_SPLIT_PHOTO_SIZES } from '@/lib/marketing/home-marketing-images'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { SITE_VOICE } from '@/lib/marketing/site-voice'

const TEAMWORK_PHOTO_SRC = '/8E3A3155.jpg'

/**
 * Homepage: teamwork, 50/50 photo + copy (md+). Alt text belongs on `<Image>` only; never duplicate it as body copy
 * (`aria-hidden` does not hide text visually).
 */
export function HomeTeamworkSection() {
  return (
    <section id="teamwork" aria-labelledby="teamwork-heading">
      <div className="grid min-h-[min(72vh,760px)] grid-cols-1 md:grid-cols-2 md:min-h-[min(82vh,860px)]">
        <div className="relative min-h-[min(52vh,420px)] overflow-hidden border-b border-formula-frost/10 md:min-h-0 md:border-b-0 md:border-r">
          <Image
            src={TEAMWORK_PHOTO_SRC}
            alt="Two athletes train one-on-one on indoor turf, viewed through sideline netting, with staff and observers along the perimeter of the facility."
            fill
            quality={HOME_SPLIT_PHOTO_QUALITY}
            sizes={HOME_SPLIT_PHOTO_SIZES}
            decoding="async"
            fetchPriority="low"
            className="object-cover object-[center_42%] transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] md:hover:scale-[1.02]"
            priority={false}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-formula-deep/60 to-transparent md:hidden"
            aria-hidden
          />
        </div>

        <div className="flex flex-col justify-center border-b border-formula-frost/10 bg-formula-deep px-8 py-14 md:px-12 md:py-16 lg:px-16">
          <ScrollFadeIn>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-formula-frost/60">Who it&apos;s for</p>

            <h2 id="teamwork-heading" className="sr-only">
              Audiences we train
            </h2>

            <p className="mt-6 text-[15px] leading-[1.65] text-formula-frost/80">
              <strong className="font-medium text-formula-paper">Club players</strong>
              <span aria-hidden className="text-formula-frost/45">
                {' '}
                -{' '}
              </span>
              <span className="text-formula-frost/75">{SITE_VOICE.homeWhoClub}</span>
            </p>

            <p className="mt-4 text-[15px] leading-[1.65] text-formula-frost/80">
              <strong className="font-medium text-formula-paper">Recreational players</strong>
              <span aria-hidden className="text-formula-frost/45">
                {' '}
                -{' '}
              </span>
              <span className="text-formula-frost/75">{SITE_VOICE.homeWhoRec}</span>
            </p>

            <p className="mt-4 text-[15px] leading-[1.65] text-formula-frost/80">
              <strong className="font-medium text-formula-paper">Competitive and elite players</strong>
              <span aria-hidden className="text-formula-frost/45">
                {' '}
                -{' '}
              </span>
              <span className="text-formula-frost/75">{SITE_VOICE.homeWhoCompetitive}</span>
            </p>

            <p className="mt-4 text-[15px] leading-[1.65] text-formula-frost/65">
              <strong className="font-medium text-formula-paper">Parents</strong>
              <span aria-hidden className="text-formula-frost/45">
                {' '}
                -{' '}
              </span>
              <span className="text-formula-frost/75">{SITE_VOICE.homeWhoParents}</span>
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
              <Link
                href={MARKETING_HREF.bookAssessmentPortal}
                className="inline-flex font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt transition-opacity hover:opacity-90"
              >
                Book an Assessment →
              </Link>
              <Link
                href={MARKETING_HREF.youthMembership}
                className="inline-flex font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-frost/55 transition-colors hover:text-formula-volt"
              >
                View Programs →
              </Link>
            </div>
          </ScrollFadeIn>
        </div>
      </div>
    </section>
  )
}
