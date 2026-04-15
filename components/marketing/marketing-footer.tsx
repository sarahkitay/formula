import Link from 'next/link'
import { getPrimaryNav, MARKETING_HREF } from '@/lib/marketing/nav'

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
  title: 'Programs',
  links: [
  { label: 'Youth membership', href: MARKETING_HREF.youthMembership },
  { label: 'The Formula', href: MARKETING_HREF.fpi },
  { label: 'Friday circuit', href: MARKETING_HREF.fridayCircuit },
  { label: 'Clinics', href: MARKETING_HREF.clinics },
  { label: 'Camps', href: MARKETING_HREF.camps },
  { label: 'Adults', href: MARKETING_HREF.adults },
  ],
  },
  {
  title: 'Facility & events',
  links: [
  { label: 'Facility', href: MARKETING_HREF.facility },
  { label: 'Field rentals', href: MARKETING_HREF.rentals },
  { label: 'Birthday parties', href: MARKETING_HREF.parties },
  { label: 'Footbot', href: MARKETING_HREF.footbot },
  { label: 'Tournaments', href: MARKETING_HREF.tournaments },
  { label: 'Events hub', href: MARKETING_HREF.events },
  ],
  },
  {
  title: 'Formula',
  links: [
  { label: 'What Formula is', href: MARKETING_HREF.whatIsFormula },
  { label: 'Assessments', href: MARKETING_HREF.assessment },
  ],
  },
]

export function MarketingFooter() {
  return (
  <footer className="border-t border-formula-frost/10 bg-formula-base">
  <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
  <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
  <div>
  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-formula-olive">Formula Soccer Center</p>
  <p className="mt-4 max-w-xs text-sm leading-relaxed text-formula-mist">
  Indoor training built on scheduled blocks, coached standards, and a real facility layout, not open-gym noise.
  </p>
  <p className="mt-4 max-w-sm text-xs leading-relaxed text-formula-olive/90">
  Visit and enrollment details are confirmed when you book. No walk-in sales floor: assessment and staff coordination keep the floor disciplined.
  </p>
  <Link
  href={MARKETING_HREF.bookAssessmentPortal}
  className="mt-8 inline-flex h-11 items-center border border-formula-volt/40 bg-formula-volt px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-base hover:brightness-105"
  >
  Book assessment
  </Link>
  </div>
  {COLS.map(col => (
  <div key={col.title}>
  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-mist">{col.title}</p>
  <ul className="mt-4 space-y-2">
  {col.links.map(l => (
  <li key={l.href + l.label}>
  <Link href={l.href} className="text-sm text-formula-frost/80 transition-colors hover:text-formula-paper">
  {l.label}
  </Link>
  </li>
  ))}
  </ul>
  </div>
  ))}
  </div>
  <div className="mt-12 flex flex-col gap-3 border-t border-formula-frost/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-formula-mist">Sign in</p>
  <nav
  aria-label="Member and staff sign-in"
  className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.16em] sm:justify-end sm:gap-x-7"
  >
  <Link href="/login?role=parent" className="text-formula-volt/95 transition-opacity hover:opacity-90">
  Parent portal →
  </Link>
  <Link href="/login?role=coach" className="text-formula-frost/75 transition-colors hover:text-formula-frost">
  Coach →
  </Link>
  <Link
  href="/login?role=admin"
  className="text-formula-olive/90 transition-colors hover:text-formula-mist/80"
  >
  Staff
  </Link>
  </nav>
  </div>
  <div className="mt-8 flex flex-wrap gap-4 border-t border-formula-frost/10 pt-8 font-mono text-[10px] uppercase tracking-[0.16em] text-formula-olive">
  {getPrimaryNav().map(n => (
  <Link key={n.href} href={n.href} className="hover:text-formula-mist">
  {n.label}
  </Link>
  ))}
  </div>
  <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.16em] text-formula-olive/90">
  <Link href={MARKETING_HREF.privacy} className="hover:text-formula-mist">
  Privacy policy
  </Link>
  <Link href={MARKETING_HREF.terms} className="hover:text-formula-mist">
  Terms and conditions
  </Link>
  </div>
  <p className="mt-8 text-center text-xs text-formula-olive">© {new Date().getFullYear()} Formula Soccer Center</p>
  </div>
  </footer>
  )
}
