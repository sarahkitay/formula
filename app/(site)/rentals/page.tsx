import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingInnerPage, CtaRow } from '@/components/marketing/marketing-inner'
import { FieldRentalBookingFlow } from '@/components/marketing/field-rental-booking-flow'
import { FieldRentalAgreementForm } from '@/components/marketing/field-rental-agreement-form'
import { BOOKING_HUB_PUBLIC } from '@/lib/marketing/book-assessment-paths'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { FIELD_RENTAL_PUBLISHED_RATES } from '@/lib/marketing/public-pricing'

export const metadata: Metadata = {
  title: 'Field rentals',
  description:
    'Structured field rentals: published hourly rate, packaged windows, deposit checkout via the booking hub.',
}

export default function RentalsPage() {
  return (
    <MarketingInnerPage
      eyebrow="Structured rentals"
      title="Field time — packaged windows"
      intro="Classified use, deposits, and waivers. Book through the hub below; not open-dock hourly chaos."
    >
      <p className="not-prose text-sm text-formula-frost/80">
        One stop with Skills Check + party deposit:{' '}
        <Link href={BOOKING_HUB_PUBLIC.fieldRental} className="text-formula-volt underline-offset-2 hover:underline">
          booking hub
        </Link>
        . Corporate / large blocks:{' '}
        <Link href={MARKETING_HREF.events} className="text-formula-volt underline-offset-2 hover:underline">
          Events
        </Link>
        .
      </p>

      <FieldRentalBookingFlow />

      <h2 className="!mt-10">Rate & deposit</h2>
      <p className="text-sm">
        <strong className="text-formula-paper">${FIELD_RENTAL_PUBLISHED_RATES.perHourUsd}/hr</strong> — book in 30-minute steps; deposit scales with length
        (e.g. 90 min ≈ ${(FIELD_RENTAL_PUBLISHED_RATES.perHourUsd * 1.5).toFixed(0)}). {FIELD_RENTAL_PUBLISHED_RATES.packages}
      </p>

      <details className="not-prose mt-8 rounded-xl border border-formula-frost/14 bg-formula-paper/[0.03] open:border-formula-frost/22">
        <summary className="cursor-pointer px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-paper md:px-5">
          Ops model & philosophy
        </summary>
        <div className="space-y-4 border-t border-formula-frost/10 px-4 py-4 text-sm leading-relaxed text-formula-frost/80 md:px-5">
          <p>
            <strong className="text-formula-paper">Check-in:</strong> low friction — staff step in for headcount, misclassified use, or safety issues.
          </p>
          <p>
            <strong className="text-formula-paper">Blocks:</strong> programmed start/stop and buffers — built for recurring clubs and trainers, not loudest
            bidder.
          </p>
          <p>
            <strong className="text-formula-paper">Packages:</strong> window + surface + expectations — 12-week alignment where recurring; youth blocks stay
            protected.
          </p>
          <p>
            <strong className="text-formula-paper">Inventory:</strong> calendar reflects programming and staffing; rentals inherit Formula tempo and transitions.
          </p>
        </div>
      </details>

      <h2 id="participant-waiver-heading" className="!mt-12 scroll-mt-28">
        Participant waiver
      </h2>
      <p className="text-sm text-formula-frost/75">One signed waiver per participant before field access.</p>
      <FieldRentalAgreementForm />

      <CtaRow
        primary={{ label: 'Events & large blocks', href: MARKETING_HREF.events }}
        secondary={{ label: 'Facility', href: MARKETING_HREF.facility }}
      />
    </MarketingInnerPage>
  )
}
