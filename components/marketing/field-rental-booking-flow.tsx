'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { CheckoutLaunchButton } from '@/components/marketing/checkout-launch-button'
import { FIELD_RENTAL_BOOKING_CHECKOUT } from '@/lib/marketing/public-pricing'
import {
  type Classification,
  type RentalType,
  bookingCanProceed,
  classifyRentalBooking,
  insuranceMayBeRequired,
} from '@/lib/rentals/booking-classification'

const PAYMENT_STEP = 6
const STEP_LABELS = ['Type', 'Slot', 'Headcount', 'Tier', 'Rules', 'Pay'] as const

const TIME_SLOTS = [
  '6:00 AM - 7:00 AM',
  '7:15 AM - 8:15 AM',
  '8:30 AM - 9:30 AM',
  '9:45 AM - 10:45 AM',
  '11:00 AM - 12:00 PM',
  '12:15 PM - 1:15 PM',
  '1:30 PM - 2:30 PM',
  '2:45 PM - 3:45 PM',
  '4:00 PM - 5:00 PM',
  '5:15 PM - 6:15 PM',
  '6:30 PM - 7:30 PM',
  '7:45 PM - 8:45 PM',
]

const FIELDS = [
  { value: 'field_a', label: 'Field A (turf)' },
  { value: 'field_b', label: 'Field B (turf)' },
  { value: 'field_indoor', label: 'Indoor / small-sided' },
]

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
  const [sessionDate, setSessionDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [fieldId, setFieldId] = useState('')
  const [participantCount, setParticipantCount] = useState<string>('')
  const [renterName, setRenterName] = useState('')
  const [renterEmail, setRenterEmail] = useState('')
  const [rulesOk, setRulesOk] = useState(false)
  const [agreementOk, setAgreementOk] = useState(false)
  const [confirmedRef, setConfirmedRef] = useState<string | null>(null)
  const [bookedSlots, setBookedSlots] = useState<{ fieldId: string; timeSlot: string }[]>([])

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

  const isSlotBooked = useCallback(
    (field: string, slot: string) => bookedSlots.some(b => b.fieldId === field && b.timeSlot === slot),
    [bookedSlots]
  )

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
    if (fieldId && timeSlot && isSlotBooked(fieldId, timeSlot)) {
      setTimeSlot('')
    }
  }, [fieldId, timeSlot, isSlotBooked])

  const step2Valid = sessionDate !== '' && timeSlot !== '' && fieldId !== '' && !isSlotBooked(fieldId, timeSlot)

  const goToPaymentStep = () => {
    const ref = `FR-${Date.now().toString(36).toUpperCase()}`
    setConfirmedRef(ref)
    setStep(PAYMENT_STEP)
  }

  return (
    <section id={sectionId} className="not-prose my-14 border border-formula-frost/12 bg-formula-base/70 p-5 md:p-8">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Booking flow</p>
      <h3 className="mt-4 font-mono text-xl font-semibold tracking-tight text-formula-paper md:text-2xl">
        Classify, pick a free slot, then pay the deposit
      </h3>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-formula-mist">
        Each field and time window can only hold one booking at a time. Taken windows are marked automatically. When you pay, your slot is locked in after
        Stripe confirms payment (no separate staff approval step).
      </p>

      <ol className="mt-8 flex flex-wrap gap-2 border border-formula-frost/10 bg-formula-paper/[0.02] p-3 font-mono text-[9px] uppercase tracking-[0.14em] text-formula-mist">
        {STEP_LABELS.map((label, i) => (
          <li
            key={label}
            className={`rounded-sm px-2 py-1 ${step === i + 1 ? 'bg-formula-volt/20 text-formula-paper' : ''}`}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      {step === 1 ? (
        <div className="mt-8 space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Step 1  -  Rental type</p>
          <p className="text-sm text-formula-mist">Selection sets rules, capacity limits, and pricing logic.</p>
          <div className="grid gap-3 md:grid-cols-3">
            {(
              [
                { value: 'club_team_practice' as const, title: 'Club / Team Practice', hint: 'Max 20 per field' },
                {
                  value: 'private_semi_private' as const,
                  title: 'Private / Semi-Private',
                  hint: '1–4 Tier 1; 5+ group / clinic (same field)',
                },
                { value: 'general_pickup' as const, title: 'General Use / Pick-Up', hint: 'Max 15; no organized coaching' },
              ] as const
            ).map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRentalType(opt.value)}
                className={`border p-4 text-left transition-colors ${
                  rentalType === opt.value
                    ? 'border-formula-volt/50 bg-formula-volt/10'
                    : 'border-formula-frost/14 bg-formula-paper/[0.02] hover:border-formula-frost/24'
                }`}
              >
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-formula-paper">{opt.title}</span>
                <span className="mt-2 block text-xs text-formula-mist">{opt.hint}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              disabled={!rentalType}
              onClick={() => setStep(2)}
              className="inline-flex h-11 items-center border border-formula-volt/40 bg-formula-volt px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-black disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="mt-8 space-y-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Step 2  -  Date, time, and field</p>
          <p className="text-sm text-formula-mist">
            Fixed session windows. Booked combinations for your date are disabled. All sessions end on time. Overstay is billed in 30-minute increments.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Date *</span>
              <input
                type="date"
                value={sessionDate}
                onChange={e => setSessionDate(e.target.value)}
                className="h-11 border border-formula-frost/16 bg-formula-paper/[0.03] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Field *</span>
              <select
                value={fieldId}
                onChange={e => setFieldId(e.target.value)}
                className="h-11 border border-formula-frost/16 bg-formula-paper/[0.03] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
              >
                <option value="">Select field</option>
                {FIELDS.map(f => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Window *</span>
              <select
                value={timeSlot}
                onChange={e => setTimeSlot(e.target.value)}
                className="h-11 border border-formula-frost/16 bg-formula-paper/[0.03] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
                disabled={!fieldId}
              >
                <option value="">{fieldId ? 'Select window' : 'Choose a field first'}</option>
                {TIME_SLOTS.map(t => {
                  const taken = fieldId ? isSlotBooked(fieldId, t) : false
                  return (
                    <option key={t} value={t} disabled={taken}>
                      {t}
                      {taken ? ' (booked)' : ''}
                    </option>
                  )
                })}
              </select>
            </label>
          </div>
          <div className="flex flex-wrap justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex h-11 items-center border border-formula-frost/18 px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-mist"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!step2Valid}
              onClick={() => setStep(3)}
              className="inline-flex h-11 items-center border border-formula-volt/40 bg-formula-volt px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-black disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="mt-8 space-y-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Step 3  -  Participant count (control step)</p>
          <ul className="list-inside list-disc text-sm text-formula-mist">
            <li>Private: 1–4 → Tier 1 (Standard). 5+ → group / clinic tier on the same field (up to 20).</li>
            <li>Club / Team: max 20 per field (booking blocked above).</li>
            <li>General / Pick-Up: max 15 (booking blocked above).</li>
          </ul>
          <label className="flex max-w-xs flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Total participants *</span>
            <input
              type="number"
              min={1}
              value={participantCount}
              onChange={e => setParticipantCount(e.target.value)}
              className="h-11 border border-formula-frost/16 bg-formula-paper/[0.03] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
            />
          </label>
          {classification ? (
            <div
              className={`border p-4 text-sm ${
                classification.status === 'blocked'
                  ? 'border-red-500/35 bg-red-500/10 text-red-100'
                  : 'border-formula-volt/35 bg-formula-volt/10 text-formula-paper'
              }`}
              role="status"
            >
              {classificationSummary(classification)}
            </div>
          ) : (
            <p className="text-sm text-formula-mist">Enter headcount to validate against your rental type.</p>
          )}
          <div className="flex flex-wrap justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex h-11 items-center border border-formula-frost/18 px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-mist"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!step3Valid}
              onClick={() => setStep(4)}
              className="inline-flex h-11 items-center border border-formula-volt/40 bg-formula-volt px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-black disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        </div>
      ) : null}

      {step === 4 && classification && rentalType ? (
        <div className="mt-8 space-y-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Step 4  -  Classification and deposit</p>
          <div className="border border-formula-frost/12 bg-formula-paper/[0.03] p-5">
            <p className="text-sm font-medium text-formula-paper">{classificationSummary(classification)}</p>
            {classification.status === 'private_tier1' ? (
              <p className="mt-3 text-sm text-formula-mist">
                Tier 1 rate applies for published windows. You&apos;ll place a <strong className="text-formula-paper">${FIELD_RENTAL_BOOKING_CHECKOUT.priceUsd}</strong>{' '}
                deposit at checkout to lock this slot if it is still available.
              </p>
            ) : null}
            {classification.status === 'group_training_ok' ? (
              <p className="mt-3 text-sm text-formula-mist">
                Group / clinic use on one field (up to {classification.maxParticipants} participants). COI may still be required. Deposit{' '}
                <strong className="text-formula-paper">${FIELD_RENTAL_BOOKING_CHECKOUT.priceUsd}</strong> locks the calendar slot at checkout.
              </p>
            ) : null}
            {needsInsurance ? (
              <p className="mt-3 border-l-2 border-formula-volt/50 pl-3 text-sm text-formula-mist">
                <strong className="text-formula-paper">Insurance:</strong> Certificate of Insurance may be required with Formula Soccer Center named as
                additional insured ($1M+ per occurrence). Upload timing is coordinated after the booking is paid.
              </p>
            ) : null}
            {(classification.status === 'club_ok' || classification.status === 'general_ok') && (
              <p className="mt-3 text-sm text-formula-mist">
                After rules and agreement, you&apos;ll pay a <strong className="text-formula-paper">${FIELD_RENTAL_BOOKING_CHECKOUT.priceUsd}</strong> booking
                deposit via Stripe. The calendar prevents double booking for this field and window.
              </p>
            )}
          </div>
          <div className="flex flex-wrap justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex h-11 items-center border border-formula-frost/18 px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-mist"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(5)}
              className="inline-flex h-11 items-center border border-formula-volt/40 bg-formula-volt px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-black"
            >
              Continue
            </button>
          </div>
        </div>
      ) : null}

      {step === 5 ? (
        <div className="mt-8 space-y-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Step 5  -  Rules and agreement</p>
          <p className="text-sm text-formula-mist">
            Primary renter (distributes waivers). After payment, the system can send a waiver link for all participants when email is connected.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Renter name *</span>
              <input
                value={renterName}
                onChange={e => setRenterName(e.target.value)}
                className="h-11 border border-formula-frost/16 bg-formula-paper/[0.03] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Renter email *</span>
              <input
                type="email"
                value={renterEmail}
                onChange={e => setRenterEmail(e.target.value)}
                className="h-11 border border-formula-frost/16 bg-formula-paper/[0.03] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
              />
            </label>
          </div>
          <ul className="space-y-2 border border-formula-frost/10 bg-formula-paper/[0.02] p-4 text-sm text-formula-mist">
            <li>No cleats on turf.</li>
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
            <span className="text-sm text-formula-paper">I have reviewed the key rules above.</span>
          </label>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={agreementOk}
              onChange={e => setAgreementOk(e.target.checked)}
              className="mt-1 h-4 w-4 accent-formula-volt"
            />
            <span className="text-sm text-formula-paper">I affirm agreement to the full Field Rental Agreement and Facility Use Waiver.</span>
          </label>
          <div className="flex flex-wrap justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="inline-flex h-11 items-center border border-formula-frost/18 px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-mist"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!rulesOk || !agreementOk || !renterName.trim() || !renterEmail.trim()}
              onClick={goToPaymentStep}
              className="inline-flex h-11 items-center border border-formula-volt/40 bg-formula-volt px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-black disabled:opacity-40"
            >
              {`Pay $${FIELD_RENTAL_BOOKING_CHECKOUT.priceUsd} deposit (Stripe)`}
            </button>
          </div>
        </div>
      ) : null}

      {step === PAYMENT_STEP && confirmedRef && classification && rentalType ? (
        <div className="mt-8 space-y-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Step 6  -  Pay booking deposit</p>
          <p className="text-sm text-formula-mist">
            Paying creates a short hold on this field and window while Stripe opens. If the slot was taken by someone else in the last moment, checkout will
            tell you to pick a new time.
          </p>
          <div className="border border-formula-frost/12 bg-formula-paper/[0.03] p-5 text-sm text-formula-mist">
            <p className="font-mono text-xs font-semibold text-formula-paper">Reference {confirmedRef}</p>
            <ul className="mt-3 list-inside list-disc space-y-1">
              <li>Type: {rentalType.replace(/_/g, ' ')}</li>
              <li>Date: {sessionDate}</li>
              <li>Window: {timeSlot}</li>
              <li>Field: {FIELDS.find(f => f.value === fieldId)?.label ?? fieldId}</li>
              <li>Participants: {countNum}</li>
              <li>Renter: {renterName.trim()}</li>
            </ul>
            <p className="mt-4 text-formula-paper">
              Total due now: <strong>${FIELD_RENTAL_BOOKING_CHECKOUT.priceUsd}</strong> ({FIELD_RENTAL_BOOKING_CHECKOUT.productName})
            </p>
            <p className="mt-2 text-xs">{FIELD_RENTAL_BOOKING_CHECKOUT.summary}</p>
          </div>
          <CheckoutLaunchButton
            checkoutType="field-rental-booking"
            label={`Pay $${FIELD_RENTAL_BOOKING_CHECKOUT.priceUsd} with Stripe`}
            successNext="field-rental"
            metadata={{
              rental_ref: confirmedRef,
              rental_type: rentalType,
              rental_date: sessionDate.slice(0, 40),
              rental_window: timeSlot.slice(0, 80),
              rental_field: fieldId.slice(0, 40),
              rental_participants: String(countNum),
              renter_name: renterName.trim().slice(0, 80),
              renter_email: renterEmail.trim().slice(0, 80),
            }}
          />
          <button
            type="button"
            onClick={() => {
              void releasePendingHold(confirmedRef)
              setStep(5)
              setConfirmedRef(null)
            }}
            className="inline-flex h-11 items-center border border-formula-frost/18 px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-mist"
          >
            Back
          </button>
        </div>
      ) : null}
    </section>
  )
}
