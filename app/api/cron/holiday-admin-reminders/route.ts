import { NextResponse } from 'next/server'
import { escapeHtml, sendAdminNotification } from '@/lib/email/send-admin-notification'
import { holidaysDueForLeadReminder, ymdTodayInTimeZone } from '@/lib/schedule/us-major-holidays'

export const runtime = 'nodejs'

/** Days ahead of each holiday to email admin (Los Angeles calendar dates). */
const LEAD_DAYS = 30
const TZ = 'America/Los_Angeles'

function authorizeCron(req: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret) return false
  return req.headers.get('authorization') === `Bearer ${secret}`
}

/**
 * Daily cron: when “today” in LA is exactly 30 days before a major holiday, email admin via Resend.
 *
 * Configure on Vercel: set `CRON_SECRET`, add Cron in dashboard or `vercel.json` pointing here.
 * Manual: `curl -H "Authorization: Bearer $CRON_SECRET" https://…/api/cron/holiday-admin-reminders`
 */
export async function GET(req: Request) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = ymdTodayInTimeZone(TZ)
  const due = holidaysDueForLeadReminder(today, LEAD_DAYS)

  for (const h of due) {
    const subject = `[Formula] ${h.name} in 30 days (${h.ymd}) — plan a special event`
    const html = `<p>Hi team,</p>
<p><strong>${escapeHtml(h.name)}</strong> is <strong>30 days away</strong> (date <strong>${escapeHtml(h.ymd)}</strong> on the ${escapeHtml(TZ)} calendar).</p>
<p>Please put together a plan for any <strong>special event</strong>, promotion, staffing, or programming you want around this holiday.</p>
<p style="margin-top:16px;font-size:12px;color:#64748b">Automated reminder from Formula.</p>`
    const text = `${h.name} is 30 days away (${h.ymd}, ${TZ}). Please plan for any special event or programming.`
    await sendAdminNotification({ subject, html, text })
  }

  return NextResponse.json({ ok: true, today, leadDays: LEAD_DAYS, reminders: due.length })
}
