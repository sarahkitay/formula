import { NextResponse } from 'next/server'

/** Future: Stripe webhooks, scanner ingest, etc. */
export function GET() {
  return NextResponse.json({ ok: true, service: 'formula-api', ts: new Date().toISOString() })
}
