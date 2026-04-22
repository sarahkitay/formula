'use client'

import { useActionState } from 'react'
import { submitEventRequest, type EventRequestState } from '@/app/(site)/events/actions'
import { EVENT_BUDGET_RANGES, EVENT_REQUEST_TYPES, EVENT_SPACE_PRESETS } from '@/lib/marketing/event-request-config'

const INITIAL: EventRequestState = { ok: false, message: '' }

/** `min-w-0` + `w-full` so grid children shrink on narrow viewports (select option text is a common overflow source). */
const fieldClass =
  'box-border w-full min-w-0 max-w-full min-h-12 border border-formula-frost/18 bg-formula-paper/[0.04] px-3 text-base text-formula-paper outline-none focus:border-formula-volt/45 sm:h-11 sm:min-h-0 sm:text-sm'

const textareaClass =
  'box-border w-full min-w-0 max-w-full min-h-[7.5rem] border border-formula-frost/18 bg-formula-paper/[0.04] px-3 py-2.5 text-base text-formula-paper outline-none focus:border-formula-volt/45 sm:text-sm'

const labelClass = 'flex min-w-0 flex-col gap-2'

export function EventRequestForm() {
  const [state, action, pending] = useActionState(submitEventRequest, INITIAL)

  return (
    <form
      action={action}
      className="not-prose grid w-full min-w-0 max-w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-6 md:gap-y-5"
    >
      <label className={`${labelClass} md:col-span-2`}>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Event type *</span>
        <select name="eventType" required className={fieldClass} defaultValue="">
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

      <label className={labelClass}>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Headcount *</span>
        <input name="guestCount" type="number" min={1} max={5000} required className={fieldClass} placeholder="e.g. 40" />
      </label>

      <label className={labelClass}>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Budget *</span>
        <select name="budgetRange" required className={fieldClass} defaultValue="">
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

      <label className={labelClass}>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist"># of fields / areas *</span>
        <input name="spaceCount" type="number" min={1} max={20} required defaultValue={1} className={fieldClass} />
      </label>

      <label className={`${labelClass} md:col-span-2`}>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Space preference *</span>
        <select name="spacePreset" required className={fieldClass} defaultValue="">
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

      <label className={`${labelClass} md:col-span-2`}>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Preferred dates or timing</span>
        <input
          name="preferredDates"
          type="text"
          maxLength={240}
          className={fieldClass}
          placeholder="e.g. Sat in March, weekday evenings"
        />
      </label>

      <label className={labelClass}>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Your name *</span>
        <input name="contactName" required autoComplete="name" className={fieldClass} />
      </label>

      <label className={labelClass}>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Email *</span>
        <input name="contactEmail" type="email" required autoComplete="email" className={fieldClass} />
      </label>

      <label className={`${labelClass} md:col-span-2`}>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Phone</span>
        <input name="contactPhone" type="tel" autoComplete="tel" className={fieldClass} />
      </label>

      <label className={`${labelClass} md:col-span-2`}>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Notes</span>
        <textarea name="notes" rows={3} maxLength={2000} className={textareaClass} placeholder="Format, catering, AV, club name, etc." />
      </label>

      <div className="min-w-0 md:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="flex min-h-12 w-full max-w-full items-center justify-center border border-black/25 bg-formula-volt px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-black hover:brightness-105 disabled:opacity-50 sm:h-11 sm:w-auto sm:min-h-0 sm:max-w-none sm:px-6"
        >
          {pending ? 'Sending…' : 'Submit request'}
        </button>
        {state.message ? (
          <p className={`mt-3 break-words text-sm ${state.ok ? 'text-formula-volt' : 'text-red-300'}`} role="status">
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  )
}
