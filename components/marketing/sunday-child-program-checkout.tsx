'use client'

import { useState } from 'react'
import { CheckoutLaunchButton } from '@/components/marketing/checkout-launch-button'
import {
  SUNDAY_CHILD_PROGRAM_CHECKOUT_TRACK_OPTIONS,
  type SundayChildProgramCheckoutTrackId,
} from '@/lib/marketing/sunday-child-program-tracks'
import { FORMULA_SUNDAY_CHILD_PROGRAM_10_WK } from '@/lib/marketing/public-pricing'

export function SundayChildProgramCheckout() {
  const [track, setTrack] = useState<SundayChildProgramCheckoutTrackId>(
    SUNDAY_CHILD_PROGRAM_CHECKOUT_TRACK_OPTIONS[0]!.id
  )

  return (
    <div className="not-prose flex max-w-xl flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-formula-frost/80">
          Choose age / session (Sunday)
        </span>
        <select
          value={track}
          onChange={e => setTrack(e.target.value as SundayChildProgramCheckoutTrackId)}
          className="min-h-11 rounded-sm border border-formula-frost/20 bg-formula-paper/[0.06] px-3 py-2 font-sans text-[13px] text-formula-paper"
        >
          {SUNDAY_CHILD_PROGRAM_CHECKOUT_TRACK_OPTIONS.map(o => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <CheckoutLaunchButton
        checkoutType="sunday-child-10wk-500"
        label={`Buy ${FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.label} ($${FORMULA_SUNDAY_CHILD_PROGRAM_10_WK.priceUsd})`}
        metadata={{ sunday_child_track: track }}
        hideSmsConsent
      />
    </div>
  )
}
