import Link from 'next/link'
import { FridayNightFriendliesCheckout } from '@/components/marketing/friday-night-friendlies-checkout'
import { SectionLabel } from '@/components/marketing/marketing-inner'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { FRIDAY_NIGHT_FRIENDLIES_CHECKOUT } from '@/lib/marketing/public-pricing'
import { SITE } from '@/lib/site-config'

const INSTAGRAM_HREF = 'https://www.instagram.com/formulasoccercenter/'

const statTiles: { k: string; v: string; sub?: string }[] = [
  { k: '6–13', v: 'Ages', sub: 'Grades 1–7' },
  { k: '5:30', v: 'Arrival', sub: 'Check-in' },
  { k: '6:00–7:30', v: 'Games', sub: '90 minutes' },
  { k: `$${FRIDAY_NIGHT_FRIENDLIES_CHECKOUT.pricePerPlayerUsd}`, v: 'Per player', sub: 'Walk-ups OK' },
  { k: 'Multi', v: 'Fields', sub: 'Age-split' },
]

export function FridayNightFriendliesLanding() {
  return (
    <div className="not-prose min-w-0 space-y-12">
      <div>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-formula-mist">Formula Soccer Center</p>
        <p className="mt-1 text-sm text-formula-frost/85">Technology-driven youth soccer training</p>
        <p className="mt-4 inline-block border border-formula-volt/35 bg-formula-volt/[0.08] px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-volt">
          Friday Night Friendlies
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-formula-frost/88">
          Coach-run pickup soccer for ages 6–13. Starting <strong className="text-formula-paper">Friday, May 8, 2026</strong>.
        </p>
        <p className="mt-4 max-w-2xl text-center font-mono text-[11px] font-medium uppercase leading-relaxed tracking-[0.12em] text-formula-volt/95 sm:text-left">
          ★ Be there for our very first Friday Night Friendlies ★
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-px rounded-lg border border-formula-frost/12 bg-formula-frost/10 sm:grid-cols-3 lg:grid-cols-5">
        {statTiles.map(t => (
          <li key={t.v} className="bg-formula-base/90 px-3 py-4 text-center sm:px-4">
            <p className="font-mono text-lg font-semibold tracking-tight text-formula-paper">{t.k}</p>
            <p className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-mist">{t.v}</p>
            {t.sub ? <p className="mt-0.5 text-[11px] text-formula-frost/70">{t.sub}</p> : null}
          </li>
        ))}
      </ul>

      <div className="max-w-2xl space-y-4 text-sm leading-relaxed text-formula-frost/85">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-paper">Real games. Balanced teams. No pressure.</p>
        <p>
          Friday Night Friendlies is coach-run pickup soccer at Formula — a step up from free play, but a long way from a league. Our coaches build balanced
          teams every week and run short, fast-paced small-sided King of the Hill games. Kids show up, get matched up, and play the kind of soccer they actually
          want to play on a Friday night.
        </p>
      </div>

      <section aria-labelledby="fnf-how-heading" className="scroll-mt-28">
        <SectionLabel id="fnf-how-heading">How a Friendlies night runs</SectionLabel>
        <ol className="mt-6 space-y-8 border-l border-formula-frost/15 pl-6">
          <li className="relative">
            <span className="absolute -left-[calc(0.5rem+1px)] top-1.5 h-2 w-2 -translate-x-1/2 rounded-full bg-formula-volt/90" aria-hidden />
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-volt">5:30 PM</p>
            <p className="mt-1 font-medium text-formula-paper">Arrive &amp; match up</p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-formula-frost/82">
              Players check in and warm up. Coaches form balanced teams based on who&apos;s there — no rosters, no pre-set sides. Every kid plays.
            </p>
          </li>
          <li className="relative">
            <span className="absolute -left-[calc(0.5rem+1px)] top-1.5 h-2 w-2 -translate-x-1/2 rounded-full bg-formula-volt/90" aria-hidden />
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-volt">6:00 PM</p>
            <p className="mt-1 font-medium text-formula-paper">Game on</p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-formula-frost/82">
              Concurrent games on separate fields, split by age (younger / middle / older as registration allows). Short games, King of the Hill, coaches running
              the show.
            </p>
          </li>
          <li className="relative">
            <span className="absolute -left-[calc(0.5rem+1px)] top-1.5 h-2 w-2 -translate-x-1/2 rounded-full bg-formula-volt/90" aria-hidden />
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-volt">7:30 PM</p>
            <p className="mt-1 font-medium text-formula-paper">Crown the kings</p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-formula-frost/82">
              &quot;Kings of the Hill&quot; honors for the top team on each field. Plus a Coach&apos;s Pick MVP per field for hustle, sportsmanship, or play of the
              night.
            </p>
          </li>
        </ol>
      </section>

      <section aria-labelledby="fnf-format-heading">
        <SectionLabel id="fnf-format-heading">The format, quickly</SectionLabel>
        <ul className="mt-4 max-w-2xl space-y-2.5 text-sm leading-relaxed text-formula-frost/85">
          <li className="flex gap-2">
            <span className="shrink-0 text-formula-volt" aria-hidden>
              ▸
            </span>
            <span>Coach-run pickup — short games, balanced teams</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0 text-formula-volt" aria-hidden>
              ▸
            </span>
            <span>Small-sided games — more touches, more action than full-field</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0 text-formula-volt" aria-hidden>
              ▸
            </span>
            <span>King of the Hill: most wins on the night = Kings of the Hill</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0 text-formula-volt" aria-hidden>
              ▸
            </span>
            <span>Age-split fields running concurrently — every kid plays kids their size</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0 text-formula-volt" aria-hidden>
              ▸
            </span>
            <span>Coach&apos;s Pick MVP recognized every week for hustle, sportsmanship, or play of the night</span>
          </li>
        </ul>
      </section>

      <section aria-labelledby="fnf-bring-heading">
        <SectionLabel id="fnf-bring-heading">What to bring</SectionLabel>
        <dl className="mt-4 grid max-w-xl gap-3 sm:grid-cols-2">
          {[
            { term: 'Turf shoes', desc: 'No cleats' },
            { term: 'Shin guards', desc: 'Required' },
            { term: 'Water bottle', desc: 'Labeled' },
            { term: 'Energy', desc: "It's Friday night" },
          ].map(row => (
            <div key={row.term} className="rounded-lg border border-formula-frost/12 bg-formula-paper/[0.03] px-4 py-3">
              <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-formula-paper">{row.term}</dt>
              <dd className="mt-1 text-[13px] text-formula-frost/75">{row.desc}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        aria-labelledby="fnf-opening-heading"
        className="rounded-xl border border-formula-volt/25 bg-formula-volt/[0.06] px-5 py-6 sm:px-7"
      >
        <p id="fnf-opening-heading" className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-formula-volt">
          Opening night
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-formula-frost/90">
          This is our very first Friday Night Friendlies. Bring your soccer-loving kid out for the launch and be part of something new from day one. Group photo,
          special recognition for our inaugural players, and a Friday night they won&apos;t forget. Tell your friends — the more kids on the fields, the better the
          games.
        </p>
      </section>

      <div className="max-w-2xl space-y-3 border-t border-formula-frost/10 pt-8 text-sm text-formula-frost/80">
        <p>
          <strong className="text-formula-paper">Save your spot</strong> — pre-register on this page (secure checkout). Walk-ups welcome at the door.
        </p>
        <p>
          <strong className="text-formula-paper">Friday nights at Formula</strong> · {SITE.facilityAddressLine}
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.1em]">
          <Link href={MARKETING_HREF.home} className="text-formula-volt underline-offset-2 hover:underline">
            formulasoccer.com
          </Link>
          <span className="mx-2 text-formula-frost/40">·</span>
          <a href={INSTAGRAM_HREF} target="_blank" rel="noopener noreferrer" className="text-formula-volt underline-offset-2 hover:underline">
            Follow us on Instagram
          </a>
        </p>
      </div>

      <FridayNightFriendliesCheckout />

      <p className="text-center font-mono text-[10px] text-formula-mist sm:text-left">
        <Link href={MARKETING_HREF.events} className="text-formula-volt underline-offset-2 hover:underline">
          ← Events hub
        </Link>
      </p>
    </div>
  )
}
