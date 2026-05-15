import { NextResponse } from 'next/server'
import { sendRosterInviteIncompletePremeetingAdminEmail } from '@/lib/email/roster-invite-admin-notify'
import { FACILITY_TIMEZONE } from '@/lib/facility/facility-day'
import { utcInstantForLocalWallClock } from '@/lib/facility/utc-for-local-wall-time'
import {
  countWaiversForInviteId,
  listWaiverInvitesEligibleForPremeetingReminder,
  markRosterPremeetingIncompleteReminderSent,
} from '@/lib/rentals/waiver-invites-server'
import { formatMinutesAsUsTime, parseRentalTimeSlot } from '@/lib/rentals/rental-time-window'
import { getSiteOrigin } from '@/lib/stripe/server'

export const runtime = 'nodejs'

function authorizeCron(req: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret) return false
  return req.headers.get('authorization') === `Bearer ${secret}`
}

/**
 * Hourly: (optional) email ops when a roster link still has missing waivers ~1h before first session.
 * Disabled by default: staff policy is payment / completed-checkout notices plus one email when all roster waivers are in,
 * not waiver-adjacent digests. Re-enable only with explicit product approval.
 */
const SEND_PREMEETING_ROSTER_INCOMPLETE_ADMIN_EMAIL = false

export async function GET(req: Request) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!SEND_PREMEETING_ROSTER_INCOMPLETE_ADMIN_EMAIL) {
    return NextResponse.json({
      ok: true,
      remindersSent: 0,
      skipped: 'premeeting_incomplete_roster_admin_email_disabled',
    })
  }

  const now = Date.now()
  const origin = getSiteOrigin()
  const candidates = await listWaiverInvitesEligibleForPremeetingReminder()
  let sent = 0

  for (const inv of candidates) {
    const signed = await countWaiversForInviteId(inv.id)
    if (signed >= inv.expected_waiver_count) continue

    const date = inv.booking_rental_date?.trim()
    const win = inv.booking_rental_window?.trim()
    if (!date || !win) continue

    const slot = parseRentalTimeSlot(win)
    if (!slot) continue

    const hour24 = Math.floor(slot.startMinutes / 60) % 24
    const minute = slot.startMinutes % 60
    const start = utcInstantForLocalWallClock(date, hour24, minute, FACILITY_TIMEZONE)
    if (!start) continue

    const startMs = start.getTime()
    if (startMs <= now) continue

    const minutesUntil = (startMs - now) / 60_000
    if (minutesUntil < 55 || minutesUntil > 70) continue

    const missing = Math.max(0, inv.expected_waiver_count - signed)
    const sessionStartSummary = `${date} · ${formatMinutesAsUsTime(slot.startMinutes)} (${FACILITY_TIMEZONE})`

    try {
      await sendRosterInviteIncompletePremeetingAdminEmail({
        invite: inv,
        rosterWaiverUrl: `${origin}/rentals/waiver/${inv.token}`,
        signedCount: signed,
        missingCount: missing,
        sessionStartSummary,
      })
      const ok = await markRosterPremeetingIncompleteReminderSent(inv.id)
      if (ok) sent += 1
    } catch (e) {
      console.error('[cron roster-waiver-reminders] invite', inv.id, e)
    }
  }

  return NextResponse.json({
    ok: true,
    scanned: candidates.length,
    remindersSent: sent,
    timeZone: FACILITY_TIMEZONE,
  })
}
