'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AssessmentMonthCalendar } from '@/components/marketing/assessment-month-calendar'
import { CheckoutLaunchButton } from '@/components/marketing/checkout-launch-button'
import type { BookAssessmentVariant } from '@/components/marketing/book-assessment-types'
import { GUARDIAN_SESSION_STORAGE_KEY, readGuardianFromSession } from '@/components/marketing/book-assessment-guardian-contact-client'
import { BOOKING_HUB_PARENT, BOOKING_HUB_PUBLIC } from '@/lib/marketing/book-assessment-paths'
import { ASSESSMENT_MAX_KIDS_PER_BOOKING } from '@/lib/assessment/constants'
import { ASSESSMENT_JUNE_PREBOOK_MONTH, ASSESSMENT_JUNE_PREBOOK_YEAR } from '@/lib/assessment/june-2026-slots'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { FORMULA_SKILLS_CHECK } from '@/lib/marketing/public-pricing'
import { cn } from '@/lib/utils'

type Slot = {
  id: string
  starts_at: string
  capacity: number
  label: string | null
  booked_kids: number
  available: number
}

export function BookAssessmentSkillsCheckClient({
  variant = 'public',
  guardianFullName = '',
  guardianEmail = '',
  skillsCheckPriceUsd = 0,
}: {
  variant?: BookAssessmentVariant
  guardianFullName?: string
  guardianEmail?: string
  skillsCheckPriceUsd?: number
}) {
  const [slots, setSlots] = useState<Slot[]>([])
  const [slotsError, setSlotsError] = useState<string | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [numKids, setNumKids] = useState(1)
  const [parentFullName, setParentFullName] = useState('')
  const [parentEmail, setParentEmail] = useState('')

  const isPortal = variant === 'portal'
  const hub = isPortal ? BOOKING_HUB_PARENT.hub : BOOKING_HUB_PUBLIC.hub
  const contactHref = isPortal ? BOOKING_HUB_PARENT.contact : BOOKING_HUB_PUBLIC.contact

  useEffect(() => {
    if (isPortal) return
    const g = readGuardianFromSession()
    if (g) {
      setParentFullName(g.name)
      setParentEmail(g.email)
    }
  }, [isPortal])

  const billingName = isPortal ? guardianFullName.trim() : parentFullName.trim()
  const billingEmail = isPortal ? guardianEmail.trim() : parentEmail.trim()
  const skillsCheckUsd = skillsCheckPriceUsd > 0 ? skillsCheckPriceUsd : FORMULA_SKILLS_CHECK.priceUsd

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

  const selected = useMemo(() => slots.find((s) => s.id === selectedId) ?? null, [slots, selectedId])

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

  const persistGuardian = useCallback(() => {
    if (isPortal) return
    try {
      sessionStorage.setItem(
        GUARDIAN_SESSION_STORAGE_KEY,
        JSON.stringify({ name: parentFullName.trim(), email: parentEmail.trim() })
      )
    } catch {
      /* ignore */
    }
  }, [isPortal, parentEmail, parentFullName])

  const canPay =
    selected &&
    selected.available > 0 &&
    numKids >= 1 &&
    numKids <= Math.min(ASSESSMENT_MAX_KIDS_PER_BOOKING, selected.available) &&
    billingName.length > 1 &&
    billingEmail.includes('@')

  return (
    <div className="not-prose space-y-8 md:space-y-10">
      {!isPortal ? (
        <div className="rounded-sm border border-formula-frost/14 bg-formula-paper/[0.03] p-5 md:p-6">
          <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Guardian contact</h2>
          <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-formula-frost/70">
            Same details as the{' '}
            <Link href={contactHref} className="text-formula-volt underline-offset-2 hover:underline">
              contact page
            </Link>
            . Edit here if you need to change them before paying.
          </p>
          <div className="mt-4 grid max-w-xl min-w-0 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="ba-skills-parent-name" className="block font-mono text-[10px] uppercase tracking-[0.14em] text-formula-frost/60">
                Full name
              </label>
              <input
                id="ba-skills-parent-name"
                value={parentFullName}
                onChange={(e) => {
                  setParentFullName(e.target.value)
                  persistGuardian()
                }}
                onBlur={persistGuardian}
                autoComplete="name"
                className="mt-1.5 w-full min-w-0 border border-formula-frost/18 bg-formula-deep/80 px-3 py-2.5 text-sm text-formula-paper outline-none focus:border-formula-volt/40"
                placeholder="Parent or guardian"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="ba-skills-parent-email" className="block font-mono text-[10px] uppercase tracking-[0.14em] text-formula-frost/60">
                Email (for receipt & portal)
              </label>
              <input
                id="ba-skills-parent-email"
                type="email"
                value={parentEmail}
                onChange={(e) => {
                  setParentEmail(e.target.value.trim())
                  persistGuardian()
                }}
                onBlur={persistGuardian}
                autoComplete="email"
                className="mt-1.5 w-full min-w-0 border border-formula-frost/18 bg-formula-deep/80 px-3 py-2.5 text-sm text-formula-paper outline-none focus:border-formula-volt/40"
                placeholder="you@example.com"
              />
            </div>
          </div>
        </div>
      ) : null}

      <section id="skills-check" className="scroll-mt-28 space-y-5" aria-labelledby="ba-slots-heading">
        <h2 id="ba-slots-heading" className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">
          Skills Check — June pre-book
        </h2>
        <p className="max-w-2xl text-[13px] leading-relaxed text-formula-frost/70">
          Assessment slots open <strong className="font-medium text-formula-paper">June {ASSESSMENT_JUNE_PREBOOK_YEAR}</strong> — pre-book now. Times are
          Pacific. Each hour is capped at <strong className="font-medium text-formula-paper">four athletes total</strong> across all families (you can book 1–4
          in one checkout if space allows). Pick a June day, then an open hour.
        </p>

        {loadingSlots ? (
          <p className="font-mono text-[11px] text-formula-frost/50">Loading June availability…</p>
        ) : slotsError ? (
          <p className="text-sm text-amber-300/95">{slotsError}</p>
        ) : slots.length === 0 ? (
          <p className="text-sm text-formula-frost/70">
            No June windows available yet. If you expected to see times, try again later or call the front desk — we may still be opening that month.
          </p>
        ) : (
          <AssessmentMonthCalendar
            slots={slots}
            selectedId={selectedId}
            onSelectId={setSelectedId}
            formatWhen={formatWhen}
            initialCalendarYear={ASSESSMENT_JUNE_PREBOOK_YEAR}
            initialCalendarMonth={ASSESSMENT_JUNE_PREBOOK_MONTH}
          />
        )}
      </section>

      {selected && selected.available > 0 ? (
        <section className="space-y-3 border border-formula-frost/14 bg-formula-paper/[0.03] p-5 md:p-6" aria-labelledby="ba-kids-heading">
          <h2 id="ba-kids-heading" className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">
            Athletes this booking
          </h2>
          <p className="mt-2 text-[13px] text-formula-frost/75">
            Pricing is per athlete for this Skills Check. You can reserve up to {Math.min(ASSESSMENT_MAX_KIDS_PER_BOOKING, selected.available)} spot
            {Math.min(ASSESSMENT_MAX_KIDS_PER_BOOKING, selected.available) === 1 ? '' : 's'} in this window.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: Math.min(ASSESSMENT_MAX_KIDS_PER_BOOKING, selected.available) }, (_, i) => i + 1).map((n) => (
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
        <section className="space-y-3 border border-formula-frost/14 bg-formula-deep/60 p-5 md:p-6" aria-labelledby="ba-pay-heading">
          <h2 id="ba-pay-heading" className="text-lg font-semibold text-formula-paper">
            Pay to hold this window
          </h2>
          <p className="mt-2 text-[13px] text-formula-frost/78">
            {formatWhen(selected!.starts_at)} · {numKids} athlete{numKids === 1 ? '' : 's'}
          </p>
          {!isPortal ? (
            <p className="mt-2 text-[12px] text-formula-frost/65">
              <strong className="text-formula-paper">${skillsCheckUsd}</strong> per athlete.{' '}
              <Link href={hub} className="text-formula-volt underline-offset-2 hover:underline">
                Hub overview
              </Link>
            </p>
          ) : null}
          <div className="not-prose mt-6">
            <CheckoutLaunchButton
              checkoutType="assessment"
              label="Continue to secure payment"
              successNext={isPortal ? undefined : 'portal-assessment'}
              metadata={{
                assessment_slot_id: selected!.id,
                assessment_num_kids: String(numKids),
                parent_full_name: billingName,
                parent_email_hint: billingEmail,
              }}
            />
          </div>
        </section>
      ) : null}

      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-frost/55">
        <a href={hub} className="text-formula-volt underline-offset-2 hover:underline">
          ← Booking hub
        </a>
        {' · '}
        <Link href={MARKETING_HREF.assessment} className="text-formula-volt underline-offset-2 hover:underline">
          What we measure
        </Link>
        {!isPortal ? (
          <>
            {' · '}
            <Link
              href={`/login?role=parent&next=${encodeURIComponent(MARKETING_HREF.parentBookAssessmentDirectory)}`}
              className="text-formula-volt underline-offset-2 hover:underline"
            >
              Sign in to book here
            </Link>
          </>
        ) : (
          <>
            {' · '}
            <Link href="/parent/dashboard" className="text-formula-volt underline-offset-2 hover:underline">
              Parent home
            </Link>
          </>
        )}
      </p>
    </div>
  )
}
