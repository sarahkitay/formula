import { NextResponse } from 'next/server'
import { deleteStripePurchaseById, listStripePurchasesAsPayments } from '@/lib/billing/stripe-purchases-server'

export const runtime = 'nodejs'

/** Admin UI: Checkout rows from `stripe_purchases` (service role), including field-rental deposits. */
export async function GET() {
  const payments = await listStripePurchasesAsPayments(600)
  return NextResponse.json({ payments })
}

/** Remove a ledger row only (no Stripe refund). */
export async function DELETE(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }
  const id = typeof (body as { id?: unknown }).id === 'string' ? (body as { id: string }).id.trim() : ''
  const result = await deleteStripePurchaseById(id)
  if (!result.ok) {
    const status = 'notFound' in result && result.notFound ? 404 : 400
    return NextResponse.json({ error: result.message }, { status })
  }
  return NextResponse.json({ ok: true })
}
