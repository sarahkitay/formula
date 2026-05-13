'use client'

import Link from 'next/link'
import { ManualWaiverInviteForm } from '@/components/admin/manual-waiver-invite-form'
import { BOOKING_HUB_PUBLIC } from '@/lib/marketing/book-assessment-paths'
import { cn } from '@/lib/utils'

/**
 * Complimentary / internal roster link only. Paid flows live under Payment on the same admin panel.
 */
export function RosterLinkCreationPicker() {
  return (
    <div className="mt-3 space-y-3 border-t border-formula-frost/10 pt-3 font-mono text-[10px] leading-relaxed text-formula-mist/90">
      <p>
        <strong className="text-formula-paper/90">Quick roster link</strong> — comp or internal lists (no card charge, no Payments row). For desk payment + ledger
        row, or a Stripe Checkout link, use <strong className="text-formula-paper/90">Payment</strong> in the section below. For public web checkout, send renters
        through{' '}
        <Link className="text-formula-volt underline-offset-2 hover:underline" href={BOOKING_HUB_PUBLIC.fieldRental}>
          field rental checkout
        </Link>{' '}
        or <Link className="text-formula-volt underline-offset-2 hover:underline" href="/rentals">Rentals</Link>.
      </p>
      <p className="text-formula-mist/80">
        The roster URL offers full sign or RSVP (prior waiver on file). Rows without this invite stay in Signed waivers only.
      </p>

      <div
        className={cn(
          'rounded-md border border-formula-frost/12 bg-formula-base/30 p-3',
          'animate-in fade-in-0 slide-in-from-top-1 duration-150'
        )}
      >
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-formula-mist">Quick roster link</p>
        <ManualWaiverInviteForm />
      </div>
    </div>
  )
}
