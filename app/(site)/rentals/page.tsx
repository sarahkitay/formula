import type { Metadata } from 'next'
import Link from 'next/link'
import { CtaRow } from '@/components/marketing/marketing-inner'
import { FieldRentalBookingFlow } from '@/components/marketing/field-rental-booking-flow'
import { FieldRentalAgreementForm } from '@/components/marketing/field-rental-agreement-form'
import { ScrollFadeIn } from '@/components/marketing/scroll-fade-in'
import { marketingDisplayH1ClassName } from '@/lib/marketing/display-typography'
import { BOOKING_HUB_PUBLIC } from '@/lib/marketing/book-assessment-paths'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { FIELD_RENTAL_PUBLISHED_RATES } from '@/lib/marketing/public-pricing'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Field rentals',
  description:
    'Structured field rentals: published hourly rate, packaged windows, deposit checkout via the booking hub.',
}

const ctaPrimaryClass =
  'inline-flex min-h-12 items-center justify-center border border-black/25 bg-formula-volt px-6 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-black no-underline transition-[filter] hover:brightness-105'
const ctaSecondaryClass =
  'inline-flex min-h-12 items-center justify-center border border-formula-frost/22 bg-transparent px-6 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-formula-paper no-underline transition-colors hover:border-formula-volt/35 hover:bg-formula-volt/[0.06]'

export default function RentalsPage() {
  return (
    <article
      className={cn(
        'marketing-site mx-auto w-full min-w-0 max-w-[1180px] px-4 pb-32 pt-[calc(5.5rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pb-40 sm:pt-28 md:pt-32'
      )}
    >
      <ScrollFadeIn className="not-prose min-w-0">
        <header className="border-b border-formula-frost/12 pb-12 md:pb-16">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-formula-volt/90">Field rentals</p>
          <h1 className={cn(marketingDisplayH1ClassName, 'mt-4 max-w-[22ch] text-balance')}>Book field time without back-and-forth</h1>
          <p className="mt-6 max-w-[52ch] text-[16px] leading-relaxed text-formula-frost/88 sm:text-[17px]">
            Pick a package, lock a published window, pay the booking deposit, then complete the participant waiver. One flow: calendar conflicts are blocked
            automatically; Stripe confirms your hold.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#rental-booking" className={ctaPrimaryClass}>
              Reserve a field
            </a>
            <a href="#field-rental-packages" className={ctaSecondaryClass}>
              View packages
            </a>
          </div>
          <p className="mt-8 max-w-[60ch] text-[14px] leading-relaxed text-formula-mist">
            Unified booking hub:{' '}
            <Link href={BOOKING_HUB_PUBLIC.hub} className="text-formula-volt underline-offset-2 hover:underline">
              {BOOKING_HUB_PUBLIC.hub}
            </Link>
            . Field rental-only path:{' '}
            <Link href={BOOKING_HUB_PUBLIC.fieldRental} className="text-formula-volt underline-offset-2 hover:underline">
              {BOOKING_HUB_PUBLIC.fieldRental}
            </Link>
            . Corporate or large blocks:{' '}
            <Link href={MARKETING_HREF.events} className="text-formula-volt underline-offset-2 hover:underline">
              Events
            </Link>
            .
          </p>
        </header>

        <FieldRentalBookingFlow />

        <div className="mt-16 border-t border-formula-frost/10 pt-12 md:mt-20 md:pt-16">
          <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Rate & deposit</h2>
          <p className="mt-4 max-w-[60ch] text-[15px] leading-relaxed text-formula-frost/85">
            <strong className="text-formula-paper">${FIELD_RENTAL_PUBLISHED_RATES.perHourUsd}/hr</strong> published field rate. Booking deposit is{' '}
            <strong className="text-formula-paper">$1,000</strong> to hold your calendar window. {FIELD_RENTAL_PUBLISHED_RATES.packages}
          </p>
        </div>

        <details className="mt-12 border border-formula-frost/14 bg-formula-paper/[0.02] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] md:mt-14">
          <summary className="cursor-pointer px-5 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-formula-paper md:px-6">
            Ops model & philosophy
          </summary>
          <div className="space-y-4 border-t border-formula-frost/10 px-5 py-5 text-[14px] leading-relaxed text-formula-frost/82 md:px-6">
            <p>
              <strong className="text-formula-paper">Check-in:</strong> low friction. Staff step in for headcount, misclassified use, or safety issues.
            </p>
            <p>
              <strong className="text-formula-paper">Blocks:</strong> programmed start/stop and buffers, built for recurring clubs and trainers, not loudest
              bidder.
            </p>
            <p>
              <strong className="text-formula-paper">Packages:</strong> window + surface + expectations. 12-week alignment where recurring; youth blocks stay
              protected.
            </p>
            <p>
              <strong className="text-formula-paper">Inventory:</strong> calendar reflects programming and staffing; rentals inherit Formula tempo and
              transitions.
            </p>
          </div>
        </details>

        <div className="h-20 md:h-28" aria-hidden />

        <section className="border-t border-formula-frost/12 pt-12 md:pt-16">
          <div className="max-w-[62ch]">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-volt/90">Step 3 · After deposit</p>
            <h2 className="mt-3 font-mono text-lg font-semibold tracking-tight text-formula-paper md:text-xl">Participant waiver</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-formula-frost/82">
              One signed agreement per participant before field access. Complete this section once your rental deposit is placed (or anytime you need a
              standalone waiver on file).
            </p>
          </div>
          <div className="mt-10">
            <FieldRentalAgreementForm />
          </div>
        </section>

        <div className="h-16 md:h-20" aria-hidden />

        <CtaRow
          primary={{ label: 'Events & large blocks', href: MARKETING_HREF.events }}
          secondary={{ label: 'Facility', href: MARKETING_HREF.facility }}
        />
      </ScrollFadeIn>
    </article>
  )
}
