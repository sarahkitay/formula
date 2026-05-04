import Link from 'next/link'
import { ScrollFadeIn } from '@/components/marketing/scroll-fade-in'
import { WHAT_WE_OFFER_NOW } from '@/lib/marketing/what-we-offer-now'
import { cn } from '@/lib/utils'

/**
 * Homepage band: current offers as fully clickable cards (entire surface is the link).
 */
export function HomeWhatWeOfferNow() {
  return (
    <section className="border-b border-formula-frost/10 bg-formula-deep" aria-labelledby="home-what-we-offer-heading">
      <div className="mx-auto max-w-[1200px] px-5 py-12 sm:px-6 md:py-16 lg:px-8">
        <ScrollFadeIn>
          <h2
            id="home-what-we-offer-heading"
            className="max-w-2xl font-mono text-[clamp(1.35rem,2.8vw,1.85rem)] font-semibold leading-snug tracking-tight text-formula-paper"
          >
            What we offer right now
          </h2>
          <div className="mt-8 grid gap-3.5 sm:grid-cols-2 sm:gap-4 lg:gap-5">
            {WHAT_WE_OFFER_NOW.map(item => (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  'group relative flex min-h-[9.5rem] flex-col rounded-md border border-formula-frost/15 bg-formula-paper/[0.03] p-5 transition-colors',
                  'hover:border-formula-volt/40 hover:bg-formula-paper/[0.055]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-formula-volt/45 focus-visible:ring-offset-2 focus-visible:ring-offset-formula-deep'
                )}
              >
                <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.24em] text-formula-mist/85">Live or next</span>
                <span className="mt-2.5 block font-mono text-[15px] font-semibold leading-tight tracking-tight text-formula-paper">{item.title}</span>
                <span className="mt-2.5 block flex-1 text-[14px] leading-relaxed text-formula-frost/78">{item.body}</span>
                <span className="mt-3 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-formula-volt opacity-0 transition-opacity group-hover:opacity-100">
                  Open
                </span>
              </Link>
            ))}
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  )
}
