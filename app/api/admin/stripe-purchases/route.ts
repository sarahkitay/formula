import { NextResponse } from 'next/server'
import { listStripePurchasesAsPayments } from '@/lib/billing/stripe-purchases-server'

export const runtime = 'nodejs'

/** Admin UI: Checkout rows from `stripe_purchases` (service role), including field-rental deposits. */
export async function GET() {
  const payments = await listStripePurchasesAsPayments(600)
  return NextResponse.json({ payments })
}
