'use client'

import { useState } from 'react'
import { CheckoutLaunchButton } from '@/components/marketing/checkout-launch-button'
import {
  LITTLES_CHECKOUT_TRACK_OPTIONS,
  type LittlesCheckoutTrackId,
} from '@/lib/marketing/littles-tracks'
import { LITTLES_SIX_WEEK } from '@/lib/marketing/public-pricing'

export function LittlesSixWeekCheckout() {
  const [track, setTrack] = useState<LittlesCheckoutTrackId>(LITTLES_CHECKOUT_TRACK_OPTIONS[0]!.id)

  return (
    <div className="not-prose flex max-w-xl flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-formula-frost/80">
          Choose day and time
        </span>
        <select
          value={track}
          onChange={e => setTrack(e.target.value as LittlesCheckoutTrackId)}
          className="min-h-11 rounded-sm border border-formula-frost/20 bg-formula-paper/[0.06] px-3 py-2 font-sans text-[13px] text-formula-paper"
        >
          {LITTLES_CHECKOUT_TRACK_OPTIONS.map(o => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <CheckoutLaunchButton
        checkoutType="littles-6wk-300"
        label={`Buy ${LITTLES_SIX_WEEK.label} ($${LITTLES_SIX_WEEK.priceUsd})`}
        metadata={{ littles_track: track }}
      />
    </div>
  )
}
