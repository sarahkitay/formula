import type { Metadata } from 'next'
import Link from 'next/link'
import { PartyBookingFlow } from '@/components/marketing/party-booking-flow'
import { BookingHubBackLink } from '@/components/marketing/booking-hub-back-link'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'
import { BOOKING_HUB_PUBLIC } from '@/lib/marketing/book-assessment-paths'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { PARTIES_PRICING_STATUS } from '@/lib/marketing/public-pricing'

export const metadata: Metadata = {
  title: 'Birthday party deposit',
  description: 'Secure a hosted birthday party date with the party deposit at Formula Soccer Center.',
}

export default function BookAssessmentBirthdayPartyPage() {
  return (
    <MarketingInnerPage eyebrow="Booking hub" title="Birthday party deposit" wide>
      <BookingHubBackLink href={BOOKING_HUB_PUBLIC.hub} />
      <section className="not-prose space-y-5 rounded-sm border border-formula-frost/14 bg-formula-paper/[0.03] p-5 md:p-7" aria-labelledby="ba-party-heading">
        <div className="space-y-2">
          <h2 id="ba-party-heading" className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">
            Party deposit checkout
          </h2>
          <p className="max-w-2xl text-[13px] leading-relaxed text-formula-frost/75">
            Hosted parties use the same ops discipline as training. <strong className="font-medium text-formula-paper">{PARTIES_PRICING_STATUS}</strong> Secure
            your date with the deposit below; field window details help match turf or indoor inventory.
          </p>
          <p className="text-[12px] text-formula-frost/60">
            Prefer the full marketing page?{' '}
            <Link href={MARKETING_HREF.parties} className="text-formula-volt underline-offset-2 hover:underline">
              Birthday parties
            </Link>
          </p>
        </div>
        <div className="mt-2 border-t border-formula-frost/10 pt-6">
          <PartyBookingFlow />
        </div>
      </section>
    </MarketingInnerPage>
  )
}
