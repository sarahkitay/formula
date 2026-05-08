'use client'

import { useEffect, useMemo, useState } from 'react'
import { CheckoutLaunchButton } from '@/components/marketing/checkout-launch-button'
import { FRIDAY_NIGHT_FRIENDLIES_AGE, FRIDAY_NIGHT_FRIENDLIES_CHECKOUT } from '@/lib/marketing/public-pricing'

const { minPlayers, maxPlayers, pricePerPlayerUsd } = FRIDAY_NIGHT_FRIENDLIES_CHECKOUT
const { min: AGE_MIN, max: AGE_MAX } = FRIDAY_NIGHT_FRIENDLIES_AGE

const AGE_OPTIONS = Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, i) => AGE_MIN + i)

export function FridayNightFriendliesCheckout() {
  const [guardianName, setGuardianName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [playerNames, setPlayerNames] = useState('')
  const [playerCount, setPlayerCount] = useState(1)
  const [ageYoungest, setAgeYoungest] = useState(8)
  const [ageOldest, setAgeOldest] = useState(8)

  useEffect(() => {
    if (playerCount === 1) {
      setAgeOldest(ageYoungest)
    } else if (ageOldest < ageYoungest) {
      setAgeOldest(ageYoungest)
    }
  }, [playerCount, ageYoungest, ageOldest])

  const totalUsd = useMemo(() => playerCount * pricePerPlayerUsd, [playerCount])

  const metadata = useMemo(
    () => ({
      fnf_guardian_name: guardianName.trim(),
      fnf_contact_email: contactEmail.trim(),
      fnf_player_names: playerNames.trim(),
      fnf_player_count: String(playerCount),
      fnf_age_youngest: String(ageYoungest),
      fnf_age_oldest: String(playerCount === 1 ? ageYoungest : ageOldest),
    }),
    [guardianName, contactEmail, playerNames, playerCount, ageYoungest, ageOldest]
  )

  const agesValid = playerCount === 1 ? true : ageOldest >= ageYoungest

  const canSubmit =
    guardianName.trim().length >= 2 &&
    playerNames.trim().length >= 3 &&
    playerCount >= minPlayers &&
    playerCount <= maxPlayers &&
    agesValid

  return (
    <div
      id="register"
      className="not-prose mt-8 scroll-mt-28 rounded-xl border border-formula-frost/16 bg-formula-paper/[0.04] p-4 sm:mt-10 sm:p-7"
    >
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt/90">Save your spot</p>
      <h2 className="mt-2 font-mono text-sm font-semibold uppercase tracking-[0.14em] text-formula-paper">Pre-register & pay</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-formula-frost/80">
        {pricePerPlayerUsd} per player for the night you are booking toward (starting May 8, 2026). Walk-ups are still welcome at the desk - pre-pay holds your
        spot and speeds check-in.
      </p>
      <div className="mt-5 flex max-w-md flex-col gap-3.5 sm:mt-6 sm:gap-4">
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
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-formula-frost/75">Email (for Stripe receipt)</span>
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
            value={playerNames}
            onChange={e => setPlayerNames(e.target.value)}
            rows={2}
            className="resize-y rounded-sm border border-formula-frost/20 bg-formula-paper/[0.06] px-3 py-2.5 font-sans text-base text-formula-paper placeholder:text-formula-mist/50 sm:py-2 sm:text-[13px]"
            placeholder="e.g. Jordan or Jordan, Riley"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-formula-frost/75">Number of players (this checkout)</span>
          <select
            value={playerCount}
            onChange={e => setPlayerCount(parseInt(e.target.value, 10))}
            className="min-h-12 rounded-sm border border-formula-frost/20 bg-formula-paper/[0.06] px-3 py-2.5 font-sans text-base text-formula-paper sm:min-h-11 sm:py-2 sm:text-[13px]"
          >
            {Array.from({ length: maxPlayers - minPlayers + 1 }, (_, i) => minPlayers + i).map(n => (
              <option key={n} value={n}>
                {n} player{n !== 1 ? 's' : ''} · ${n * pricePerPlayerUsd}
              </option>
            ))}
          </select>
        </label>

        {playerCount === 1 ? (
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-formula-frost/75">
              Athlete age ({AGE_MIN}–{AGE_MAX})
            </span>
            <select
              value={ageYoungest}
              onChange={e => setAgeYoungest(parseInt(e.target.value, 10))}
              className="min-h-12 rounded-sm border border-formula-frost/20 bg-formula-paper/[0.06] px-3 py-2.5 font-sans text-base text-formula-paper sm:min-h-11 sm:py-2 sm:text-[13px]"
            >
              {AGE_OPTIONS.map(a => (
                <option key={a} value={a}>
                  {a} years old
                </option>
              ))}
            </select>
          </label>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-formula-frost/75">Youngest athlete age</span>
              <select
                value={ageYoungest}
                onChange={e => setAgeYoungest(parseInt(e.target.value, 10))}
                className="min-h-12 rounded-sm border border-formula-frost/20 bg-formula-paper/[0.06] px-3 py-2.5 font-sans text-base text-formula-paper sm:min-h-11 sm:py-2 sm:text-[13px]"
              >
                {AGE_OPTIONS.map(a => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-formula-frost/75">Oldest athlete age</span>
              <select
                value={ageOldest}
                onChange={e => setAgeOldest(parseInt(e.target.value, 10))}
                className="min-h-12 rounded-sm border border-formula-frost/20 bg-formula-paper/[0.06] px-3 py-2.5 font-sans text-base text-formula-paper sm:min-h-11 sm:py-2 sm:text-[13px]"
              >
                {AGE_OPTIONS.filter(a => a >= ageYoungest).map(a => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>
      <div className="mt-6">
        <CheckoutLaunchButton
          checkoutType="friday-friendlies-player"
          label={`Continue to checkout · $${totalUsd}`}
          metadata={metadata}
          hideSmsConsent
          disabled={!canSubmit}
        />
      </div>
      {!canSubmit ? (
        <p className="mt-3 font-mono text-[10px] text-formula-mist/90">
          Enter guardian name, athlete name(s), ages ({AGE_MIN}–{AGE_MAX}), and player count to enable checkout.
        </p>
      ) : null}
    </div>
  )
}
