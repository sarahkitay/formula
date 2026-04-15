'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AssessmentMonthCalendar } from '@/components/marketing/assessment-month-calendar'
import { CheckoutLaunchButton } from '@/components/marketing/checkout-launch-button'
import { FieldRentalAgreementForm } from '@/components/marketing/field-rental-agreement-form'
import { FieldRentalBookingFlow } from '@/components/marketing/field-rental-booking-flow'
import { YouthBlocksWeekPanel } from '@/components/marketing/youth-blocks-week-panel'
import { ASSESSMENT_MAX_KIDS_PER_BOOKING } from '@/lib/assessment/constants'
import { BOOKING_HUB_DIRECTORY_ID, MARKETING_HREF } from '@/lib/marketing/nav'
import { cn } from '@/lib/utils'

type Slot = {
  id: string
  starts_at: string
  capacity: number
  label: string | null
  booked_kids: number
  available: number
}

export type BookAssessmentVariant = 'public' | 'portal'

type BookAssessmentClientProps = {
  variant?: BookAssessmentVariant
  guardianFullName?: string
  guardianEmail?: string
}

export function BookAssessmentClient({
  variant = 'public',
  guardianFullName = '',
  guardianEmail = '',
}: BookAssessmentClientProps) {
  const [slots, setSlots] = useState<Slot[]>([])
  const [slotsError, setSlotsError] = useState<string | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [numKids, setNumKids] = useState(1)
  const [parentFullName, setParentFullName] = useState('')
  const [parentEmail, setParentEmail] = useState('')

  const isPortal = variant === 'portal'
  const billingName = isPortal ? guardianFullName.trim() : parentFullName.trim()
  const billingEmail = isPortal ? guardianEmail.trim() : parentEmail.trim()

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

  const canPay =
    selected &&
    selected.available > 0 &&
    numKids >= 1 &&
    numKids <= Math.min(ASSESSMENT_MAX_KIDS_PER_BOOKING, selected.available) &&
    billingName.length > 1 &&
    billingEmail.includes('@')

  const bookingDirectoryLinks = [
    ...(isPortal
      ? [{ href: '#booking-account', label: 'Account' as const }]
      : [{ href: '#booking-contact', label: 'Guardian contact' as const }]),
    { href: '#skills-check', label: 'Skills Check' as const },
    { href: '#youth-training-blocks', label: 'Youth training blocks' as const },
    { href: '#field-rental-on-hub', label: 'Field rental' as const },
    { href: '#participant-waiver', label: 'Rental agreement & waiver' as const },
  ]

  return (
    <div className="not-prose space-y-14">
      <p className="max-w-2xl text-[15px] leading-relaxed text-formula-frost/85">
        {isPortal ? (
          <>
            Use the calendar to pick a Skills Check window, book field time with deposit + agreement, and preview youth training blocks. Receipts use the email
            on your portal account.
          </>
        ) : (
          <>
            One hub: Skills Check calendar, youth block preview (package required to finalize in portal), and field rentals with the same anti-overlap calendar
            rules. After checkout you can create a parent login for athlete names.
          </>
        )}
      </p>

      <nav
        id={BOOKING_HUB_DIRECTORY_ID}
        aria-label="Jump to booking type"
        className="scroll-mt-24 rounded-sm border border-formula-frost/14 bg-formula-paper/[0.03] p-4 md:p-5"
      >
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Book by type</p>
        <p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-formula-frost/70">
          Jump to the section you need — Skills Check calendar, youth block preview, field rental hold, or the rental agreement.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {bookingDirectoryLinks.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="inline-flex border border-formula-frost/18 bg-formula-deep/50 px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-formula-paper transition-colors hover:border-formula-volt/40 hover:text-formula-volt"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {isPortal ? (
        <section
          id="booking-account"
          aria-labelledby="ba-account-heading"
          className="scroll-mt-24 rounded-sm border border-formula-frost/14 bg-formula-paper/[0.04] p-4"
        >
          <h2 id="ba-account-heading" className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">
            Your account
          </h2>
          <p className="mt-2 text-sm font-medium text-formula-paper">{billingName}</p>
          <p className="mt-1 text-[13px] text-formula-frost/75">{billingEmail}</p>
        </section>
      ) : (
        <section id="booking-contact" aria-labelledby="ba-contact-heading" className="scroll-mt-24">
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
                onChange={(e) => setParentFullName(e.target.value)}
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
                onChange={(e) => setParentEmail(e.target.value.trim())}
                autoComplete="email"
                className="mt-1.5 w-full border border-formula-frost/18 bg-formula-deep/80 px-3 py-2.5 text-sm text-formula-paper outline-none focus:border-formula-volt/40"
                placeholder="you@example.com"
              />
            </div>
          </div>
        </section>
      )}

      <section id="skills-check" className="scroll-mt-24 space-y-4" aria-labelledby="ba-slots-heading">
        <h2 id="ba-slots-heading" className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">
          Skills Check — month calendar
        </h2>
        <p className="max-w-2xl text-[13px] leading-relaxed text-formula-frost/70">
          Times shown in Pacific. Each window has up to four athlete spots total across families. Pick a day, then a time.
        </p>

        {loadingSlots ? (
          <p className="font-mono text-[11px] text-formula-frost/50">Loading availability…</p>
        ) : slotsError ? (
          <p className="text-sm text-amber-300/95">{slotsError}</p>
        ) : slots.length === 0 ? (
          <p className="text-sm text-formula-frost/70">No upcoming windows published yet. Check back soon or call the front desk.</p>
        ) : (
          <AssessmentMonthCalendar
            slots={slots}
            selectedId={selectedId}
            onSelectId={setSelectedId}
            formatWhen={formatWhen}
          />
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

      <div className="marketing-section-divider" aria-hidden />

      <YouthBlocksWeekPanel />

      <div className="marketing-section-divider" aria-hidden />

      <FieldRentalBookingFlow sectionId="field-rental-on-hub" />

      <FieldRentalAgreementForm />

      {isPortal ? (
        <p className="text-[12px] text-formula-frost/55">
          <Link href="/parent/dashboard" className="text-formula-volt underline-offset-2 hover:underline">
            Back to home
          </Link>
          {' · '}
          <Link href={MARKETING_HREF.assessment} className="text-formula-volt underline-offset-2 hover:underline">
            What we measure
          </Link>
        </p>
      ) : (
        <p className="text-[12px] text-formula-frost/55">
          Already have a portal account?{' '}
          <Link
            href={`/login?role=parent&next=${encodeURIComponent(MARKETING_HREF.parentBookAssessmentDirectory)}`}
            className="text-formula-volt underline-offset-2 hover:underline"
          >
            Sign in to book here
          </Link>
          {' · '}
          <Link href={MARKETING_HREF.rentals} className="text-formula-volt underline-offset-2 hover:underline">
            Rental policies
          </Link>
          {' · '}
          <Link href={MARKETING_HREF.assessment} className="text-formula-volt underline-offset-2 hover:underline">
            What we measure
          </Link>
        </p>
      )}
    </div>
  )
}
