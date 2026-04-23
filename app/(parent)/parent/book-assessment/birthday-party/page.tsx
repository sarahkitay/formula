import Link from 'next/link'
import { PartyBookingFlow } from '@/components/marketing/party-booking-flow'
import { BookingHubBackLink } from '@/components/marketing/booking-hub-back-link'
import { BOOKING_HUB_PARENT } from '@/lib/marketing/book-assessment-paths'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { PARTIES_PRICING_STATUS } from '@/lib/marketing/public-pricing'

export default function ParentBookAssessmentBirthdayPartyPage() {
  return (
    <>
      <BookingHubBackLink href={BOOKING_HUB_PARENT.hub} />
      <section className="space-y-5 rounded-sm border border-formula-frost/14 bg-formula-paper/[0.03] p-5 md:p-7" aria-labelledby="ba-party-heading">
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
    </>
  )
}
