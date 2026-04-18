import type Stripe from 'stripe'
import { escapeHtml, sendAdminNotification, sendTransactionalEmail } from '@/lib/email/send-admin-notification'

function row(k: string, v: string): string {
  return `<tr><td style="padding:6px 10px;border:1px solid #333;font-weight:bold">${escapeHtml(k)}</td><td style="padding:6px 10px;border:1px solid #333">${escapeHtml(v)}</td></tr>`
}

export async function sendPartyBookingEmails(session: Stripe.Checkout.Session, bookingId: string): Promise<void> {
  const m = session.metadata ?? {}
  const email = session.customer_details?.email ?? session.customer_email ?? m.party_contact_email ?? ''
  const amount = session.amount_total != null ? (session.amount_total / 100).toFixed(2) : '1000.00'

  const bodyRows = [
    row('Booking id', bookingId),
    row('Stripe session', session.id),
    row('Amount', `$${amount} USD`),
    row('Contact name', m.party_contact_name ?? ''),
    row('Contact email', email),
    row('Contact phone', m.party_contact_phone ?? '—'),
    row('Party preferred date', m.party_preferred_date ?? ''),
    row('Party guest count', m.party_guest_count ?? ''),
    row('Birthday child / honoree', m.party_child_name ?? '—'),
    row('Party notes', m.party_notes ?? '—'),
    row('Rental field', m.rental_field ?? ''),
    row('Rental session date', m.rental_date ?? ''),
    row('Rental time window', m.rental_time_slot ?? ''),
    row('Rental headcount', m.rental_headcount ?? ''),
    row('Organization', m.rental_org ?? '—'),
    row('Rental notes', m.rental_notes ?? '—'),
  ].join('')

  const html = `
    <p><strong>Party deposit paid</strong> — follow up to confirm schedule and any balance.</p>
    <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">${bodyRows}</table>
  `

  await sendAdminNotification({
    subject: `[Formula] Party booking paid · $${amount} · ${escapeHtml(m.party_contact_name ?? 'Guest')}`,
    html,
    text: `Party paid $${amount}\nBooking id: ${bookingId}\nSession: ${session.id}\nEmail: ${email}`,
  })

  if (email.includes('@')) {
    await sendTransactionalEmail({
      to: email,
      subject: `Formula — we received your party deposit ($${amount})`,
      html: `
        <p>Hi ${escapeHtml(m.party_contact_name ?? 'there')},</p>
        <p>Thanks for your <strong>$${amount}</strong> party deposit. Our team will confirm your date, headcount, and field window shortly.</p>
        <p><strong>What you submitted</strong></p>
        <table style="border-collapse:collapse;font-size:13px">${bodyRows}</table>
        <p style="margin-top:16px;font-size:12px;color:#555">Reference: ${escapeHtml(bookingId)}</p>
      `,
      text: `Thanks — we received your party deposit of $${amount}. Reference: ${bookingId}. We'll be in touch.`,
    })
  }
}
