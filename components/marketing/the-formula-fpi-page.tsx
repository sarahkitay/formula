import Image from 'next/image'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import { FpiPillarsInteractive } from '@/components/marketing/fpi-pillars-interactive'
import { FormulaLiveChamber } from '@/components/marketing/formula-live-chamber'
import { FPI_PILLARS } from '@/lib/marketing/formula-pillars'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { HOME_SPLIT_PHOTO_QUALITY } from '@/lib/marketing/home-marketing-images'

/** Facility photo for The Formula hero — youth training on indoor turf (not reused on homepage hero). */
const FORMULA_HERO_IMAGE = '/8E3A3813.jpg'

/** Temporary shared image on pillar cards until pillar-specific photography exists (Footbot / fields context from site photography). */
const FORMULA_PILLAR_CARD_IMAGE = '/8E3A3278.jpg'

const PARTNER_PHOTO_SRC = '/steve2.jpg'

const CHERUNDOLO_QUOTE =
  'I have partnered with Formula because it reflects my own personal philosophy of player development in the modern game. Every soccer action has three critical moments which increase in difficulty when time and space are reduced.'

const PARENT_QUOTE_BODY =
  "I had no idea what my son's actual weak point was until Formula showed us the scores. Turns out his speed was fine — his decision speed under pressure was the ceiling. That changed everything about how we thought about his training."

const sectionShell = 'px-4 sm:px-6'
const innerMax = 'mx-auto w-full max-w-[1100px]'

const eyebrowClass =
  'font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500'

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

export function TheFormulaFpiPage() {
  return (
    <div className="not-prose bg-[#1a2820] text-white">
      {/* SECTION 01 — HERO */}
      <section className={`${sectionShell} scroll-mt-28 border-b border-white/[0.08] pt-28 pb-20 md:pb-28 lg:pt-32 lg:pb-[120px]`} aria-labelledby="formula-hero-heading">
        <div className={`${innerMax} grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14`}>
          <div className="min-w-0">
            <p className={eyebrowClass}>The Formula</p>
            <h1
              id="formula-hero-heading"
              className="mt-4 text-[clamp(1.65rem,4.2vw,2.75rem)] font-semibold leading-[1.15] tracking-wide text-white"
            >
              Six pillars. Objective scores. A plan that updates every six months.
            </h1>
            <p className="mt-6 max-w-[52ch] text-base leading-[1.65] text-zinc-300 sm:text-[17px] sm:leading-relaxed">
              {"Here's exactly what we measure, how we score it, and what you'll see in your portal."}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <PrimaryLink href={MARKETING_HREF.bookAssessmentPortal}>Book an Assessment</PrimaryLink>
              <SecondaryLink href={MARKETING_HREF.facility}>Tour the Facility</SecondaryLink>
            </div>
          </div>
          <div className="relative min-h-[220px] w-full overflow-hidden rounded border border-white/[0.12] sm:min-h-[280px] lg:min-h-[340px]">
            <Image
              src={FORMULA_HERO_IMAGE}
              alt="Youth soccer players on indoor turf at Formula Soccer Center — training and game-style movement with facility netting and lighting visible."
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={HOME_SPLIT_PHOTO_QUALITY}
              priority
            />
          </div>
        </div>
      </section>

      {/* SECTION 02 — INTERACTIVE SYSTEM */}
      <section className={`${sectionShell} border-b border-white/[0.06] bg-[#1e2d24] py-20 md:py-28 lg:py-[120px]`} aria-labelledby="formula-system-heading">
        <div className={innerMax}>
          <p className={eyebrowClass}>The system</p>
          <h2 id="formula-system-heading" className="mt-4 max-w-[40ch] text-2xl font-semibold tracking-wide text-white md:text-3xl">
            {"The Formula is not a slogan. It's a weighted scoring architecture."}
          </h2>
          <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-zinc-400">
            Follow the flow from inputs through weighting to the composite score — the animation walks the architecture on load.
          </p>
          <p className="sr-only">
            Animated model: six pillars stream into a composite performance score. Perimeter labels read Input, Signal, Weighting, Evaluation, and Composite.
          </p>
          <div className="mt-10">
            <FormulaLiveChamber embedded />
          </div>
          <p className="mx-auto mt-10 max-w-[48ch] text-center text-sm leading-relaxed text-zinc-500">
            Formula is based on data.
          </p>
        </div>
      </section>

      {/* SECTION 03 — SIX PILLARS */}
      <section className={`${sectionShell} py-20 md:py-28 lg:py-[120px]`} aria-labelledby="formula-pillars-heading">
        <div className={innerMax}>
          <p className={eyebrowClass}>What we measure</p>
          <h2 id="formula-pillars-heading" className="mt-4 text-2xl font-semibold tracking-wide text-white md:text-3xl">
            Six pillars on assessment day
          </h2>
          <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-zinc-400">
            Each card shows what your athlete actually does on the floor for that domain.
          </p>
          <FpiPillarsInteractive
            intro="Each pillar below lists what your athlete does on assessment day. The same action imagery illustrates every card for now."
            pillars={FPI_PILLARS}
            cardLayout="expanded"
            expandedCardImageSrc={FORMULA_PILLAR_CARD_IMAGE}
          />
          <p className="mx-auto mt-8 max-w-[56ch] text-center text-sm leading-relaxed text-zinc-500">
            Every athlete is scored on all six. No pillar is skipped. Scores are age-weighted — a U10 is not held to a U16 standard.
          </p>
        </div>
      </section>

      {/* SECTION 04 — CREDIBILITY */}
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
                  alt="Steve Cherundolo — LA Galaxy Head Coach, Formula partner."
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

      {/* SECTION 05 — TIMELINE */}
      <section className={`${sectionShell} py-20 md:py-28 lg:py-[120px]`} aria-labelledby="formula-timeline-heading">
        <div className={innerMax}>
          <p className={eyebrowClass}>How scoring works</p>
          <h2 id="formula-timeline-heading" className="mt-4 text-2xl font-semibold tracking-wide text-white md:text-3xl">
            From assessment to your portal
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3 md:gap-5">
            {[
              {
                step: 'Step 1 · Assessment Day',
                title: 'One hour. Six pillars.',
                body: "Your athlete completes standardized tasks across all six pillars using our timing technology, Footbot, the Speed Track, and the Double Speed Court. Technology captures the data. Coaches don't estimate.",
              },
              {
                step: 'Step 2 · 48–72 Hours',
                title: 'Scores finalized. No guessing.',
                body: 'Our coaching staff reviews the raw data for context. Pillar scores are calculated, not assigned. You receive a same-day portal note on what ran and what comes next.',
              },
              {
                step: 'Step 3 · Within a Week',
                title: 'Full report. Training priority. Clear plan.',
                body: 'Individual scores for each pillar, an overall Formula profile, and a personalized training plan targeting the specific limiter holding your athlete back right now.',
              },
            ].map(card => (
              <div key={card.step} className="relative rounded border border-white/[0.12] bg-white/[0.03] p-6 md:p-8">
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-formula-volt">{card.step}</p>
                <h3 className="mt-3 text-lg font-semibold tracking-wide text-white">{card.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-zinc-400">{card.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 border-l-[3px] border-formula-volt py-1 pl-6 md:pl-8">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-400">Why the limiter matters</p>
            <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-zinc-300">
              {
                "A fast player who can't make decisions under pressure will hit a ceiling. A technically gifted player with no explosive speed gets bypassed at the next level. The Formula finds the specific skill holding your athlete back and builds training around fixing it. When that pillar improves, the whole score moves."
              }
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 06 — FAMILY REPORTING */}
      <section className={`${sectionShell} border-t border-white/[0.06] bg-[#1e2d24] py-20 md:py-28`} aria-labelledby="formula-reporting-heading">
        <div className={innerMax}>
          <p className={eyebrowClass}>Family reporting</p>
          <h2 id="formula-reporting-heading" className="mt-4 text-2xl font-semibold tracking-wide text-white md:text-3xl">
            What you see, and when
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: 'Same day',
                body: 'A portal note on what ran, what the athlete worked on, and what comes next. No mystery after each session.',
                icon: true,
              },
              {
                title: 'Within a week',
                body: "Full pillar scores, your athlete's Formula profile, and a training priority report — all in the parent portal.",
                icon: false,
              },
              {
                title: 'Every 6 months',
                body: 'Full reassessment. Updated scores. Updated plan. You see exactly how far your athlete has come and what the next ceiling is.',
                icon: false,
              },
              {
                title: 'When it matters',
                body: "Injury return, a growth spurt, or a tier change — we reassess when the athlete's situation changes, not just when the calendar says so.",
                icon: false,
              },
            ].map(card => (
              <article
                key={card.title}
                className="rounded border border-white/[0.12] bg-[#1a2820] p-6 transition-colors hover:border-white/[0.18]"
              >
                <div className="flex items-start gap-3">
                  {card.icon ? (
                    <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded border border-white/[0.12] bg-white/[0.04] text-formula-volt">
                      <Clock className="h-4 w-4" aria-hidden />
                      <span className="sr-only">Timing</span>
                    </span>
                  ) : (
                    <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 rounded border border-white/[0.08] bg-white/[0.03]" aria-hidden />
                  )}
                  <div>
                    <h3 className="text-base font-semibold tracking-wide text-white">{card.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">{card.body}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-14 max-w-[40ch] text-center text-2xl font-semibold leading-snug tracking-wide text-white">
            No lost emails. No wondering. Everything is in your portal.
          </p>
        </div>
      </section>

      {/* SECTION 07 — PRIVACY */}
      <section className={`${sectionShell} py-20 md:py-28`} aria-labelledby="formula-privacy-heading">
        <div className={`${innerMax} max-w-[640px]`}>
          <div className="rounded border border-white/[0.1] bg-white/[0.03] px-6 py-10 md:px-10 md:py-12">
            <p className={eyebrowClass}>{"A note on how we use your athlete's data"}</p>
            <h2 id="formula-privacy-heading" className="mt-4 text-xl font-semibold tracking-wide text-white md:text-2xl">
              This stays between you, your athlete, and your coach.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-zinc-300">
              The Formula is not a public scoreboard. Scores are never posted publicly, never shared with other families, and never used to rank athletes against
              each other in front of their peers. We stress behavior and development in structured environments — not permanent online rankings for kids.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-zinc-500">
              Internal coaching tools may reference scores for placement and programming. That data does not leave your coaching relationship.
            </p>
            <p className="mt-6 text-sm text-zinc-500">
              We still use structured environments like the{' '}
              <Link href={MARKETING_HREF.fridayCircuit} className="text-formula-volt underline-offset-2 hover:underline">
                Friday Youth Game Circuit
              </Link>{' '}
              for live application — not public leaderboards for youth.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 08 — CLOSING CTA */}
      <section className={`${sectionShell} border-t border-white/[0.08] bg-[#1e2d24] py-20 md:py-28 lg:py-[120px]`} aria-labelledby="formula-close-heading">
        <div className={`${innerMax} text-center`}>
          <p className={eyebrowClass}>Start here</p>
          <h2 id="formula-close-heading" className="mx-auto mt-4 max-w-[18ch] text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight tracking-wide text-white md:max-w-[22ch]">
            {"Your athlete's limiter isn't a mystery. It's a number. And it changes."}
          </h2>
          <p className="mx-auto mt-6 max-w-[52ch] text-base leading-relaxed text-zinc-300">
            Every athlete at Formula starts with a Skills Check. One hour. Six pillars. You leave with a score, a plan, and a clear picture of what your athlete
            is actually working on — and why.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <PrimaryLink href={MARKETING_HREF.bookAssessmentPortal}>Book an Assessment →</PrimaryLink>
            <SecondaryLink href={MARKETING_HREF.youthMembership}>Join the Membership Waitlist</SecondaryLink>
          </div>
          <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
            Already have a portal account?{' '}
            <Link href="/login?role=parent" className="text-formula-volt underline-offset-2 hover:underline">
              Sign in →
            </Link>
          </p>
          <p className="mx-auto mt-10 max-w-[56ch] text-center font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-600">
            Internal systems may still reference legacy shorthand &quot;FPI&quot; in staff tools. On the public site we call it The Formula.
          </p>
        </div>
      </section>
    </div>
  )
}
