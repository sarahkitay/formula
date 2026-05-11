import Image from 'next/image'
import Link from 'next/link'
import { FormulaLiveChamber } from '@/components/marketing/formula-live-chamber'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { HOME_SPLIT_PHOTO_QUALITY } from '@/lib/marketing/home-marketing-images'

/** Facility photo for The Formula hero - youth training on indoor turf (not reused on homepage hero). */
const FORMULA_HERO_IMAGE = '/8E3A3813.jpg'

const PARTNER_PHOTO_SRC = '/steve2.jpg'

const CHERUNDOLO_QUOTE =
  'I have partnered with Formula because it reflects my own personal philosophy of player development in the modern game. Every soccer action has three critical moments which increase in difficulty when time and space are reduced.'

const PARENT_QUOTE_BODY =
  "I had no idea what my son's actual weak point was until Formula showed us the scores. Turns out his speed was fine - his decision speed under pressure was the ceiling. That changed everything about how we thought about his training."

const PARENT_PORTAL_LOGIN = '/login?role=parent'

const PILLAR_MEASUREMENT_ROWS: [string, string][] = [
  ['Speed & Explosiveness', 'Timed sprints on Speed Track'],
  ['Agility & Change of Direction', 'Reactive cuts on Double Speed Court'],
  ['Decision-Making & Cognitive Speed', 'Pressure scenarios + choice timing'],
  ['Technical Execution', 'High-rep Footbot precision'],
  ['Game Application', 'Skills in live play contexts'],
  ['Consistency & Coachability', 'Full-session performance under fatigue'],
]

const sectionShell = 'px-4 sm:px-6'
const innerMax = 'mx-auto w-full max-w-[1100px]'

const eyebrowClass =
  'font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500'

const tableWrap = 'overflow-x-auto rounded border border-white/[0.1] bg-white/[0.02]'
const tableClass = 'w-full min-w-[420px] border-collapse font-mono text-[11px] text-zinc-400'

function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-11 items-center justify-center rounded border border-black/25 bg-formula-volt px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0a0f0c] no-underline transition-[filter] hover:brightness-105"
    >
      {children}
    </Link>
  )
}

function SecondaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-11 items-center justify-center rounded border border-white/25 bg-transparent px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-white no-underline transition-colors hover:border-white/40 hover:bg-white/[0.04]"
    >
      {children}
    </Link>
  )
}

function PipeCtaRow() {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em]">
      <PrimaryLink href={MARKETING_HREF.bookAssessmentPortal}>Book assessment</PrimaryLink>
      <span className="text-zinc-500" aria-hidden>
        |
      </span>
      <SecondaryLink href={PARENT_PORTAL_LOGIN}>Portal login</SecondaryLink>
    </div>
  )
}

export function TheFormulaFpiPage() {
  return (
    <div className="not-prose bg-[#1a2820] text-white">
      {/* SECTION 01 - HERO */}
      <section className={`${sectionShell} scroll-mt-28 border-b border-white/[0.08] pt-28 pb-20 md:pb-28 lg:pt-32 lg:pb-[120px]`} aria-labelledby="formula-hero-heading">
        <div className={`${innerMax} grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14`}>
          <div className="min-w-0">
            <p className={eyebrowClass}>The Formula</p>
            <h1
              id="formula-hero-heading"
              className="mt-4 text-[clamp(1.65rem,4.2vw,2.75rem)] font-semibold leading-[1.15] tracking-wide text-white"
            >
              Six pillars scored objectively.
            </h1>
            <p className="mt-5 max-w-[52ch] text-base leading-[1.65] text-zinc-300 sm:text-[17px] sm:leading-relaxed">
              Reveals your athlete&apos;s limiter + personalized plan. Reassess every 6 months.
            </p>
            <div className="mt-10">
              <PipeCtaRow />
            </div>
          </div>
          <div className="relative min-h-[220px] w-full overflow-hidden rounded border border-white/[0.12] sm:min-h-[280px] lg:min-h-[340px]">
            <Image
              src={FORMULA_HERO_IMAGE}
              alt="Youth soccer players on indoor turf at Formula Soccer Center - training and game-style movement with facility netting and lighting visible."
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={HOME_SPLIT_PHOTO_QUALITY}
              priority
            />
          </div>
        </div>
      </section>

      {/* SECTION 02 - INTERACTIVE SYSTEM */}
      <section className={`${sectionShell} border-b border-white/[0.06] bg-[#1e2d24] py-20 md:py-28 lg:py-[120px]`} aria-labelledby="formula-system-heading">
        <div className={innerMax}>
          <p className={eyebrowClass}>The system</p>
          <h2 id="formula-system-heading" className="mt-4 max-w-[40ch] text-2xl font-semibold tracking-wide text-white md:text-3xl">
            Weighted scoring architecture
          </h2>
          <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-zinc-400">
            The Formula is not a slogan—it&apos;s how inputs become signal, then a composite. Follow the flow in the animation on load.
          </p>
          <p className="sr-only">
            Animated model: six pillars stream into a composite performance score. Perimeter labels read Input, Signal, Weighting, Evaluation, and Composite.
          </p>
          <div className="mt-10">
            <FormulaLiveChamber embedded />
          </div>
          <p className="mx-auto mt-10 max-w-[48ch] text-center text-sm leading-relaxed text-zinc-500">Formula is based on data.</p>
        </div>
      </section>

      {/* SECTION 03 - WHAT WE MEASURE */}
      <section className={`${sectionShell} py-20 md:py-28 lg:py-[120px]`} aria-labelledby="formula-pillars-heading">
        <div className={innerMax}>
          <p className={eyebrowClass}>Assessment</p>
          <h2 id="formula-pillars-heading" className="mt-4 text-2xl font-semibold tracking-wide text-white md:text-3xl">
            What we measure
          </h2>
          <div className={`${tableWrap} mt-8`}>
            <table className={tableClass}>
              <caption className="sr-only">Six pillars and how each is tested</caption>
              <thead>
                <tr className="border-b border-white/[0.12] text-left text-zinc-500 uppercase tracking-wide">
                  <th className="px-4 py-3 font-medium">Pillar</th>
                  <th className="px-4 py-3 font-medium">How it&apos;s tested</th>
                </tr>
              </thead>
              <tbody>
                {PILLAR_MEASUREMENT_ROWS.map(([pillar, tested]) => (
                  <tr key={pillar} className="border-b border-white/[0.06] last:border-b-0">
                    <td className="px-4 py-3 align-top text-zinc-100">{pillar}</td>
                    <td className="px-4 py-3 align-top text-zinc-400">{tested}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mx-auto mt-8 max-w-[56ch] text-center text-sm leading-relaxed text-zinc-500">
            Age-weighted composite score—not a simple sum.
          </p>
        </div>
      </section>

      {/* SECTION 04 - CREDIBILITY */}
      <section className={`${sectionShell} border-y border-white/[0.06] bg-[#1e2d24] py-20 md:py-28`} aria-labelledby="formula-proof-heading">
        <div className={innerMax}>
          <p className={eyebrowClass}>Proof</p>
          <h2 id="formula-proof-heading" className="mt-4 text-2xl font-semibold tracking-wide text-white md:text-3xl">
            Built with coaches who live the game
          </h2>
          <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <figure className="grid gap-6 sm:grid-cols-[minmax(0,140px)_1fr] sm:items-start sm:gap-8">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-[160px] overflow-hidden rounded border border-white/[0.12] sm:mx-0 sm:max-w-none">
                <Image
                  src={PARTNER_PHOTO_SRC}
                  alt="Steve Cherundolo - LA Galaxy Head Coach, Formula partner."
                  fill
                  className="object-cover object-[center_22%]"
                  sizes="160px"
                  quality={HOME_SPLIT_PHOTO_QUALITY}
                />
              </div>
              <div className="min-w-0">
                <span className="font-mono text-5xl font-light leading-none text-formula-volt md:text-6xl" aria-hidden>
                  &ldquo;
                </span>
                <blockquote className="border-l-[3px] border-formula-volt pl-5">
                  <p className="text-[15px] leading-[1.7] text-zinc-200 md:text-base md:leading-relaxed">{CHERUNDOLO_QUOTE}</p>
                  <figcaption className="mt-6 text-sm">
                    <span className="font-semibold text-white">Steve Cherundolo</span>
                    <span className="mt-1 block text-zinc-500">LA Galaxy Head Coach</span>
                  </figcaption>
                </blockquote>
              </div>
            </figure>

            <blockquote className="rounded border border-white/[0.1] bg-white/[0.03] p-6 md:p-8">
              <p className="text-[15px] leading-[1.7] text-zinc-200 md:text-base md:leading-relaxed">{PARENT_QUOTE_BODY}</p>
              <footer className="mt-6 text-sm font-semibold text-white">Formula parent, U12</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* SECTION 05 - YOUR FLOW + WHY */}
      <section className={`${sectionShell} py-20 md:py-28 lg:py-[120px]`} aria-labelledby="formula-flow-heading">
        <div className={innerMax}>
          <p className={eyebrowClass}>Your flow</p>
          <h2 id="formula-flow-heading" className="mt-4 text-2xl font-semibold tracking-wide text-white md:text-3xl">
            From assessment to your portal
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3 md:gap-5">
            {[
              {
                step: 'Assessment (1 hr)',
                body: 'Tech captures data across all 6 pillars.',
              },
              {
                step: '48–72 hrs',
                body: 'Portal note on results + next steps.',
              },
              {
                step: '1 week',
                body: 'Full report, profile, training priority in parent portal.',
              },
            ].map(card => (
              <div key={card.step} className="relative rounded border border-white/[0.12] bg-white/[0.03] p-6 md:p-8">
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-formula-volt">{card.step}</p>
                <p className="mt-4 text-[15px] leading-relaxed text-zinc-400">{card.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 border-l-[3px] border-formula-volt py-1 pl-6 md:pl-8">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-400">Why it works</p>
            <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-zinc-300">
              Finds the one skill ceiling (e.g., slow decisions despite speed) and targets it. No public rankings—private to your family/coach.
            </p>
            <p className="mt-5 max-w-[62ch] text-sm leading-relaxed text-zinc-500">
              Reassessments every six months refresh scores and your athlete&apos;s plan. The Formula is not a public scoreboard: scores are not posted for
              rankings against other families; internal coaching tools may reference scores for placement only within your coaching relationship.
            </p>
            <p className="mt-5 text-sm text-zinc-500">
              Live application still happens in structured environments like the{' '}
              <Link href={MARKETING_HREF.fridayCircuit} className="text-formula-volt underline-offset-2 hover:underline">
                Friday Youth Game Circuit
              </Link>
              —not youth leaderboards online.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 06 - CLOSING CTA */}
      <section className={`${sectionShell} border-t border-white/[0.08] bg-[#1e2d24] py-20 md:py-28 lg:py-[120px]`} aria-labelledby="formula-close-heading">
        <div className={`${innerMax} text-center`}>
          <p className={eyebrowClass}>Start here</p>
          <h2 id="formula-close-heading" className="mx-auto mt-4 max-w-[22ch] text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight tracking-wide text-white">
            Book assessment or open your portal
          </h2>
          <p className="mx-auto mt-6 max-w-[52ch] text-base leading-relaxed text-zinc-300">
            Every athlete at Formula starts with a Skills Check. One hour. Six pillars. You leave with a clear picture of what to train next—and it stays
            private to your family and coach.
          </p>
          <div className="mt-10 flex justify-center">
            <PipeCtaRow />
          </div>
          <p className="mx-auto mt-10 max-w-[56ch] text-center font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-600">
            Internal systems may still reference legacy shorthand &quot;FPI&quot; in staff tools. On the public site we call it The Formula.
          </p>
        </div>
      </section>
    </div>
  )
}
