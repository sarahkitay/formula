import Link from 'next/link'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { SITE_VOICE } from '@/lib/marketing/site-voice'

/**
 * Homepage: final CTA before site-wide email capture.
 */
export function HomeStartHereSection() {
  return (
    <section className="border-t border-formula-frost/10 bg-formula-deep/[0.35]" aria-labelledby="home-start-here-heading">
      <div className="mx-auto max-w-[1200px] px-6 py-16 text-center md:py-20">
        <h2
          id="home-start-here-heading"
          className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-formula-mist"
        >
          Start here
        </h2>
        <p className="mx-auto mt-5 max-w-[52ch] text-[15px] leading-relaxed text-formula-frost/85">{SITE_VOICE.homeStartHereBody}</p>
        <div className="mt-8 flex justify-center">
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
