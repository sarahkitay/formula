import Link from 'next/link'
import { SummerCamp2026Checkout } from '@/components/marketing/summer-camp-2026-checkout'
import { SectionLabel } from '@/components/marketing/marketing-inner'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { SUMMER_CAMP_2026_MONTH_BUNDLE_CHECKOUT, SUMMER_CAMP_2026_WEEK_CHECKOUT } from '@/lib/marketing/public-pricing'
import { SITE, FACILITY_APPLE_MAPS_URL } from '@/lib/site-config'
import { SUMMER_CAMP_2026, SUMMER_CAMP_2026_WEEKS } from '@/lib/marketing/summer-camp-2026-data'

const facilityAssets = [
  { icon: '🤖', name: 'Footbot', line: 'Automated ball return · high-rep first touch' },
  { icon: '🧠', name: 'Speed Brain', line: 'Cognitive reaction panels · decisions under pressure' },
  { icon: '🎯', name: 'Double Speed Court', line: '9-box reactive screen · two groups of six' },
  { icon: '⚡', name: 'Speed Track', line: 'Acceleration, deceleration, sprint quality' },
  { icon: '🏟', name: 'Performance Center', line: 'Indoor tactical & skill arena · coach-led blocks' },
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
    <div className="not-prose min-w-0 space-y-12">
      <header className="space-y-3">
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

      <section aria-labelledby="sc-themes-heading">
        <SectionLabel id="sc-themes-heading">Themed weeks</SectionLabel>
        <p className="mt-3 max-w-2xl text-sm text-formula-frost/80">
          Each theme runs twice across the summer (weeks 1 &amp; 5, 2 &amp; 6, 3 &amp; 7, 4 &amp; 8) so families can align travel or double down on a favorite block.
        </p>
        <div className="mt-6 overflow-x-auto rounded-lg border border-formula-frost/12">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-formula-frost/12 bg-formula-paper/[0.04] font-mono text-[10px] uppercase tracking-[0.14em] text-formula-mist">
                <th className="px-3 py-2.5 font-medium">Week</th>
                <th className="px-3 py-2.5 font-medium">Dates</th>
                <th className="px-3 py-2.5 font-medium">Theme</th>
                <th className="px-3 py-2.5 font-medium">Featured assets</th>
              </tr>
            </thead>
            <tbody className="text-formula-frost/85">
              {SUMMER_CAMP_2026_WEEKS.map(row => (
                <tr key={row.week} className="border-b border-formula-frost/8 last:border-0">
                  <td className="px-3 py-2.5 font-mono text-[11px] text-formula-paper">{row.week}</td>
                  <td className="px-3 py-2.5">{row.datesLabel}</td>
                  <td className="px-3 py-2.5">
                    <span className="font-medium text-formula-paper">{row.themeTitle}</span>
                    <span className="mt-0.5 block text-[12px] text-formula-frost/70">{row.themeTagline}</span>
                  </td>
                  <td className="px-3 py-2.5 text-[13px]">{row.primaryAssets}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="sc-assets-heading">
        <SectionLabel id="sc-assets-heading">Facility assets · every week</SectionLabel>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {facilityAssets.map(a => (
            <li key={a.name} className="rounded-lg border border-formula-frost/12 bg-formula-paper/[0.03] px-4 py-3">
              <span className="font-mono text-[11px] font-semibold text-formula-paper">
                {a.icon} {a.name}
              </span>
              <p className="mt-1 text-[13px] leading-snug text-formula-frost/75">{a.line}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sc-schedule-heading">
        <SectionLabel id="sc-schedule-heading">Daily shape (Mon–Fri)</SectionLabel>
        <div className="mt-4 overflow-x-auto rounded-lg border border-formula-frost/12">
          <table className="w-full min-w-[400px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-formula-frost/12 bg-formula-paper/[0.04] font-mono text-[10px] uppercase tracking-[0.14em] text-formula-mist">
                <th className="px-3 py-2.5 font-medium">Time</th>
                <th className="px-3 py-2.5 font-medium">Block</th>
              </tr>
            </thead>
            <tbody className="text-formula-frost/85">
              {scheduleRows.map(([time, detail]) => (
                <tr key={time} className="border-b border-formula-frost/8 last:border-0">
                  <td className="whitespace-nowrap px-3 py-2.5 font-mono text-[11px] text-formula-paper">{time}</td>
                  <td className="px-3 py-2.5 leading-relaxed">{detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="sc-koth-heading">
        <SectionLabel id="sc-koth-heading">King-of-the-hill · game format</SectionLabel>
        <ul className="mt-4 max-w-2xl space-y-2 text-sm leading-relaxed text-formula-frost/85">
          <li className="flex gap-2">
            <span className="text-formula-volt">1</span>
            Three teams per field · two teams compete while the third trains at a facility station.
          </li>
          <li className="flex gap-2">
            <span className="text-formula-volt">2</span>
            Game ends at two goals or eight minutes — winner stays; rotating side re-enters from training.
          </li>
          <li className="flex gap-2">
            <span className="text-formula-volt">3</span>
            Waiting sides stay in high-rep work (Footbot, Speed Brain, Speed Track, Performance Center) instead of standing in line.
          </li>
        </ul>
      </section>

      <section aria-labelledby="sc-pricing-heading">
        <SectionLabel id="sc-pricing-heading">Pricing · 2026</SectionLabel>
        <div className="mt-4 grid max-w-3xl gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-formula-frost/14 bg-formula-paper/[0.04] p-5">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-volt">One week</p>
            <p className="mt-2 font-mono text-2xl font-semibold text-formula-paper">${SUMMER_CAMP_2026_WEEK_CHECKOUT.priceUsd}</p>
            <p className="mt-2 text-sm text-formula-frost/80">Mon–Fri · {SUMMER_CAMP_2026.dayHours}</p>
            <p className="mt-2 text-[12px] text-formula-mist/90">Pick any of the eight themed weeks at registration.</p>
          </div>
          <div className="rounded-xl border border-formula-volt/25 bg-formula-volt/[0.06] p-5">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-volt">Four-week bundle</p>
            <p className="mt-2 font-mono text-2xl font-semibold text-formula-paper">${SUMMER_CAMP_2026_MONTH_BUNDLE_CHECKOUT.priceUsd}</p>
            <p className="mt-2 text-sm text-formula-frost/90">
              Full four-week block: <strong className="text-formula-paper">weeks 1–4</strong> (June) or <strong className="text-formula-paper">weeks 5–8</strong>{' '}
              (July–August).
            </p>
            <p className="mt-2 text-[12px] text-formula-frost/80">Bundled month pricing replaces legacy multi-tier day rates.</p>
          </div>
        </div>
      </section>

      <div className="max-w-2xl space-y-2 border-t border-formula-frost/10 pt-8 text-sm text-formula-frost/80">
        <p>
          <a href={`tel:${SITE.publicPhoneTel}`} className="text-formula-volt underline-offset-2 hover:underline">
            {SITE.publicPhoneDisplay}
          </a>
          <span className="mx-2 text-formula-frost/40">·</span>
          <a href={`mailto:${SUMMER_CAMP_2026.inquiriesEmail}`} className="text-formula-volt underline-offset-2 hover:underline">
            {SUMMER_CAMP_2026.inquiriesEmail}
          </a>
        </p>
        <p>
          <a href={FACILITY_APPLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="text-formula-volt underline-offset-2 hover:underline">
            {SITE.facilityAddressLine}
          </a>
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-formula-mist">
          <Link href={MARKETING_HREF.home} className="text-formula-volt underline-offset-2 hover:underline">
            formulasoccer.com
          </Link>
          {' · '}
          <Link href={MARKETING_HREF.camps} className="text-formula-volt underline-offset-2 hover:underline">
            Camps overview
          </Link>
        </p>
      </div>

      <SummerCamp2026Checkout />

      <p className="text-center font-mono text-[10px] text-formula-mist sm:text-left">
        <Link href={MARKETING_HREF.events} className="text-formula-volt underline-offset-2 hover:underline">
          ← Events hub
        </Link>
      </p>
    </div>
  )
}
