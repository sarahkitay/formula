'use client'

import { useMemo, useState } from 'react'
import {
  type Classification,
  type RentalType,
  bookingCanProceed,
  bookingRequiresApproval,
  classifyRentalBooking,
  insuranceMayBeRequired,
} from '@/lib/rentals/booking-classification'

const STEPS = 6

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
    case 'group_training_approval':
      return `This session qualifies as Group Training / Clinic Use (${c.participantCount} participants) and requires approval before it can be confirmed.`
    case 'club_ok':
      return `Club / Team Practice  -  ${c.participantCount} of ${c.maxParticipants} participants allowed per field.`
    case 'general_ok':
      return `General Use / Pick-Up  -  ${c.participantCount} of ${c.maxParticipants} participants allowed per field.`
    default:
      return ''
  }
}

export function FieldRentalBookingFlow() {
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

  const needsApproval = classification ? bookingRequiresApproval(classification) : false
  const canProceedBooking = classification ? bookingCanProceed(classification) : false
  const step3Valid =
    rentalType !== '' &&
    Number.isFinite(countNum) &&
    countNum >= 1 &&
    canProceedBooking &&
    classification !== null

  const step2Valid = sessionDate !== '' && timeSlot !== '' && fieldId !== ''

  const confirmBooking = () => {
    const ref = `FR-${Date.now().toString(36).toUpperCase()}`
    setConfirmedRef(ref)
    setStep(STEPS)
  }

  const resetBooking = () => {
    setStep(1)
    setRentalType('')
    setSessionDate('')
    setTimeSlot('')
    setFieldId('')
    setParticipantCount('')
    setRenterName('')
    setRenterEmail('')
    setRulesOk(false)
    setAgreementOk(false)
    setConfirmedRef(null)
  }

  return (
    <section id="rental-booking" className="not-prose my-14 border border-formula-frost/12 bg-formula-base/70 p-5 md:p-8">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-formula-mist">Booking flow</p>
      <h3 className="mt-4 font-mono text-xl font-semibold tracking-tight text-formula-paper md:text-2xl">
        Classify, enforce, and filter before arrival
      </h3>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-formula-mist">
        Rental type and headcount drive capacity rules, tier, pricing logic, and waiver enforcement. Live inventory and email delivery will connect
        once your booking backend is wired; this flow implements the product logic today.
      </p>

      <ol className="mt-8 flex flex-wrap gap-2 border border-formula-frost/10 bg-formula-paper/[0.02] p-3 font-mono text-[9px] uppercase tracking-[0.14em] text-formula-mist">
        {Array.from({ length: STEPS }, (_, i) => (
          <li
            key={i}
            className={`rounded-sm px-2 py-1 ${step === i + 1 ? 'bg-formula-volt/20 text-formula-paper' : ''}`}
          >
            {i + 1}. {['Type', 'Slot', 'Headcount', 'Tier', 'Rules', 'Done'][i]}
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
                  hint: '1–4 Tier 1; 5+ group / clinic approval',
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
            Fixed session windows. All sessions end on time. Overstay is billed in 30-minute increments (disclosed now, enforced at check-in).
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
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Window *</span>
              <select
                value={timeSlot}
                onChange={e => setTimeSlot(e.target.value)}
                className="h-11 border border-formula-frost/16 bg-formula-paper/[0.03] px-3 text-sm text-formula-paper outline-none focus:border-formula-volt/45"
              >
                <option value="">Select window</option>
                {TIME_SLOTS.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
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
            <li>Private: 1–4 → Tier 1 (Standard). 5+ → Group / Clinic, approval required.</li>
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
                  : needsApproval
                    ? 'border-amber-400/35 bg-amber-400/10 text-amber-50'
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
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Step 4  -  Auto classification and pricing</p>
          <div className="border border-formula-frost/12 bg-formula-paper/[0.03] p-5">
            <p className="text-sm font-medium text-formula-paper">{classificationSummary(classification)}</p>
            {classification.status === 'private_tier1' ? (
              <p className="mt-3 text-sm text-formula-mist">
                Pricing: Tier 1 rate applies (connect rate card). No group approval required.
              </p>
            ) : null}
            {needsApproval ? (
              <p className="mt-3 text-sm text-formula-mist">
                Pricing and slot hold remain pending until staff approves. You will receive status by email once connected.
              </p>
            ) : null}
            {needsInsurance ? (
              <p className="mt-3 border-l-2 border-formula-volt/50 pl-3 text-sm text-formula-mist">
                <strong className="text-formula-paper">Insurance:</strong> Certificate of Insurance may be required with Formula Soccer Center named as
                additional insured ($1M+ per occurrence). Booking may stay pending until COI is verified.
              </p>
            ) : null}
            {(classification.status === 'club_ok' || classification.status === 'general_ok') && !needsApproval ? (
              <p className="mt-3 text-sm text-formula-mist">Pricing follows published band for this rental class and window (connect checkout).</p>
            ) : null}
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
            Primary renter (distributes waivers). After confirmation, the system sends a waiver link for all participants (when email is connected).
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
              onClick={confirmBooking}
              className="inline-flex h-11 items-center border border-formula-volt/40 bg-formula-volt px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-black disabled:opacity-40"
            >
              {needsApproval ? 'Submit request (pending approval)' : 'Confirm booking'}
            </button>
          </div>
        </div>
      ) : null}

      {step === STEPS && confirmedRef ? (
        <div className="mt-8 space-y-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Step 6  -  Waiver distribution</p>
          <div className="border border-formula-volt/30 bg-formula-volt/10 p-5">
            <p className="font-mono text-sm font-semibold text-formula-paper">Reference: {confirmedRef}</p>
            <p className="mt-3 text-sm text-formula-mist">
              {needsApproval
                ? 'Request recorded. You will be notified when staff approves; waiver blast sends after confirmed booking when email is connected.'
                : 'Booking recorded locally for demo. When email is connected, the renter receives a waiver link to forward to every participant.'}
            </p>
          </div>
          <div className="border border-formula-frost/12 bg-formula-paper/[0.02] p-5 text-sm text-formula-mist">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Renter dashboard (example)</p>
            <p className="mt-2 text-formula-paper">
              Waiver completion: <strong>0 / {Number.isFinite(countNum) ? countNum : ' - '}</strong> (e.g. 8 / 12 when partially complete)
            </p>
            <p className="mt-2">
              Automated reminders at <strong>24 hours</strong> and <strong>3 hours</strong> before session for anyone not completed - once messaging is connected.
            </p>
          </div>
          <p className="text-sm text-formula-mist">
            Each participant completes the{' '}
            <a href="#participant-waiver" className="font-mono text-formula-volt underline-offset-4 hover:underline">
              participant waiver
            </a>{' '}
            (name, email, DOB, signature). Minors: parent or guardian on their behalf.
          </p>
          <button
            type="button"
            onClick={resetBooking}
            className="inline-flex h-11 items-center border border-formula-frost/18 px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-mist"
          >
            Start new booking
          </button>
        </div>
      ) : null}
    </section>
  )
}
