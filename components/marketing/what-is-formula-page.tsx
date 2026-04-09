import Link from 'next/link'
import { FormulaPositioningBackground } from '@/components/marketing/formula-positioning-background'
import { marketingDisplayH1ClassName } from '@/lib/marketing/display-typography'
import { ScrollFadeIn } from '@/components/marketing/scroll-fade-in'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { cn } from '@/lib/utils'

const CLUB_VS_FORMULA: [string, string][] = [
  ['Team identity and culture', 'Individual performance data'],
  ['Minutes and match experience', 'Isolated skill development'],
  ['Group coaching', 'Personalized training plans'],
  ['Game application', 'Measured technical reps'],
  ['Season structure', 'Year-round development arc'],
]

const OFFER_NOW: { title: string; body: string }[] = [
  {
    title: '10-session package',
    body: '$300. Start immediately after your assessment.',
  },
  {
    title: 'Friday Youth Game Circuit',
    body: 'Live now. Structured competitive play.',
  },
  {
    title: 'Adult programming',
    body: 'Live now. Pickup and leagues.',
  },
  {
    title: 'Clinics',
    body: 'Small group, coach-led sessions. Check availability.',
  },
  {
    title: 'Memberships',
    body: 'Coming within the next month. Join the waitlist to get first access.',
  },
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
              <h1 className={cn(marketingDisplayH1ClassName, 'max-w-5xl')}>
                Built to work alongside your club.
                <br />
                Not replace it.
              </h1>
              <p className="mt-8 max-w-3xl text-[clamp(1.05rem,1.8vw,1.45rem)] leading-9 text-white/72">
                Formula Soccer Center isn&apos;t a club team. We don&apos;t do travel schedules, tournaments, or team identity. That&apos;s your club&apos;s job,
                and they do it well. What we do is fill the gap: the structured individual development, objective performance data, and measured skill-building
                that club practice doesn&apos;t have time for.
              </p>
            </div>

            <div className="flex items-end justify-start lg:justify-end">
              <div className="w-full max-w-md border border-white/10 bg-white/[0.03] p-8">
                <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">The idea</div>
                <div className="space-y-4 text-[1.05rem] leading-8 text-white/78">
                  <p>
                    Your club builds team chemistry, minutes, and identity. Formula builds the individual habits, data-backed improvements, and technical reps
                    that make your athlete better inside the club environment.
                  </p>
                  <p>
                    More training isn&apos;t the answer. Better training is. And the only way to know if training is working is to measure it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10" aria-labelledby="what-formula-adds-heading">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-24 lg:px-10 lg:py-28">
            <ScrollFadeIn>
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-white/45">Complement, don&apos;t compete</p>
              <h2
                id="what-formula-adds-heading"
                className="mt-4 font-mono text-2xl font-semibold tracking-tight text-[#eef2ed] md:text-[1.65rem]"
              >
                What Formula adds
              </h2>
              <p className="mt-6 max-w-[62ch] text-[15px] leading-relaxed text-white/72">
                Side by side with what you already get from club soccer.
              </p>

              <div className="not-prose mt-10 overflow-x-auto border border-white/10 bg-white/[0.025]">
                <table className="w-full min-w-[480px] border-collapse text-left font-sans text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.08] bg-white/[0.03] font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                      <th className="px-4 py-3 font-medium text-white/70">What your club provides</th>
                      <th className="px-4 py-3 font-medium text-formula-volt/95">What Formula adds</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/65">
                    {CLUB_VS_FORMULA.map(([club, formula]) => (
                      <tr key={club} className="border-b border-white/[0.06] last:border-b-0">
                        <td className="px-4 py-3 leading-relaxed">{club}</td>
                        <td className="px-4 py-3 leading-relaxed text-white/85">{formula}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Link
                href={MARKETING_HREF.fpi}
                className="mt-8 inline-flex font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt transition-opacity hover:opacity-90"
              >
                See how The Formula works →
              </Link>
            </ScrollFadeIn>
          </div>
        </section>

        <section className="border-b border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-24 lg:px-10 lg:py-28">
            <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <h2 className="font-sans text-[clamp(2rem,4vw,3.4rem)] leading-[1.02] tracking-[-0.04em] text-[#eef2ed]">Who Formula is for</h2>
                <p className="mt-6 max-w-xl text-lg leading-8 text-white/68">
                  Athletes and families who want structure, measurement, and a facility that runs like a performance brand.
                </p>
              </div>

              <div className="border border-white/10 bg-white/[0.025] p-8 md:p-10">
                <ul className="list-none space-y-4 p-0 text-[15px] leading-relaxed text-white/72">
                  <li>
                    <strong className="text-white/92">Club athletes</strong> who want to show up to practice sharper, and track it.
                  </li>
                  <li>
                    <strong className="text-white/92">Recreational players</strong> who want structured development without the commitment of a travel team.
                  </li>
                  <li>
                    <strong className="text-white/92">Competitive athletes</strong> heading toward high school, college, or elite club who need every edge
                    measured and optimized.
                  </li>
                  <li>
                    <strong className="text-white/92">Parents</strong> who want to see real data on what their athlete is working on, and why.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-24 lg:px-10 lg:py-28">
            <h2 className="max-w-xl font-sans text-[clamp(2rem,3.8vw,3.35rem)] leading-[1.04] tracking-[-0.04em] text-[#eef2ed]">
              What we offer right now
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {OFFER_NOW.map(item => (
                <article
                  key={item.title}
                  className="min-h-[140px] border border-white/10 bg-white/[0.025] p-6 transition duration-300 hover:border-formula-volt/40 hover:bg-white/[0.04]"
                >
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Live or next</h3>
                  <p className="mt-3 text-[1.2rem] font-semibold tracking-tight text-white/92">{item.title}</p>
                  <p className="mt-3 text-[15px] leading-7 text-white/62">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 md:py-24 lg:px-10 lg:py-28">
          <div className="flex flex-col items-start justify-between gap-10 border border-white/10 bg-white/[0.025] p-8 md:flex-row md:items-end md:p-12">
            <div className="max-w-2xl">
              <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">Start here</div>
              <h2 className="font-mono text-[clamp(1.5rem,3vw,2rem)] leading-[1.1] tracking-[-0.02em] text-[#edf1ec]">
                Book an assessment. Join the membership waitlist when you&apos;re ready for recurring blocks.
              </h2>
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
