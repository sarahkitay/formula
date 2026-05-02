'use client'

import { useMemo, useState } from 'react'
import { CheckoutLaunchButton } from '@/components/marketing/checkout-launch-button'
import { FRIDAY_NIGHT_FRIENDLIES_CHECKOUT } from '@/lib/marketing/public-pricing'

const { minPlayers, maxPlayers, pricePerPlayerUsd } = FRIDAY_NIGHT_FRIENDLIES_CHECKOUT

export function FridayNightFriendliesCheckout() {
  const [guardianName, setGuardianName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [playerNames, setPlayerNames] = useState('')
  const [playerCount, setPlayerCount] = useState(1)

  const totalUsd = useMemo(() => playerCount * pricePerPlayerUsd, [playerCount])

  const metadata = useMemo(
    () => ({
      fnf_guardian_name: guardianName.trim(),
      fnf_contact_email: contactEmail.trim(),
      fnf_player_names: playerNames.trim(),
      fnf_player_count: String(playerCount),
    }),
    [guardianName, contactEmail, playerNames, playerCount]
  )

  const canSubmit =
    guardianName.trim().length >= 2 &&
    playerNames.trim().length >= 3 &&
    playerCount >= minPlayers &&
    playerCount <= maxPlayers

  return (
    <div
      id="register"
      className="not-prose mt-10 rounded-xl border border-formula-frost/16 bg-formula-paper/[0.04] p-5 sm:p-7"
    >
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt/90">Save your spot</p>
      <h2 className="mt-2 font-mono text-sm font-semibold uppercase tracking-[0.14em] text-formula-paper">Pre-register & pay</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-formula-frost/80">
        {pricePerPlayerUsd} per player for the night you are booking toward (starting May 8, 2026). Walk-ups are still welcome at the desk — pre-pay holds your
        spot and speeds check-in.
      </p>
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
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-formula-frost/75">Email (for Stripe receipt)</span>
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
            value={playerNames}
            onChange={e => setPlayerNames(e.target.value)}
            rows={2}
            className="resize-y rounded-sm border border-formula-frost/20 bg-formula-paper/[0.06] px-3 py-2 font-sans text-[13px] text-formula-paper placeholder:text-formula-mist/50"
            placeholder="e.g. Jordan or Jordan, Riley"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-formula-frost/75">Number of players (this checkout)</span>
          <select
            value={playerCount}
            onChange={e => setPlayerCount(parseInt(e.target.value, 10))}
            className="min-h-11 rounded-sm border border-formula-frost/20 bg-formula-paper/[0.06] px-3 py-2 font-sans text-[13px] text-formula-paper"
          >
            {Array.from({ length: maxPlayers - minPlayers + 1 }, (_, i) => minPlayers + i).map(n => (
              <option key={n} value={n}>
                {n} player{n !== 1 ? 's' : ''} · ${n * pricePerPlayerUsd}
              </option>
            ))}
          </select>
        </label>
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
        <p className="mt-3 font-mono text-[10px] text-formula-mist/90">Enter guardian name, athlete name(s), and choose how many players to enable checkout.</p>
      ) : null}
    </div>
  )
}
