import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckoutSuccessPortalModal } from './checkout-success-portal-modal'
import { MARKETING_HREF } from '@/lib/marketing/nav'

export const metadata: Metadata = {
  title: 'Payment received',
  robots: { index: false, follow: false },
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; next?: string }>
}) {
  const { session_id: sessionId, next: nextStep } = await searchParams

  return (
    <article className="mx-auto max-w-lg px-6 pb-24 pt-28 md:pb-32 md:pt-32">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-formula-mist">Checkout</p>
      <h1 className="mt-4 font-mono text-2xl font-semibold tracking-tight text-formula-paper">Thanks. Payment submitted</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-formula-frost/85">
        Stripe is processing your payment. Fulfillment (scheduling, session credits, portal updates) is confirmed via our systems, not only this page. If
        anything looks off, contact the front desk with your receipt email.
      </p>
      {sessionId ? (
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-formula-mist/80">
          Reference · {sessionId.slice(0, 24)}…
        </p>
      ) : null}
      <div className="not-prose mt-10 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center border border-black/20 bg-formula-volt px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] !text-black hover:brightness-105"
        >
          Home
        </Link>
        <Link
          href={MARKETING_HREF.youthMembership}
          className="inline-flex h-11 items-center border border-formula-frost/14 bg-formula-paper/[0.04] px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-paper hover:border-formula-frost/22"
        >
          Membership
        </Link>
        {nextStep === 'portal-assessment' ? (
          <Link
            href="/parent/bookings#upcoming-bookings"
            className="inline-flex h-11 items-center border border-formula-frost/14 bg-formula-paper/[0.04] px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-paper hover:border-formula-frost/22"
          >
            Portal · Schedule
          </Link>
        ) : null}
        {nextStep === 'field-rental' ? (
          <Link
            href={`${MARKETING_HREF.rentals}#rental-booking`}
            className="inline-flex h-11 items-center border border-formula-frost/14 bg-formula-paper/[0.04] px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-paper hover:border-formula-frost/22"
          >
            Field rentals
          </Link>
        ) : null}
      </div>

      <CheckoutSuccessPortalModal nextStep={nextStep} sessionId={sessionId} />
    </article>
  )
}
