'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ScrollFadeIn } from '@/components/marketing/scroll-fade-in'
import { MARKETING_HREF } from '@/lib/marketing/nav'

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
            className="object-cover object-[center_35%] transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] md:hover:scale-[1.02]"
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
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-formula-frost/60">
              State-of-the-art technology. Actual results.
            </p>

            <h2
              id="fields-formula-heading"
              className="mt-4 font-mono text-[clamp(1.6rem,3.2vw,2.4rem)] font-semibold leading-[1.05] tracking-tight text-formula-paper"
            >
              Footbot
            </h2>

            <p className="mt-6 text-[15px] leading-[1.65] text-formula-frost/80">
              Precision ball training that captures technical reps with data, not just repetition for repetition&apos;s sake.
            </p>

            <p className="mt-4 text-[15px] leading-[1.65] text-formula-frost/65">
              <strong className="font-medium text-formula-paper">The Formula</strong> is how we track progress and prove it. After an assessment, athletes
              receive scores across six measurable pillars. Objective data from our technology, reviewed by staff, tells us where to focus and how to measure
              improvement over time.
            </p>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {['Precision reps', 'Data capture', 'Technical work', 'Measured progress'].map(tag => (
                <span
                  key={tag}
                  className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-formula-volt/70"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
              <Link
                href={MARKETING_HREF.fpi}
                className="inline-flex font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt transition-opacity hover:opacity-90"
              >
                See how The Formula works →
              </Link>
              <Link
                href={MARKETING_HREF.facility}
                className="inline-flex font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-frost/80 transition-colors hover:text-formula-volt"
              >
                Tour the facility →
              </Link>
            </div>
          </ScrollFadeIn>
        </div>
      </div>
    </section>
  )
}
