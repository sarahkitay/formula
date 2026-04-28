import type { Metadata } from 'next'
import Link from 'next/link'
import { FormulaMinisSixWeekCheckout } from '@/components/marketing/formula-minis-six-week-checkout'
import { SundayChildProgramCheckout } from '@/components/marketing/sunday-child-program-checkout'
import { MarketingInnerPage, CtaRow } from '@/components/marketing/marketing-inner'
import {
  FORMULA_MINIS_SUNDAY_SEASON_ROWS,
  FORMULA_MINIS_WEEKDAY_CALENDAR_ROWS,
  FORMULA_MINIS_WEEKDAY_PROGRAM_DATES,
} from '@/lib/marketing/formula-minis-public-content'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import {
  FORMULA_MINIS_SIX_WEEK,
  FORMULA_SUNDAY_CHILD_PROGRAM_10_WK,
} from '@/lib/marketing/public-pricing'

export const metadata: Metadata = {
  title: 'Formula Minis',
  description:
    'Formula Minis weekday program (ages 2–3) and Sunday Weekend Program (ages 2–5) at Formula Soccer Center — schedules, capacity, and published pricing ($300 / $500).',
}

const tableWrap = 'not-prose overflow-x-auto rounded-lg border border-formula-frost/12 bg-formula-paper/[0.02]'
const tableClass = 'w-full min-w-[480px] border-collapse font-mono text-[11px] text-formula-frost/90'

export default function MinisPage() {
  return (
    <MarketingInnerPage
      wide
      eyebrow="Children's programming"
      title="Formula Minis & Sunday weekend"
      intro={`Formula Minis covers our youngest players: weekday blocks for ages 2–3 (${FORMULA_MINIS_SIX_WEEK.priceUsd} / ${FORMULA_MINIS_SIX_WEEK.sessionsInPack}-session season package) and the Sunday Weekend Program for ages 2–5 (${FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.priceUsd} / ${FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.sessionsInPack} scheduled Sundays). Everything below matches the published v4 family guide.`}
    >
      <nav className="not-prose mb-10 flex flex-wrap gap-2 border-b border-formula-frost/10 pb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-formula-mist">
        <a href="#overview" className="text-formula-volt hover:underline">
          Overview
        </a>
        <span className="text-formula-frost/30">·</span>
        <a href="#weekday-package" className="hover:text-formula-paper hover:underline">
          Weekday · ${FORMULA_MINIS_SIX_WEEK.priceUsd}
        </a>
        <span className="text-formula-frost/30">·</span>
        <a href="#sunday-weekend" className="hover:text-formula-paper hover:underline">
          Sunday weekend · ${FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.priceUsd}
        </a>
        <span className="text-formula-frost/30">·</span>
        <a href="#policies" className="hover:text-formula-paper hover:underline">
          Policies
        </a>
      </nav>

      <section id="overview" className="scroll-mt-28 space-y-4">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-formula-mist">Overview</h2>
        <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-formula-frost/88">
          <li>
            <strong className="text-formula-paper">Weekday Formula Minis</strong> (ages 2–3): Monday, Wednesday, and Friday; two session times per day; you enroll in{' '}
            <strong>one</strong> session time (A or B) for the full 6-week season.
          </li>
          <li>
            <strong className="text-formula-paper">Sunday Weekend Program</strong> (ages 2–5): four age-specific sessions on Sunday — Formula Minis for ages 2 and
            3, Formula Juniors for ages 4 and 5 — each with its own weekly time and length (30 or 45 minutes).
          </li>
          <li>
            <strong className="text-formula-paper">Rosters</strong>: after you pay, link your child in the parent portal (U6 band for weekday Minis ages 2–3),
            then book the matching published block on the schedule.
          </li>
        </ul>
        <p className="text-sm text-formula-frost/75">
          Older youth session packages and memberships are on the{' '}
          <Link href={MARKETING_HREF.youthMembership} className="text-formula-volt underline-offset-2 hover:underline">
            programs &amp; pricing
          </Link>{' '}
          page — not the same product as Minis packs below.
        </p>
      </section>

      <section id="weekday-package" className="scroll-mt-28 mt-14 space-y-6 border-t border-formula-frost/10 pt-12">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-formula-mist">Weekday · Formula Minis (ages 2–3)</h2>
        <div className="rounded-xl border border-formula-volt/20 bg-formula-volt/[0.06] p-5 md:p-6">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt">Published package</p>
          <p className="mt-2 font-mono text-2xl font-bold tabular-nums text-formula-paper">
            ${FORMULA_MINIS_SIX_WEEK.priceUsd}{' '}
            <span className="text-base font-medium text-formula-frost/80">
              · {FORMULA_MINIS_SIX_WEEK.sessionsInPack} sessions · ${FORMULA_MINIS_SIX_WEEK.perSessionUsd}/session effective
            </span>
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-formula-frost/90">{FORMULA_MINIS_SIX_WEEK.summary}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-mist">Session times</h3>
            <ul className="mt-3 space-y-2 text-sm text-formula-frost/88">
              <li>
                <strong className="text-formula-paper">Session A</strong> · 10:00–10:30 AM
              </li>
              <li>
                <strong className="text-formula-paper">Session B</strong> · 10:45–11:15 AM
              </li>
              <li>30 minutes each · Performance Center</li>
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-mist">Enrollment &amp; capacity</h3>
            <ul className="mt-3 space-y-2 text-sm text-formula-frost/88">
              <li>Minimum <strong className="text-formula-paper">6</strong> participants per session (may cancel or consolidate below that)</li>
              <li>Maximum <strong className="text-formula-paper">24</strong> per session</li>
              <li>6-week package only — no drop-ins</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-mist">Program dates</h3>
          <p className="mt-2 text-sm text-formula-frost/80">
            {FORMULA_MINIS_WEEKDAY_PROGRAM_DATES.seasonLabel}. {FORMULA_MINIS_WEEKDAY_PROGRAM_DATES.mondayNote}
          </p>
          <div className={`${tableWrap} mt-4`}>
            <table className={tableClass}>
              <thead>
                <tr className="border-b border-formula-frost/15 text-left text-formula-mist">
                  <th className="p-3 pr-4 font-medium">Week</th>
                  <th className="p-3 pr-4 font-medium">Monday</th>
                  <th className="p-3 pr-4 font-medium">Wednesday</th>
                  <th className="p-3 font-medium">Friday</th>
                </tr>
              </thead>
              <tbody>
                {FORMULA_MINIS_WEEKDAY_CALENDAR_ROWS.map((r) => (
                  <tr key={r.week} className="border-b border-formula-frost/[0.06]">
                    <td className="p-3 pr-4 text-formula-paper/95">{r.week}</td>
                    <td className="p-3 pr-4">{r.mon}</td>
                    <td className="p-3 pr-4">{r.wed}</td>
                    <td className="p-3">{r.fri}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-mist">Checkout · choose day &amp; session</h3>
          <p className="mt-2 text-sm text-formula-frost/80">Stripe charges {FORMULA_MINIS_SIX_WEEK.label} at checkout ({FORMULA_MINIS_SIX_WEEK.priceUsd} USD).</p>
          <div className="mt-5 max-w-xl">
            <FormulaMinisSixWeekCheckout />
          </div>
        </div>
      </section>

      <section id="sunday-weekend" className="scroll-mt-28 mt-14 space-y-6 border-t border-formula-frost/10 pt-12">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-formula-mist">Sunday · Weekend program (ages 2–5)</h2>
        <div className="rounded-xl border border-formula-frost/18 bg-formula-paper/[0.04] p-5 md:p-6">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Published package</p>
          <p className="mt-2 font-mono text-2xl font-bold tabular-nums text-formula-paper">
            ${FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.priceUsd}{' '}
            <span className="text-base font-medium text-formula-frost/80">
              · {FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.sessionsInPack} Sundays · ${FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.perSessionUsd}/Sunday effective
            </span>
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-formula-frost/90">{FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.summary}</p>
          <p className="mt-3 text-sm text-formula-frost/75">
            Season {FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.startDateYmd} → {FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.endDateYmd}. Skipped:{' '}
            {FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.skippedSundayNotes.join(' · ')}. Capacity min {FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.minEnrollment} · max{' '}
            {FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.maxCapacity}.
          </p>
        </div>

        <div>
          <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-mist">Sunday session grid</h3>
          <div className={`${tableWrap} mt-4`}>
            <table className={tableClass}>
              <thead>
                <tr className="border-b border-formula-frost/15 text-left text-formula-mist">
                  <th className="p-3 pr-4 font-medium">Program</th>
                  <th className="p-3 pr-4 font-medium">Time</th>
                  <th className="p-3 font-medium">Length</th>
                  <th className="p-3 font-medium">Age</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Formula Minis (age 2)', '9:00–9:30 AM', '30 min', '2 years'],
                  ['Formula Minis (age 3)', '9:45–10:15 AM', '30 min', '3 years'],
                  ['Formula Juniors (age 4)', '10:30–11:15 AM', '45 min', '4 years'],
                  ['Formula Juniors (age 5)', '11:30 AM–12:15 PM', '45 min', '5 years'],
                ].map(([program, time, len, age]) => (
                  <tr key={program} className="border-b border-formula-frost/[0.06]">
                    <td className="p-3 pr-4 text-formula-paper/95">{program}</td>
                    <td className="p-3 pr-4">{time}</td>
                    <td className="p-3 pr-4">{len}</td>
                    <td className="p-3">{age}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-mist">Sunday calendar (10 scheduled weeks)</h3>
          <div className={`${tableWrap} mt-4`}>
            <table className={`${tableClass} min-w-[360px]`}>
              <thead>
                <tr className="border-b border-formula-frost/15 text-left text-formula-mist">
                  <th className="p-3 pr-4 font-medium">Week</th>
                  <th className="p-3 pr-4 font-medium">Date</th>
                  <th className="p-3 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {FORMULA_MINIS_SUNDAY_SEASON_ROWS.map((r, i) => (
                  <tr key={`${r.week}-${r.date}-${i}`} className="border-b border-formula-frost/[0.06]">
                    <td className="p-3 pr-4 text-formula-paper/95">{r.week}</td>
                    <td className="p-3 pr-4">{r.date}</td>
                    <td className="p-3">{r.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-mist">Checkout · choose age slot</h3>
          <p className="mt-2 text-sm text-formula-frost/80">Stripe charges {FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.label} at checkout ({FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.priceUsd} USD).</p>
          <div className="mt-5 max-w-xl">
            <SundayChildProgramCheckout />
          </div>
        </div>
      </section>

      <section id="policies" className="scroll-mt-28 mt-14 space-y-4 border-t border-formula-frost/10 pt-12">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-formula-mist">Policies (summary)</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-formula-frost/85">
          <li>No refunds after enrollment is confirmed.</li>
          <li>No formal make-up sessions; staff may try to place your child in another slot the same week (weekday) or same day (Sunday), subject to capacity — not guaranteed.</li>
          <li>Sunday alternate slots must stay age-appropriate.</li>
        </ul>
        <p className="text-sm text-formula-frost/70">
          Formula Juniors <strong className="text-formula-paper">weekday</strong> programming (ages 4–5) is still being finalized — this page covers Sunday
          weekend ages 4–5 and all weekday Minis (2–3) enrollment.
        </p>
      </section>

      <CtaRow
        primary={{ label: 'Book an assessment', href: MARKETING_HREF.bookAssessmentPortal }}
        secondary={{ label: 'All programs & pricing', href: MARKETING_HREF.youthMembership }}
      />
    </MarketingInnerPage>
  )
}
