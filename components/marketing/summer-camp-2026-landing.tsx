import Link from 'next/link'
import { SummerCamp2026Checkout } from '@/components/marketing/summer-camp-2026-checkout'
import { SummerCamp2026WeeksTable } from '@/components/marketing/summer-camp-2026-weeks-table'
import { SectionLabel } from '@/components/marketing/marketing-inner'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { SUMMER_CAMP_2026_MONTH_BUNDLE_CHECKOUT, SUMMER_CAMP_2026_WEEK_CHECKOUT } from '@/lib/marketing/public-pricing'
import { SITE, FACILITY_APPLE_MAPS_URL } from '@/lib/site-config'
import { SUMMER_CAMP_2026 } from '@/lib/marketing/summer-camp-2026-data'

const facilityAssets = [
  { name: 'Footbot', line: 'Automated ball return · high-rep first touch' },
  { name: 'Speed Brain', line: 'Cognitive reaction panels · decisions under pressure' },
  { name: 'Double Speed Court', line: '9-box reactive screen · two groups of six' },
  { name: 'Speed Track', line: 'Acceleration, deceleration, sprint quality' },
  { name: 'Performance Center', line: 'Indoor tactical & skill arena · coach-led blocks' },
]

const scheduleRows: [string, string][] = [
  ['9:00–9:20', 'Arrival · check-in · teams & warmup'],
  ['9:20–10:20', 'Block 1 · field games + themed station (rotates daily)'],
  ['10:20–11:20', 'Block 2 · full rotation to next station'],
  ['11:20–12:20', 'Block 3 · all groups complete the daily circuit'],
  ['12:20–1:00', 'Lunch · bring your own (no nuts; staff supervision)'],
  ['1:00–2:15', 'Afternoon block · small-sided + application tied to weekly theme'],
  ['2:15–2:30', 'Pickup · debrief & dismissal'],
]

export function SummerCamp2026Landing() {
  return (
    <div className="not-prose min-w-0 space-y-8 sm:space-y-10 md:space-y-12">
      <header className="space-y-2.5 sm:space-y-3">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-formula-mist">Formula Soccer Center</p>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.28em] text-formula-volt/95">{SUMMER_CAMP_2026.seasonLabel}</p>
        <p className="text-sm text-formula-frost/85">
          {SUMMER_CAMP_2026.ageRange} · weekly registration · one primary theme per week · eight weeks total
        </p>
        <p className="max-w-2xl text-sm leading-relaxed text-formula-frost/88">
          Mon–Fri day camp · <strong className="text-formula-paper">{SUMMER_CAMP_2026.dayHours}</strong> · full-facility rotations across Formula training assets.
          {SUMMER_CAMP_2026.capacityNote}
        </p>
      </header>

      <section id="themes" aria-labelledby="sc-themes-heading" className="scroll-mt-24 sm:scroll-mt-28">
        <SectionLabel id="sc-themes-heading">Themed weeks</SectionLabel>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-formula-frost/80">
          Each theme runs twice across the summer (weeks 1 &amp; 5, 2 &amp; 6, 3 &amp; 7, 4 &amp; 8) so families can align travel or double down on a favorite block. Expand any week for a fuller theme description, then use{' '}
          <strong className="text-formula-paper">Pay now</strong> to jump to secure signup below.
        </p>
        <SummerCamp2026WeeksTable />
      </section>

      <section aria-labelledby="sc-assets-heading" className="scroll-mt-24 sm:scroll-mt-28">
        <SectionLabel id="sc-assets-heading">Facility assets · every week</SectionLabel>
        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 sm:gap-3">
          {facilityAssets.map(a => (
            <li key={a.name} className="rounded-lg border border-formula-frost/12 bg-formula-paper/[0.03] px-4 py-3.5 sm:py-3">
              <span className="font-mono text-[11px] font-semibold text-formula-paper">{a.name}</span>
              <p className="mt-1 text-[13px] leading-snug text-formula-frost/75">{a.line}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sc-schedule-heading" className="scroll-mt-24 sm:scroll-mt-28">
        <SectionLabel id="sc-schedule-heading">Daily shape (Mon–Fri)</SectionLabel>
        <div className="-mx-4 mt-4 overflow-x-auto border-y border-formula-frost/12 sm:mx-0 sm:rounded-lg sm:border">
          <table className="w-full min-w-[340px] border-collapse text-left text-[13px] sm:min-w-[400px] sm:text-sm">
            <thead>
              <tr className="border-b border-formula-frost/12 bg-formula-paper/[0.04] font-mono text-[9px] uppercase tracking-[0.12em] text-formula-mist sm:text-[10px] sm:tracking-[0.14em]">
                <th className="px-3 py-3 font-medium sm:py-2.5">Time</th>
                <th className="px-3 py-3 font-medium sm:py-2.5">Block</th>
              </tr>
            </thead>
            <tbody className="text-formula-frost/85">
              {scheduleRows.map(([time, detail]) => (
                <tr key={time} className="border-b border-formula-frost/8 last:border-0">
                  <td className="whitespace-nowrap px-3 py-3.5 font-mono text-[11px] text-formula-paper sm:py-2.5">{time}</td>
                  <td className="px-3 py-3.5 leading-relaxed sm:py-2.5">{detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="sc-koth-heading" className="scroll-mt-24 sm:scroll-mt-28">
        <SectionLabel id="sc-koth-heading">King-of-the-hill · game format</SectionLabel>
        <ul className="mt-4 max-w-2xl space-y-3 text-sm leading-relaxed text-formula-frost/85 sm:space-y-2">
          <li className="flex gap-3 sm:gap-2">
            <span className="shrink-0 font-mono text-formula-volt">1</span>
            Three teams per field · two teams compete while the third trains at a facility station.
          </li>
          <li className="flex gap-3 sm:gap-2">
            <span className="shrink-0 font-mono text-formula-volt">2</span>
            Game ends at two goals or eight minutes - winner stays; rotating side re-enters from training.
          </li>
          <li className="flex gap-3 sm:gap-2">
            <span className="shrink-0 font-mono text-formula-volt">3</span>
            Waiting sides stay in high-rep work (Footbot, Speed Brain, Speed Track, Performance Center) instead of standing in line.
          </li>
        </ul>
      </section>

      <section id="pricing" aria-labelledby="sc-pricing-heading" className="scroll-mt-24 sm:scroll-mt-28">
        <SectionLabel id="sc-pricing-heading">Pricing · 2026</SectionLabel>
        <div className="mt-4 grid max-w-3xl gap-3 sm:grid-cols-2 sm:gap-4">
          <Link
            href="#register"
            className="block rounded-xl border border-formula-frost/14 bg-formula-paper/[0.04] p-4 no-underline transition-colors active:bg-formula-paper/[0.06] sm:p-5 sm:hover:border-formula-volt/35 sm:hover:bg-formula-paper/[0.07]"
          >
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-volt">One week</p>
            <p className="mt-2 font-mono text-2xl font-semibold text-formula-paper">${SUMMER_CAMP_2026_WEEK_CHECKOUT.priceUsd}</p>
            <p className="mt-2 text-sm text-formula-frost/80">Mon–Fri · {SUMMER_CAMP_2026.dayHours}</p>
            <p className="mt-2 text-[12px] text-formula-mist/90">Pick any of the eight themed weeks at registration.</p>
            <p className="mt-3 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-formula-volt">Continue to checkout →</p>
          </Link>
          <Link
            href="#register"
            className="block rounded-xl border border-formula-volt/25 bg-formula-volt/[0.06] p-4 no-underline transition-colors active:bg-formula-volt/[0.12] sm:p-5 sm:hover:border-formula-volt/50 sm:hover:bg-formula-volt/[0.1]"
          >
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-volt">Four-week bundle</p>
            <p className="mt-2 font-mono text-2xl font-semibold text-formula-paper">${SUMMER_CAMP_2026_MONTH_BUNDLE_CHECKOUT.priceUsd}</p>
            <p className="mt-2 text-sm text-formula-frost/90">
              Full four-week block: <strong className="text-formula-paper">weeks 1–4</strong> (June) or <strong className="text-formula-paper">weeks 5–8</strong>{' '}
              (July–August).
            </p>
            <p className="mt-2 text-[12px] text-formula-frost/80">Bundled month pricing replaces legacy multi-tier day rates.</p>
            <p className="mt-3 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-formula-volt">Continue to checkout →</p>
          </Link>
        </div>
      </section>

      <div className="max-w-2xl space-y-3 border-t border-formula-frost/10 pt-7 text-sm leading-relaxed text-formula-frost/80 sm:space-y-2 sm:pt-8">
        <p className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2">
          <a
            href={`tel:${SITE.publicPhoneTel}`}
            className="inline-flex min-h-11 items-center text-formula-volt underline-offset-2 hover:underline sm:min-h-0"
          >
            {SITE.publicPhoneDisplay}
          </a>
          <span className="hidden text-formula-frost/40 sm:inline">·</span>
          <a
            href={`mailto:${SUMMER_CAMP_2026.inquiriesEmail}`}
            className="inline-flex min-h-11 items-center break-all text-formula-volt underline-offset-2 hover:underline sm:min-h-0"
          >
            {SUMMER_CAMP_2026.inquiriesEmail}
          </a>
        </p>
        <p>
          <a
            href={FACILITY_APPLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 text-formula-volt underline-offset-2 hover:underline sm:min-h-0"
          >
            {SITE.facilityAddressLine}
          </a>
        </p>
        <p className="flex flex-col gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-formula-mist sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2">
          <Link
            href={MARKETING_HREF.home}
            className="inline-flex min-h-11 items-center text-formula-volt underline-offset-2 hover:underline sm:min-h-0"
          >
            formulasoccer.com
          </Link>
          <span className="hidden text-formula-frost/40 sm:inline">·</span>
          <Link
            href={MARKETING_HREF.camps}
            className="inline-flex min-h-11 items-center text-formula-volt underline-offset-2 hover:underline sm:min-h-0"
          >
            Camps overview
          </Link>
        </p>
      </div>

      <SummerCamp2026Checkout />

      <p className="pt-2 text-center font-mono text-[10px] text-formula-mist sm:pt-0 sm:text-left">
        <Link href={MARKETING_HREF.events} className="text-formula-volt underline-offset-2 hover:underline">
          ← Events hub
        </Link>
      </p>
    </div>
  )
}
