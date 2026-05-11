import { FormulaMinisSixWeekCheckout } from '@/components/marketing/formula-minis-six-week-checkout'
import { SundayChildProgramCheckout } from '@/components/marketing/sunday-child-program-checkout'
import { marketingInnerH1CompactClassName } from '@/lib/marketing/display-typography'
import { FORMULA_MINIS_SIX_WEEK, FORMULA_SUNDAY_CHILD_PROGRAM_10_WK } from '@/lib/marketing/public-pricing'
import { cn } from '@/lib/utils'

const tableWrap = 'not-prose overflow-x-auto rounded-lg border border-formula-frost/12 bg-formula-paper/[0.02]'
const tableClass = 'w-full min-w-[360px] border-collapse font-mono text-[11px] text-formula-frost/90'

/**
 * Formula Minis + Sunday weekend — lives on youth membership (no standalone /minis page).
 */
export function FormulaMinisMembershipSection() {
  const w = FORMULA_MINIS_SIX_WEEK
  const sun = FORMULA_SUNDAY_CHILD_PROGRAM_10_WK

  return (
    <section id="formula-minis" className="scroll-mt-[calc(3.5rem+1rem)] border-b border-formula-frost/10 pb-20 pt-6 md:pb-24 md:pt-8">
      <div className="not-prose mx-auto max-w-[1100px] space-y-10">
        <header className="space-y-4">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-formula-volt">Ages 2–5</p>
          <h2 className={cn(marketingInnerH1CompactClassName, 'max-w-4xl')}>Formula Minis</h2>
          <p className="max-w-[62ch] text-[15px] leading-relaxed text-formula-frost/88">
            Fun intro soccer for ages 2–5. Fixed packs, no drop-ins—pick your slot and commit.
          </p>
          <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-formula-mist">
            <a href="#weekday-package" className="text-formula-volt hover:underline">
              Weekday details
            </a>
            <span className="text-formula-frost/30" aria-hidden>
              |
            </span>
            <a href="#sunday-weekend" className="hover:text-formula-paper hover:underline">
              Sunday details
            </a>
            <span className="text-formula-frost/30" aria-hidden>
              |
            </span>
            <a href="#session-package" className="hover:text-formula-paper hover:underline">
              Older kids →
            </a>
          </nav>
        </header>

        <div id="weekday-package" className="scroll-mt-[calc(3.5rem+1rem)] space-y-6">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-formula-mist">Weekday Minis (ages 2–3)</h3>
          <div className={tableWrap}>
            <table className={tableClass}>
              <caption className="sr-only">Weekday Formula Minis package</caption>
              <thead>
                <tr className="border-b border-formula-frost/15 text-left text-formula-mist uppercase tracking-wide">
                  <th className="p-3 pr-3 font-medium">Package</th>
                  <th className="p-3 pr-3 font-medium">Price</th>
                  <th className="p-3 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 pr-3 align-top text-formula-paper/95">
                    {w.sessionsInPack} sessions (1×/week)
                  </td>
                  <td className="p-3 pr-3 align-top">
                    ${w.priceUsd} (${w.perSessionUsd}/sess)
                  </td>
                  <td className="p-3 align-top text-formula-frost/85">
                    Mon/Wed/Fri · A: 10–10:30 AM or B: 10:45–11:15 AM · May 11–Jun 19 (Mon skips Memorial Day) · Min 6, max 24
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm font-medium text-formula-paper">
            Buy weekday pack (${w.priceUsd}) → choose day + time.
          </p>
          <div className="max-w-xl">
            <FormulaMinisSixWeekCheckout />
          </div>
        </div>

        <div id="sunday-weekend" className="scroll-mt-[calc(3.5rem+1rem)] space-y-6 border-t border-formula-frost/10 pt-12">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-formula-mist">Sunday weekend (ages 2–5)</h3>
          <div className={tableWrap}>
            <table className={`${tableClass} min-w-[420px]`}>
              <caption className="sr-only">Sunday weekend program slots</caption>
              <thead>
                <tr className="border-b border-formula-frost/15 text-left text-formula-mist uppercase tracking-wide">
                  <th className="p-3 pr-3 font-medium">Program</th>
                  <th className="p-3 pr-3 font-medium">Time</th>
                  <th className="p-3 pr-3 font-medium">Length</th>
                  <th className="p-3 font-medium">Price</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Minis (2)', '9–9:30 AM', '30 min', `$${sun.priceUsd}/10 Sundays`],
                  ['Minis (3)', '9:45–10:15 AM', '30 min', `$${sun.priceUsd}/10 Sundays`],
                  ['Juniors (4)', '10:30–11:15 AM', '45 min', `$${sun.priceUsd}/10 Sundays`],
                  ['Juniors (5)', '11:30 AM–12:15 PM', '45 min', `$${sun.priceUsd}/10 Sundays`],
                ].map(([program, time, len, price]) => (
                  <tr key={program} className="border-b border-formula-frost/[0.06] last:border-b-0">
                    <td className="p-3 pr-3 align-top text-formula-paper/95">{program}</td>
                    <td className="p-3 pr-3 align-top">{time}</td>
                    <td className="p-3 pr-3 align-top">{len}</td>
                    <td className="p-3 align-top">{price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-formula-frost/80">
            May 17–Aug 2 (skips Memorial + Father&apos;s Day) · Min {sun.minEnrollment}, max {sun.maxCapacity}.
          </p>
          <p className="text-sm font-medium text-formula-paper">
            Buy Sunday pack (${sun.priceUsd}) → choose age slot.
          </p>
          <div className="max-w-xl">
            <SundayChildProgramCheckout />
          </div>
        </div>

        <div id="formula-minis-policies" className="scroll-mt-[calc(3.5rem+1rem)] space-y-3 border-t border-formula-frost/10 pt-12">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-formula-mist">Policies</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-formula-frost/88">
            <li>No refunds post-enrollment</li>
            <li>No guaranteed makeups (same-week swaps if space)</li>
          </ul>
        </div>

        <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-formula-frost/10 pt-8 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-formula-mist">
          <a href="#weekday-package" className="text-formula-volt hover:underline">
            Weekday details
          </a>
          <span className="text-formula-frost/30" aria-hidden>
            |
          </span>
          <a href="#sunday-weekend" className="hover:text-formula-paper hover:underline">
            Sunday details
          </a>
          <span className="text-formula-frost/30" aria-hidden>
            |
          </span>
          <a href="#session-package" className="hover:text-formula-paper hover:underline">
            Older kids →
          </a>
        </nav>
      </div>
    </section>
  )
}
