'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitWaiverInviteRsvp, type WaiverRsvpState } from '@/app/(site)/rentals/waiver-rsvp-actions'
import { FieldRentalAgreementForm, type FieldRentalRosterInvite } from '@/components/marketing/field-rental-agreement-form'
import { cn } from '@/lib/utils'

const RSVP_INITIAL: WaiverRsvpState = { ok: false, message: '' }

const fieldClass =
  'box-border w-full min-h-11 border border-formula-frost/18 bg-formula-paper/[0.04] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45'

type Mode = 'choose' | 'sign' | 'rsvp'

export function RosterWaiverInviteFlow({
  inviteToken,
  rosterInvite,
}: {
  inviteToken: string
  rosterInvite: FieldRentalRosterInvite
}) {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('choose')
  const [rsvpState, rsvpAction, rsvpPending] = useActionState(submitWaiverInviteRsvp, RSVP_INITIAL)
  const refreshedAfterRsvp = useRef(false)

  useEffect(() => {
    if (rsvpState.ok && !refreshedAfterRsvp.current) {
      refreshedAfterRsvp.current = true
      setMode('choose')
      router.refresh()
    }
  }, [rsvpState.ok, router])

  return (
    <div className="not-prose space-y-8">
      {mode === 'choose' ? (
        <div className="grid gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode('sign')}
            className="flex flex-col gap-2 rounded-lg border border-formula-volt/35 bg-formula-volt/[0.08] p-5 text-left transition-colors hover:border-formula-volt/55 hover:bg-formula-volt/[0.12]"
          >
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-volt">Option 1</span>
            <span className="text-base font-semibold text-formula-paper">Sign the waiver</span>
            <span className="text-sm leading-relaxed text-formula-frost/85">
              First time on this roster link, or you have not completed the Formula field rental agreement for this participant yet. Full form with signature.
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMode('rsvp')}
            className="flex flex-col gap-2 rounded-lg border border-formula-frost/18 bg-formula-paper/[0.03] p-5 text-left transition-colors hover:border-formula-frost/32 hover:bg-formula-paper/[0.06]"
          >
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-mist">Option 2</span>
            <span className="text-base font-semibold text-formula-paper">RSVP only</span>
            <span className="text-sm leading-relaxed text-formula-frost/85">
              You already signed our digital waiver on file with Formula (same email in our system). Enter name + email to be counted on this roster — no new
              signature.
            </span>
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setMode('choose')}
            className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-formula-volt hover:underline"
          >
            ← Back to options
          </button>
        </div>
      )}

      {mode === 'sign' ? <FieldRentalAgreementForm rosterInvite={rosterInvite} /> : null}

      {mode === 'rsvp' ? (
        <div className="rounded-lg border border-formula-frost/14 bg-formula-base/80 p-6 md:p-8">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-mist">RSVP</p>
          <p className="mt-2 max-w-xl text-sm text-formula-frost/85">
            Use the <strong className="text-formula-paper">same email</strong> and <strong className="text-formula-paper">participant name</strong> as on your
            existing signed waiver. We match against the latest waiver in our database for that email.
          </p>
          <form action={rsvpAction} className="mt-6 grid max-w-md gap-4">
            <input type="hidden" name="waiverInviteToken" value={inviteToken} />
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
  )
}
