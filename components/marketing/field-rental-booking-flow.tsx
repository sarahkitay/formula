'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CheckoutLaunchButton } from '@/components/marketing/checkout-launch-button'
import { FieldRentalWaiverLegalDocument } from '@/components/marketing/field-rental-waiver-legal-document'
import { InlineSignaturePad } from '@/components/marketing/inline-signature-pad'
import { FIELD_RENTAL_BOOKING_CHECKOUT, FIELD_RENTAL_PUBLISHED_RATES, fieldRentalSessionPaymentUsd } from '@/lib/marketing/public-pricing'
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

const FIELDS = [...RENTAL_FIELD_OPTIONS]

type PackagePresentationId = 'full' | 'half' | 'cage' | 'team_private'

const PACKAGE_CARDS: {
  id: PackagePresentationId
  rentalType: RentalType
  title: string
  bestFor: string
  durationNote: string
  paymentLine: string
}[] = [
  {
    id: 'full',
    rentalType: 'club_team_practice',
    title: 'Full Field Rental',
    bestFor: 'Clubs and teams that need a full field for structured training or match prep.',
    durationNote: 'Hold length is set below (30 min–4 hr).',
    paymentLine: `Payment is at $${FIELD_RENTAL_PUBLISHED_RATES.perHourUsd}/hr in 30-minute steps; your total is window length times every session date you confirm.`,
  },
  {
    id: 'half',
    rentalType: 'general_pickup',
    title: 'Half Field Rental',
    bestFor: 'Smaller-sided play, scrimmages, and informal blocks, up to 15 on the field.',
    durationNote: 'Pick your window; staff may assign a half-field segment at check-in.',
    paymentLine: `Same published $${FIELD_RENTAL_PUBLISHED_RATES.perHourUsd}/hr rate; checkout collects payment for the time and sessions you book.`,
  },
  {
    id: 'cage',
    rentalType: 'private_semi_private',
    title: 'Cage Rental',
    bestFor: 'Technical work, finishing, and small-group reps where a compact space fits best.',
    durationNote: 'Choose field and start time below; cage-style use maps to private / small-group rules.',
    paymentLine: `Tier 1 (1-4) or group clinic tier (5+). Checkout uses $${FIELD_RENTAL_PUBLISHED_RATES.perHourUsd}/hr for the minutes you reserve across each session.`,
  },
  {
    id: 'team_private',
    rentalType: 'private_semi_private',
    title: 'Team / Private Event',
    bestFor: 'Private training, semi-private sessions, or larger clinic-style groups on one field (up to 20).',
    durationNote: 'Headcount below sets Tier 1 vs group / clinic classification.',
    paymentLine: `Certificate of insurance may be required for some classifications. Calendar holds clear once payment completes.`,
  },
]

function namesMatchForSignature(legalName: string, typed: string): boolean {
  const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ')
  const a = norm(legalName)
  const b = norm(typed)
  return a.length >= 2 && b.length >= 2 && a === b
}

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
  const [rentalType, setRentalType] = useState<RentalType | ''>('')
  const [packageId, setPackageId] = useState<PackagePresentationId | ''>('')
  const [sessionDate, setSessionDate] = useState('')
  const [slotStart, setSlotStart] = useState('')
  /** Default field rental block: 2 hr - separate checkout from hosted parties ($1k) and events. */
  const [durationMinutes, setDurationMinutes] = useState(FIELD_RENTAL_DEFAULT_DURATION_MINUTES)
  const [fieldId, setFieldId] = useState('')
  const [participantCount, setParticipantCount] = useState<string>('')
  const [renterName, setRenterName] = useState('')
  const [renterEmail, setRenterEmail] = useState('')
  const [typedSignature, setTypedSignature] = useState('')
  const [signatureDataUrl, setSignatureDataUrl] = useState('')
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

  const bookingPaymentUsd = fieldRentalSessionPaymentUsd(durationMinutes) * sessionCount

  const bookingLockKey = useMemo(
    () =>
      [sessionDate, rentalWindow, fieldId, [...selectedSessionDates].sort().join(','), rentalType, String(countNum)].join('|'),
    [sessionDate, rentalWindow, fieldId, selectedSessionDates, rentalType, countNum]
  )

  const mintedHoldForKeyRef = useRef<string | null>(null)

  const renterEmailValid = useMemo(() => {
    const e = renterEmail.trim().toLowerCase()
    return e.length > 3 && e.includes('@') && e.includes('.')
  }, [renterEmail])

  const signatureDrawn = signatureDataUrl.length > 400
  const typedNameMatches = namesMatchForSignature(renterName, typedSignature)

  const paymentReady =
    step2Valid &&
    step3Valid &&
    rulesOk &&
    agreementOk &&
    renterName.trim().length >= 2 &&
    renterEmailValid &&
    typedNameMatches &&
    signatureDrawn

  useEffect(() => {
    if (!paymentReady) {
      mintedHoldForKeyRef.current = null
      setConfirmedRef(prev => {
        if (prev) void releasePendingHold(prev)
        return null
      })
      return
    }

    setConfirmedRef(prev => {
      if (mintedHoldForKeyRef.current === bookingLockKey && prev) {
        return prev
      }
      if (prev) void releasePendingHold(prev)
      const next = `FR-${Date.now().toString(36).toUpperCase()}`
      mintedHoldForKeyRef.current = bookingLockKey
      return next
    })
  }, [paymentReady, bookingLockKey])

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
      electronic_sign_name: typedSignature.trim().slice(0, 80),
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
    typedSignature,
  ])

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
      <header className="border-b border-formula-frost/12 pb-8">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-volt/90">Field rental checkout</p>
        <h2 className="mt-3 text-xl font-semibold leading-tight text-formula-paper md:text-2xl">
          One page: your package &amp; time, who&apos;s coming, waiver &amp; signature, then pay
        </h2>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-formula-frost/85">
          <strong className="text-formula-paper">Field rental only</strong> — not the hosted party or custom event payment. Scroll through once: pick your slot,
          enter the primary renter and headcount, review rules and the agreement text, sign, then open Stripe. A short calendar hold is placed while checkout loads.
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-12 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-14 lg:space-y-16">
          <div className="space-y-6">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Package</p>
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-formula-frost/85">
                Choose the option that best matches your use. Capacity and payment follow the published field-rental rate (
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
                    <span className="mt-2 block text-[12px] leading-snug text-formula-mist/90">{card.paymentLine}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-8 border-t border-formula-frost/10 pt-12">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Time &amp; field</p>
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-formula-frost/85">
                Starts every 30 minutes through the evening; default hold is <strong className="text-formula-paper">2 hours</strong>. Published rate is{' '}
                <strong className="text-formula-paper">${FIELD_RENTAL_PUBLISHED_RATES.perHourUsd}/hr</strong> in 30-minute steps; your total is that rate times
                window length times each session you select. Overlapping windows are blocked automatically.
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
                    Window · {humanRentalWindowSummary(rentalWindow) || '-'}
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
                    {FIELD_RENTAL_SLOT_STARTS.map(st => {
                      const key = encodeRentalWindow(st, durationMinutes)
                      const taken = isWindowUnavailable(fieldId, key)
                      return (
                        <option key={st} value={st} disabled={taken}>
                          {taken ? `${st} (booked)` : st}
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
                <p className="text-[13px] text-formula-mist">Enter weeks (1-52), or set your anchor date first.</p>
              ) : null}
              <p className="text-[13px] text-formula-mist">
                Payment due at checkout: <strong className="text-formula-paper">${bookingPaymentUsd.toFixed(0)}</strong> (Stripe).
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
          </div>

          <div className="space-y-6 border-t border-formula-frost/10 pt-12">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Primary renter &amp; group size</p>
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-formula-frost/85">
                Who pays and how many people are on the field. Headcount must fit the package you chose.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-formula-mist">Your name *</span>
                <input
                  value={renterName}
                  onChange={e => setRenterName(e.target.value)}
                  autoComplete="name"
                  className="min-h-12 rounded-none border border-formula-frost/16 bg-formula-paper/[0.03] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-formula-mist">Email *</span>
                <input
                  type="email"
                  value={renterEmail}
                  onChange={e => setRenterEmail(e.target.value)}
                  autoComplete="email"
                  className="min-h-12 rounded-none border border-formula-frost/16 bg-formula-paper/[0.03] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
                />
              </label>
            </div>
            <label className="flex max-w-xs flex-col gap-2">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-formula-mist">How many people on the field *</span>
              <input
                type="number"
                min={1}
                value={participantCount}
                onChange={e => setParticipantCount(e.target.value)}
                className="min-h-12 rounded-none border border-formula-frost/16 bg-formula-paper/[0.03] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
              />
            </label>
            <ul className="list-inside list-disc space-y-2 text-[14px] leading-relaxed text-formula-mist">
              <li>Private: 1–4 → Tier 1. 5+ → group / clinic tier (up to 20).</li>
              <li>Club / Team: max 20 per field (booking blocked above).</li>
              <li>General / Pick-Up: max 15 (booking blocked above).</li>
            </ul>
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
                <p className="text-[15px] font-medium leading-snug">{classificationSummary(classification)}</p>
                {classification.status === 'private_tier1' ? (
                  <p className="mt-4 text-[14px] leading-relaxed text-formula-mist">
                    Tier 1 rate applies for published windows. Checkout collects{' '}
                    <strong className="text-formula-paper">${bookingPaymentUsd.toFixed(0)}</strong> if the slot is still available.
                  </p>
                ) : null}
                {classification.status === 'group_training_ok' ? (
                  <p className="mt-4 text-[14px] leading-relaxed text-formula-mist">
                    Group / clinic use on one field (up to {classification.maxParticipants} participants). COI may still be required. Payment of{' '}
                    <strong className="text-formula-paper">${bookingPaymentUsd.toFixed(0)}</strong> locks the calendar at checkout.
                  </p>
                ) : null}
                {(classification.status === 'club_ok' || classification.status === 'general_ok') && (
                  <p className="mt-4 text-[14px] leading-relaxed text-formula-mist">
                    You&apos;ll pay <strong className="text-formula-paper">${bookingPaymentUsd.toFixed(0)}</strong> via Stripe below. The calendar prevents overlapping
                    bookings on the same field.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-[14px] text-formula-mist">Choose a package and enter headcount to validate your session.</p>
            )}
            {needsInsurance && classification && classification.status !== 'blocked' ? (
              <p className="border-l-2 border-formula-volt/50 pl-4 text-[14px] leading-relaxed text-formula-mist">
                <strong className="text-formula-paper">Insurance:</strong> Certificate of Insurance may be required with Formula Soccer Center named as additional
                insured ($1M+ per occurrence). Upload timing is coordinated after the booking is paid.
              </p>
            ) : null}
          </div>

          <div className="space-y-6 border-t border-formula-frost/10 pt-12">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Rules &amp; waiver</p>
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-formula-frost/85">
                Primary renter distributes roster waivers to participants after you pay. Confirm you&apos;ve read the key rules and the full agreement language.
              </p>
            </div>
            <ul className="space-y-2 rounded-none border border-formula-frost/12 bg-formula-paper/[0.02] p-5 text-[14px] leading-relaxed text-formula-mist">
              <li>{SITE.turfShoesAttendeeRule}</li>
              <li>Water only on the field (no food, gum, or other beverages).</li>
              <li>Access limited to reserved field and time.</li>
              <li>All participants must complete waivers before field access.</li>
              <li>Overstays billed in 30-minute increments; 48-hour cancellation policy applies.</li>
            </ul>
            <details className="rounded-none border border-formula-frost/14 bg-formula-paper/[0.02] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
              <summary className="cursor-pointer list-none px-5 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-formula-paper marker:content-none [&::-webkit-details-marker]:hidden">
                View full field rental agreement &amp; waiver text
              </summary>
              <div className="border-t border-formula-frost/10 px-5 py-6 md:px-6">
                <FieldRentalWaiverLegalDocument introVariant="standard" />
              </div>
            </details>
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
              <span className="text-[14px] text-formula-paper">I agree to the Field Rental Agreement and Facility Use Waiver (including the full text above).</span>
            </label>
          </div>

          <div className="space-y-5 border-t border-formula-frost/10 pt-12">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Electronic signature</p>
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-formula-frost/85">
                Draw your signature, then type your <strong className="text-formula-paper">full legal name</strong> exactly as entered for &quot;Your name&quot; so we can
                match your e-sign to the renter of record.
              </p>
            </div>
            <div>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-formula-mist">Draw signature *</span>
              <InlineSignaturePad className="mt-2" onChange={setSignatureDataUrl} />
            </div>
            <label className="flex max-w-xl flex-col gap-2">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-formula-mist">
                Type full legal name (must match &quot;Your name&quot;) *
              </span>
              <input
                value={typedSignature}
                onChange={e => setTypedSignature(e.target.value)}
                autoComplete="off"
                className="min-h-12 rounded-none border border-formula-frost/16 bg-formula-paper/[0.03] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
                placeholder="Same spelling as Your name"
              />
            </label>
            {renterName.trim() && typedSignature.trim() && !typedNameMatches ? (
              <p className="text-[13px] text-amber-200/95">Typed name must match your name field (spacing and capitalization can differ slightly).</p>
            ) : null}
            {!signatureDrawn ? <p className="text-[13px] text-formula-mist">Sign in the box above to enable payment.</p> : null}
          </div>

          <div className="space-y-6 border-t border-formula-frost/10 pt-12">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Checkout</p>
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-formula-mist">
                When everything above is valid, we place a short hold and open Stripe. If the slot was taken at the last moment, you&apos;ll pick a new time from
                support.
              </p>
            </div>
            {confirmedRef && classification && rentalType && checkoutMetadata ? (
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
                  Total due now: <strong className="text-[16px]">${bookingPaymentUsd.toFixed(0)}</strong> field rental payment
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-formula-mist">{FIELD_RENTAL_BOOKING_CHECKOUT.summary}</p>
              </div>
            ) : (
              <p className="text-[14px] text-formula-mist">
                Complete package, schedule, renter details, rules, and signature to unlock payment.
              </p>
            )}
            {checkoutMetadata ? (
              <CheckoutLaunchButton
                checkoutType="field-rental-booking"
                label={`Pay $${bookingPaymentUsd.toFixed(0)} with Stripe`}
                successNext="field-rental"
                metadata={checkoutMetadata}
                disabled={!paymentReady}
              />
            ) : null}
          </div>
        </div>

        <aside className="min-w-0 border border-formula-frost/14 bg-[color-mix(in_srgb,var(--color-formula-deep)_88%,transparent)] p-5 shadow-[inset_0_0_0_1px_rgba(220,255,0,0.04)] md:p-6 lg:sticky lg:top-28 xl:top-32">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-formula-volt/90">Booking summary</p>
      <dl className="mt-5 space-y-4 text-sm text-formula-frost/85">
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Package</dt>
          <dd className="mt-1 text-[15px] font-medium leading-snug text-formula-paper">{selectedPackageMeta?.title ?? '-'}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Schedule</dt>
          <dd className="mt-1 leading-relaxed">
            {sessionDate && fieldId && slotStart ? (
              <>
                <span className="block text-formula-paper">{sessionDate}</span>
                <span className="mt-1 block text-formula-frost/80">{humanRentalWindowSummary(rentalWindow) || '-'}</span>
                <span className="mt-1 block font-mono text-[11px] text-formula-mist">{FIELDS.find(f => f.value === fieldId)?.label ?? fieldId}</span>
              </>
            ) : (
              <span className="text-formula-mist">Select a date, field, and start time.</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Sessions · payment</dt>
          <dd className="mt-1 leading-relaxed">
            <span className="text-formula-paper">{sessionCount} planned session{sessionCount === 1 ? '' : 's'}</span>
            <span className="mt-1 block text-[15px] font-semibold text-formula-paper">${bookingPaymentUsd.toFixed(0)} due at checkout</span>
            <span className="mt-2 block text-[13px] leading-relaxed text-formula-mist">
              Remaining balance, if any, is settled per your rental agreement after this payment. Staff may reconcile for packages or special blocks.
            </span>
          </dd>
        </div>
        {(renterName.trim() || renterEmail.trim()) ? (
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Primary renter</dt>
            <dd className="mt-1 text-formula-paper">{renterName.trim() || '-'}</dd>
            <dd className="mt-0.5 font-mono text-[11px] text-formula-mist">{renterEmail.trim() || '-'}</dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-8 border-t border-formula-frost/12 pt-6">
        <p className="text-[13px] leading-relaxed text-formula-mist">
          This panel updates as you fill out the form. Payment unlocks when package, schedule, renter, rules, and signature are complete.
        </p>
      </div>
        </aside>
      </div>
    </section>
  )
}
