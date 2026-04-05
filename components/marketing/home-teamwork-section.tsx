'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ScrollFadeIn } from '@/components/marketing/scroll-fade-in'
import { MARKETING_HREF } from '@/lib/marketing/nav'

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
            className="object-cover object-[center_42%] transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] md:hover:scale-[1.02]"
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
              On the floor together
            </p>

            <h2
              id="teamwork-heading"
              className="mt-4 font-mono text-[clamp(1.6rem,3.2vw,2.4rem)] font-semibold leading-[1.05] tracking-tight text-formula-paper"
            >
              Teamwork sharpened in a building that shows up for everyone.
            </h2>

            <p className="mt-6 text-[15px] leading-[1.65] text-formula-frost/80">
              Soccer is relational: pressure, support, and honest competition in the same room. Formula is built so athletes share real standards among coaches,
              peers, and programmed space, not anonymous open gyms.
            </p>

            <p className="mt-4 text-[15px] leading-[1.65] text-formula-frost/65">
              When operations stay disciplined with on-time blocks, protected ratios, and coaching that holds, the room levels up together. Clearer progress
              tomorrow starts with better habits today.
            </p>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {['Shared standards', 'Protected ratios', 'On-time blocks', 'Community around development'].map(tag => (
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
                href={MARKETING_HREF.bookAssessmentPortal}
                className="inline-flex font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt transition-opacity hover:opacity-90"
              >
                Book an assessment →
              </Link>
              <span className="inline-flex font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-frost/55">
                Memberships coming soon
              </span>
            </div>
          </ScrollFadeIn>
        </div>
      </div>
    </section>
  )
}
