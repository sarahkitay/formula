import Link from 'next/link'
import { BookAssessmentHub } from '@/components/marketing/book-assessment-hub'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { BOOKING_HUB_PARENT } from '@/lib/marketing/book-assessment-paths'

export default function ParentBookAssessmentHubPage() {
  return (
    <>
      <BookAssessmentHub variant="portal" />
      <p className="mt-10 border-t border-border-subtle pt-8 text-[12px] text-text-muted">
        <Link href="/parent/dashboard" className="text-formula-volt underline-offset-2 hover:underline">
          Parent home
        </Link>
        {' · '}
        <Link href={MARKETING_HREF.assessment} className="text-formula-volt underline-offset-2 hover:underline">
          What we measure
        </Link>
        {' · '}
        <Link href={BOOKING_HUB_PARENT.fieldRental} className="text-formula-volt underline-offset-2 hover:underline">
          Field rental
        </Link>
      </p>
    </>
  )
}

