import { Resend } from 'resend'

let resendSingleton: Resend | null = null

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim()
  if (!key) return null
  if (!resendSingleton) resendSingleton = new Resend(key)
  return resendSingleton
}

/** Comma-separated list in `ADMIN_NOTIFY_EMAIL` */
function adminRecipients(): string[] {
  const raw = process.env.ADMIN_NOTIFY_EMAIL?.trim()
  if (!raw) return []
  return raw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
}

/**
 * Server-only: notify operations inbox (bookings, forms, signups, paid checkouts).
 *
 * Env (Vercel / `.env.local`):
 * - `RESEND_API_KEY` — required to send
 * - `ADMIN_NOTIFY_EMAIL` — comma-separated inbox(es), e.g. `ops@example.com,admin@example.com`
 * - `RESEND_FROM_EMAIL` — optional; default `onboarding@resend.dev` (Resend test sender)
 */
export async function sendAdminNotification(params: {
  subject: string
  html: string
  text?: string
}): Promise<void> {
  const resend = getResend()
  const to = adminRecipients()
  const from = process.env.RESEND_FROM_EMAIL?.trim() || 'onboarding@resend.dev'

  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set; skipped:', params.subject)
    return
  }
  if (to.length === 0) {
    console.warn('[email] ADMIN_NOTIFY_EMAIL not set; skipped:', params.subject)
    return
  }

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      subject: params.subject,
      html: params.html,
      ...(params.text ? { text: params.text } : {}),
    })
    if (error) console.error('[email] Resend API error:', error.message)
  } catch (e) {
    console.error('[email] Resend send failed:', e)
  }
}

/** One-off transactional send (e.g. customer receipt). Same Resend + from as admin notify. */
export async function sendTransactionalEmail(params: {
  to: string
  subject: string
  html: string
  text?: string
}): Promise<void> {
  const resend = getResend()
  const from = process.env.RESEND_FROM_EMAIL?.trim() || 'onboarding@resend.dev'
  const to = params.to.trim()
  if (!resend || !to.includes('@')) {
    console.warn('[email] Skipped transactional send (no Resend or invalid to):', params.subject)
    return
  }
  try {
    const { error } = await resend.emails.send({
      from,
      to,
      subject: params.subject,
      html: params.html,
      ...(params.text ? { text: params.text } : {}),
    })
    if (error) console.error('[email] Resend transactional error:', error.message)
  } catch (e) {
    console.error('[email] Transactional send failed:', e)
  }
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
