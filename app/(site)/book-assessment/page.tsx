import type { Metadata } from 'next'
import Link from 'next/link'
import { BookAssessmentHub } from '@/components/marketing/book-assessment-hub'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'
import { BOOKING_HUB_PUBLIC } from '@/lib/marketing/book-assessment-paths'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { FORMULA_SKILLS_CHECK } from '@/lib/marketing/public-pricing'

export const metadata: Metadata = {
  title: 'Reserve your spot',
  description:
    'Booking hub: Formula Skills Check (June pre-book), youth block preview, field rental holds, birthday party deposit, and rental waiver — pay securely; optional parent portal after checkout.',
}

export default function BookAssessmentHubPage() {
  const skillsCheckUsd = FORMULA_SKILLS_CHECK.priceUsd

  return (
    <MarketingInnerPage eyebrow="Booking hub" title="Reserve your spot" wide>
      <BookAssessmentHub variant="public" />
      <p className="not-prose mt-12 max-w-3xl border-t border-formula-frost/10 pt-10 text-sm leading-relaxed text-formula-frost/85 sm:text-[15px] md:pt-12">
        No portal account required to start. Open <strong className="font-medium text-formula-paper">Guardian contact</strong> first if you want to save your
        name and email, then use <strong className="font-medium text-formula-paper">June pre-book</strong> for Skills Check (
        <strong className="font-medium text-formula-paper">${skillsCheckUsd}</strong> per athlete). Each tile above opens its own page so you are not scrolling
        past unrelated checkouts on your phone.
      </p>
      <p className="not-prose mt-6 text-[12px] text-formula-frost/55">
        <Link
          href={`/login?role=parent&next=${encodeURIComponent(MARKETING_HREF.parentBookAssessmentDirectory)}`}
          className="text-formula-volt underline-offset-2 hover:underline"
        >
          Sign in to book here
        </Link>
        {' · '}
        <Link href={MARKETING_HREF.events} className="text-formula-volt underline-offset-2 hover:underline">
          Events
        </Link>
        {' · '}
        <Link href={BOOKING_HUB_PUBLIC.fieldRental} className="text-formula-volt underline-offset-2 hover:underline">
          Field rental
        </Link>
        {' · '}
        <Link href={MARKETING_HREF.assessment} className="text-formula-volt underline-offset-2 hover:underline">
          What we measure
        </Link>
      </p>
    </MarketingInnerPage>
  )
}
