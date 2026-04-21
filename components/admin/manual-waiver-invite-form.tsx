'use client'

import { useActionState } from 'react'
import { createManualWaiverInviteAction } from '@/app/(admin)/admin/rentals/waiver-invite-actions'

type State =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success'; waiver_url: string }

const INITIAL: State = { status: 'idle' }

async function runAction(_prev: State, formData: FormData): Promise<State> {
  const r = await createManualWaiverInviteAction(formData)
  if (r.ok) return { status: 'success', waiver_url: r.waiver_url }
  return { status: 'error', message: r.message }
}

export function ManualWaiverInviteForm() {
  const [state, action, pending] = useActionState(runAction, INITIAL)

  return (
    <div className="space-y-4">
      <form
        action={action}
        className="grid gap-4 font-mono text-[11px] md:grid-cols-2"
      >
        <label className="flex flex-col gap-1.5 md:col-span-2">
          <span className="text-formula-mist">Expected waivers (1–500) *</span>
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
          <span className="text-formula-mist">Rental type (optional lock)</span>
          <select
            name="rentalType"
            className="h-10 border border-formula-frost/18 bg-formula-paper/[0.04] px-3 text-formula-paper outline-none focus:border-formula-volt/40"
            defaultValue=""
          >
            <option value="">Let each signer choose</option>
            <option value="club_team_practice">Club / Team Practice</option>
            <option value="private_semi_private">Private / Semi-Private</option>
            <option value="general_pickup">General / Pick-Up</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-formula-mist">Booking ref (optional)</span>
          <input
            name="rentalRef"
            type="text"
            maxLength={120}
            className="h-10 border border-formula-frost/18 bg-formula-paper/[0.04] px-3 text-formula-paper outline-none focus:border-formula-volt/40"
            placeholder="e.g. internal hold id"
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
            {pending ? 'Creating…' : 'Create link'}
          </button>
        </div>
      </form>
      {state.status === 'error' ? <p className="text-sm text-red-300/90">{state.message}</p> : null}
      {state.status === 'success' ? (
        <div className="rounded-sm border border-formula-frost/14 bg-formula-paper/[0.03] p-4">
          <p className="text-[10px] uppercase tracking-[0.14em] text-formula-mist">New roster link</p>
          <code className="mt-2 block break-all text-[11px] text-formula-frost/90">{state.waiver_url}</code>
          <button
            type="button"
            className="mt-3 text-[10px] uppercase tracking-[0.14em] text-formula-volt underline-offset-2 hover:underline"
            onClick={() => void navigator.clipboard.writeText(state.waiver_url)}
          >
            Copy URL
          </button>
        </div>
      ) : null}
    </div>
  )
}
