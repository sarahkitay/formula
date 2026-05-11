import Link from 'next/link'
import { FormulaPositioningBackground } from '@/components/marketing/formula-positioning-background'
import { marketingDisplayH1ClassName } from '@/lib/marketing/display-typography'
import { ScrollFadeIn } from '@/components/marketing/scroll-fade-in'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { SUMMER_CAMP_2026_WEEK_CHECKOUT } from '@/lib/marketing/public-pricing'
import { cn } from '@/lib/utils'

const WHAT_FORMULA_LIVE_NOW = [
  {
    title: 'Assessments + personalized plans',
    body: '$150/5 sessions',
    href: MARKETING_HREF.bookAssessmentPortal,
  },
  {
    title: 'Field rentals',
    body: 'Book structured field time for your group.',
    href: MARKETING_HREF.rentals,
  },
  {
    title: 'Summer camps',
    body: `$${SUMMER_CAMP_2026_WEEK_CHECKOUT.priceUsd}/wk`,
    href: MARKETING_HREF.summerCamp2026,
  },
  {
    title: 'Friday friendlies + parties',
    body: 'Pre-register for friendlies and hosted party windows from the events hub.',
    href: MARKETING_HREF.events,
  },
] as const

export function WhatIsFormulaPageContent() {
  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-[#0a0d0c] text-[#e9ece8]">
      <FormulaPositioningBackground />

      <div className="relative z-10">
        <section className="relative border-b border-white/10">
          <div className="mx-auto grid max-w-7xl gap-16 px-6 pb-20 pt-24 md:pb-24 md:pt-28 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:pb-32 lg:pt-32">
            <div className="max-w-4xl">
              <div className="mb-8 font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">What Formula is</div>
              <h1 className={cn(marketingDisplayH1ClassName, 'max-w-5xl')}>
                Formula Soccer: Data-driven individual soccer training that complements your club team.
              </h1>
              <p className="mt-8 max-w-3xl text-[clamp(1.05rem,1.8vw,1.45rem)] leading-9 text-white/72">
                We deliver measurable skill gains—tracked via assessments and tech—without travel or team commitments.
              </p>
            </div>

            <div className="flex items-end justify-start lg:justify-end">
              <div className="w-full max-w-md border border-white/10 bg-white/[0.03] p-8">
                <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">Core value</div>
                <div className="space-y-4 text-[1.05rem] leading-8 text-white/78">
                  <p>
                    Clubs build team chemistry and game minutes. Formula builds personal speed, agility, technical reps, and
                    long-term athleticism with objective data parents can see.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-24 lg:px-10 lg:py-28">
            <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <h2 className="font-sans text-[clamp(1.35rem,2.8vw,2rem)] leading-[1.08] tracking-[-0.03em] text-[#eef2ed]">Who it&apos;s for</h2>
              </div>

              <div className="border border-white/10 bg-white/[0.025] p-8 md:p-10">
                <ul className="list-none space-y-4 p-0 text-[15px] leading-relaxed text-white/72">
                  <li>
                    <strong className="text-white/92">Club players</strong> seeking sharper edges
                  </li>
                  <li>
                    <strong className="text-white/92">Rec players</strong> wanting structure
                  </li>
                  <li>
                    <strong className="text-white/92">Competitive athletes</strong> chasing college/pro paths
                  </li>
                  <li>
                    <strong className="text-white/92">Data-focused parents</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10" aria-labelledby="what-formula-offer-now-heading">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-24 lg:px-10 lg:py-28">
            <ScrollFadeIn>
              <h2
                id="what-formula-offer-now-heading"
                className="max-w-xl font-sans text-[clamp(1.35rem,2.6vw,2rem)] leading-[1.08] tracking-[-0.03em] text-[#eef2ed]"
              >
                What&apos;s live now
              </h2>
              <div className="mt-10 grid gap-5 md:grid-cols-2">
                {WHAT_FORMULA_LIVE_NOW.map(item => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={cn(
                      'group flex min-h-[140px] flex-col border border-white/10 bg-white/[0.025] p-6 text-left transition duration-300',
                      'hover:border-formula-volt/40 hover:bg-white/[0.04]',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-formula-volt/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0d0c]'
                    )}
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Live or next</span>
                    <span className="mt-3 block text-[1.2rem] font-semibold tracking-tight text-white/92">{item.title}</span>
                    <span className="mt-3 block flex-1 text-[15px] leading-7 text-white/62">{item.body}</span>
                    <span className="mt-4 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt opacity-0 transition-opacity group-hover:opacity-100">
                      Open
                    </span>
                  </Link>
                ))}
              </div>
            </ScrollFadeIn>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 md:py-24 lg:px-10 lg:py-28">
          <div className="flex flex-col items-start justify-between gap-10 border border-white/10 bg-white/[0.025] p-8 md:flex-row md:items-end md:p-12">
            <div className="max-w-2xl">
              <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">Start here</div>
              <p className="text-[clamp(1.05rem,2.2vw,1.25rem)] leading-relaxed text-white/78">
                Book an assessment at{' '}
                <Link
                  href={MARKETING_HREF.bookAssessmentPortal}
                  className="text-formula-volt underline decoration-formula-volt/35 underline-offset-4 transition hover:decoration-formula-volt/70"
                >
                  formulasoccer.com/book-assessment
                </Link>{' '}
                to start tracking real progress.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href={MARKETING_HREF.bookAssessmentPortal}
                className="inline-flex border border-formula-volt bg-formula-volt px-7 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.26em] text-[#0a0d0c] transition hover:brightness-95"
              >
                Book an assessment
              </Link>
              <Link
                href={MARKETING_HREF.youthMembership}
                className="inline-flex border border-white/14 bg-transparent px-7 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.26em] text-white/85 transition hover:border-white/30 hover:bg-white/[0.03]"
              >
                Join the membership waitlist
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
