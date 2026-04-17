import { NextResponse } from 'next/server'
import { listStripePurchasesAsPayments } from '@/lib/billing/stripe-purchases-server'

export const runtime = 'nodejs'

/** Admin UI: completed Checkout rows from `stripe_purchases` (service role). */
export async function GET() {
  const payments = await listStripePurchasesAsPayments(300)
  return NextResponse.json({ payments })
}
