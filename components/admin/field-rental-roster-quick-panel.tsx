'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import Link from 'next/link'
import type { WaiverInviteWithProgress } from '@/lib/rentals/waiver-invites-server'
import { ManualWaiverInviteForm } from '@/components/admin/manual-waiver-invite-form'
import { RentalRosterPaymentLinkForm } from '@/components/admin/rental-roster-payment-link-form'
import { BOOKING_HUB_PUBLIC } from '@/lib/marketing/book-assessment-paths'
import { cn } from '@/lib/utils'

type Mode = 'complimentary' | 'paid'

type Props = {
  invites: WaiverInviteWithProgress[]
  siteOrigin: string
}

export function FieldRentalRosterQuickPanel({ invites, siteOrigin }: Props) {
  const router = useRouter()
  const refresh = useCallback(() => {
    router.refresh()
  }, [router])
  const [mode, setMode] = useState<Mode>('complimentary')

  return (
    <div className="mt-3 space-y-4 border-t border-formula-frost/10 pt-3 font-mono text-[11px] leading-relaxed text-formula-mist/90">
      <p>
        One place: <strong className="text-formula-paper/90">complimentary</strong> roster (no payment row) or{' '}
        <strong className="text-formula-paper/90">paid</strong> desk deposit + ledger and/or Stripe Checkout for an invite you pick. Online checkout still flows
        through{' '}
        <Link className="text-formula-volt underline-offset-2 hover:underline" href={BOOKING_HUB_PUBLIC.fieldRental}>
          field rental checkout
        </Link>
        .
      </p>
      <p className="text-[10px] text-formula-mist/85">
        Roster progress is grouped by payer email (or name) below. Invites without a field/time yet sort first in paid mode so you can attach session then share
        payment.{' '}
        <Link href="#roster-invites-progress" className="text-formula-volt underline-offset-2 hover:underline">
          Jump to invite list
        </Link>
        .
      </p>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={() => setMode('complimentary')}
          className={cn(
            'flex flex-1 flex-col items-start gap-0.5 rounded-md border px-3 py-2.5 text-left font-mono transition-colors sm:min-w-[12rem]',
            mode === 'complimentary'
              ? 'border-formula-volt/50 bg-formula-volt/15 text-formula-paper'
              : 'border-formula-frost/16 bg-formula-paper/[0.04] text-formula-mist hover:border-formula-frost/28'
          )}
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.12em]">Complimentary roster</span>
          <span className="text-[10px] font-normal normal-case tracking-normal text-formula-frost/80">Quick link · comp / internal lists</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('paid')}
          className={cn(
            'flex flex-1 flex-col items-start gap-0.5 rounded-md border px-3 py-2.5 text-left font-mono transition-colors sm:min-w-[12rem]',
            mode === 'paid'
              ? 'border-formula-volt/50 bg-formula-volt/15 text-formula-paper'
              : 'border-formula-frost/16 bg-formula-paper/[0.04] text-formula-mist hover:border-formula-frost/28'
          )}
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.12em]">Paid</span>
          <span className="text-[10px] font-normal normal-case tracking-normal text-formula-frost/80">Desk + ledger · Stripe link for existing invite</span>
        </button>
      </div>

      {mode === 'complimentary' ? (
        <div className="rounded-md border border-formula-frost/12 bg-formula-base/30 p-3">
          <ManualWaiverInviteForm onInviteCreated={refresh} />
        </div>
      ) : (
        <div className="rounded-md border border-formula-volt/18 bg-formula-volt/[0.05] p-3">
          <RentalRosterPaymentLinkForm
            invites={invites}
            siteOrigin={siteOrigin}
            onDeskInviteCreated={refresh}
            onStripePaymentLinkCreated={refresh}
          />
        </div>
      )}
    </div>
  )
}
