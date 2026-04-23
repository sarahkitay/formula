import { Resend } from 'resend'

let resendSingleton: Resend | null = null

/** Resend API key — try common env names (Vercel / .env). */
function getResendApiKey(): string | undefined {
  const candidates = [
    process.env.RESEND_API_KEY,
    process.env.RESEND_KEY,
    process.env.RESEND_SECRET_KEY,
  ]
  for (const c of candidates) {
    const t = c?.trim()
    if (t) return t
  }
  return undefined
}

function getResend(): Resend | null {
  const key = getResendApiKey()
  if (!key) return null
  if (!resendSingleton) resendSingleton = new Resend(key)
  return resendSingleton
}

/**
 * Ops inbox for all admin alerts (comma-separated).
 * Supports multiple env names so `ADMIN_NOTIFY_EMAIL`, `admin_notify_email`, etc. all work.
 */
function adminNotifyRaw(): string | undefined {
  const candidates = [
    process.env.ADMIN_NOTIFY_EMAIL,
    process.env.admin_notify_email,
    process.env.NOTIFY_ADMIN_EMAIL,
    process.env.OPS_NOTIFY_EMAIL,
    process.env.FORMULA_ADMIN_NOTIFY_EMAIL,
  ]
  for (const c of candidates) {
    const t = c?.trim()
    if (t) return t
  }
  return undefined
}

function adminRecipients(): string[] {
  const raw = adminNotifyRaw()
  if (!raw) return []
  return raw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
}

/**
 * Verified sender address in Resend (`Name <email@domain>` or plain email).
 */
function fromAddress(): string {
  const candidates = [
    process.env.RESEND_FROM_EMAIL,
    process.env.FROM_EMAIL,
    process.env.from_email,
    process.env.EMAIL_FROM,
  ]
  for (const c of candidates) {
    const t = c?.trim()
    if (t) return t
  }
  return 'onboarding@resend.dev'
}

/**
 * Server-only: notify operations inbox via Resend.
 *
 * **All** of these call this helper (same `ADMIN_NOTIFY_EMAIL` / aliases + `FROM` + API key):
 * - Field rental waiver submitted (`app/(site)/rentals/actions`)
 * - Paid Stripe checkout — assessment, field rental deposit, other types (`lib/email/stripe-checkout-paid-email` from webhook)
 * - Party deposit paid (`lib/email/party-booking-email`)
 * - Event request form (`app/(site)/events/actions`)
 * - Waitlist / marketing capture (`app/api/waitlist`)
 * - Parent block booking saved (`app/api/notify/parent-block-booking`)
 * - Parent portal signup after checkout (`app/api/parent/portal-signup`)
 *
 * **Env (set any one name per row; first match wins):**
 * - API key: `RESEND_API_KEY` (preferred) · `RESEND_KEY` · `RESEND_SECRET_KEY`
 * - Admin inbox(es): `ADMIN_NOTIFY_EMAIL` (preferred) · `admin_notify_email` · `NOTIFY_ADMIN_EMAIL` · `OPS_NOTIFY_EMAIL` · `FORMULA_ADMIN_NOTIFY_EMAIL` — comma-separated for multiple
 * - From: `RESEND_FROM_EMAIL` (preferred) · `FROM_EMAIL` · `from_email` · `EMAIL_FROM` — must be a verified sender/domain in Resend
 */
export async function sendAdminNotification(params: {
  subject: string
  html: string
  text?: string
}): Promise<void> {
  const resend = getResend()
  const to = adminRecipients()
  const from = fromAddress()

  if (!getResendApiKey()) {
    console.warn('[email] No Resend API key (RESEND_API_KEY / RESEND_KEY); skipped:', params.subject)
    return
  }
  if (!resend) {
    console.warn('[email] Resend client unavailable; skipped:', params.subject)
    return
  }
  if (to.length === 0) {
    console.warn('[email] No admin notify address (ADMIN_NOTIFY_EMAIL or admin_notify_email, etc.); skipped:', params.subject)
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

/** Customer-facing send (e.g. party receipt). Same Resend key + from address as admin notify. */
export async function sendTransactionalEmail(params: {
  to: string
  subject: string
  html: string
  text?: string
}): Promise<void> {
  const resend = getResend()
  const from = fromAddress()
  const to = params.to.trim()
  if (!getResendApiKey() || !resend || !to.includes('@')) {
    console.warn('[email] Skipped transactional send (no Resend key or invalid to):', params.subject)
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
