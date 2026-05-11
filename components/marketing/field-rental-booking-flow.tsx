'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { CheckoutLaunchButton } from '@/components/marketing/checkout-launch-button'
import { FIELD_RENTAL_BOOKING_CHECKOUT, FIELD_RENTAL_PUBLISHED_RATES } from '@/lib/marketing/public-pricing'
import {
  type Classification,
  type RentalType,
  bookingCanProceed,
  classifyRentalBooking,
  insuranceMayBeRequired,
} from '@/lib/rentals/booking-classification'
import {
  FIELD_RENTAL_DEFAULT_DURATION_MINUTES,
  FIELD_RENTAL_DURATION_OPTIONS_MINUTES,
  FIELD_RENTAL_SLOT_STARTS,
  FIELD_RENTAL_WINDOW_CLOSE_MINUTES,
  RENTAL_FIELD_OPTIONS,
} from '@/lib/rentals/field-rental-picker-constants'
import { encodeRentalDatesCompact, weeklyOccurrenceDatesIso } from '@/lib/rentals/rental-weekly-dates'
import {
  encodeRentalWindow,
  humanRentalWindowSummary,
  parseUsTimeToMinutesFromMidnight,
  rentalWindowsOverlap,
} from '@/lib/rentals/rental-time-window'
import { SITE } from '@/lib/site-config'
import { cn } from '@/lib/utils'

const PAYMENT_STEP = 6

const FIELDS = [...RENTAL_FIELD_OPTIONS]

type PackagePresentationId = 'full' | 'half' | 'cage' | 'team_private'

const PACKAGE_CARDS: {
  id: PackagePresentationId
  rentalType: RentalType
  title: string
  bestFor: string
  durationNote: string
  depositLine: string
}[] = [
  {
    id: 'full',
    rentalType: 'club_team_practice',
    title: 'Full Field Rental',
    bestFor: 'Clubs and teams that need a full field for structured training or match prep.',
    durationNote: 'Hold length is set in the next step (30 min–4 hr).',
    depositLine: `Booking deposit is $${FIELD_RENTAL_BOOKING_CHECKOUT.priceUsd}.`,
  },
  {
    id: 'half',
    rentalType: 'general_pickup',
    title: 'Half Field Rental',
    bestFor: 'Smaller-sided play, scrimmages, and informal blocks—up to 15 on the field.',
    durationNote: 'Pick your window; staff may assign a half-field segment at check-in.',
    depositLine: `Booking deposit is $${FIELD_RENTAL_BOOKING_CHECKOUT.priceUsd}.`,
  },
  {
    id: 'cage',
    rentalType: 'private_semi_private',
    title: 'Cage Rental',
    bestFor: 'Technical work, finishing, and small-group reps where a compact space fits best.',
    durationNote: 'Choose field and start time below; cage-style use maps to private / small-group rules.',
    depositLine: `Tier 1 (1–4) or group clinic tier (5+) with a $${FIELD_RENTAL_BOOKING_CHECKOUT.priceUsd} booking deposit.`,
  },
  {
    id: 'team_private',
    rentalType: 'private_semi_private',
    title: 'Team / Private Event',
    bestFor: 'Private training, semi-private sessions, or larger clinic-style groups on one field (up to 20).',
    durationNote: 'Headcount in a later step sets Tier 1 vs group / clinic classification.',
    depositLine: `Certificate of insurance may be required for some classifications; deposit holds the calendar.`,
  },
]

const PROCESS_STRIP_STEPS = [
  { phase: 1 as const, title: 'Pick your package', copy: 'How you use the field sets capacity rules.' },
  { phase: 2 as const, title: 'Choose your slot', copy: 'Date, field, window, and recurring weeks.' },
  { phase: 3 as const, title: 'Sign + submit', copy: 'Classification, rules, deposit, then participant waiver.' },
] as const

function classificationSummary(c: Classification): string {
  switch (c.status) {
    case 'blocked':
      return c.reason
    case 'private_tier1':
      return `Your session is classified as ${c.label}.`
    case 'group_training_ok':
      return `Group Training / Clinic Use (${c.participantCount} participants). Same field rules apply; the calendar blocks double bookings automatically.`
    case 'club_ok':
      return `Club / Team Practice  -  ${c.participantCount} of ${c.maxParticipants} participants allowed per field.`
    case 'general_ok':
      return `General Use / Pick-Up  -  ${c.participantCount} of ${c.maxParticipants} participants allowed per field.`
    default:
      return ''
  }
}

type FieldRentalBookingFlowProps = {
  /** Anchor id for deep links from the unified booking hub. */
  sectionId?: string
}

async function releasePendingHold(rentalRef: string) {
  try {
    await fetch('/api/rental-slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'release_pending', rentalRef }),
    })
  } catch {
    /* non-blocking */
  }
}

export function FieldRentalBookingFlow({ sectionId = 'rental-booking' }: FieldRentalBookingFlowProps) {
  const [step, setStep] = useState(1)
  const [rentalType, setRentalType] = useState<RentalType | ''>('')
  const [packageId, setPackageId] = useState<PackagePresentationId | ''>('')
  const [sessionDate, setSessionDate] = useState('')
  const [slotStart, setSlotStart] = useState('')
  /** Default field rental block: 2 hr - separate product from hosted party deposits. */
  const [durationMinutes, setDurationMinutes] = useState(FIELD_RENTAL_DEFAULT_DURATION_MINUTES)
  const [fieldId, setFieldId] = useState('')
  const [participantCount, setParticipantCount] = useState<string>('')
  const [renterName, setRenterName] = useState('')
  const [renterEmail, setRenterEmail] = useState('')
  const [rulesOk, setRulesOk] = useState(false)
  const [agreementOk, setAgreementOk] = useState(false)
  const [confirmedRef, setConfirmedRef] = useState<string | null>(null)
  const [bookedSlots, setBookedSlots] = useState<{ fieldId: string; timeSlot: string }[]>([])
  /** Digits only while typing; empty allowed so e.g. clearing "1" to type "6" is natural. Normalized on blur. */
  const [weekHorizonRaw, setWeekHorizonRaw] = useState('12')
  const [selectedSessionDates, setSelectedSessionDates] = useState<string[]>([])
  const [slotTakenByDate, setSlotTakenByDate] = useState<Record<string, boolean>>({})
  const [recurringChecking, setRecurringChecking] = useState(false)

  const countNum = useMemo(() => {
    const n = parseInt(participantCount, 10)
    return Number.isFinite(n) ? n : NaN
  }, [participantCount])

  const classification = useMemo(() => {
    if (!rentalType || !Number.isFinite(countNum)) {
      return null
    }
    return classifyRentalBooking(rentalType, countNum)
  }, [rentalType, countNum])

  const needsInsurance = useMemo(() => {
    if (!rentalType || !classification) return false
    return insuranceMayBeRequired(rentalType, classification)
  }, [rentalType, classification])

  const canProceedBooking = classification ? bookingCanProceed(classification) : false
  const step3Valid =
    rentalType !== '' && Number.isFinite(countNum) && countNum >= 1 && canProceedBooking && classification !== null

  const rentalWindow = useMemo(() => {
    if (!slotStart) return ''
    return encodeRentalWindow(slotStart, durationMinutes)
  }, [slotStart, durationMinutes])

  const allowedDurations: number[] = useMemo(() => {
    if (!slotStart) return [...FIELD_RENTAL_DURATION_OPTIONS_MINUTES]
    const startM = parseUsTimeToMinutesFromMidnight(slotStart)
    if (startM == null) return [...FIELD_RENTAL_DURATION_OPTIONS_MINUTES]
    return FIELD_RENTAL_DURATION_OPTIONS_MINUTES.filter(d => startM + d <= FIELD_RENTAL_WINDOW_CLOSE_MINUTES)
  }, [slotStart])

  const isWindowUnavailable = useCallback(
    (field: string, windowKey: string) => {
      if (!windowKey) return false
      return bookedSlots.some(b => b.fieldId === field && rentalWindowsOverlap(windowKey, b.timeSlot))
    },
    [bookedSlots]
  )

  const parsedWeekHorizon = useMemo(() => {
    const t = weekHorizonRaw.trim()
    if (t === '') return 0
    const n = parseInt(t, 10)
    if (!Number.isFinite(n)) return 0
    return Math.min(52, Math.max(1, Math.floor(n)))
  }, [weekHorizonRaw])

  const candidateDates = useMemo(() => {
    if (!sessionDate || !/^\d{4}-\d{2}-\d{2}$/.test(sessionDate)) return []
    return weeklyOccurrenceDatesIso(sessionDate, parsedWeekHorizon)
  }, [sessionDate, parsedWeekHorizon])

  useEffect(() => {
    if (!fieldId || !rentalWindow || candidateDates.length === 0) {
      setSlotTakenByDate({})
      setRecurringChecking(false)
      return
    }
    let cancelled = false
    setRecurringChecking(true)
    void Promise.all(
      candidateDates.map(d =>
        fetch(`/api/rental-slots?date=${encodeURIComponent(d)}`)
          .then(r => r.json())
          .then((data: { booked?: { fieldId: string; timeSlot: string }[] }) => data.booked ?? [])
      )
    )
      .then(bookLists => {
        if (cancelled) return
        const taken: Record<string, boolean> = {}
        candidateDates.forEach((d, i) => {
          const booked = bookLists[i] ?? []
          taken[d] = booked.some(b => b.fieldId === fieldId && rentalWindowsOverlap(rentalWindow, b.timeSlot))
        })
        setSlotTakenByDate(taken)
      })
      .catch(() => {
        if (!cancelled) setSlotTakenByDate({})
      })
      .finally(() => {
        if (!cancelled) setRecurringChecking(false)
      })
    return () => {
      cancelled = true
    }
  }, [candidateDates, fieldId, rentalWindow])

  useEffect(() => {
    if (candidateDates.length === 0) {
      setSelectedSessionDates([])
      return
    }
    setSelectedSessionDates(prev => {
      const eligible = candidateDates.filter(d => slotTakenByDate[d] !== true)
      const kept = prev.filter(d => eligible.includes(d))
      if (kept.length === 0) return [...eligible].sort()
      return [...kept].sort()
    })
  }, [candidateDates, slotTakenByDate])

  const recurringConflict = useMemo(
    () => selectedSessionDates.some(d => slotTakenByDate[d] === true),
    [selectedSessionDates, slotTakenByDate]
  )

  const sessionCount = selectedSessionDates.length

  function toggleSessionDate(iso: string) {
    if (slotTakenByDate[iso] === true) return
    setSelectedSessionDates(prev => {
      if (prev.includes(iso)) return prev.filter(d => d !== iso).sort()
      return [...prev, iso].sort()
    })
  }

  function formatSessionDateLabel(iso: string): string {
    const d = new Date(`${iso}T12:00:00`)
    return d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
  }

  useEffect(() => {
    if (!sessionDate) {
      setBookedSlots([])
      return
    }
    let cancelled = false
    void fetch(`/api/rental-slots?date=${encodeURIComponent(sessionDate)}`)
      .then(r => r.json())
      .then((d: { booked?: { fieldId: string; timeSlot: string }[] }) => {
        if (!cancelled && Array.isArray(d.booked)) {
          setBookedSlots(d.booked)
        }
      })
      .catch(() => {
        if (!cancelled) setBookedSlots([])
      })
    return () => {
      cancelled = true
    }
  }, [sessionDate])

  useEffect(() => {
    if (allowedDurations.length === 0) return
    if (!allowedDurations.includes(durationMinutes)) {
      setDurationMinutes(allowedDurations[0]!)
    }
  }, [allowedDurations, durationMinutes])

  const step2Valid =
    sessionDate !== '' &&
    rentalWindow !== '' &&
    fieldId !== '' &&
    !isWindowUnavailable(fieldId, rentalWindow) &&
    !recurringConflict &&
    !recurringChecking &&
    parsedWeekHorizon >= 1 &&
    sessionCount >= 1 &&
    sessionCount <= 52

  const bookingDepositUsd = FIELD_RENTAL_BOOKING_CHECKOUT.priceUsd

  const goToPaymentStep = () => {
    const ref = `FR-${Date.now().toString(36).toUpperCase()}`
    setConfirmedRef(ref)
    setStep(PAYMENT_STEP)
  }

  const checkoutMetadata = useMemo((): Record<string, string> | null => {
    if (!confirmedRef || !classification || rentalType === '' || !sessionDate || !rentalWindow || !fieldId) return null
    return {
      rental_ref: confirmedRef,
      rental_type: rentalType,
      rental_date: sessionDate.slice(0, 40),
      rental_window: rentalWindow.slice(0, 120),
      rental_field: fieldId.slice(0, 40),
      rental_weeks: String(sessionCount),
      rental_dates_compact: encodeRentalDatesCompact(selectedSessionDates),
      rental_participants: String(countNum),
      renter_name: renterName.trim().slice(0, 80),
      renter_email: renterEmail.trim().slice(0, 80),
    }
  }, [
    confirmedRef,
    classification,
    rentalType,
    sessionDate,
    rentalWindow,
    fieldId,
    sessionCount,
    selectedSessionDates,
    countNum,
    renterName,
    renterEmail,
  ])

  const processPhase = step === 1 ? 1 : step === 2 || step === 3 ? 2 : 3

  const selectedPackageMeta = useMemo(
    () => (packageId ? PACKAGE_CARDS.find(p => p.id === packageId) : undefined),
    [packageId]
  )

  return (
    <section
      id={sectionId}
      className="not-prose my-12 scroll-mt-28 border border-formula-frost/12 bg-formula-base/[0.38] px-4 py-10 sm:px-6 md:my-16 md:px-8 md:py-12"
    >
      <div id="field-rental-packages" className="scroll-mt-28" aria-hidden />
      <nav aria-label="Booking steps" className="border-b border-formula-frost/12 pb-8">
        <ol className="grid gap-3 md:grid-cols-3">
          {PROCESS_STRIP_STEPS.map((s, i) => (
            <li
              key={s.phase}
              className={cn(
                'border px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] transition-colors',
                processPhase === s.phase
                  ? 'border-formula-volt/50 bg-formula-volt/[0.07]'
                  : 'border-formula-frost/14 bg-formula-paper/[0.02]'
              )}
            >
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-formula-volt/90">
                {i + 1}. {s.title}
              </p>
              <p className="mt-2 text-[13px] leading-snug text-formula-frost/80">{s.copy}</p>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-12 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-12 lg:space-y-14">
          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Step 1 · Package</p>
                <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-formula-frost/85">
                  Choose the option that best matches your use. Capacity and deposit logic follow the published field-rental rate (
                  <strong className="text-formula-paper">${FIELD_RENTAL_PUBLISHED_RATES.perHourUsd}/hr</strong> in 30-minute steps).
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {PACKAGE_CARDS.map(card => {
                  const selected = packageId === card.id
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => {
                        setPackageId(card.id)
                        setRentalType(card.rentalType)
                      }}
                      className={cn(
                        'rounded-none border p-5 text-left shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] transition-[border-color,background-color] duration-150',
                        selected
                          ? 'border-formula-volt/55 bg-formula-volt/[0.09]'
                          : 'border-formula-frost/16 bg-formula-paper/[0.02] hover:border-formula-frost/26'
                      )}
                    >
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-paper">{card.title}</span>
                      <span className="mt-3 block text-[13px] leading-relaxed text-formula-frost/82">{card.bestFor}</span>
                      <span className="mt-3 block font-mono text-[10px] uppercase tracking-[0.12em] text-formula-mist">{card.durationNote}</span>
                      <span className="mt-2 block text-[12px] leading-snug text-formula-mist/90">{card.depositLine}</span>
                    </button>
                  )
                })}
              </div>
              <div className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  disabled={!rentalType || !packageId}
                  onClick={() => setStep(2)}
                  className="inline-flex min-h-12 items-center border border-black/25 bg-formula-volt px-7 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-black transition-[filter] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue to schedule
                </button>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-8">
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Step 2 · Schedule</p>
                <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-formula-frost/85">
                  <strong className="text-formula-paper">Field rental checkout only</strong>—not the hosted party deposit. Starts every 30 minutes through the
                  evening; default hold is <strong className="text-formula-paper">2 hours</strong>. Published rate is{' '}
                  <strong className="text-formula-paper">${FIELD_RENTAL_PUBLISHED_RATES.perHourUsd}/hr</strong> and booking deposit is{' '}
                  <strong className="text-formula-paper">${FIELD_RENTAL_BOOKING_CHECKOUT.priceUsd}</strong>. Overlapping windows are blocked automatically.
                </p>
              </div>

              <label className="flex max-w-md flex-col gap-2">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-formula-mist">Anchor date *</span>
                <input
                  type="date"
                  value={sessionDate}
                  onChange={e => setSessionDate(e.target.value)}
                  className="min-h-12 rounded-none border border-formula-frost/16 bg-formula-paper/[0.03] px-3 text-base text-formula-paper outline-none focus:border-formula-volt/45"
                />
              </label>

              <div className="space-y-3">
                <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-formula-mist">Field *</span>
                <div className="grid gap-3 sm:grid-cols-3">
                  {FIELDS.map(f => (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => setFieldId(f.value)}
                      className={cn(
                        'min-h-[4.5rem] rounded-none border px-4 py-3 text-left transition-colors',
                        fieldId === f.value
                          ? 'border-formula-volt/55 bg-formula-volt/[0.08] shadow-[inset_0_0_0_1px_rgba(220,255,0,0.12)]'
                          : 'border-formula-frost/16 bg-formula-paper/[0.02] hover:border-formula-frost/26'
                      )}
                    >
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-paper">{f.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-formula-mist">Available start time *</span>
                  {slotStart && fieldId ? (
                    <span className="font-mono text-[11px] text-formula-frost/70">
                      Window · {humanRentalWindowSummary(rentalWindow) || '—'}
                    </span>
                  ) : null}
                </div>
                <select
                  value={slotStart}
                  onChange={e => setSlotStart(e.target.value)}
                  size={8}
                  className="max-h-72 w-full overflow-y-auto rounded-none border border-formula-frost/14 bg-formula-paper/[0.02] px-3 py-2 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
                >
                  {!fieldId ? (
                    <option value="">Select a field first</option>
                  ) : (
                    <>
                      <option value="">Select a start time</option>
                      {FIELD_RENTAL_SLOT_STARTS.map(s => {
                        const key = encodeRentalWindow(s, durationMinutes)
                        const taken = isWindowUnavailable(fieldId, key)
                        return (
                          <option key={s} value={s} disabled={taken}>
                            {taken ? `${s} — Booked` : s}
                          </option>
                        )
                      })}
                    </>
                  )}
                </select>
                {!fieldId ? <p className="text-[13px] text-formula-mist">Select a field to load availability.</p> : null}
              </div>

              <label className="flex max-w-md flex-col gap-2">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-formula-mist">Duration *</span>
                <select
                  value={String(durationMinutes)}
                  onChange={e => setDurationMinutes(parseInt(e.target.value, 10))}
                  className="min-h-12 rounded-none border border-formula-frost/16 bg-formula-paper/[0.03] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
                  disabled={!slotStart}
                >
                  {!slotStart ? (
                    <option value="">Pick a start time first</option>
                  ) : (
                    allowedDurations.map(m => (
                      <option key={m} value={m}>
                        {m} min
                      </option>
                    ))
                  )}
                </select>
              </label>

              <div className="max-w-xl space-y-4">
                <label className="flex max-w-md flex-col gap-2">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-formula-mist">
                    Weeks on calendar (same weekday)
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    aria-label="Number of consecutive weekly rows to offer, 1 to 52"
                    value={weekHorizonRaw}
                    onChange={e => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 2)
                      setWeekHorizonRaw(digits)
                    }}
                    onBlur={() => {
                      if (weekHorizonRaw.trim() === '') {
                        setWeekHorizonRaw('1')
                        return
                      }
                      const n = parseInt(weekHorizonRaw, 10)
                      if (!Number.isFinite(n) || n < 1) setWeekHorizonRaw('1')
                      else if (n > 52) setWeekHorizonRaw('52')
                    }}
                    className="min-h-12 max-w-[10rem] rounded-none border border-formula-frost/16 bg-formula-paper/[0.03] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
                  />
                  <span className="text-[13px] leading-relaxed text-formula-mist">
                    Enter 1–52. We list that many weekly occurrences from your anchor date; toggle which sessions you are buying.
                  </span>
                </label>
                {candidateDates.length > 0 ? (
                  <fieldset className="space-y-2 rounded-none border border-formula-frost/14 bg-formula-paper/[0.02] p-4">
                    <legend className="px-1 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-formula-mist">
                      Session dates ({sessionCount} selected)
                    </legend>
                    <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
                      {candidateDates.map(iso => {
                        const taken = slotTakenByDate[iso] === true
                        const checked = selectedSessionDates.includes(iso)
                        return (
                          <li key={iso}>
                            <label
                              className={cn(
                                'flex cursor-pointer items-start gap-3 border px-3 py-2.5 text-[14px] transition-colors',
                                taken && 'cursor-not-allowed border-formula-frost/8 bg-formula-base/40 text-formula-mist/70',
                                !taken && checked && 'border-formula-volt/40 bg-formula-volt/[0.06] text-formula-paper',
                                !taken && !checked && 'border-formula-frost/14 bg-formula-paper/[0.02] text-formula-frost/90'
                              )}
                            >
                              <input
                                type="checkbox"
                                className="mt-1 h-4 w-4 accent-formula-volt"
                                checked={checked}
                                disabled={taken}
                                onChange={() => toggleSessionDate(iso)}
                              />
                              <span>
                                {formatSessionDateLabel(iso)}
                                {taken ? <span className="ml-2 font-mono text-[10px] text-amber-200/90">Booked</span> : null}
                              </span>
                            </label>
                          </li>
                        )
                      })}
                    </ul>
                  </fieldset>
                ) : sessionDate && /^\d{4}-\d{2}-\d{2}$/.test(sessionDate) ? (
                  <p className="text-[13px] text-formula-mist">Enter weeks (1–52), or set your anchor date first.</p>
                ) : null}
                <p className="text-[13px] text-formula-mist">
                  Booking deposit due at checkout: <strong className="text-formula-paper">${bookingDepositUsd.toFixed(0)}</strong> (Stripe).
                </p>
              </div>
              {recurringChecking ? (
                <p className="font-mono text-[11px] text-formula-frost/55">Checking each listed week…</p>
              ) : null}
              {recurringConflict ? (
                <p className="text-[14px] leading-relaxed text-amber-200/95">
                  A selected date conflicts with an existing booking for this field and window. Uncheck blocked dates or change anchor, field, or time.
                </p>
              ) : null}
              <div className="flex flex-wrap justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex min-h-11 items-center border border-formula-frost/18 px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-mist transition-colors hover:border-formula-frost/28"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!step2Valid}
                  onClick={() => setStep(3)}
                  className="inline-flex min-h-12 items-center border border-black/25 bg-formula-volt px-7 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-black transition-[filter] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue to participants
                </button>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-6">
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Step 3 · Participants</p>
                <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-formula-frost/85">
                  Headcount drives how your session is classified against the package you chose.
                </p>
              </div>
              <ul className="list-inside list-disc space-y-2 text-[14px] leading-relaxed text-formula-mist">
                <li>Private: 1–4 → Tier 1 (Standard). 5+ → group / clinic tier on the same field (up to 20).</li>
                <li>Club / Team: max 20 per field (booking blocked above).</li>
                <li>General / Pick-Up: max 15 (booking blocked above).</li>
              </ul>
              <label className="flex max-w-xs flex-col gap-2">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-formula-mist">Total participants *</span>
                <input
                  type="number"
                  min={1}
                  value={participantCount}
                  onChange={e => setParticipantCount(e.target.value)}
                  className="min-h-12 rounded-none border border-formula-frost/16 bg-formula-paper/[0.03] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
                />
              </label>
              {classification ? (
                <div
                  className={cn(
                    'rounded-none border p-5 text-[14px] leading-relaxed',
                    classification.status === 'blocked'
                      ? 'border-red-500/35 bg-red-500/10 text-red-100'
                      : 'border-formula-volt/35 bg-formula-volt/[0.08] text-formula-paper'
                  )}
                  role="status"
                >
                  {classificationSummary(classification)}
                </div>
              ) : (
                <p className="text-[14px] text-formula-mist">Enter headcount to validate against your rental type.</p>
              )}
              <div className="flex flex-wrap justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex min-h-11 items-center border border-formula-frost/18 px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-mist"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!step3Valid}
                  onClick={() => setStep(4)}
                  className="inline-flex min-h-12 items-center border border-black/25 bg-formula-volt px-7 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue to classification
                </button>
              </div>
            </div>
          ) : null}

          {step === 4 && classification && rentalType ? (
            <div className="space-y-6">
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Step 4 · Classification & deposit</p>
              </div>
              <div className="rounded-none border border-formula-frost/14 bg-formula-paper/[0.03] p-6">
                <p className="text-[15px] font-medium leading-snug text-formula-paper">{classificationSummary(classification)}</p>
                {classification.status === 'private_tier1' ? (
                  <p className="mt-4 text-[14px] leading-relaxed text-formula-mist">
                    Tier 1 rate applies for published windows. You&apos;ll place a{' '}
                    <strong className="text-formula-paper">${bookingDepositUsd.toFixed(0)}</strong> booking deposit at checkout if the slot is still available.
                  </p>
                ) : null}
                {classification.status === 'group_training_ok' ? (
                  <p className="mt-4 text-[14px] leading-relaxed text-formula-mist">
                    Group / clinic use on one field (up to {classification.maxParticipants} participants). COI may still be required. Deposit{' '}
                    <strong className="text-formula-paper">${bookingDepositUsd.toFixed(0)}</strong> locks the calendar slot at checkout.
                  </p>
                ) : null}
                {needsInsurance ? (
                  <p className="mt-4 border-l-2 border-formula-volt/50 pl-4 text-[14px] leading-relaxed text-formula-mist">
                    <strong className="text-formula-paper">Insurance:</strong> Certificate of Insurance may be required with Formula Soccer Center named as
                    additional insured ($1M+ per occurrence). Upload timing is coordinated after the booking is paid.
                  </p>
                ) : null}
                {(classification.status === 'club_ok' || classification.status === 'general_ok') && (
                  <p className="mt-4 text-[14px] leading-relaxed text-formula-mist">
                    After rules and agreement, you&apos;ll pay a{' '}
                    <strong className="text-formula-paper">${bookingDepositUsd.toFixed(0)}</strong> booking deposit via Stripe. The calendar prevents overlapping
                    bookings on the same field.
                  </p>
                )}
              </div>
              <div className="flex flex-wrap justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex min-h-11 items-center border border-formula-frost/18 px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-mist"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="inline-flex min-h-12 items-center border border-black/25 bg-formula-volt px-7 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-black transition-[filter] hover:brightness-105"
                >
                  Continue to rules
                </button>
              </div>
            </div>
          ) : null}

          {step === 5 ? (
            <div className="space-y-6">
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Step 5 · Rules & renter</p>
                <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-formula-frost/85">
                  Primary renter distributes roster waivers. After payment, automated waiver links can go out when email is connected.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-formula-mist">Renter name *</span>
                  <input
                    value={renterName}
                    onChange={e => setRenterName(e.target.value)}
                    className="min-h-12 rounded-none border border-formula-frost/16 bg-formula-paper/[0.03] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-formula-mist">Renter email *</span>
                  <input
                    type="email"
                    value={renterEmail}
                    onChange={e => setRenterEmail(e.target.value)}
                    className="min-h-12 rounded-none border border-formula-frost/16 bg-formula-paper/[0.03] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
                  />
                </label>
              </div>
              <ul className="space-y-2 rounded-none border border-formula-frost/12 bg-formula-paper/[0.02] p-5 text-[14px] leading-relaxed text-formula-mist">
                <li>{SITE.turfShoesAttendeeRule}</li>
                <li>Water only on the field (no food, gum, or other beverages).</li>
                <li>Access limited to reserved field and time.</li>
                <li>All participants must complete waivers before field access.</li>
                <li>Overstays billed in 30-minute increments; 48-hour cancellation policy applies.</li>
              </ul>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={rulesOk}
                  onChange={e => setRulesOk(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-formula-volt"
                />
                <span className="text-[14px] text-formula-paper">I have reviewed the key rules above.</span>
              </label>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreementOk}
                  onChange={e => setAgreementOk(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-formula-volt"
                />
                <span className="text-[14px] text-formula-paper">I affirm agreement to the full Field Rental Agreement and Facility Use Waiver.</span>
              </label>
              <div className="flex flex-wrap justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="inline-flex min-h-11 items-center border border-formula-frost/18 px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-mist"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!rulesOk || !agreementOk || !renterName.trim() || !renterEmail.trim()}
                  onClick={goToPaymentStep}
                  className="inline-flex min-h-12 items-center border border-black/25 bg-formula-volt px-7 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-black transition-[filter] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {`Continue to payment · $${bookingDepositUsd.toFixed(0)} deposit`}
                </button>
              </div>
            </div>
          ) : null}

          {step === PAYMENT_STEP && confirmedRef && classification && rentalType ? (
            <div className="space-y-6">
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Step 6 · Pay deposit</p>
                <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-formula-mist">
                  Paying creates a short hold on this field and window while Stripe opens. If the slot was taken in the last moment, checkout will ask you to pick
                  a new time.
                </p>
              </div>
              <div className="rounded-none border border-formula-frost/14 bg-formula-paper/[0.03] p-6 text-[14px] leading-relaxed text-formula-mist">
                <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-formula-paper">Reference {confirmedRef}</p>
                <ul className="mt-4 list-inside list-disc space-y-1.5 text-formula-frost/88">
                  <li>Type: {rentalType.replace(/_/g, ' ')}</li>
                  <li>Anchor date (series): {sessionDate}</li>
                  <li>Sessions booked: {sessionCount}</li>
                  <li>Window: {humanRentalWindowSummary(rentalWindow)}</li>
                  <li>Field: {FIELDS.find(f => f.value === fieldId)?.label ?? fieldId}</li>
                  <li>Participants: {countNum}</li>
                  <li>Renter: {renterName.trim()}</li>
                </ul>
                <div className="mt-4 border-t border-formula-frost/10 pt-4">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-formula-mist">Session dates</p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-formula-frost/90">
                    {selectedSessionDates.map(d => (
                      <li key={d}>{formatSessionDateLabel(d)}</li>
                    ))}
                  </ul>
                </div>
                <p className="mt-5 text-formula-paper">
                  Total due now: <strong className="text-[16px]">${bookingDepositUsd.toFixed(0)}</strong> booking deposit
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-formula-mist">{FIELD_RENTAL_BOOKING_CHECKOUT.summary}</p>
              </div>
              {checkoutMetadata ? (
                <CheckoutLaunchButton
                  checkoutType="field-rental-booking"
                  label={`Pay $${bookingDepositUsd.toFixed(0)} with Stripe`}
                  successNext="field-rental"
                  metadata={checkoutMetadata}
                />
              ) : null}
              <button
                type="button"
                onClick={() => {
                  void releasePendingHold(confirmedRef)
                  setStep(5)
                  setConfirmedRef(null)
                }}
                className="inline-flex min-h-11 items-center border border-formula-frost/18 px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-mist"
              >
                Back
              </button>
            </div>
          ) : null}
        </div>

        <aside className="min-w-0 border border-formula-frost/14 bg-[color-mix(in_srgb,var(--color-formula-deep)_88%,transparent)] p-5 shadow-[inset_0_0_0_1px_rgba(220,255,0,0.04)] md:p-6 lg:sticky lg:top-28 xl:top-32">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-volt/90">Booking summary</p>
      <dl className="mt-5 space-y-4 text-sm text-formula-frost/85">
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Package</dt>
          <dd className="mt-1 text-[15px] font-medium leading-snug text-formula-paper">{selectedPackageMeta?.title ?? '—'}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Schedule</dt>
          <dd className="mt-1 leading-relaxed">
            {sessionDate && fieldId && slotStart ? (
              <>
                <span className="block text-formula-paper">{sessionDate}</span>
                <span className="mt-1 block text-formula-frost/80">{humanRentalWindowSummary(rentalWindow) || '—'}</span>
                <span className="mt-1 block font-mono text-[11px] text-formula-mist">{FIELDS.find(f => f.value === fieldId)?.label ?? fieldId}</span>
              </>
            ) : (
              <span className="text-formula-mist">Select a date, field, and start time.</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Sessions · deposit</dt>
          <dd className="mt-1 leading-relaxed">
            <span className="text-formula-paper">{sessionCount} planned session{sessionCount === 1 ? '' : 's'}</span>
            <span className="mt-1 block text-[15px] font-semibold text-formula-paper">${bookingDepositUsd.toFixed(0)} due at checkout</span>
            <span className="mt-2 block text-[13px] leading-relaxed text-formula-mist">
              Remaining balance, if any, is settled per your rental agreement after the deposit—staff may reconcile for packages or special blocks.
            </span>
          </dd>
        </div>
        {step >= 5 ? (
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Primary renter</dt>
            <dd className="mt-1 text-formula-paper">{renterName.trim() || '—'}</dd>
            <dd className="mt-0.5 font-mono text-[11px] text-formula-mist">{renterEmail.trim() || '—'}</dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-8 border-t border-formula-frost/12 pt-6">
        <p className="text-[13px] leading-relaxed text-formula-mist">
          Continue in the main column. This panel stays as a live summary while you move through each step.
        </p>
      </div>
        </aside>
      </div>
    </section>
  )
}
