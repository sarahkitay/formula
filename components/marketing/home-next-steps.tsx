import Link from 'next/link'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { SITE_VOICE } from '@/lib/marketing/site-voice'

/**
 * Homepage closing band: programs list + primary CTAs (centered).
 */
export function HomeNextSteps() {
  return (
    <section
      id="next-steps"
      className="border-t border-formula-frost/10 bg-formula-deep/[0.35]"
      aria-labelledby="home-next-steps-heading"
    >
      <div className="mx-auto max-w-[1200px] px-6 py-16 text-center md:py-20">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-formula-mist">Programs</p>
        <h2 id="home-next-steps-heading" className="sr-only">
          Program overview
        </h2>
        <ul className="mx-auto mt-6 max-w-[62ch] list-none space-y-3 p-0 text-center text-[15px] leading-relaxed text-formula-frost/85">
          {SITE_VOICE.homeProgramsItems.map(row => (
            <li key={row.label}>
              <strong className="font-medium text-formula-paper">{row.label}:</strong> {row.description}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href={MARKETING_HREF.youthMembership}
            className="inline-flex h-11 w-fit items-center border border-formula-frost/18 bg-formula-paper/[0.05] px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-paper transition-colors hover:border-formula-frost/28"
          >
            View Programs
          </Link>
          <Link
            href={MARKETING_HREF.bookAssessmentPortal}
            className="inline-flex h-11 w-fit items-center border border-formula-volt/50 bg-formula-volt px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-base transition-[filter] duration-300 hover:brightness-105"
          >
            Book an Assessment
          </Link>
        </div>
      </div>
    </section>
  )
}
