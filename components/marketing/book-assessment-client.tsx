'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AssessmentMonthCalendar } from '@/components/marketing/assessment-month-calendar'
import { CheckoutLaunchButton } from '@/components/marketing/checkout-launch-button'
import { FieldRentalAgreementForm } from '@/components/marketing/field-rental-agreement-form'
import { FieldRentalBookingFlow } from '@/components/marketing/field-rental-booking-flow'
import { PartyBookingFlow } from '@/components/marketing/party-booking-flow'
import { YouthBlocksWeekPanel } from '@/components/marketing/youth-blocks-week-panel'
import { ASSESSMENT_MAX_KIDS_PER_BOOKING } from '@/lib/assessment/constants'
import { ASSESSMENT_JUNE_PREBOOK_MONTH, ASSESSMENT_JUNE_PREBOOK_YEAR } from '@/lib/assessment/june-2026-slots'
import { BOOKING_HUB_DIRECTORY_ID, MARKETING_HREF } from '@/lib/marketing/nav'
import { PARTIES_PRICING_STATUS } from '@/lib/marketing/public-pricing'
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

  const bookingDirectoryLinks: { href: string; label: string }[] = [
    ...(isPortal
      ? [{ href: '#booking-account', label: 'Account' }]
      : [{ href: '#booking-contact', label: 'Guardian contact' }]),
    { href: '#skills-check', label: 'June pre-book' },
    { href: '#youth-training-blocks', label: 'Youth training blocks' },
    { href: '#field-rental-on-hub', label: 'Field rental' },
    { href: '#birthday-party-booking', label: 'Birthday party' },
    { href: '#participant-waiver', label: 'Rental waiver' },
  ]

  return (
    <div className="not-prose space-y-16 md:space-y-20">
      <p className="max-w-2xl text-[15px] leading-relaxed text-formula-frost/85">
        {isPortal ? (
          <>
            Use the calendar to pre-book a June Skills Check window, preview youth blocks, book field time or a birthday party deposit, and sign the rental
            waiver when needed. Receipts use the email on your portal account.
          </>
        ) : (
          <>
            One hub: June Skills Check pre-book, youth block preview (package required to finalize in portal), field rentals, hosted birthday party deposits, and
            the rental waiver when you need it on file. After checkout you can create a parent login for athlete names.
          </>
        )}
      </p>

      <nav
        id={BOOKING_HUB_DIRECTORY_ID}
        aria-label="Jump to booking type"
        className="scroll-mt-28 sticky top-14 z-40 rounded-sm border border-formula-frost/14 bg-formula-base/90 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-md md:top-16 md:p-6"
      >
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Book by type</p>
        <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-formula-frost/75">
          Jump to a section — each block below lines up with these shortcuts. Stays pinned while you scroll on larger screens.
        </p>
        <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {bookingDirectoryLinks.map((item) => (
            <li key={item.href} className="min-w-0">
              <a
                href={item.href}
                className="flex min-h-[3rem] w-full items-center justify-center text-balance border border-formula-frost/18 bg-formula-deep/55 px-4 py-3 text-center font-mono text-[10px] font-semibold uppercase leading-snug tracking-[0.1em] text-formula-paper transition-colors hover:border-formula-volt/45 hover:text-formula-volt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-formula-volt/70 sm:min-h-[3.25rem] sm:text-[11px] sm:tracking-[0.12em]"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 font-mono text-[10px] leading-relaxed text-formula-frost/55">
          Full party story + policies:{' '}
          <Link href={MARKETING_HREF.parties} className="text-formula-volt underline-offset-2 hover:underline">
            Birthday parties page
          </Link>
          .
        </p>
      </nav>

      {isPortal ? (
        <section
          id="booking-account"
          aria-labelledby="ba-account-heading"
          className="scroll-mt-28 rounded-sm border border-formula-frost/14 bg-formula-paper/[0.04] p-5 md:p-6"
        >
          <h2 id="ba-account-heading" className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">
            Your account
          </h2>
          <p className="mt-2 text-sm font-medium text-formula-paper">{billingName}</p>
          <p className="mt-1 text-[13px] text-formula-frost/75">{billingEmail}</p>
        </section>
      ) : (
        <section id="booking-contact" aria-labelledby="ba-contact-heading" className="scroll-mt-28 space-y-4">
          <h2 id="ba-contact-heading" className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">
            Guardian contact
          </h2>
          <div className="grid max-w-xl gap-5 sm:grid-cols-2">
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

      <div className="marketing-section-divider" aria-hidden />

      <section
        id="birthday-party-booking"
        className="scroll-mt-28 space-y-5 rounded-sm border border-formula-frost/14 bg-formula-paper/[0.03] p-5 md:p-7"
        aria-labelledby="ba-party-heading"
      >
        <div className="space-y-2">
          <h2 id="ba-party-heading" className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">
            Birthday party — deposit
          </h2>
          <p className="max-w-2xl text-[13px] leading-relaxed text-formula-frost/75">
            Hosted parties use the same ops discipline as training. <strong className="font-medium text-formula-paper">{PARTIES_PRICING_STATUS}</strong> Secure
            your date with the deposit below; field window details help match turf or indoor inventory.
          </p>
          <p className="text-[12px] text-formula-frost/60">
            Prefer the full marketing page?{' '}
            <Link href={MARKETING_HREF.parties} className="text-formula-volt underline-offset-2 hover:underline">
              Birthday parties
            </Link>
          </p>
        </div>
        <div className="not-prose mt-2 border-t border-formula-frost/10 pt-6">
          <PartyBookingFlow />
        </div>
      </section>

      <div className="marketing-section-divider" aria-hidden />

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
