'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import type { WaiverInviteWithProgress } from '@/lib/rentals/waiver-invites-server'
import { RENTAL_FIELD_OPTIONS } from '@/lib/rentals/field-rental-picker-constants'
import { formatCheckoutAmount, formatRosterInviteBookingSummary } from '@/lib/rentals/field-rental-agreement-admin-display'
import { formatFacilityDateTimeShort } from '@/lib/facility/format-facility-datetime'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FIELD_RENTAL_WAIVER_DRAG_MIME } from '@/lib/rentals/field-rental-waiver-labels'

type Props = {
  invites: WaiverInviteWithProgress[]
  siteOrigin: string
}

function toDatetimeLocalInput(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

function fromDatetimeLocalToIso(v: string): string {
  const t = v.trim()
  if (!t) return ''
  const d = new Date(t)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString()
}

function InviteSnapshotEditor({ invite }: { invite: WaiverInviteWithProgress }) {
  const router = useRouter()
  const dollarsInit =
    invite.checkout_amount_total_cents != null ? (invite.checkout_amount_total_cents / 100).toFixed(2) : ''
  const [amountDollars, setAmountDollars] = React.useState(dollarsInit)
  const [currency, setCurrency] = React.useState((invite.checkout_currency ?? 'usd').toLowerCase())
  const [paidAtLocal, setPaidAtLocal] = React.useState(() => toDatetimeLocalInput(invite.checkout_completed_at ?? null))
  const [field, setField] = React.useState(invite.booking_rental_field ?? '')
  const [windowStr, setWindowStr] = React.useState(invite.booking_rental_window ?? '')
  const [anchorDate, setAnchorDate] = React.useState(invite.booking_rental_date ?? '')
  const [datesCompact, setDatesCompact] = React.useState(invite.booking_rental_dates_compact ?? '')
  const [weeks, setWeeks] = React.useState(
    invite.booking_session_weeks != null ? String(invite.booking_session_weeks) : ''
  )
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setAmountDollars(invite.checkout_amount_total_cents != null ? (invite.checkout_amount_total_cents / 100).toFixed(2) : '')
    setCurrency((invite.checkout_currency ?? 'usd').toLowerCase())
    setPaidAtLocal(toDatetimeLocalInput(invite.checkout_completed_at ?? null))
    setField(invite.booking_rental_field ?? '')
    setWindowStr(invite.booking_rental_window ?? '')
    setAnchorDate(invite.booking_rental_date ?? '')
    setDatesCompact(invite.booking_rental_dates_compact ?? '')
    setWeeks(invite.booking_session_weeks != null ? String(invite.booking_session_weeks) : '')
  }, [
    invite.id,
    invite.checkout_amount_total_cents,
    invite.checkout_currency,
    invite.checkout_completed_at,
    invite.booking_rental_field,
    invite.booking_rental_window,
    invite.booking_rental_date,
    invite.booking_rental_dates_compact,
    invite.booking_session_weeks,
  ])

  const preview = formatRosterInviteBookingSummary({
    booking_rental_field: field || null,
    booking_rental_window: windowStr || null,
    booking_rental_date: anchorDate || null,
    booking_rental_dates_compact: datesCompact || null,
    booking_session_weeks: weeks.trim() ? parseInt(weeks, 10) : null,
    expected_waiver_count: invite.expected_waiver_count,
  })

  async function saveSnapshot() {
    setError(null)
    const raw = amountDollars.trim()
    const cents =
      raw === ''
        ? null
        : (() => {
            const n = Math.round(parseFloat(raw) * 100)
            return Number.isFinite(n) ? n : NaN
          })()
    if (cents != null && (!Number.isFinite(cents) || cents < 0)) {
      setError('Enter a valid dollar amount or leave empty to clear.')
      return
    }
    const wk = weeks.trim() === '' ? null : parseInt(weeks, 10)
    if (wk != null && (!Number.isFinite(wk) || wk < 1)) {
      setError('Session weeks must be a positive integer or empty.')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/waiver-invite-snapshot', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: invite.id,
          checkout_amount_total_cents: cents,
          checkout_currency: currency.trim() || 'usd',
          checkout_completed_at: paidAtLocal.trim() ? fromDatetimeLocalToIso(paidAtLocal) : null,
          booking_rental_field: field.trim() || null,
          booking_rental_window: windowStr.trim() || null,
          booking_rental_date: anchorDate.trim() || null,
          booking_rental_dates_compact: datesCompact.trim().replace(/\s/g, '') || null,
          booking_session_weeks: wk,
        }),
      })
      const body = (await res.json()) as { error?: string }
      if (!res.ok) throw new Error(body.error ?? 'Save failed')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-3 rounded border border-formula-frost/12 bg-formula-paper/[0.04] p-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-formula-mist">Edit payment &amp; session (saved on invite)</p>
      <p className="mt-1 font-mono text-[10px] text-formula-mist/85">
        Fixes missing Stripe metadata, wrong deposit, or unclear times. Each new waiver signed after this still copies the invite snapshot into the agreement row.
      </p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <label className="block font-mono text-[10px] text-formula-mist">
          Amount paid (USD)
          <input
            className="mt-0.5 w-full border border-formula-frost/14 bg-formula-base/50 px-2 py-1.5 text-[12px] text-formula-paper"
            value={amountDollars}
            onChange={e => setAmountDollars(e.target.value)}
            placeholder="e.g. 450.00"
            inputMode="decimal"
          />
        </label>
        <label className="block font-mono text-[10px] text-formula-mist">
          Currency
          <input
            className="mt-0.5 w-full border border-formula-frost/14 bg-formula-base/50 px-2 py-1.5 text-[12px] text-formula-paper"
            value={currency}
            onChange={e => setCurrency(e.target.value.toLowerCase())}
            maxLength={3}
          />
        </label>
        <label className="block font-mono text-[10px] text-formula-mist sm:col-span-2">
          Paid at (local time — leave empty to clear)
          <input
            type="datetime-local"
            className="mt-0.5 w-full max-w-md border border-formula-frost/14 bg-formula-base/50 px-2 py-1.5 text-[12px] text-formula-paper"
            value={paidAtLocal}
            onChange={e => setPaidAtLocal(e.target.value)}
          />
        </label>
        <label className="block font-mono text-[10px] text-formula-mist sm:col-span-2">
          Field
          <select
            className="mt-0.5 w-full border border-formula-frost/14 bg-formula-base/50 px-2 py-1.5 text-[12px] text-formula-paper"
            value={field}
            onChange={e => setField(e.target.value)}
          >
            <option value="">—</option>
            {field && !RENTAL_FIELD_OPTIONS.some(o => o.value === field) ? (
              <option value={field}>{field} (current)</option>
            ) : null}
            {RENTAL_FIELD_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block font-mono text-[10px] text-formula-mist sm:col-span-2">
          Time window (e.g. <code className="text-formula-volt/90">6:00 AM|120</code> = start + minutes)
          <input
            className="mt-0.5 w-full border border-formula-frost/14 bg-formula-base/50 px-2 py-1.5 font-mono text-[11px] text-formula-paper"
            value={windowStr}
            onChange={e => setWindowStr(e.target.value)}
            placeholder="6:00 AM|120"
          />
        </label>
        <label className="block font-mono text-[10px] text-formula-mist">
          First session date (YYYY-MM-DD)
          <input
            className="mt-0.5 w-full border border-formula-frost/14 bg-formula-base/50 px-2 py-1.5 font-mono text-[11px] text-formula-paper"
            value={anchorDate}
            onChange={e => setAnchorDate(e.target.value)}
            placeholder="2026-05-01"
          />
        </label>
        <label className="block font-mono text-[10px] text-formula-mist">
          Recurring weeks (optional)
          <input
            className="mt-0.5 w-full border border-formula-frost/14 bg-formula-base/50 px-2 py-1.5 text-[12px] text-formula-paper"
            value={weeks}
            onChange={e => setWeeks(e.target.value)}
            placeholder="6"
            inputMode="numeric"
          />
        </label>
        <label className="block font-mono text-[10px] text-formula-mist sm:col-span-2">
          All session dates compact (optional — same as Stripe metadata)
          <input
            className="mt-0.5 w-full border border-formula-frost/14 bg-formula-base/50 px-2 py-1.5 font-mono text-[10px] text-formula-paper"
            value={datesCompact}
            onChange={e => setDatesCompact(e.target.value)}
            placeholder="2026050120260508…"
          />
        </label>
      </div>
      <p className="mt-2 font-mono text-[10px] text-formula-frost/80">
        Preview: <span className="text-formula-paper/95">{preview}</span>
      </p>
      {error ? <p className="mt-2 font-mono text-[10px] text-amber-200/90">{error}</p> : null}
      <div className="mt-2">
        <Button type="button" variant="secondary" size="sm" disabled={saving} onClick={() => void saveSnapshot()}>
          {saving ? 'Saving…' : 'Save payment & session'}
        </Button>
      </div>
    </div>
  )
}

function InviteOrganizerEditor({ invite }: { invite: WaiverInviteWithProgress }) {
  const router = useRouter()
  const [name, setName] = React.useState(invite.purchaser_name?.trim() ?? '')
  const [email, setEmail] = React.useState(invite.purchaser_email?.trim() ?? '')
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setName(invite.purchaser_name?.trim() ?? '')
    setEmail(invite.purchaser_email?.trim() ?? '')
  }, [invite.id, invite.purchaser_name, invite.purchaser_email])

  async function save() {
    setError(null)
    setSaving(true)
    try {
      const res = await fetch('/api/admin/waiver-invite-organizer', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: invite.id,
          purchaserName: name,
          purchaserEmail: email,
        }),
      })
      const body = (await res.json()) as { error?: string }
      if (!res.ok) throw new Error(body.error ?? 'Save failed')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-3 rounded border border-formula-frost/12 bg-formula-paper/[0.04] p-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-formula-mist">Edit organizer (display + records)</p>
      <p className="mt-1 font-mono text-[10px] text-formula-mist/85">
        Use when Stripe didn’t capture the payer name. Name and/or email must be set (name needs 2+ characters if used).
      </p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <label className="block font-mono text-[10px] text-formula-mist">
          Organizer name
          <input
            className="mt-0.5 w-full border border-formula-frost/14 bg-formula-base/50 px-2 py-1.5 text-[12px] text-formula-paper"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Mike Comrie"
            autoComplete="name"
          />
        </label>
        <label className="block font-mono text-[10px] text-formula-mist">
          Organizer email
          <input
            className="mt-0.5 w-full border border-formula-frost/14 bg-formula-base/50 px-2 py-1.5 text-[12px] text-formula-paper"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="payer@example.com"
            type="email"
            autoComplete="email"
          />
        </label>
      </div>
      {error ? <p className="mt-2 font-mono text-[10px] text-amber-200/90">{error}</p> : null}
      <div className="mt-2">
        <Button type="button" variant="secondary" size="sm" disabled={saving} onClick={() => void save()}>
          {saving ? 'Saving…' : 'Save organizer'}
        </Button>
      </div>
    </div>
  )
}

export function RosterWaiverInvitesAdmin({ invites, siteOrigin }: Props) {
  const router = useRouter()
  const [dragOverInviteId, setDragOverInviteId] = React.useState<string | null>(null)
  const [dropBusy, setDropBusy] = React.useState(false)
  const [dropError, setDropError] = React.useState<string | null>(null)

  const onDropAgreement = React.useCallback(
    async (inviteId: string, agreementId: string) => {
      setDropError(null)
      setDropBusy(true)
      try {
        const res = await fetch('/api/admin/field-rental-agreement-waiver-invite', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agreementId, waiverInviteId: inviteId }),
        })
        const body = (await res.json()) as { error?: string }
        if (!res.ok) throw new Error(body.error ?? 'Link failed')
        router.refresh()
      } catch (e) {
        setDropError(e instanceof Error ? e.message : 'Link failed')
      } finally {
        setDropBusy(false)
      }
    },
    [router]
  )

  return (
    <div className="mt-6 space-y-3">
      {dropError ? <p className="font-mono text-[11px] text-amber-200/90">{dropError}</p> : null}
      {dropBusy ? <p className="font-mono text-[10px] text-formula-mist/80">Linking waiver…</p> : null}
      {invites.map(inv => {
        const waiverUrl = `${siteOrigin}/rentals/waiver/${inv.token}`
        const displayName = inv.purchaser_name?.trim() ?? ''
        const displayEmail = inv.purchaser_email?.trim() ?? ''
        const organizer =
          displayName ||
          displayEmail ||
          (inv.stripe_checkout_session_id ? 'Paid checkout (name not captured)' : 'Manual / comp link')
        const paid =
          inv.checkout_amount_total_cents != null
            ? formatCheckoutAmount(inv.checkout_amount_total_cents, inv.checkout_currency ?? null)
            : '—'
        const paidWhen =
          inv.checkout_completed_at != null && String(inv.checkout_completed_at).trim() !== ''
            ? formatFacilityDateTimeShort(inv.checkout_completed_at)
            : inv.created_at != null && String(inv.created_at).trim() !== ''
              ? `${formatFacilityDateTimeShort(inv.created_at)} (invite created)`
              : '—'
        const sessionLine = formatRosterInviteBookingSummary({
          booking_rental_field: inv.booking_rental_field ?? null,
          booking_rental_window: inv.booking_rental_window ?? null,
          booking_rental_date: inv.booking_rental_date ?? null,
          booking_rental_dates_compact: inv.booking_rental_dates_compact ?? null,
          booking_session_weeks: inv.booking_session_weeks ?? null,
          expected_waiver_count: inv.expected_waiver_count,
        })
        const organizerFoot = displayName || displayEmail || 'this link’s payer'

        return (
          <details
            key={inv.id}
            className="group rounded-lg border border-formula-frost/14 bg-formula-base/50 open:border-formula-frost/22"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-3 px-4 py-3 font-mono text-[11px] text-formula-frost/90 [&::-webkit-details-marker]:hidden">
              <span className="min-w-0 flex-1 space-y-1">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  {displayName ? (
                    <>
                      <span className="font-semibold text-formula-paper">{displayName}</span>
                      {displayEmail ? <span className="text-formula-mist/90">{displayEmail}</span> : null}
                    </>
                  ) : (
                    <span className="font-semibold text-formula-paper">{organizer}</span>
                  )}
                </span>
                <span className="block text-formula-mist/85">
                  Paid {paid} · {paidWhen}
                </span>
                <span className="block text-formula-frost/88">
                  Session (on invite): {sessionLine}
                </span>
                <span className="inline-flex items-center gap-2 text-formula-volt">
                  Waivers signed {inv.completed_count} / {inv.expected_waiver_count}
                  {inv.remaining_count > 0 ? (
                    <span className="text-formula-mist">({inv.remaining_count} remaining)</span>
                  ) : (
                    <span className="text-emerald-400/90">(complete)</span>
                  )}
                </span>
              </span>
              <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-formula-mist transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <div className="border-t border-formula-frost/10 px-4 pb-4 pt-2">
              <div
                className={cn(
                  'mb-3 rounded-md border border-dashed px-3 py-2.5 text-center font-mono text-[10px] leading-snug transition-colors',
                  dragOverInviteId === inv.id
                    ? 'border-formula-volt/60 bg-formula-volt/15 text-formula-paper'
                    : 'border-formula-frost/25 bg-black/15 text-formula-mist/90'
                )}
                onDragOver={e => {
                  e.preventDefault()
                  e.dataTransfer.dropEffect = 'copy'
                  setDragOverInviteId(inv.id)
                }}
                onDragEnter={e => {
                  e.preventDefault()
                  setDragOverInviteId(inv.id)
                }}
                onDragLeave={e => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setDragOverInviteId(null)
                  }
                }}
                onDrop={e => {
                  e.preventDefault()
                  setDragOverInviteId(null)
                  const agreementId =
                    e.dataTransfer.getData(FIELD_RENTAL_WAIVER_DRAG_MIME) || e.dataTransfer.getData('text/plain').trim()
                  if (!agreementId) return
                  void onDropAgreement(inv.id, agreementId)
                }}
              >
                <span className="text-formula-frost/95">Drop a signed waiver here</span>
                <span className="mt-1 block text-formula-mist/75">
                  (use the ⣿ handle in the table below, or the dropdown on each row)
                </span>
              </div>
              <InviteOrganizerEditor invite={inv} />
              <InviteSnapshotEditor invite={inv} />
              <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-formula-mist">Share link</p>
              <code className="mt-1 block max-w-full break-all rounded border border-formula-frost/12 bg-black/20 px-2 py-1.5 font-mono text-[10px] text-formula-frost/88">
                {waiverUrl}
              </code>
              <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-formula-mist">Signers (this rental)</p>
              <p className="mt-1 text-[10px] text-formula-mist/75">
                “Organizer / payer” when the signer&apos;s email matches the invite payer email. Session lines are copied from checkout + invite when each waiver is submitted.
              </p>
              {inv.signed_waivers.length === 0 ? (
                <p className="mt-2 font-mono text-[11px] text-formula-mist/80">
                  No waivers on this invite yet — use the drop zone above or link rows from the signed waivers table so walk-up signers count here.
                </p>
              ) : (
                <ul className="mt-2 divide-y divide-formula-frost/10 rounded-md border border-formula-frost/10">
                  {inv.signed_waivers.map(w => (
                    <li key={w.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 font-mono text-[11px]">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link href={`/admin/rentals/waivers/${w.id}`} className="font-medium text-formula-volt hover:underline">
                            {w.participant_name}
                          </Link>
                          {w.is_organizer_waiver ? (
                            <span className="rounded border border-emerald-500/35 bg-emerald-950/40 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-emerald-100">
                              Organizer / payer
                            </span>
                          ) : null}
                        </div>
                        <span className="block truncate text-formula-mist/85">{w.participant_email}</span>
                        {w.session_summary ? (
                          <span className="mt-1 block text-[10px] leading-snug text-formula-frost/80">
                            Session on file: {w.session_summary}
                          </span>
                        ) : (
                          <span className="mt-1 block text-[10px] text-amber-200/70">No field / window / dates stored on this waiver row.</span>
                        )}
                      </div>
                      <span className="shrink-0 text-right text-formula-mist/80">
                        Signed
                        <br />
                        {formatFacilityDateTimeShort(w.submitted_at)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-[10px] leading-relaxed text-formula-mist/75">
                Each person signs for the field session above; the organizer ({organizerFoot}) paid the deposit (online or in person). Waivers without a roster link
                appear only in the table below.
              </p>
            </div>
          </details>
        )
      })}
    </div>
  )
}
