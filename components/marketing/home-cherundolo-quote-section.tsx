'use client'

import Link from 'next/link'
import { ScrollFadeIn } from '@/components/marketing/scroll-fade-in'
import { MARKETING_HREF } from '@/lib/marketing/nav'

/**
 * Homepage: partner endorsement quote (photo omitted until a higher-res asset ships).
 */
export function HomeCherundoloQuoteSection() {
  return (
    <section id="partner-quote" aria-labelledby="cherundolo-quote-heading">
      <div className="border-b border-formula-frost/10 bg-formula-deep px-8 py-14 md:px-12 md:py-20 lg:px-16">
        <ScrollFadeIn>
          <div className="mx-auto max-w-[min(100%,52rem)]">
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
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  )
}
