'use client'

import { useMemo, useState } from 'react'
import { CheckoutLaunchButton } from '@/components/marketing/checkout-launch-button'
import { PARTY_BOOKING_1K_CHECKOUT } from '@/lib/marketing/public-pricing'
import { RENTAL_FIELD_OPTIONS, RENTAL_TIME_SLOTS } from '@/lib/rentals/field-rental-picker-constants'
import { cn } from '@/lib/utils'

const META_MAX = 480

function clipMeta(s: string): string {
  const t = s.trim()
  return t.length <= META_MAX ? t : t.slice(0, META_MAX)
}

const inputClass =
  'mt-1 w-full border border-formula-frost/14 bg-formula-deep/30 px-2 py-2 text-sm text-formula-paper placeholder:text-formula-mist/50'

export function PartyBookingFlow() {
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [partyPreferredDate, setPartyPreferredDate] = useState('')
  const [partyGuestCount, setPartyGuestCount] = useState('')
  const [partyChildName, setPartyChildName] = useState('')
  const [partyNotes, setPartyNotes] = useState('')
  const [rentalField, setRentalField] = useState('')
  const [rentalDate, setRentalDate] = useState('')
  const [rentalTimeSlot, setRentalTimeSlot] = useState('')
  const [rentalHeadcount, setRentalHeadcount] = useState('')
  const [rentalOrg, setRentalOrg] = useState('')
  const [rentalNotes, setRentalNotes] = useState('')
  const [rulesOk, setRulesOk] = useState(false)

  const partyGuests = useMemo(() => {
    const n = parseInt(partyGuestCount, 10)
    return Number.isInteger(n) ? n : NaN
  }, [partyGuestCount])

  const rentalHeads = useMemo(() => {
    const n = parseInt(rentalHeadcount, 10)
    return Number.isInteger(n) ? n : NaN
  }, [rentalHeadcount])

  const canPay = useMemo(() => {
    if (!rulesOk) return false
    if (contactName.trim().length < 2) return false
    const em = contactEmail.trim().toLowerCase()
    if (!em.includes('@') || !em.includes('.')) return false
    if (!/^\d{4}-\d{2}-\d{2}$/.test(partyPreferredDate)) return false
    if (!Number.isFinite(partyGuests) || partyGuests < 1 || partyGuests > 200) return false
    if (!rentalField) return false
    if (!/^\d{4}-\d{2}-\d{2}$/.test(rentalDate)) return false
    if (!rentalTimeSlot) return false
    if (!Number.isFinite(rentalHeads) || rentalHeads < 1 || rentalHeads > 200) return false
    return true
  }, [
    rulesOk,
    contactName,
    contactEmail,
    partyPreferredDate,
    partyGuests,
    rentalField,
    rentalDate,
    rentalTimeSlot,
    rentalHeads,
  ])

  const metadata = useMemo(() => {
    if (!canPay) return undefined
    return {
      party_contact_name: clipMeta(contactName),
      party_contact_email: clipMeta(contactEmail),
      party_contact_phone: clipMeta(contactPhone),
      party_preferred_date: partyPreferredDate,
      party_guest_count: String(partyGuests),
      party_child_name: clipMeta(partyChildName),
      party_notes: clipMeta(partyNotes),
      rental_field: rentalField,
      rental_date: rentalDate,
      rental_time_slot: rentalTimeSlot,
      rental_headcount: String(rentalHeads),
      rental_org: clipMeta(rentalOrg),
      rental_notes: clipMeta(rentalNotes),
      party_rules_ok: 'true',
    }
  }, [
    canPay,
    contactName,
    contactEmail,
    contactPhone,
    partyPreferredDate,
    partyGuests,
    partyChildName,
    partyNotes,
    rentalField,
    rentalDate,
    rentalTimeSlot,
    rentalHeads,
    rentalOrg,
    rentalNotes,
  ])

  return (
    <div
      id="party-booking"
      className="space-y-8 border border-formula-frost/12 bg-formula-paper/[0.03] p-5 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]"
    >
      <div>
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-formula-mist">Book online</p>
        <h3 className="mt-1 text-lg font-semibold text-formula-paper">Party deposit · ${PARTY_BOOKING_1K_CHECKOUT.priceUsd.toLocaleString()}</h3>
        <p className="mt-2 max-w-2xl font-mono text-[11px] leading-relaxed text-formula-frost/85">
          {PARTY_BOOKING_1K_CHECKOUT.summary} Complete both sections — your details are saved with the deposit, and you and our
          events team each get a confirmation email.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="font-mono text-[10px] font-bold uppercase tracking-wide text-formula-volt">Party details</p>
          <label className="block font-mono text-[10px] text-formula-mist">
            Contact name
            <input className={inputClass} value={contactName} onChange={e => setContactName(e.target.value)} autoComplete="name" />
          </label>
          <label className="block font-mono text-[10px] text-formula-mist">
            Email
            <input
              className={inputClass}
              type="email"
              value={contactEmail}
              onChange={e => setContactEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          <label className="block font-mono text-[10px] text-formula-mist">
            Phone (optional)
            <input className={inputClass} value={contactPhone} onChange={e => setContactPhone(e.target.value)} autoComplete="tel" />
          </label>
          <label className="block font-mono text-[10px] text-formula-mist">
            Preferred party date (YYYY-MM-DD)
            <input className={inputClass} value={partyPreferredDate} onChange={e => setPartyPreferredDate(e.target.value)} placeholder="2026-04-13" />
          </label>
          <label className="block font-mono text-[10px] text-formula-mist">
            Expected guest count
            <input className={inputClass} inputMode="numeric" value={partyGuestCount} onChange={e => setPartyGuestCount(e.target.value)} placeholder="24" />
          </label>
          <label className="block font-mono text-[10px] text-formula-mist">
            Birthday child / honoree (optional)
            <input className={inputClass} value={partyChildName} onChange={e => setPartyChildName(e.target.value)} />
          </label>
          <label className="block font-mono text-[10px] text-formula-mist">
            Party notes (optional)
            <textarea className={cn(inputClass, 'min-h-[88px] resize-y')} value={partyNotes} onChange={e => setPartyNotes(e.target.value)} />
          </label>
        </div>

        <div className="space-y-4">
          <p className="font-mono text-[10px] font-bold uppercase tracking-wide text-formula-volt">Field rental window (required)</p>
          <p className="font-mono text-[10px] text-formula-frost/75">
            Same picker as public field rentals — helps staff align turf / indoor holds with your party.
          </p>
          <label className="block font-mono text-[10px] text-formula-mist">
            Field
            <select className={inputClass} value={rentalField} onChange={e => setRentalField(e.target.value)}>
              <option value="">Select…</option>
              {RENTAL_FIELD_OPTIONS.map(f => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block font-mono text-[10px] text-formula-mist">
            Session date (YYYY-MM-DD)
            <input className={inputClass} value={rentalDate} onChange={e => setRentalDate(e.target.value)} placeholder="2026-04-13" />
          </label>
          <label className="block font-mono text-[10px] text-formula-mist">
            Time window
            <select className={inputClass} value={rentalTimeSlot} onChange={e => setRentalTimeSlot(e.target.value)}>
              <option value="">Select…</option>
              {RENTAL_TIME_SLOTS.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="block font-mono text-[10px] text-formula-mist">
            Headcount for this rental block
            <input
              className={inputClass}
              inputMode="numeric"
              value={rentalHeadcount}
              onChange={e => setRentalHeadcount(e.target.value)}
              placeholder="Same as party or staff + athletes on field"
            />
          </label>
          <label className="block font-mono text-[10px] text-formula-mist">
            Organization (optional)
            <input className={inputClass} value={rentalOrg} onChange={e => setRentalOrg(e.target.value)} />
          </label>
          <label className="block font-mono text-[10px] text-formula-mist">
            Rental / setup notes (optional)
            <textarea className={cn(inputClass, 'min-h-[72px] resize-y')} value={rentalNotes} onChange={e => setRentalNotes(e.target.value)} />
          </label>
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-sm border border-formula-frost/14 bg-formula-deep/20 p-4 font-mono text-[11px] text-formula-frost/90">
        <input type="checkbox" className="mt-1" checked={rulesOk} onChange={e => setRulesOk(e.target.checked)} />
        <span>
          I confirm the party and field details above are accurate and I agree to facility use, cleanup, and billing terms.
          Staff will confirm final schedule; this charge is the published deposit.
        </span>
      </label>

      {!canPay ? (
        <p className="font-mono text-[10px] text-formula-mist">Fill all required fields and accept terms to enable payment.</p>
      ) : (
        <CheckoutLaunchButton
          checkoutType="party-booking-1k"
          label={`Pay $${PARTY_BOOKING_1K_CHECKOUT.priceUsd.toLocaleString()} deposit (secure checkout)`}
          metadata={metadata}
          hideSmsConsent
        />
      )}
    </div>
  )
}
