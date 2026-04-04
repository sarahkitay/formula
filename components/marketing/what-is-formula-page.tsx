import Link from 'next/link'
import { FormulaPositioningBackground } from '@/components/marketing/formula-positioning-background'
import { MARKETING_HREF } from '@/lib/marketing/nav'

/** Same modules as current copy; titles match `<strong>` labels on the live page. */
const COMBINES = [
  {
    title: 'Youth blocks',
    body: 'Published schedules, capped density, no drop-in chaos.',
  },
  {
    title: 'The Formula',
    body: 'Coach + family signal. Internal science, not public ranking.',
  },
  {
    title: 'Application',
    body: 'Friday circuit + arena scenarios; training → execution.',
  },
  {
    title: 'Clinics & camps',
    body: 'Scarce, coach-led labs + full-facility immersion.',
  },
  {
    title: 'Adults',
    body: 'Hosted pickup + leagues, respectful intensity.',
  },
  {
    title: 'Rentals',
    body: 'Packaged inventory: clubs, teams, private training.',
  },
  {
    title: 'Events',
    body: 'Parties, tournaments, Footbot - same ops standard.',
  },
] as const

const NEXT_LINKS: { label: string; href: string }[] = [
  { label: 'Youth membership', href: MARKETING_HREF.youthMembership },
  { label: 'The Formula', href: MARKETING_HREF.fpi },
  { label: 'Friday circuit', href: MARKETING_HREF.fridayCircuit },
]

export function WhatIsFormulaPageContent() {
  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-[#0a0d0c] text-[#e9ece8]">
      <FormulaPositioningBackground />

      <div className="relative z-10">
        <section className="relative border-b border-white/10">
          <div className="mx-auto grid max-w-7xl gap-16 px-6 pb-20 pt-24 md:pb-24 md:pt-28 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:pb-32 lg:pt-32">
            <div className="max-w-4xl">
              <div className="mb-8 font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">Positioning</div>
              <h1 className="max-w-5xl font-mono text-[clamp(3.25rem,8vw,6.2rem)] leading-[0.96] tracking-[-0.04em] text-[#edf1ec]">
                Club-complementary.
                <br />
                Built for the next tier.
              </h1>
              <p className="mt-8 max-w-3xl text-[clamp(1.05rem,1.8vw,1.45rem)] leading-9 text-white/72">
                Not a club replacement - an operating layer: structure, measurement, and application when the team calendar
                can’t carry it all.
              </p>
            </div>

            <div className="flex items-end justify-start lg:justify-end">
              <div className="w-full max-w-md border border-white/10 bg-white/[0.03] p-8">
                <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">The idea</div>
                <div className="space-y-4 text-[1.05rem] leading-8 text-white/78">
                  <p>
                    Clubs build identity and minutes. Formula builds{' '}
                    <span className="text-white/95">repeatable habits</span>,{' '}
                    <span className="text-white/95">measured progression</span>, and{' '}
                    <span className="text-white/95">controlled application</span> - visible, coachable, long-term athletic
                    literacy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-24 lg:px-10 lg:py-28">
            <div className="grid gap-14 lg:grid-cols-[0.78fr_1.22fr]">
              <div>
                <h2 className="max-w-xl font-sans text-[clamp(2rem,3.8vw,3.35rem)] leading-[1.04] tracking-[-0.04em] text-[#eef2ed]">
                  What Formula combines
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {COMBINES.map((item) => (
                  <article
                    key={item.title}
                    className="group min-h-[172px] border border-white/10 bg-white/[0.025] p-6 transition duration-300 hover:border-formula-volt/40 hover:bg-white/[0.04]"
                  >
                    <div className="mb-8 font-mono text-[11px] uppercase tracking-[0.26em] text-white/40">Module</div>
                    <h3 className="text-[1.35rem] leading-8 tracking-[-0.03em] text-white/92">{item.title}</h3>
                    <p className="mt-4 text-[15px] leading-7 text-white/62">{item.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10">
          <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 md:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:px-10 lg:py-28">
            <div>
              <h2 className="font-sans text-[clamp(2rem,4vw,3.4rem)] leading-[1.02] tracking-[-0.04em] text-[#eef2ed]">
                Who it is for
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/68">
                Athletes who want <strong className="font-semibold text-white/90">standards</strong>,{' '}
                <strong className="font-semibold text-white/90">continuity</strong>, and a building that runs like a performance
                brand - on time, buffered, coaching that holds.
              </p>
            </div>

            <div className="border border-white/10 bg-white/[0.025] p-8 md:p-10">
              <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">Next</div>
              <div className="flex flex-wrap gap-x-3 gap-y-2 text-[1.1rem] leading-8">
                {NEXT_LINKS.map((item, index) => (
                  <div key={item.href} className="flex items-center gap-3">
                    <Link href={item.href} className="text-formula-volt transition hover:opacity-85">
                      {item.label}
                    </Link>
                    {index < NEXT_LINKS.length - 1 ? <span className="text-white/30">·</span> : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 md:py-24 lg:px-10 lg:py-28">
          <div className="flex flex-col items-start justify-between gap-10 border border-white/10 bg-white/[0.025] p-8 md:flex-row md:items-end md:p-12">
            <div className="max-w-2xl">
              <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">Positioning</div>
              <h2 className="font-mono text-[clamp(2rem,4vw,3.7rem)] leading-[1.02] tracking-[-0.04em] text-[#edf1ec]">
                Club-complementary. Built for the next tier.
              </h2>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href={MARKETING_HREF.assessment}
                className="inline-flex border border-formula-volt bg-formula-volt px-7 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.26em] text-[#0a0d0c] transition hover:brightness-95"
              >
                Book Assessment
              </Link>
              <Link
                href={MARKETING_HREF.youthMembership}
                className="inline-flex border border-white/14 bg-transparent px-7 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.26em] text-white/85 transition hover:border-white/30 hover:bg-white/[0.03]"
              >
                Explore Membership
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
