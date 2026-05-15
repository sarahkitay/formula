import type Stripe from 'stripe'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import {
  isSummerCampEarlyRegistrationActive,
  SUMMER_CAMP_2026_EARLY_DISCOUNT_USD,
  SUMMER_CAMP_2026_MONTH_BUNDLE_CHECKOUT,
  SUMMER_CAMP_2026_WEEK_CHECKOUT,
} from '@/lib/marketing/public-pricing'
import { getSummerCampWeekRow, SUMMER_CAMP_2026, type SummerCampMonthBundleId } from '@/lib/marketing/summer-camp-2026-data'
import { getSiteOrigin } from '@/lib/site-origin'
import { escapeHtml, sendTransactionalEmail } from '@/lib/email/send-admin-notification'

function monthBundleLabel(bundle: string): string {
  if (bundle === 'weeks-1-4') return 'Weeks 1–4 (June block)'
  if (bundle === 'weeks-5-8') return 'Weeks 5–8 (July–August block)'
  return bundle
}

/** Customer confirmation after paid Summer Camp 2026 Checkout (webhook). */
export async function sendSummerCampCheckoutConfirmationEmail(session: Stripe.Checkout.Session): Promise<void> {
  const type = session.metadata?.type
  if (type !== 'summer-camp-week-495' && type !== 'summer-camp-month-1780') return

  const to =
    (session.customer_details?.email ?? session.customer_email ?? '').trim().toLowerCase()
  if (!to.includes('@')) {
    console.warn('[summer-camp email] No customer email on session', session.id)
    return
  }

  const m = session.metadata ?? {}
  const guardian = (m.sc_guardian_name ?? '').trim()
  const athletes = (m.sc_athlete_names ?? '').trim()
  const weekNum = parseInt(m.sc_week_number ?? '', 10)
  const bundle = (m.sc_month_bundle ?? '').trim() as SummerCampMonthBundleId | ''

  const amount =
    session.amount_total != null ? (session.amount_total / 100).toFixed(2) : '—'
  const currency = (session.currency ?? 'usd').toUpperCase()
  const paidAt = new Date((session.created ?? 0) * 1000)
  const early = isSummerCampEarlyRegistrationActive(paidAt)
  const listWeek = SUMMER_CAMP_2026_WEEK_CHECKOUT.priceUsd
  const listBundle = SUMMER_CAMP_2026_MONTH_BUNDLE_CHECKOUT.priceUsd

  let selectionHtml = ''
  let selectionText = ''
  if (type === 'summer-camp-week-495' && Number.isFinite(weekNum)) {
    const row = getSummerCampWeekRow(weekNum)
    const theme = row ? escapeHtml(row.themeTitle) : ''
    const dates = row ? escapeHtml(row.datesLabel) : ''
    selectionHtml = `<li><strong>Week</strong>: ${weekNum}${row ? ` · ${dates} · ${theme}` : ''}</li>`
    selectionText = `Week: ${weekNum}${row ? ` · ${row.datesLabel} · ${row.themeTitle}` : ''}`
  } else if (type === 'summer-camp-month-1780' && bundle) {
    const label = monthBundleLabel(bundle)
    selectionHtml = `<li><strong>Bundle</strong>: ${escapeHtml(label)}</li>`
    selectionText = `Bundle: ${label}`
  }

  const origin = getSiteOrigin()
  const campUrl = `${origin}${MARKETING_HREF.summerCamp2026}`

  const pricingNote =
    type === 'summer-camp-week-495'
      ? early
        ? `You received the early registration rate ($${SUMMER_CAMP_2026_EARLY_DISCOUNT_USD} off the standard $${listWeek} week tuition).`
        : `Standard week tuition ($${listWeek}).`
      : early
        ? `You received the early registration rate ($${SUMMER_CAMP_2026_EARLY_DISCOUNT_USD} off the standard $${listBundle} bundle tuition).`
        : `Standard four-week bundle tuition ($${listBundle}).`

  const referenceLine = escapeHtml(
    typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id ?? session.id
  )

  const html = `
    <p>Hi ${escapeHtml(guardian || 'there')},</p>
    <p>Thank you for registering for <strong>${escapeHtml(SUMMER_CAMP_2026.seasonLabel)}</strong>. This email confirms we received your payment.</p>
    <h2 style="font-size:16px;margin:20px 0 8px">Receipt summary</h2>
    <ul>
      <li><strong>Amount paid</strong>: $${escapeHtml(amount)} ${escapeHtml(currency)}</li>
      <li><strong>Stripe Checkout session</strong>: ${escapeHtml(session.id)}</li>
      <li><strong>Payment reference</strong>: ${referenceLine}</li>
      ${selectionHtml}
      <li><strong>Athlete name(s)</strong>: ${escapeHtml(athletes || '—')}</li>
    </ul>
    <p>${escapeHtml(pricingNote)} Your official Stripe receipt was sent to this address as well.</p>
    <h2 style="font-size:16px;margin:20px 0 8px">Camp details</h2>
    <ul>
      <li><strong>Schedule</strong>: Mon–Fri · ${escapeHtml(SUMMER_CAMP_2026.dayHours)}</li>
      <li><strong>Ages</strong>: ${escapeHtml(SUMMER_CAMP_2026.ageRange)}</li>
      <li><strong>Capacity note</strong>: ${escapeHtml(SUMMER_CAMP_2026.capacityNote)}</li>
      <li><strong>Questions</strong>: ${escapeHtml(SUMMER_CAMP_2026.inquiriesEmail)}</li>
    </ul>
    <p>Staff will confirm age group, roster, and final placement after payment. You can review themes and dates anytime on the <a href="${escapeHtml(campUrl)}">summer camp page</a>.</p>
    <p style="margin-top:24px;color:#555;font-size:13px">Formula Soccer Center · ${escapeHtml(SUMMER_CAMP_2026.seasonLabel)}</p>
  `

  const text = [
    `Hi ${guardian || 'there'},`,
    '',
    `Thank you for registering for ${SUMMER_CAMP_2026.seasonLabel}.`,
    '',
    'Receipt summary',
    `- Amount paid: $${amount} ${currency}`,
    `- Stripe session: ${session.id}`,
    selectionText,
    `- Athlete name(s): ${athletes || '—'}`,
    '',
    pricingNote,
    '',
    'Camp details',
    `- Mon–Fri · ${SUMMER_CAMP_2026.dayHours}`,
    `- ${SUMMER_CAMP_2026.ageRange}`,
    `- ${SUMMER_CAMP_2026.capacityNote}`,
    `- Questions: ${SUMMER_CAMP_2026.inquiriesEmail}`,
    '',
    `Camp page: ${campUrl}`,
  ]
    .filter(Boolean)
    .join('\n')

  await sendTransactionalEmail({
    to,
    subject: `[Formula] Summer Camp 2026 registration · receipt · $${amount} ${currency}`,
    html,
    text,
  })
}
