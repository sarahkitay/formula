import type Stripe from 'stripe'
import { escapeHtml, sendAdminNotification } from '@/lib/email/send-admin-notification'

function metaLines(session: Stripe.Checkout.Session): string {
  const m = session.metadata ?? {}
  const rows = Object.entries(m).map(([k, v]) => `<tr><td style="padding:4px 8px;border:1px solid #333">${escapeHtml(k)}</td><td style="padding:4px 8px;border:1px solid #333">${escapeHtml(String(v))}</td></tr>`)
  return rows.length ? `<table style="border-collapse:collapse">${rows.join('')}</table>` : '<p><em>No metadata</em></p>'
}

/** One email per paid Checkout completion (webhook). */
export async function sendStripeCheckoutPaidAdminEmail(session: Stripe.Checkout.Session): Promise<void> {
  const email = session.customer_details?.email ?? session.customer_email ?? ''
  const amount = session.amount_total != null ? (session.amount_total / 100).toFixed(2) : '—'
  const currency = (session.currency ?? 'usd').toUpperCase()

  await sendAdminNotification({
    subject: `[Formula] Paid checkout · ${escapeHtml(session.metadata?.type ?? 'unknown')} · $${amount} ${currency}`,
    html: `
      <p><strong>Stripe Checkout completed</strong></p>
      <ul>
        <li><strong>Session</strong>: ${escapeHtml(session.id)}</li>
        <li><strong>Customer email</strong>: ${escapeHtml(email || '—')}</li>
        <li><strong>Amount</strong>: ${escapeHtml(amount)} ${escapeHtml(currency)}</li>
        <li><strong>Payment status</strong>: ${escapeHtml(session.payment_status)}</li>
      </ul>
      <p><strong>Metadata</strong></p>
      ${metaLines(session)}
    `,
    text: `Paid checkout\nSession: ${session.id}\nEmail: ${email}\nAmount: ${amount} ${currency}\nType: ${session.metadata?.type ?? 'unknown'}`,
  })
}
