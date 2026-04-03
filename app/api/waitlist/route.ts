import { NextResponse } from 'next/server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ ok: false, error: 'Invalid body' }, { status: 400 })
  }

  const { email, name, source, company } = body as Record<string, unknown>
  if (typeof company === 'string' && company.trim()) {
    return NextResponse.json({ ok: true })
  }
  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ ok: false, error: 'Valid email required' }, { status: 400 })
  }

  const payload = {
    email: email.trim().toLowerCase(),
    name: typeof name === 'string' ? name.trim().slice(0, 120) : undefined,
    source: typeof source === 'string' ? source.slice(0, 64) : 'unknown',
    at: new Date().toISOString(),
  }

  const webhook = process.env.WAITLIST_WEBHOOK_URL
  if (webhook) {
    try {
      const r = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!r.ok) {
        console.error('[waitlist] webhook failed', r.status)
        return NextResponse.json({ ok: false, error: 'Could not save request' }, { status: 502 })
      }
    } catch (e) {
      console.error('[waitlist] webhook error', e)
      return NextResponse.json({ ok: false, error: 'Could not save request' }, { status: 502 })
    }
  } else {
    console.info('[waitlist] capture (set WAITLIST_WEBHOOK_URL to persist)', payload)
  }

  return NextResponse.json({ ok: true })
}
