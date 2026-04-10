'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ScrollFadeIn } from '@/components/marketing/scroll-fade-in'
import { MARKETING_HREF } from '@/lib/marketing/nav'

const PHOTO_SRC = '/steve.jpg'

/**
 * Homepage: partner endorsement, 50/50 photo + quote (md+). Matches `HomeFacilitySection` / `HomeTeamworkSection` split layout.
 */
export function HomeCherundoloQuoteSection() {
  return (
    <section id="partner-quote" aria-labelledby="cherundolo-quote-heading">
      <div className="grid min-h-[min(72vh,760px)] grid-cols-1 md:grid-cols-2 md:min-h-[min(82vh,860px)]">
        <div className="relative min-h-[min(52vh,420px)] overflow-hidden border-b border-formula-frost/10 md:min-h-0 md:border-b-0 md:border-r">
          <Image
            src={PHOTO_SRC}
            alt="Steve Cherundolo on an outdoor pitch in LAFC coaching kit."
            fill
            className="object-cover object-[22%_center] transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] md:hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-formula-deep/60 to-transparent md:hidden"
            aria-hidden
          />
        </div>

        <div className="flex flex-col justify-center border-b border-formula-frost/10 bg-formula-deep px-8 py-14 md:px-12 md:py-16 lg:px-16">
          <ScrollFadeIn>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-formula-frost/60">Partnership</p>

            <h2
              id="cherundolo-quote-heading"
              className="mt-4 font-mono text-[clamp(1.6rem,3.2vw,2.4rem)] font-semibold leading-[1.05] tracking-tight text-formula-paper"
            >
              Structure, freedom, intelligence
            </h2>

            <blockquote className="mt-6 border-l-2 border-formula-volt/45 pl-6">
              <p className="text-[15px] font-normal leading-[1.7] text-formula-frost/88 md:text-[16px] md:leading-[1.75]">
                I have partnered with Formula because it reflects how the modern game is played: built on structure, driven by freedom, and powered by
                intelligence. By combining elite coaching with cutting-edge technology, Formula will develop players who think faster, make better decisions, and
                perform at their highest level.
              </p>
              <footer className="mt-8 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-formula-frost/55">
                <cite className="not-italic">Steve Cherundolo</cite>
              </footer>
            </blockquote>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
              <Link
                href={MARKETING_HREF.bookAssessmentPortal}
                className="inline-flex font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt transition-opacity hover:opacity-90"
              >
                Book an assessment →
              </Link>
              <Link
                href={MARKETING_HREF.fpi}
                className="inline-flex font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-frost/55 transition-colors hover:text-formula-volt"
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
