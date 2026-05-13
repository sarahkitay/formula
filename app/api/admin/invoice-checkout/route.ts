import { NextResponse } from 'next/server'
import { requireStaffRoles } from '@/lib/auth/require-staff-bearer'
import { createManualInvoiceCheckoutUrl } from '@/lib/stripe/manual-invoice-checkout'

export const runtime = 'nodejs'

/**
 * Admin: create a one-off Stripe Checkout URL for a custom invoice amount (server-validated; never trust client-only).
 */
export async function POST(req: Request) {
  const gate = await requireStaffRoles(req, ['admin', 'staff'])
  if (gate instanceof NextResponse) return gate

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const b = body as Record<string, unknown>
  const payeeName = typeof b.payeeName === 'string' ? b.payeeName.trim() : ''
  const memo = typeof b.memo === 'string' ? b.memo.trim() : ''
  const customerEmail = typeof b.customerEmail === 'string' ? b.customerEmail.trim().toLowerCase() : ''
  const waiverInviteIdRaw = typeof b.waiverInviteId === 'string' ? b.waiverInviteId.trim() : ''

  const amountUsdRaw = b.amountUsd ?? b.amount
  const amountUsd: string | number =
    typeof amountUsdRaw === 'string' || typeof amountUsdRaw === 'number' ? amountUsdRaw : ''

  const result = await createManualInvoiceCheckoutUrl({
    payeeName,
    amountUsd,
    memo,
    customerEmail,
    waiverInviteId: waiverInviteIdRaw || undefined,
  })

  if (!result.ok) {
    const status =
      result.message.includes('not configured') || result.message.includes('verify roster')
        ? 503
        : result.message.includes('Roster invite not found')
          ? 404
          : result.message.includes('Invalid roster')
            ? 400
            : result.message.includes('Bill-to')
              ? 400
              : result.message.includes('amount')
                ? 400
                : 502
    return NextResponse.json({ error: result.message }, { status })
  }

  return NextResponse.json({
    url: result.url,
    session_id: result.session_id,
  })
}
