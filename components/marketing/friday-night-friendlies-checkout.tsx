'use client'

import { useActionState, useMemo, useState } from 'react'
import {
  submitFridayFriendliesWaiverRsvp,
  type FridayFriendliesWaiverRsvpState,
} from '@/app/(site)/events/friday-friendlies-waiver-actions'
import { CheckoutLaunchButton } from '@/components/marketing/checkout-launch-button'
import { FieldRentalAgreementForm } from '@/components/marketing/field-rental-agreement-form'
import { FRIDAY_NIGHT_FRIENDLIES_AGE, FRIDAY_NIGHT_FRIENDLIES_CHECKOUT } from '@/lib/marketing/public-pricing'
import { cn } from '@/lib/utils'

const { minPlayers, maxPlayers, pricePerPlayerUsd } = FRIDAY_NIGHT_FRIENDLIES_CHECKOUT
const { min: AGE_MIN, max: AGE_MAX } = FRIDAY_NIGHT_FRIENDLIES_AGE

const AGE_OPTIONS = Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, i) => AGE_MIN + i)

const RSVP_INITIAL: FridayFriendliesWaiverRsvpState = { ok: false, message: '' }

const fieldClass =
  'box-border w-full min-h-11 border border-formula-frost/18 bg-formula-paper/[0.04] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45'

type WaiverStep = 'choose' | 'sign' | 'rsvp'

export function FridayNightFriendliesCheckout() {
  const [guardianName, setGuardianName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [playerNames, setPlayerNames] = useState('')
  const [playerCount, setPlayerCount] = useState(1)
  const [ageYoungest, setAgeYoungest] = useState(8)
  const [ageOldest, setAgeOldest] = useState(8)
  const [waiverStep, setWaiverStep] = useState<WaiverStep>('choose')
  const [waiverAttested, setWaiverAttested] = useState(false)

  const [rsvpState, rsvpAction, rsvpPending] = useActionState(submitFridayFriendliesWaiverRsvp, RSVP_INITIAL)

  const resolvedAgeOldest = playerCount === 1 ? ageYoungest : Math.max(ageYoungest, ageOldest)

  const totalUsd = useMemo(() => playerCount * pricePerPlayerUsd, [playerCount])

  const emailOk =
    contactEmail.trim().length > 3 && contactEmail.includes('@') && contactEmail.includes('.')

  const metadata = useMemo(
    () => ({
      fnf_guardian_name: guardianName.trim(),
      fnf_contact_email: contactEmail.trim(),
      fnf_player_names: playerNames.trim(),
      fnf_player_count: String(playerCount),
      fnf_age_youngest: String(ageYoungest),
      fnf_age_oldest: String(resolvedAgeOldest),
      ...(waiverAttested ? { fnf_waiver_attested: 'confirmed' } : {}),
    }),
    [guardianName, contactEmail, playerNames, playerCount, ageYoungest, resolvedAgeOldest, waiverAttested]
  )

  const agesValid = playerCount === 1 ? true : resolvedAgeOldest >= ageYoungest

  const canSubmit =
    guardianName.trim().length >= 2 &&
    emailOk &&
    playerNames.trim().length >= 3 &&
    playerCount >= minPlayers &&
    playerCount <= maxPlayers &&
    agesValid &&
    waiverAttested

  return (
    <div className="not-prose space-y-10">
      <section
        id="waiver"
        className="scroll-mt-28 rounded-xl border border-formula-frost/16 bg-formula-paper/[0.04] p-4 sm:p-7"
      >
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-volt/90">Waiver</p>
        <h2 className="mt-2 font-mono text-sm font-semibold uppercase tracking-[0.14em] text-formula-paper">Before you pay</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-formula-frost/80">
          Each athlete needs a current Formula field rental waiver on file. Pick one path per athlete: sign the full agreement here, or RSVP if we already have
          their signed waiver for the email you used before.
        </p>

        {waiverStep === 'choose' ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setWaiverStep('sign')}
              className="flex flex-col gap-2 rounded-lg border border-formula-volt/35 bg-formula-volt/[0.08] p-5 text-left transition-colors hover:border-formula-volt/55 hover:bg-formula-volt/[0.12]"
            >
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-volt">Option 1</span>
              <span className="text-base font-semibold text-formula-paper">Sign the waiver now</span>
              <span className="text-sm leading-relaxed text-formula-frost/85">
                First time with us for this athlete, or no Formula waiver on file yet for them. Full digital form with signature. Submit once per athlete who
                needs it.
              </span>
            </button>
            <button
              type="button"
              onClick={() => setWaiverStep('rsvp')}
              className="flex flex-col gap-2 rounded-lg border border-formula-frost/18 bg-formula-paper/[0.03] p-5 text-left transition-colors hover:border-formula-frost/32 hover:bg-formula-paper/[0.06]"
            >
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-mist">Option 2</span>
              <span className="text-base font-semibold text-formula-paper">RSVP (waiver already signed)</span>
              <span className="text-sm leading-relaxed text-formula-frost/85">
                This athlete already completed our digital waiver with Formula. Enter the same participant name and email as on file. No new signature.
              </span>
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <button
              type="button"
              onClick={() => setWaiverStep('choose')}
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-formula-volt hover:underline"
            >
              ← Back to waiver options
            </button>

            {waiverStep === 'sign' ? (
              <div className="rounded-lg border border-formula-frost/12 bg-formula-base/40 p-2 sm:p-4">
                <FieldRentalAgreementForm programContext="friday_friendlies" />
              </div>
            ) : null}

            {waiverStep === 'rsvp' ? (
              <div className="rounded-lg border border-formula-frost/14 bg-formula-base/80 p-6 md:p-8">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-mist">RSVP</p>
                <p className="mt-2 max-w-xl text-sm text-formula-frost/85">
                  Use the <strong className="text-formula-paper">same email</strong> and <strong className="text-formula-paper">participant name</strong> as on the
                  athlete&apos;s existing signed waiver. Submit once per athlete using RSVP.
                </p>
                <form action={rsvpAction} className="mt-6 grid max-w-md gap-4">
                  <label className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-formula-mist">Participant name *</span>
                    <input name="participantName" type="text" required autoComplete="name" className={fieldClass} placeholder="As on your signed waiver" />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-formula-mist">Email *</span>
                    <input name="participantEmail" type="email" required autoComplete="email" className={fieldClass} placeholder="Same email as prior waiver" />
                  </label>
                  <button
                    type="submit"
                    disabled={rsvpPending}
                    className="inline-flex h-11 w-fit items-center border border-black/20 bg-formula-volt px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] !text-black hover:brightness-105 disabled:opacity-50"
                  >
                    {rsvpPending ? 'Saving…' : 'Confirm RSVP'}
                  </button>
                  {rsvpState.message ? (
                    <p className={cn('text-sm', rsvpState.ok ? 'text-formula-volt' : 'text-red-300/90')} role="status">
                      {rsvpState.message}
                    </p>
                  ) : null}
                </form>
              </div>
            ) : null}
          </div>
        )}
      </section>

      <div
        id="register"
        className="scroll-mt-28 rounded-xl border border-formula-frost/16 bg-formula-paper/[0.04] p-4 sm:mt-0 sm:p-7"
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
              onChange={e => {
                const n = parseInt(e.target.value, 10)
                setPlayerCount(n)
                if (n === 1) setAgeOldest(ageYoungest)
              }}
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
                  onChange={e => {
                    const v = parseInt(e.target.value, 10)
                    setAgeYoungest(v)
                    setAgeOldest(o => (o < v ? v : o))
                  }}
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
                  value={resolvedAgeOldest}
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

        <label className="mt-6 flex max-w-xl cursor-pointer items-start gap-3 rounded-sm border border-formula-frost/14 bg-formula-paper/[0.03] p-4">
          <input
            type="checkbox"
            checked={waiverAttested}
            onChange={e => setWaiverAttested(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-formula-volt"
          />
          <span className="text-[13px] leading-relaxed text-formula-frost/88">
            I confirm every athlete listed above is covered by a Formula waiver for this visit: I used <strong className="text-formula-paper">Sign the waiver</strong>{' '}
            and/or <strong className="text-formula-paper">RSVP</strong> in the section above for each person who needed it.
          </span>
        </label>

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
            Complete waivers or RSVPs above for each athlete, fill guardian name, valid email, athlete name(s), ages ({AGE_MIN}–{AGE_MAX}), player count, and check
            the waiver confirmation box to enable checkout.
          </p>
        ) : null}
      </div>
    </div>
  )
}
