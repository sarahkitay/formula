'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CheckoutLaunchButton } from '@/components/marketing/checkout-launch-button'
import { ASSESSMENT_MAX_KIDS_PER_BOOKING } from '@/lib/assessment/constants'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { cn } from '@/lib/utils'

type Slot = {
  id: string
  starts_at: string
  capacity: number
  label: string | null
  booked_kids: number
  available: number
}

export function BookAssessmentClient() {
  const [slots, setSlots] = useState<Slot[]>([])
  const [slotsError, setSlotsError] = useState<string | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [numKids, setNumKids] = useState(1)
  const [parentFullName, setParentFullName] = useState('')
  const [parentEmail, setParentEmail] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/assessment-slots')
        const data = (await res.json()) as { slots?: Slot[]; error?: string }
        if (!res.ok) throw new Error(data.error ?? 'Could not load times')
        if (!cancelled) setSlots(data.slots ?? [])
      } catch (e) {
        if (!cancelled) setSlotsError(e instanceof Error ? e.message : 'Could not load times')
      } finally {
        if (!cancelled) setLoadingSlots(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const selected = useMemo(() => slots.find(s => s.id === selectedId) ?? null, [slots, selectedId])

  useEffect(() => {
    if (selected && numKids > selected.available) {
      setNumKids(Math.max(1, selected.available))
    }
  }, [selected, numKids])

  const formatWhen = useCallback((iso: string) => {
    const d = new Date(iso)
    return d.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/Los_Angeles',
    })
  }, [])

  const canPay =
    selected &&
    selected.available > 0 &&
    numKids >= 1 &&
    numKids <= Math.min(ASSESSMENT_MAX_KIDS_PER_BOOKING, selected.available) &&
    parentFullName.trim().length > 1 &&
    parentEmail.includes('@')

  return (
    <div className="not-prose space-y-10">
      <p className="max-w-2xl text-[15px] leading-relaxed text-formula-frost/85">
        Pick an open Skills Check window, choose how many athletes you&apos;re bringing (up to four spots per hour across all families), then pay securely. You
        don&apos;t need a portal account first. After checkout, you can create a parent login and add your athletes&apos; names so they appear in your portal.
      </p>

      <section aria-labelledby="ba-contact-heading">
        <h2 id="ba-contact-heading" className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">
          Guardian contact
        </h2>
        <div className="mt-4 grid max-w-xl gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="ba-parent-name" className="block font-mono text-[10px] uppercase tracking-[0.14em] text-formula-frost/60">
              Full name
            </label>
            <input
              id="ba-parent-name"
              value={parentFullName}
              onChange={e => setParentFullName(e.target.value)}
              autoComplete="name"
              className="mt-1.5 w-full border border-formula-frost/18 bg-formula-deep/80 px-3 py-2.5 text-sm text-formula-paper outline-none focus:border-formula-volt/40"
              placeholder="Parent or guardian"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="ba-parent-email" className="block font-mono text-[10px] uppercase tracking-[0.14em] text-formula-frost/60">
              Email (for receipt & portal)
            </label>
            <input
              id="ba-parent-email"
              type="email"
              value={parentEmail}
              onChange={e => setParentEmail(e.target.value.trim())}
              autoComplete="email"
              className="mt-1.5 w-full border border-formula-frost/18 bg-formula-deep/80 px-3 py-2.5 text-sm text-formula-paper outline-none focus:border-formula-volt/40"
              placeholder="you@example.com"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="ba-slots-heading">
        <h2 id="ba-slots-heading" className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">
          Open windows
        </h2>
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-formula-frost/70">
          Each hour has up to four athlete spots total. We show how many are already reserved and how many you can still book.
        </p>

        {loadingSlots ? (
          <p className="mt-6 font-mono text-[11px] text-formula-frost/50">Loading availability…</p>
        ) : slotsError ? (
          <p className="mt-6 text-sm text-amber-300/95">{slotsError}</p>
        ) : slots.length === 0 ? (
          <p className="mt-6 text-sm text-formula-frost/70">No upcoming windows published yet. Check back soon or call the front desk.</p>
        ) : (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {slots.map(slot => {
              const active = selectedId === slot.id
              const full = slot.available <= 0
              return (
                <li key={slot.id}>
                  <button
                    type="button"
                    disabled={full}
                    onClick={() => !full && setSelectedId(slot.id)}
                    className={cn(
                      'w-full border p-4 text-left transition-colors',
                      full
                        ? 'cursor-not-allowed border-formula-frost/8 bg-formula-paper/[0.02] opacity-50'
                        : active
                          ? 'border-formula-volt/45 bg-formula-volt/[0.08] ring-1 ring-formula-volt/25'
                          : 'border-formula-frost/14 bg-formula-paper/[0.03] hover:border-formula-frost/24'
                    )}
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-formula-frost/55">
                      {slot.label ?? 'Formula Skills Check'}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-formula-paper">{formatWhen(slot.starts_at)}</p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-formula-volt/85">
                      {full ? 'Full' : `${slot.booked_kids}/${slot.capacity} booked · ${slot.available} open`}
                    </p>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {selected && selected.available > 0 ? (
        <section className="border border-formula-frost/14 bg-formula-paper/[0.03] p-5 md:p-6" aria-labelledby="ba-kids-heading">
          <h2 id="ba-kids-heading" className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">
            Athletes this booking
          </h2>
          <p className="mt-2 text-[13px] text-formula-frost/75">
            Pricing is per athlete for this Skills Check. You can reserve up to {Math.min(ASSESSMENT_MAX_KIDS_PER_BOOKING, selected.available)} spot
            {Math.min(ASSESSMENT_MAX_KIDS_PER_BOOKING, selected.available) === 1 ? '' : 's'} in this window.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: Math.min(ASSESSMENT_MAX_KIDS_PER_BOOKING, selected.available) }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setNumKids(n)}
                className={cn(
                  'min-w-[2.75rem] border px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors',
                  numKids === n
                    ? 'border-formula-volt/50 bg-formula-volt/15 text-formula-paper'
                    : 'border-formula-frost/18 text-formula-frost/80 hover:border-formula-frost/30'
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-formula-frost/50">
            Selected: {numKids} athlete{numKids === 1 ? '' : 's'}
          </p>
        </section>
      ) : null}

      {canPay ? (
        <section className="border border-formula-frost/14 bg-formula-deep/60 p-5 md:p-6" aria-labelledby="ba-pay-heading">
          <h2 id="ba-pay-heading" className="text-lg font-semibold text-formula-paper">
            Pay to hold this window
          </h2>
          <p className="mt-2 text-[13px] text-formula-frost/78">
            {formatWhen(selected!.starts_at)} · {numKids} athlete{numKids === 1 ? '' : 's'}
          </p>
          <div className="not-prose mt-6">
            <CheckoutLaunchButton
              checkoutType="assessment"
              label="Continue to secure payment"
              successNext="portal-assessment"
              metadata={{
                assessment_slot_id: selected!.id,
                assessment_num_kids: String(numKids),
                parent_full_name: parentFullName.trim(),
                parent_email_hint: parentEmail.trim(),
              }}
            />
          </div>
        </section>
      ) : null}

      <p className="text-[12px] text-formula-frost/55">
        Already have a portal account?{' '}
        <Link href="/login?role=parent" className="text-formula-volt underline-offset-2 hover:underline">
          Sign in
        </Link>
        {' · '}
        <Link href={MARKETING_HREF.assessment} className="text-formula-volt underline-offset-2 hover:underline">
          What we measure
        </Link>
      </p>
    </div>
  )
}
