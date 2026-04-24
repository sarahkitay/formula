'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { createPaidInPersonFieldRentalInviteAction } from '@/app/(admin)/admin/rentals/waiver-invite-actions'
import {
  FIELD_RENTAL_DEFAULT_DURATION_MINUTES,
  FIELD_RENTAL_DURATION_OPTIONS_MINUTES,
  FIELD_RENTAL_SLOT_STARTS,
  RENTAL_FIELD_OPTIONS,
} from '@/lib/rentals/field-rental-picker-constants'

type State =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success'; waiver_url: string }

const INITIAL: State = { status: 'idle' }

async function runAction(_prev: State, formData: FormData): Promise<State> {
  const r = await createPaidInPersonFieldRentalInviteAction(formData)
  if (r.ok) return { status: 'success', waiver_url: r.waiver_url }
  return { status: 'error', message: r.message }
}

export function PaidInPersonFieldRentalInviteForm() {
  const [state, action, pending] = useActionState(runAction, INITIAL)

  return (
    <div className="mt-8 space-y-4 border-t border-formula-frost/12 pt-8">
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
            className="h-10 border border-formula-frost/18 bg-formula-paper/[0.04] px-3 text-formula-paper outline-none focus:border-formula-volt/40"
            placeholder="e.g. 360.00"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-formula-mist">Expected waivers (roster size) *</span>
          <input
            name="expectedWaiverCount"
            type="number"
            min={1}
            max={500}
            required
            defaultValue={12}
            className="h-10 border border-formula-frost/18 bg-formula-paper/[0.04] px-3 text-formula-paper outline-none focus:border-formula-volt/40"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-formula-mist">Payer / organizer name *</span>
          <input
            name="purchaserName"
            type="text"
            required
            maxLength={200}
            className="h-10 border border-formula-frost/18 bg-formula-paper/[0.04] px-3 text-formula-paper outline-none focus:border-formula-volt/40"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-formula-mist">Payer email (optional)</span>
          <input
            name="purchaserEmail"
            type="email"
            maxLength={200}
            className="h-10 border border-formula-frost/18 bg-formula-paper/[0.04] px-3 text-formula-paper outline-none focus:border-formula-volt/40"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-formula-mist">Rental type *</span>
          <select
            name="rentalType"
            required
            defaultValue=""
            className="h-10 border border-formula-frost/18 bg-formula-paper/[0.04] px-3 text-formula-paper outline-none focus:border-formula-volt/40"
          >
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
          <select
            name="rentalField"
            required
            defaultValue=""
            className="h-10 border border-formula-frost/18 bg-formula-paper/[0.04] px-3 text-formula-paper outline-none focus:border-formula-volt/40"
          >
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
          <input
            name="sessionDate"
            type="date"
            required
            className="h-10 border border-formula-frost/18 bg-formula-paper/[0.04] px-3 text-formula-paper outline-none focus:border-formula-volt/40"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-formula-mist">Consecutive weekly sessions *</span>
          <input
            name="sessionWeeks"
            type="number"
            min={1}
            max={52}
            required
            defaultValue={1}
            className="h-10 border border-formula-frost/18 bg-formula-paper/[0.04] px-3 text-formula-paper outline-none focus:border-formula-volt/40"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-formula-mist">Start time *</span>
          <select
            name="slotStart"
            required
            defaultValue=""
            className="h-10 border border-formula-frost/18 bg-formula-paper/[0.04] px-3 text-formula-paper outline-none focus:border-formula-volt/40"
          >
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
            className="h-10 border border-formula-frost/18 bg-formula-paper/[0.04] px-3 text-formula-paper outline-none focus:border-formula-volt/40"
          >
            {FIELD_RENTAL_DURATION_OPTIONS_MINUTES.map(m => (
              <option key={m} value={m}>
                {m} minutes
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 md:col-span-2">
          <span className="text-formula-mist">Booking ref (optional — auto if empty)</span>
          <input
            name="rentalRef"
            type="text"
            maxLength={120}
            className="h-10 border border-formula-frost/18 bg-formula-paper/[0.04] px-3 text-formula-paper outline-none focus:border-formula-volt/40"
            placeholder="Internal id or receipt #"
          />
        </label>
        <label className="flex flex-col gap-1.5 md:col-span-2">
          <span className="text-formula-mist">Notes (optional)</span>
          <textarea
            name="notes"
            rows={2}
            maxLength={500}
            className="border border-formula-frost/18 bg-formula-paper/[0.04] px-3 py-2 text-formula-paper outline-none focus:border-formula-volt/40"
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
