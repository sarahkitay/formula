'use client'

import { useMemo, useState } from 'react'
import { CheckoutLaunchButton } from '@/components/marketing/checkout-launch-button'
import type { CheckoutType } from '@/lib/stripe/checkout-types'
import { SUMMER_CAMP_2026_MONTH_BUNDLE_CHECKOUT, SUMMER_CAMP_2026_WEEK_CHECKOUT } from '@/lib/marketing/public-pricing'
import {
  SUMMER_CAMP_2026_WEEKS,
  type SummerCampMonthBundleId,
} from '@/lib/marketing/summer-camp-2026-data'

export function SummerCamp2026Checkout() {
  const [guardianName, setGuardianName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [athleteNames, setAthleteNames] = useState('')
  const [purchaseKind, setPurchaseKind] = useState<'week' | 'month'>('week')
  const [weekNumber, setWeekNumber] = useState(1)
  const [monthBundle, setMonthBundle] = useState<SummerCampMonthBundleId>('weeks-1-4')

  const baseMeta = useMemo(
    () => ({
      sc_guardian_name: guardianName.trim(),
      sc_contact_email: contactEmail.trim(),
      sc_athlete_names: athleteNames.trim(),
    }),
    [guardianName, contactEmail, athleteNames]
  )

  const weekMetadata = useMemo(
    () => ({ ...baseMeta, sc_week_number: String(weekNumber) }),
    [baseMeta, weekNumber]
  )

  const monthMetadata = useMemo(
    () => ({ ...baseMeta, sc_month_bundle: monthBundle }),
    [baseMeta, monthBundle]
  )

  const namesOk = guardianName.trim().length >= 2 && athleteNames.trim().length >= 2

  const checkoutType: CheckoutType = purchaseKind === 'week' ? 'summer-camp-week-495' : 'summer-camp-month-1780'
  const metadata = purchaseKind === 'week' ? weekMetadata : monthMetadata
  const priceLabel =
    purchaseKind === 'week'
      ? `$${SUMMER_CAMP_2026_WEEK_CHECKOUT.priceUsd}`
      : `$${SUMMER_CAMP_2026_MONTH_BUNDLE_CHECKOUT.priceUsd}`

  const ready = namesOk

  return (
    <div
      id="register"
      className="not-prose mt-10 rounded-xl border border-formula-frost/16 bg-formula-paper/[0.04] p-5 sm:p-7"
    >
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt/90">Registration</p>
      <h2 className="mt-2 font-mono text-sm font-semibold uppercase tracking-[0.14em] text-formula-paper">Pre-pay · secure checkout</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-formula-frost/80">
        Staff confirms age group, roster, and week placement after payment. Use the same guardian email you check most often — Stripe sends the receipt there.
      </p>

      <fieldset className="mt-6 flex flex-wrap gap-3">
        <legend className="sr-only">Purchase type</legend>
        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-formula-frost/18 bg-formula-base/60 px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-formula-paper has-[:checked]:border-formula-volt/50 has-[:checked]:bg-formula-volt/[0.08]">
          <input
            type="radio"
            name="sc-purchase-kind"
            checked={purchaseKind === 'week'}
            onChange={() => setPurchaseKind('week')}
            className="accent-formula-volt"
          />
          One week · ${SUMMER_CAMP_2026_WEEK_CHECKOUT.priceUsd}
        </label>
        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-formula-frost/18 bg-formula-base/60 px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-formula-paper has-[:checked]:border-formula-volt/50 has-[:checked]:bg-formula-volt/[0.08]">
          <input
            type="radio"
            name="sc-purchase-kind"
            checked={purchaseKind === 'month'}
            onChange={() => setPurchaseKind('month')}
            className="accent-formula-volt"
          />
          Four-week bundle · ${SUMMER_CAMP_2026_MONTH_BUNDLE_CHECKOUT.priceUsd}
        </label>
      </fieldset>

      {purchaseKind === 'week' ? (
        <label className="mt-5 flex max-w-md flex-col gap-1.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-formula-frost/75">Select week</span>
          <select
            value={weekNumber}
            onChange={e => setWeekNumber(parseInt(e.target.value, 10))}
            className="min-h-11 rounded-sm border border-formula-frost/20 bg-formula-paper/[0.06] px-3 py-2 font-sans text-[13px] text-formula-paper"
          >
            {SUMMER_CAMP_2026_WEEKS.map(row => (
              <option key={row.week} value={row.week}>
                Week {row.week} · {row.datesLabel} · {row.themeTitle}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <label className="mt-5 flex max-w-md flex-col gap-1.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-formula-frost/75">Four-week block</span>
          <select
            value={monthBundle}
            onChange={e => setMonthBundle(e.target.value as SummerCampMonthBundleId)}
            className="min-h-11 rounded-sm border border-formula-frost/20 bg-formula-paper/[0.06] px-3 py-2 font-sans text-[13px] text-formula-paper"
          >
            <option value="weeks-1-4">Weeks 1–4 · June block</option>
            <option value="weeks-5-8">Weeks 5–8 · July–August block</option>
          </select>
        </label>
      )}

      <div className="mt-6 flex max-w-md flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-formula-frost/75">Guardian / payer full name</span>
          <input
            value={guardianName}
            onChange={e => setGuardianName(e.target.value)}
            autoComplete="name"
            className="min-h-11 rounded-sm border border-formula-frost/20 bg-formula-paper/[0.06] px-3 py-2 font-sans text-[13px] text-formula-paper placeholder:text-formula-mist/50"
            placeholder="Full name"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-formula-frost/75">Email (Stripe receipt)</span>
          <input
            type="email"
            value={contactEmail}
            onChange={e => setContactEmail(e.target.value)}
            autoComplete="email"
            className="min-h-11 rounded-sm border border-formula-frost/20 bg-formula-paper/[0.06] px-3 py-2 font-sans text-[13px] text-formula-paper placeholder:text-formula-mist/50"
            placeholder="you@example.com"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-formula-frost/75">Athlete first name(s)</span>
          <textarea
            value={athleteNames}
            onChange={e => setAthleteNames(e.target.value)}
            rows={2}
            className="resize-y rounded-sm border border-formula-frost/20 bg-formula-paper/[0.06] px-3 py-2 font-sans text-[13px] text-formula-paper placeholder:text-formula-mist/50"
            placeholder="e.g. Alex or Alex, Sam"
          />
        </label>
      </div>

      <div className="mt-6">
        <CheckoutLaunchButton
          checkoutType={checkoutType}
          label={`Continue to checkout · ${priceLabel}`}
          metadata={metadata}
          hideSmsConsent
          disabled={!ready}
        />
      </div>
      {!ready ? (
        <p className="mt-3 font-mono text-[10px] text-formula-mist/90">Enter guardian and athlete name(s) to enable checkout.</p>
      ) : null}
    </div>
  )
}
