import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import type { WaiverInviteWithProgress } from '@/lib/rentals/waiver-invites-server'
import { formatCheckoutAmount, formatRosterInviteBookingSummary } from '@/lib/rentals/field-rental-agreement-admin-display'
import { formatFacilityDateTimeShort } from '@/lib/facility/format-facility-datetime'

type Props = {
  invites: WaiverInviteWithProgress[]
  siteOrigin: string
}

export function RosterWaiverInvitesAdmin({ invites, siteOrigin }: Props) {
  return (
    <div className="mt-6 space-y-3">
      {invites.map(inv => {
        const waiverUrl = `${siteOrigin}/rentals/waiver/${inv.token}`
        const organizer =
          inv.purchaser_name?.trim() ||
          (inv.stripe_checkout_session_id ? 'Paid checkout (name not captured)' : 'Manual / comp link')
        const organizerEmail = inv.purchaser_email?.trim() || '—'
        const paid =
          inv.checkout_amount_total_cents != null
            ? formatCheckoutAmount(inv.checkout_amount_total_cents, inv.checkout_currency ?? null)
            : '—'
        const paidWhen = inv.checkout_completed_at ? formatFacilityDateTimeShort(inv.checkout_completed_at) : '—'
        const sessionLine = formatRosterInviteBookingSummary({
          booking_rental_field: inv.booking_rental_field ?? null,
          booking_rental_window: inv.booking_rental_window ?? null,
          booking_rental_date: inv.booking_rental_date ?? null,
          booking_rental_dates_compact: inv.booking_rental_dates_compact ?? null,
          booking_session_weeks: inv.booking_session_weeks ?? null,
          expected_waiver_count: inv.expected_waiver_count,
        })

        return (
          <details
            key={inv.id}
            className="group rounded-lg border border-formula-frost/14 bg-formula-base/50 open:border-formula-frost/22"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-3 px-4 py-3 font-mono text-[11px] text-formula-frost/90 [&::-webkit-details-marker]:hidden">
              <span className="min-w-0 flex-1 space-y-1">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-semibold text-formula-paper">{organizer}</span>
                  {organizerEmail !== '—' ? (
                    <span className="text-formula-mist/90">{organizerEmail}</span>
                  ) : null}
                </span>
                <span className="block text-formula-mist/85">
                  Paid {paid} · {paidWhen}
                </span>
                <span className="block text-formula-frost/88">Session: {sessionLine}</span>
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
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-formula-mist">Share link</p>
              <code className="mt-1 block max-w-full break-all rounded border border-formula-frost/12 bg-black/20 px-2 py-1.5 font-mono text-[10px] text-formula-frost/88">
                {waiverUrl}
              </code>
              <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-formula-mist">Signers (this rental)</p>
              {inv.signed_waivers.length === 0 ? (
                <p className="mt-2 font-mono text-[11px] text-formula-mist/80">No waivers submitted through this link yet.</p>
              ) : (
                <ul className="mt-2 divide-y divide-formula-frost/10 border border-formula-frost/10 rounded-md">
                  {inv.signed_waivers.map(w => (
                    <li key={w.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 font-mono text-[11px]">
                      <div className="min-w-0">
                        <Link href={`/admin/rentals/waivers/${w.id}`} className="font-medium text-formula-volt hover:underline">
                          {w.participant_name}
                        </Link>
                        <span className="block truncate text-formula-mist/85">{w.participant_email}</span>
                      </div>
                      <span className="shrink-0 text-formula-mist/80">{formatFacilityDateTimeShort(w.submitted_at)}</span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-[10px] leading-relaxed text-formula-mist/75">
                Each person signs for the field session above; the organizer ({organizer}) paid the deposit. Waivers without a roster link appear only in the
                table below.
              </p>
            </div>
          </details>
        )
      })}
    </div>
  )
}
