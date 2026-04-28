'use client'

import { useActionState } from 'react'
import { submitCareerApplication, type CareerApplicationState } from '@/app/(site)/careers/actions'
import { CAREER_POSITION_OPTIONS } from '@/lib/careers/career-positions'

const INITIAL: CareerApplicationState = { ok: false, message: '' }

const fieldClass =
  'box-border w-full min-w-0 max-w-full min-h-12 border border-formula-frost/18 bg-formula-paper/[0.04] px-3 text-base text-formula-paper outline-none focus:border-formula-volt/45 sm:h-11 sm:min-h-0 sm:text-sm'

const textareaClass =
  'box-border w-full min-w-0 max-w-full min-h-[8rem] border border-formula-frost/18 bg-formula-paper/[0.04] px-3 py-2.5 text-base text-formula-paper outline-none focus:border-formula-volt/45 sm:text-sm'

const labelClass = 'flex min-w-0 flex-col gap-2'

export function CareersApplicationForm() {
  const [state, action, pending] = useActionState(submitCareerApplication, INITIAL)

  return (
    <form action={action} className="not-prose grid w-full min-w-0 max-w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-6 md:gap-y-5">
      <label className={`${labelClass} md:col-span-2`}>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Role *</span>
        <select name="position" required className={fieldClass} defaultValue="">
          <option value="" disabled>
            Select role
          </option>
          {CAREER_POSITION_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <label className={labelClass}>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Full name *</span>
        <input name="fullName" type="text" required autoComplete="name" className={fieldClass} placeholder="Your name" />
      </label>

      <label className={labelClass}>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Email *</span>
        <input name="email" type="email" required autoComplete="email" className={fieldClass} placeholder="you@example.com" />
      </label>

      <label className={labelClass}>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Phone</span>
        <input name="phone" type="tel" autoComplete="tel" className={fieldClass} placeholder="Optional" />
      </label>

      <label className={labelClass}>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Typical availability</span>
        <input name="availability" type="text" className={fieldClass} placeholder="e.g. weekday afternoons, full-time summer" />
      </label>

      <label className={`${labelClass} md:col-span-2`}>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">
          Coaching / playing background (coaching applicants)
        </span>
        <textarea
          name="coachingBackground"
          className={textareaClass}
          rows={4}
          placeholder="Licenses, age groups coached, playing level — optional for front desk."
        />
      </label>

      <label className={`${labelClass} md:col-span-2`}>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Why Formula? *</span>
        <textarea
          name="message"
          required
          minLength={40}
          className={textareaClass}
          rows={6}
          placeholder="A few sentences on what draws you to this role and how you would contribute."
        />
      </label>

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center border border-black/20 bg-formula-volt px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] !text-black transition-[filter] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? 'Sending…' : 'Submit application'}
        </button>
        {state.message ? (
          <p className={`mt-3 text-sm ${state.ok ? 'text-formula-volt' : 'text-red-300/90'}`} role="status">
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  )
}
