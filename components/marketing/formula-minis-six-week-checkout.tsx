'use client'

import { useState } from 'react'
import { CheckoutLaunchButton } from '@/components/marketing/checkout-launch-button'
import {
  FORMULA_MINIS_CHECKOUT_TRACK_OPTIONS,
  type FormulaMinisCheckoutTrackId,
} from '@/lib/marketing/formula-minis-tracks'
import { FORMULA_MINIS_SIX_WEEK } from '@/lib/marketing/public-pricing'

export function FormulaMinisSixWeekCheckout() {
  const [track, setTrack] = useState<FormulaMinisCheckoutTrackId>(FORMULA_MINIS_CHECKOUT_TRACK_OPTIONS[0]!.id)

  return (
    <div className="not-prose flex max-w-xl flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-formula-frost/80">
          Choose day and session time
        </span>
        <select
          value={track}
          onChange={e => setTrack(e.target.value as FormulaMinisCheckoutTrackId)}
          className="min-h-11 rounded-sm border border-formula-frost/20 bg-formula-paper/[0.06] px-3 py-2 font-sans text-[13px] text-formula-paper"
        >
          {FORMULA_MINIS_CHECKOUT_TRACK_OPTIONS.map(o => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <CheckoutLaunchButton
        checkoutType="littles-6wk-300"
        label={`Buy ${FORMULA_MINIS_SIX_WEEK.label} ($${FORMULA_MINIS_SIX_WEEK.priceUsd})`}
        metadata={{ littles_track: track }}
        hideSmsConsent
      />
    </div>
  )
}
