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
import { FORMULA_SKILLS_CHECK, PARTIES_PRICING_STATUS } from '@/lib/marketing/public-pricing'
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
  /** Shown in hub intro (public page passes from server pricing). */
  skillsCheckPriceUsd?: number
}

type DirectoryTile = { href: string; label: string; description: string }

export function BookAssessmentClient({
  variant = 'public',
  guardianFullName = '',
  guardianEmail = '',
  skillsCheckPriceUsd = 0,
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

  const canPay =
    selected &&
    selected.available > 0 &&
    numKids >= 1 &&
    numKids <= Math.min(ASSESSMENT_MAX_KIDS_PER_BOOKING, selected.available) &&
    billingName.length > 1 &&
    billingEmail.includes('@')

  const bookingDirectoryTiles: DirectoryTile[] = [
    ...(isPortal
      ? [{ href: '#booking-account', label: 'Your account', description: 'Signed-in guardian · receipts' }]
      : [{ href: '#booking-contact', label: 'Guardian contact', description: 'Name & email for receipts' }]),
    { href: '#skills-check', label: 'June pre-book', description: 'Skills Check calendar & pay' },
    { href: '#youth-training-blocks', label: 'Youth training blocks', description: 'Preview published weeks' },
    { href: '#field-rental-on-hub', label: 'Field rental', description: 'Deposit & hold a window' },
    { href: '#birthday-party-booking', label: 'Birthday party', description: 'Party deposit checkout' },
    { href: '#participant-waiver', label: 'Rental waiver', description: 'Sign agreement on file' },
  ]

  return (
    <div className="not-prose space-y-16 md:space-y-20">
      <section
        id={BOOKING_HUB_DIRECTORY_ID}
        aria-label="Reserve by category"
        className="scroll-mt-28 space-y-5"
      >
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
          {bookingDirectoryTiles.map((item) => (
            <li key={item.href} className="min-w-0">
              <a
                href={item.href}
                className={cn(
                  'flex min-h-[7.25rem] w-full flex-col justify-between rounded-xl border-2 border-formula-frost/20 bg-gradient-to-br from-formula-paper/[0.07] to-formula-base/90 px-5 py-5 shadow-[0_12px_40px_rgba(0,0,0,0.28)] transition-[border-color,box-shadow,transform] duration-200 md:min-h-[8.25rem] md:px-6 md:py-6',
                  'hover:-translate-y-0.5 hover:border-formula-volt/55 hover:shadow-[0_16px_48px_rgba(0,0,0,0.38),0_0_0_1px_rgba(220,255,0,0.12)]',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-formula-volt/80'
                )}
              >
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Open</span>
                <span className="mt-3 text-balance font-mono text-lg font-semibold leading-snug tracking-tight text-formula-paper md:text-xl">
                  {item.label}
                </span>
                <span className="mt-2 text-pretty text-sm leading-snug text-formula-frost/80 md:text-[15px]">{item.description}</span>
              </a>
            </li>
          ))}
        </ul>

        <Link
          href={MARKETING_HREF.parties}
          className={cn(
            'group mt-2 flex w-full flex-col gap-1 rounded-xl border-2 border-formula-frost/22 bg-formula-paper/[0.06] px-6 py-6 text-left transition-[border-color,transform] duration-200 md:flex-row md:items-center md:justify-between md:py-7',
            'hover:-translate-y-0.5 hover:border-formula-volt/50 hover:bg-formula-paper/[0.09]',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-formula-volt/80'
          )}
        >
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-formula-mist">Birthday parties</p>
            <p className="mt-2 text-xl font-semibold tracking-tight text-formula-paper md:text-2xl group-hover:text-formula-volt">
              Full party story + policies
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-formula-frost/80 md:text-[15px]">
              Hosted parties, pricing context, and facility rules live on the dedicated parties page — open it before you book the deposit below.
            </p>
          </div>
          <span className="mt-4 inline-flex shrink-0 items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-formula-volt md:mt-0">
            Go to parties page
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </span>
        </Link>
      </section>

      <p className="max-w-3xl border-t border-formula-frost/10 pt-10 text-[15px] leading-relaxed text-formula-frost/85 md:pt-12">
        {isPortal ? (
          <>
            Pre-book a June Skills Check window, preview youth blocks, book field time or a birthday party deposit, and sign the rental waiver when needed.
            Receipts use the email on your portal account.
          </>
        ) : (
          <>
            No portal account required to start. Choose a published Skills Check window (up to four athletes per hour), how many players you are bringing, and
            pay <strong className="font-medium text-formula-paper">${skillsCheckUsd}</strong> per athlete. After payment you can create a parent login and add names so your kids show up in the portal. Youth block preview shows the schedule; final
            enrollment still happens in the portal with an active package.
          </>
        )}
      </p>

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
          <Link href={MARKETING_HREF.events} className="text-formula-volt underline-offset-2 hover:underline">
            Events
          </Link>
          {' · '}
          <Link href={MARKETING_HREF.rentals} className="text-formula-volt underline-offset-2 hover:underline">
            Field rentals
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
