'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import type { FieldRentalAgreementRow } from '@/lib/rentals/field-rental-agreements-server'
import { FIELD_RENTAL_WAIVER_DRAG_MIME } from '@/lib/rentals/field-rental-waiver-labels'
import {
  formatCheckoutAmount,
  formatFieldRentalBookingSummaryLine,
  formatFieldRentalWaiverSource,
} from '@/lib/rentals/field-rental-agreement-admin-display'
import { formatFacilityDateTimeShort } from '@/lib/facility/format-facility-datetime'

export type RosterInvitePickOption = {
  id: string
  /** Short label for the select (organizer + progress). */
  label: string
  completed: number
  expected: number
}

function clip(s: string | null, max: number) {
  if (!s) return '—'
  return s.length <= max ? s : `${s.slice(0, max)}…`
}

async function patchLink(agreementId: string, waiverInviteId: string | null): Promise<void> {
  const res = await fetch('/api/admin/field-rental-agreement-waiver-invite', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agreementId, waiverInviteId }),
  })
  const body = (await res.json()) as { error?: string }
  if (!res.ok) throw new Error(body.error ?? 'Update failed')
}

export function SignedRentalWaiversLinkTable({
  rows,
  inviteOptions,
}: {
  rows: FieldRentalAgreementRow[]
  inviteOptions: RosterInvitePickOption[]
}) {
  const router = useRouter()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onLinkSelect = useCallback(
    async (agreementId: string, raw: string) => {
      setError(null)
      const waiverInviteId = raw === '' ? null : raw
      setBusyId(agreementId)
      try {
        await patchLink(agreementId, waiverInviteId)
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Update failed')
      } finally {
        setBusyId(null)
      }
    },
    [router]
  )

  return (
    <div className="space-y-3">
      {error ? <p className="font-mono text-[11px] text-amber-200/90">{error}</p> : null}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-[11px]">
          <thead>
            <tr className="border-b border-formula-frost/12 text-left text-formula-mist uppercase tracking-wide">
              <th className="pb-2 pr-2 font-medium">Drag</th>
              <th className="pb-2 pr-4 font-medium">Submitted</th>
              <th className="pb-2 pr-4 font-medium">Origin</th>
              <th className="pb-2 pr-4 font-medium">Roster link</th>
              <th className="pb-2 pr-4 font-medium">Attach to…</th>
              <th className="pb-2 pr-4 font-medium">Booked by</th>
              <th className="pb-2 pr-4 font-medium">Paid</th>
              <th className="pb-2 pr-4 font-medium">Booking</th>
              <th className="pb-2 pr-4 font-medium">Rental type</th>
              <th className="pb-2 pr-4 font-medium">Participant</th>
              <th className="pb-2 pr-4 font-medium">Email</th>
              <th className="pb-2 pr-4 font-medium">DOB</th>
              <th className="pb-2 pr-4 font-medium">Count</th>
              <th className="pb-2 pr-4 font-medium">Signer</th>
              <th className="pb-2 pr-4 font-medium">Guardian</th>
              <th className="pb-2 pr-4 font-medium">Org</th>
              <th className="pb-2 pr-4 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const bookedBy = [r.roster_organizer_name, r.roster_organizer_email].filter(Boolean).join(' · ') || '—'
              const selectVal = r.waiver_invite_id ?? ''
              return (
                <tr key={r.id} className="border-b border-formula-frost/[0.08] text-formula-frost/90">
                  <td className="py-2 pr-2 align-top">
                    <span
                      draggable
                      title="Drag onto a roster invite above"
                      aria-label={`Drag waiver for ${r.participant_name} to a roster invite`}
                      className="inline-flex cursor-grab select-none rounded border border-formula-frost/20 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-formula-mist active:cursor-grabbing"
                      onDragStart={e => {
                        e.dataTransfer.setData(FIELD_RENTAL_WAIVER_DRAG_MIME, r.id)
                        e.dataTransfer.setData('text/plain', r.id)
                        e.dataTransfer.effectAllowed = 'copy'
                      }}
                    >
                      ⣿
                    </span>
                  </td>
                  <td className="py-2 pr-4 align-top">{formatFacilityDateTimeShort(r.submitted_at)}</td>
                  <td className="py-2 pr-4 align-top text-formula-frost/85">{formatFieldRentalWaiverSource(r.source)}</td>
                  <td className="py-2 pr-4 align-top text-formula-frost/85">
                    {r.waiver_invite_roster_progress ?? (
                      <span className="text-formula-mist/80">Not linked</span>
                    )}
                  </td>
                  <td className="py-2 pr-4 align-top">
                    <label className="sr-only" htmlFor={`waiver-invite-${r.id}`}>
                      Roster invite for {r.participant_name}
                    </label>
                    <select
                      id={`waiver-invite-${r.id}`}
                      className="max-w-[220px] border border-formula-frost/20 bg-formula-base/60 px-2 py-1 text-[10px] text-formula-paper"
                      value={selectVal}
                      disabled={busyId === r.id}
                      onChange={e => void onLinkSelect(r.id, e.target.value)}
                    >
                      <option value="">— Not linked</option>
                      {inviteOptions.map(opt => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 pr-4 align-top">{clip(bookedBy, 40)}</td>
                  <td className="py-2 pr-4 align-top">
                    {formatCheckoutAmount(r.checkout_amount_total_cents ?? null, r.checkout_currency ?? null)}
                  </td>
                  <td className="py-2 pr-4 align-top">{clip(formatFieldRentalBookingSummaryLine(r), 52)}</td>
                  <td className="py-2 pr-4 align-top">{r.rental_type}</td>
                  <td className="py-2 pr-4 align-top">
                    <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <Link href={`/admin/rentals/waivers/${r.id}`} className="text-formula-volt underline-offset-2 hover:underline">
                        {r.participant_name}
                      </Link>
                      <Link
                        href={`/admin/rentals/waivers/${r.id}`}
                        className="font-mono text-[9px] uppercase tracking-wide text-formula-mist hover:text-formula-paper"
                      >
                        Full record
                      </Link>
                    </span>
                  </td>
                  <td className="py-2 pr-4 align-top">{r.participant_email}</td>
                  <td className="py-2 pr-4 align-top">{r.participant_dob}</td>
                  <td className="py-2 pr-4 align-top">{r.participant_count != null ? String(r.participant_count) : '—'}</td>
                  <td className="py-2 pr-4 align-top">{r.signature_name}</td>
                  <td className="py-2 pr-4 align-top">{r.parent_guardian_name ?? '—'}</td>
                  <td className="py-2 pr-4 align-top">{r.organization_name ?? '—'}</td>
                  <td className="py-2 pr-4 align-top">{clip(r.notes, 48)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
