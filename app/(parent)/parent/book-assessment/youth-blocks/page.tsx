import Link from 'next/link'
import { YouthBlocksWeekPanel } from '@/components/marketing/youth-blocks-week-panel'
import { BookingHubBackLink } from '@/components/marketing/booking-hub-back-link'
import { BOOKING_HUB_PARENT } from '@/lib/marketing/book-assessment-paths'

export default function ParentBookAssessmentYouthBlocksPage() {
  return (
    <>
      <BookingHubBackLink href={BOOKING_HUB_PARENT.hub} />
      <p className="mb-8 max-w-2xl text-sm leading-relaxed text-formula-frost/80">
        Published schedule preview. Final enrollment still happens in the portal with an active package.
      </p>
      <YouthBlocksWeekPanel />
      <div className="marketing-section-divider my-10" aria-hidden />
      <p className="text-[12px] text-formula-frost/55">
        <Link href={BOOKING_HUB_PARENT.hub} className="text-formula-volt underline-offset-2 hover:underline">
          ← Booking hub
        </Link>
      </p>
    </>
  )
}
