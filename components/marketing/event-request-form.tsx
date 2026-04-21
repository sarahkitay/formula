'use client'

import { useActionState } from 'react'
import { submitEventRequest, type EventRequestState } from '@/app/(site)/events/actions'
import { EVENT_BUDGET_RANGES, EVENT_REQUEST_TYPES, EVENT_SPACE_PRESETS } from '@/lib/marketing/event-request-config'

const INITIAL: EventRequestState = { ok: false, message: '' }

export function EventRequestForm() {
  const [state, action, pending] = useActionState(submitEventRequest, INITIAL)

  return (
    <form action={action} className="not-prose grid gap-5 md:grid-cols-2">
      <label className="flex flex-col gap-2 md:col-span-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Event type *</span>
        <select
          name="eventType"
          required
          className="h-11 border border-formula-frost/18 bg-formula-paper/[0.04] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
          defaultValue=""
        >
          <option value="" disabled>
            Select type
          </option>
          {EVENT_REQUEST_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Headcount *</span>
        <input
          name="guestCount"
          type="number"
          min={1}
          max={5000}
          required
          className="h-11 border border-formula-frost/18 bg-formula-paper/[0.04] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
          placeholder="e.g. 40"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Budget *</span>
        <select
          name="budgetRange"
          required
          className="h-11 border border-formula-frost/18 bg-formula-paper/[0.04] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
          defaultValue=""
        >
          <option value="" disabled>
            Select range
          </option>
          {EVENT_BUDGET_RANGES.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist"># of fields / areas *</span>
        <input
          name="spaceCount"
          type="number"
          min={1}
          max={20}
          required
          defaultValue={1}
          className="h-11 border border-formula-frost/18 bg-formula-paper/[0.04] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
        />
      </label>

      <label className="flex flex-col gap-2 md:col-span-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Space preference *</span>
        <select
          name="spacePreset"
          required
          className="h-11 border border-formula-frost/18 bg-formula-paper/[0.04] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
          defaultValue=""
        >
          <option value="" disabled>
            Select primary need
          </option>
          {EVENT_SPACE_PRESETS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2 md:col-span-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Preferred dates or timing</span>
        <input
          name="preferredDates"
          type="text"
          maxLength={240}
          className="h-11 border border-formula-frost/18 bg-formula-paper/[0.04] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
          placeholder="e.g. Sat in March, weekday evenings"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Your name *</span>
        <input
          name="contactName"
          required
          autoComplete="name"
          className="h-11 border border-formula-frost/18 bg-formula-paper/[0.04] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Email *</span>
        <input
          name="contactEmail"
          type="email"
          required
          autoComplete="email"
          className="h-11 border border-formula-frost/18 bg-formula-paper/[0.04] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
        />
      </label>

      <label className="flex flex-col gap-2 md:col-span-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Phone</span>
        <input
          name="contactPhone"
          type="tel"
          autoComplete="tel"
          className="h-11 border border-formula-frost/18 bg-formula-paper/[0.04] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
        />
      </label>

      <label className="flex flex-col gap-2 md:col-span-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Notes</span>
        <textarea
          name="notes"
          rows={3}
          maxLength={2000}
          className="border border-formula-frost/18 bg-formula-paper/[0.04] px-3 py-2 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
          placeholder="Format, catering, AV, club name, etc."
        />
      </label>

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center border border-black/25 bg-formula-volt px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-black hover:brightness-105 disabled:opacity-50"
        >
          {pending ? 'Sending…' : 'Submit request'}
        </button>
        {state.message ? (
          <p className={`mt-3 text-sm ${state.ok ? 'text-formula-volt' : 'text-red-300'}`} role="status">
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  )
}
