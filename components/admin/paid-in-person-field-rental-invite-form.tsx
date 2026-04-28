'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { createPaidInPersonFieldRentalInviteAction } from '@/app/(admin)/admin/rentals/waiver-invite-actions'
import {
  FIELD_RENTAL_COMMON_DEPOSIT_USD,
  FIELD_RENTAL_DEFAULT_DURATION_MINUTES,
  FIELD_RENTAL_DURATION_OPTIONS_MINUTES,
  FIELD_RENTAL_ROSTER_HEADCOUNT_OPTIONS,
  FIELD_RENTAL_SESSION_WEEKS_OPTIONS,
  FIELD_RENTAL_SLOT_STARTS,
  formatFieldRentalDurationLabel,
  RENTAL_FIELD_OPTIONS,
} from '@/lib/rentals/field-rental-picker-constants'

type State =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success'; waiver_url: string }

const INITIAL: State = { status: 'idle' }

const fieldBase =
  'h-10 w-full rounded-sm border border-formula-frost/20 bg-formula-paper/[0.06] px-3 text-[13px] text-formula-paper outline-none transition-colors focus:border-formula-volt/50 focus:ring-1 focus:ring-formula-volt/25'
const selectField = `${fieldBase} cursor-pointer`

async function runAction(_prev: State, formData: FormData): Promise<State> {
  const r = await createPaidInPersonFieldRentalInviteAction(formData)
  if (r.ok) return { status: 'success', waiver_url: r.waiver_url }
  return { status: 'error', message: r.message }
}

export function PaidInPersonFieldRentalInviteForm() {
  const [state, action, pending] = useActionState(runAction, INITIAL)

  return (
    <div className="space-y-4 pt-1">
      <div>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-mist">Paid in person</p>
        <h3 className="mt-1 font-mono text-sm font-semibold text-formula-paper">Field rental deposit + roster waiver link</h3>
        <p className="mt-2 max-w-2xl font-mono text-[11px] leading-relaxed text-formula-mist">
          Use when the renter already paid at the desk (cash, check, or terminal outside Stripe). This creates the same shareable waiver link as after online checkout, fills the roster card with payer and session details, and writes a row to{' '}
          <Link href="/admin/payments" className="text-formula-volt underline-offset-2 hover:underline">
            Admin → Payments
          </Link>{' '}
          so field rental revenue rollups stay accurate.
        </p>
      </div>

      <datalist id="field-rental-deposit-presets">
        {FIELD_RENTAL_COMMON_DEPOSIT_USD.map(amt => (
          <option key={amt} value={amt.toFixed(2)} />
        ))}
      </datalist>

      <form action={action} className="grid gap-4 font-mono text-[11px] md:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-formula-mist">Amount collected (USD) *</span>
          <input
            name="amountUsd"
            type="number"
            inputMode="decimal"
            min={0.5}
            step="0.01"
            required
            list="field-rental-deposit-presets"
            className={fieldBase}
            placeholder="e.g. 360.00"
          />
          <span className="text-[10px] text-formula-mist/80">Type a custom amount or pick from browser suggestions (common deposits).</span>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-formula-mist">Expected waivers (roster size) *</span>
          <select name="expectedWaiverCount" required defaultValue={12} className={selectField}>
            {FIELD_RENTAL_ROSTER_HEADCOUNT_OPTIONS.map(n => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'signer' : 'signers'}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-formula-mist">Payer / organizer name *</span>
          <input name="purchaserName" type="text" required maxLength={200} className={fieldBase} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-formula-mist">Payer email (optional)</span>
          <input name="purchaserEmail" type="email" maxLength={200} className={fieldBase} />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-formula-mist">Rental type *</span>
          <select name="rentalType" required defaultValue="" className={selectField}>
            <option value="" disabled>
              Select type
            </option>
            <option value="club_team_practice">Club / Team Practice</option>
            <option value="private_semi_private">Private / Semi-Private</option>
            <option value="general_pickup">General / Pick-Up</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-formula-mist">Field *</span>
          <select name="rentalField" required defaultValue="" className={selectField}>
            <option value="" disabled>
              Select field
            </option>
            {RENTAL_FIELD_OPTIONS.map(f => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-formula-mist">First session date *</span>
          <input name="sessionDate" type="date" required className={selectField} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-formula-mist">Consecutive weekly sessions *</span>
          <select name="sessionWeeks" required defaultValue={1} className={selectField}>
            {FIELD_RENTAL_SESSION_WEEKS_OPTIONS.map(w => (
              <option key={w} value={w}>
                {w} {w === 1 ? 'week' : 'weeks'}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-formula-mist">Start time *</span>
          <select name="slotStart" required defaultValue="" className={selectField}>
            <option value="" disabled>
              Select start
            </option>
            {FIELD_RENTAL_SLOT_STARTS.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-formula-mist">Duration *</span>
          <select
            name="durationMinutes"
            required
            defaultValue={FIELD_RENTAL_DEFAULT_DURATION_MINUTES}
            className={selectField}
          >
            {FIELD_RENTAL_DURATION_OPTIONS_MINUTES.map(m => (
              <option key={m} value={m}>
                {formatFieldRentalDurationLabel(m)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 md:col-span-2">
          <span className="text-formula-mist">Booking ref (optional — auto if empty)</span>
          <input name="rentalRef" type="text" maxLength={120} className={fieldBase} placeholder="Internal id or receipt #" />
        </label>
        <label className="flex flex-col gap-1.5 md:col-span-2">
          <span className="text-formula-mist">Notes (optional)</span>
          <textarea
            name="notes"
            rows={2}
            maxLength={500}
            className="min-h-[4.5rem] w-full rounded-sm border border-formula-frost/20 bg-formula-paper/[0.06] px-3 py-2 text-[13px] text-formula-paper outline-none transition-colors focus:border-formula-volt/50 focus:ring-1 focus:ring-formula-volt/25"
          />
        </label>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-10 items-center border border-black/25 bg-formula-volt px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-black hover:brightness-105 disabled:opacity-50"
          >
            {pending ? 'Creating…' : 'Create link + record payment'}
          </button>
        </div>
      </form>

      {state.status === 'error' ? <p className="text-sm text-red-300/90">{state.message}</p> : null}
      {state.status === 'success' ? (
        <div className="rounded-sm border border-formula-frost/14 bg-formula-paper/[0.03] p-4">
          <p className="text-[10px] uppercase tracking-[0.14em] text-formula-mist">Roster waiver link</p>
          <code className="mt-2 block break-all text-[11px] text-formula-frost/90">{state.waiver_url}</code>
          <div className="mt-3 flex flex-wrap gap-4 text-[10px] uppercase tracking-[0.14em]">
            <button
              type="button"
              className="text-formula-volt underline-offset-2 hover:underline"
              onClick={() => void navigator.clipboard.writeText(state.waiver_url)}
            >
              Copy URL
            </button>
            <Link href="/admin/payments" className="text-formula-mist underline-offset-2 hover:text-formula-paper hover:underline">
              View payments
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  )
}
