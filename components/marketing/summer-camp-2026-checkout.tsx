'use client'

import { useMemo, useState } from 'react'
import { CheckoutLaunchButton } from '@/components/marketing/checkout-launch-button'
import type { CheckoutType } from '@/lib/stripe/checkout-types'
import {
  isSummerCampEarlyRegistrationActive,
  summerCamp2026MonthBundleCheckoutPriceUsd,
  summerCamp2026WeekCheckoutPriceUsd,
  SUMMER_CAMP_2026_EARLY_DISCOUNT_USD,
  SUMMER_CAMP_2026_MONTH_BUNDLE_CHECKOUT,
  SUMMER_CAMP_2026_WEEK_CHECKOUT,
} from '@/lib/marketing/public-pricing'
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

  const { weekPrice, bundlePrice, early } = useMemo(() => {
    const t = new Date()
    return {
      weekPrice: summerCamp2026WeekCheckoutPriceUsd(t),
      bundlePrice: summerCamp2026MonthBundleCheckoutPriceUsd(t),
      early: isSummerCampEarlyRegistrationActive(t),
    }
  }, [])

  const checkoutType: CheckoutType = purchaseKind === 'week' ? 'summer-camp-week-495' : 'summer-camp-month-1780'
  const metadata = purchaseKind === 'week' ? weekMetadata : monthMetadata
  const priceLabel = purchaseKind === 'week' ? `$${weekPrice}` : `$${bundlePrice}`

  const ready = namesOk

  return (
    <div
      id="register"
      className="not-prose mt-8 scroll-mt-28 rounded-xl border border-formula-frost/16 bg-formula-paper/[0.04] p-4 sm:mt-10 sm:p-7"
    >
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt/90">Registration</p>
      <h2 className="mt-2 font-mono text-sm font-semibold uppercase tracking-[0.14em] text-formula-paper">Pre-pay · secure checkout</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-formula-frost/80">
        Staff confirms age group, roster, and week placement after payment. Use the same guardian email you check most often - Stripe sends the receipt there, and
        Formula sends a confirmation with camp details right after payment succeeds.
      </p>

      {early ? (
        <div className="mt-4 rounded-lg border border-formula-volt/30 bg-formula-volt/[0.08] px-3 py-2.5 font-mono text-[11px] leading-relaxed text-formula-paper sm:mt-5">
          <strong className="text-formula-volt">Early registration through May 29</strong> (Los Angeles date):{' '}
          <strong>${SUMMER_CAMP_2026_EARLY_DISCOUNT_USD} off</strong> the listed week (${SUMMER_CAMP_2026_WEEK_CHECKOUT.priceUsd} → ${weekPrice}) or bundle (
          ${SUMMER_CAMP_2026_MONTH_BUNDLE_CHECKOUT.priceUsd} → ${bundlePrice}). Checkout uses the lower total automatically.
        </div>
      ) : null}

      <fieldset className="mt-5 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:flex-wrap sm:gap-3">
        <legend className="sr-only">Purchase type</legend>
        <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-formula-frost/18 bg-formula-base/60 px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-formula-paper has-[:checked]:border-formula-volt/50 has-[:checked]:bg-formula-volt/[0.08] sm:min-h-0 sm:flex-1 sm:px-3 sm:py-2 sm:text-[10px]">
          <input
            type="radio"
            name="sc-purchase-kind"
            checked={purchaseKind === 'week'}
            onChange={() => setPurchaseKind('week')}
            className="h-4 w-4 shrink-0 accent-formula-volt"
          />
          One week · ${early ? `$${weekPrice} (was $${SUMMER_CAMP_2026_WEEK_CHECKOUT.priceUsd})` : `$${SUMMER_CAMP_2026_WEEK_CHECKOUT.priceUsd}`}
        </label>
        <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-formula-frost/18 bg-formula-base/60 px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-formula-paper has-[:checked]:border-formula-volt/50 has-[:checked]:bg-formula-volt/[0.08] sm:min-h-0 sm:flex-1 sm:px-3 sm:py-2 sm:text-[10px]">
          <input
            type="radio"
            name="sc-purchase-kind"
            checked={purchaseKind === 'month'}
            onChange={() => setPurchaseKind('month')}
            className="h-4 w-4 shrink-0 accent-formula-volt"
          />
          Four-week bundle · ${early ? `$${bundlePrice} (was $${SUMMER_CAMP_2026_MONTH_BUNDLE_CHECKOUT.priceUsd})` : `$${SUMMER_CAMP_2026_MONTH_BUNDLE_CHECKOUT.priceUsd}`}
        </label>
      </fieldset>

      {purchaseKind === 'week' ? (
        <label className="mt-5 flex max-w-md flex-col gap-1.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-formula-frost/75">Select week</span>
          <select
            value={weekNumber}
            onChange={e => setWeekNumber(parseInt(e.target.value, 10))}
            className="min-h-12 rounded-sm border border-formula-frost/20 bg-formula-paper/[0.06] px-3 py-2.5 font-sans text-base text-formula-paper sm:min-h-11 sm:py-2 sm:text-[13px]"
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
            className="min-h-12 rounded-sm border border-formula-frost/20 bg-formula-paper/[0.06] px-3 py-2.5 font-sans text-base text-formula-paper sm:min-h-11 sm:py-2 sm:text-[13px]"
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
            className="min-h-12 rounded-sm border border-formula-frost/20 bg-formula-paper/[0.06] px-3 py-2.5 font-sans text-base text-formula-paper placeholder:text-formula-mist/50 sm:min-h-11 sm:py-2 sm:text-[13px]"
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
            className="min-h-12 rounded-sm border border-formula-frost/20 bg-formula-paper/[0.06] px-3 py-2.5 font-sans text-base text-formula-paper placeholder:text-formula-mist/50 sm:min-h-11 sm:py-2 sm:text-[13px]"
            placeholder="you@example.com"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-formula-frost/75">Athlete first name(s)</span>
          <textarea
            value={athleteNames}
            onChange={e => setAthleteNames(e.target.value)}
            rows={2}
            className="resize-y rounded-sm border border-formula-frost/20 bg-formula-paper/[0.06] px-3 py-2.5 font-sans text-base text-formula-paper placeholder:text-formula-mist/50 sm:py-2 sm:text-[13px]"
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
