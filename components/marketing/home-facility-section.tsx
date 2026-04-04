'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { SITE_VOICE } from '@/lib/marketing/site-voice'
import { SITE } from '@/lib/site-config'

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
            className="object-cover object-[28%_center] transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] md:hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-formula-deep/60 to-transparent md:hidden"
            aria-hidden
          />
        </div>

        <div className="flex flex-col justify-center border-b border-formula-frost/10 bg-formula-deep px-8 py-14 md:px-12 md:py-16 lg:px-16">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-formula-frost/60">
            {SITE.facilityName}
          </p>

          <h2
            id="home-facility-heading"
            className="mt-4 font-mono text-[clamp(1.6rem,3.2vw,2.4rem)] font-semibold leading-[1.05] tracking-tight text-formula-paper"
          >
            The full facility: structured soccer development under one roof.
          </h2>

          <p className="mt-6 text-[15px] leading-[1.65] text-formula-frost/80">{SITE_VOICE.trainingCenterPrograms}</p>

          <p className="mt-4 text-[15px] leading-[1.65] text-formula-frost/65">{SITE_VOICE.whoWeTrain}</p>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {['Capped density', 'Published blocks', 'The Formula', 'Pro floor ops'].map(tag => (
              <span
                key={tag}
                className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-formula-volt/70"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={MARKETING_HREF.facility}
              className="inline-flex items-center gap-2 border border-formula-frost/20 px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-paper transition-colors duration-200 hover:border-formula-frost/40 hover:bg-formula-frost/5"
            >
              Facility & interactive map →
            </Link>
            <Link
              href={MARKETING_HREF.whatIsFormula}
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt/80 opacity-70 transition-opacity hover:opacity-100"
            >
              How the formula works →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
