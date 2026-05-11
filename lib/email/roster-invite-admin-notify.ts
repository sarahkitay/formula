import { escapeHtml, sendAdminNotification } from '@/lib/email/send-admin-notification'
import { formatRosterInviteBookingSummary } from '@/lib/rentals/field-rental-agreement-admin-display'
import type { FieldRentalAgreementRow } from '@/lib/rentals/field-rental-agreements-server'
import type { WaiverInviteRow } from '@/lib/rentals/waiver-invites-server'

function organizerLabel(inv: WaiverInviteRow): string {
  const n = inv.purchaser_name?.trim()
  const e = inv.purchaser_email?.trim()
  if (n && e) return `${n} <${e}>`
  if (n) return n
  if (e) return e
  return inv.stripe_checkout_session_id ? 'Paid checkout (organizer not on file)' : 'Manual / comp link'
}

function sessionLine(inv: WaiverInviteRow): string {
  return formatRosterInviteBookingSummary({
    booking_rental_field: inv.booking_rental_field ?? null,
    booking_rental_window: inv.booking_rental_window ?? null,
    booking_rental_date: inv.booking_rental_date ?? null,
    booking_rental_dates_compact: inv.booking_rental_dates_compact ?? null,
    booking_session_weeks: inv.booking_session_weeks ?? null,
    expected_waiver_count: inv.expected_waiver_count,
  })
}

export async function sendRosterInviteFullyCompleteAdminEmail(params: {
  invite: WaiverInviteRow
  agreements: Pick<FieldRentalAgreementRow, 'id' | 'participant_name' | 'participant_email' | 'source'>[]
  rosterWaiverUrl: string
}): Promise<void> {
  const { invite, agreements, rosterWaiverUrl } = params
  const org = organizerLabel(invite)
  const n = agreements.length
  const listItems = agreements
    .map(
      a =>
        `<li>${escapeHtml(a.participant_name)} · ${escapeHtml(a.participant_email)} · ${escapeHtml(a.source ?? '-')}</li>`
    )
    .join('')

  await sendAdminNotification({
    subject: `[Formula] Roster complete · ${n}/${invite.expected_waiver_count} · ${invite.purchaser_name?.trim() || invite.purchaser_email?.trim() || invite.token.slice(0, 8)}`,
    html: `
      <p><strong>Field rental roster link — all waivers in</strong></p>
      <ul>
        <li><strong>Organizer</strong>: ${escapeHtml(org)}</li>
        <li><strong>Progress</strong>: ${n} / ${invite.expected_waiver_count} (complete)</li>
        <li><strong>Session (invite)</strong>: ${escapeHtml(sessionLine(invite))}</li>
        <li><strong>Roster URL</strong>: <a href="${escapeHtml(rosterWaiverUrl)}">${escapeHtml(rosterWaiverUrl)}</a></li>
      </ul>
      <p><strong>Signers</strong></p>
      <ol>${listItems}</ol>
      <p style="margin-top:12px;font-size:12px;color:#64748b">No per-signer emails are sent for roster links; this is the single completion notice.</p>
    `,
    text: `Roster complete ${n}/${invite.expected_waiver_count}\n${org}\n${rosterWaiverUrl}`,
  })
}

export async function sendRosterInviteIncompletePremeetingAdminEmail(params: {
  invite: WaiverInviteRow
  rosterWaiverUrl: string
  signedCount: number
  missingCount: number
  sessionStartSummary: string
}): Promise<void> {
  const { invite, rosterWaiverUrl, signedCount, missingCount, sessionStartSummary } = params
  const org = organizerLabel(invite)

  await sendAdminNotification({
    subject: `[Formula] Roster missing waivers (${missingCount}) · ~1h to session · ${invite.purchaser_name?.trim() || invite.purchaser_email?.trim() || invite.token.slice(0, 8)}`,
    html: `
      <p><strong>Field rental roster — waivers still missing before first session</strong></p>
      <ul>
        <li><strong>Organizer</strong>: ${escapeHtml(org)}</li>
        <li><strong>Signed</strong>: ${signedCount} / ${invite.expected_waiver_count}</li>
        <li><strong>Still needed</strong>: ${missingCount}</li>
        <li><strong>First session (local)</strong>: ${escapeHtml(sessionStartSummary)}</li>
        <li><strong>Session (invite)</strong>: ${escapeHtml(sessionLine(invite))}</li>
        <li><strong>Roster URL</strong>: <a href="${escapeHtml(rosterWaiverUrl)}">${escapeHtml(rosterWaiverUrl)}</a></li>
      </ul>
      <p>Chase the organizer or attach walk-up waivers in Admin → Rentals if needed.</p>
    `,
    text: `Roster incomplete: ${missingCount} missing (~1h to session)\n${signedCount}/${invite.expected_waiver_count}\n${rosterWaiverUrl}`,
  })
}
