'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ManualWaiverInviteForm } from '@/components/admin/manual-waiver-invite-form'
import { PaidInPersonFieldRentalInviteForm } from '@/components/admin/paid-in-person-field-rental-invite-form'
import { BOOKING_HUB_PUBLIC } from '@/lib/marketing/book-assessment-paths'
import { cn } from '@/lib/utils'

type CreateMode = '' | 'quick' | 'paid_in_person'

const selectShell =
  'h-11 w-full max-w-xl rounded-md border border-formula-frost/22 bg-formula-base/55 px-3 font-mono text-[12px] text-formula-paper outline-none transition-colors focus:border-formula-volt/45 focus:ring-1 focus:ring-formula-volt/25'

/**
 * Field rental: choose Quick roster (comp) vs Paid in person in one dropdown instead of nested disclosure blocks.
 */
export function RosterLinkCreationPicker() {
  const [mode, setMode] = useState<CreateMode>('')

  return (
    <div className="mt-3 space-y-3 border-t border-formula-frost/10 pt-3 font-mono text-[10px] leading-relaxed text-formula-mist/90">
      <p>
        <strong className="text-formula-paper/90">Complimentary / internal</strong>: use Quick roster (no card charge, no Payments row).{' '}
        <strong className="text-formula-paper/90">Paid in person</strong>: desk collects payment; same waiver URL plus a Payments / revenue entry.{' '}
        <strong className="text-formula-paper/90">Pay online</strong>: send the organizer through{' '}
        <Link className="text-formula-volt underline-offset-2 hover:underline" href={BOOKING_HUB_PUBLIC.fieldRental}>
          field rental checkout
        </Link>{' '}
        or <Link className="text-formula-volt underline-offset-2 hover:underline" href="/rentals">Rentals</Link>; Stripe creates the roster link after payment.
      </p>
      <p className="text-formula-mist/80">
        The roster URL offers full sign or RSVP (prior waiver on file). Organizer (this link’s payer) completed payment online or in person. Rows without this
        invite stay in Signed waivers only.
      </p>

      <div className="space-y-2">
        <label htmlFor="roster-link-create-mode" className="block text-[10px] font-bold uppercase tracking-[0.14em] text-formula-mist">
          Add roster link: choose path
        </label>
        <select
          id="roster-link-create-mode"
          value={mode}
          onChange={e => setMode(e.target.value as CreateMode)}
          className={selectShell}
          aria-label="Choose how to create a roster waiver link"
        >
          <option value="">Select an option…</option>
          <option value="quick">Quick roster link (comp / internal, no payment row)</option>
          <option value="paid_in_person">Paid in person (desk payment + waiver URL + Payments entry)</option>
        </select>
      </div>

      {mode === 'quick' ? (
        <div
          className={cn(
            'rounded-md border border-formula-frost/12 bg-formula-base/30 p-3',
            'animate-in fade-in-0 slide-in-from-top-1 duration-150'
          )}
        >
          <ManualWaiverInviteForm />
        </div>
      ) : null}

      {mode === 'paid_in_person' ? (
        <div
          className={cn(
            'rounded-md border border-formula-frost/12 bg-formula-base/30 p-3',
            'animate-in fade-in-0 slide-in-from-top-1 duration-150'
          )}
        >
          <PaidInPersonFieldRentalInviteForm />
        </div>
      ) : null}
    </div>
  )
}
