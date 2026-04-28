import { NextResponse } from 'next/server'
import { recordAdminScheduleLedgerPayment } from '@/lib/stripe/record-purchase'

export const runtime = 'nodejs'

type Body = {
  amountCents?: unknown
  currency?: unknown
  email?: unknown
  payeeName?: unknown
  notes?: unknown
  weekStart?: unknown
  blockSummary?: unknown
}

/** Admin: record cash / in-person payment for schedule ops → `stripe_purchases` (`manual-invoice`). */
export async function POST(req: Request) {
  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const amountCents = typeof body.amountCents === 'number' ? body.amountCents : Number(body.amountCents)
  const currency = typeof body.currency === 'string' && body.currency.trim() ? body.currency.trim() : 'usd'
  const email = typeof body.email === 'string' ? body.email.trim() || null : null
  const payeeName = typeof body.payeeName === 'string' ? body.payeeName : ''
  const notes = typeof body.notes === 'string' ? body.notes : null
  const weekStart = typeof body.weekStart === 'string' ? body.weekStart.trim() : ''
  const blockSummary = typeof body.blockSummary === 'string' ? body.blockSummary.trim() : ''

  const metadataExtra: Record<string, string> = {}
  if (weekStart) metadataExtra.admin_schedule_week_start = weekStart
  if (blockSummary) metadataExtra.admin_schedule_block = blockSummary.slice(0, 500)

  const result = await recordAdminScheduleLedgerPayment({
    amountCents,
    currency,
    email,
    payeeName,
    notes,
    metadataExtra,
  })

  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 400 })
  }
  return NextResponse.json({ ok: true, stripe_session_id: result.stripe_session_id })
}
