'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MARKETING_HREF } from '@/lib/marketing/nav'

type SignupMode = 'checkout_session' | 'booking_email'

export function OrganizerSignupClient() {
  const searchParams = useSearchParams()
  const sessionIdFromQuery = searchParams.get('session_id')?.trim() ?? ''
  const [mode, setMode] = useState<SignupMode>(() => (sessionIdFromQuery.startsWith('cs_') ? 'checkout_session' : 'booking_email'))
  const [sessionId, setSessionId] = useState(sessionIdFromQuery)
  const [bookingEmail, setBookingEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!sessionIdFromQuery.startsWith('cs_')) return
    setSessionId(sessionIdFromQuery)
    setMode('checkout_session')
  }, [sessionIdFromQuery])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setSubmitting(true)
    try {
      const body =
        mode === 'checkout_session'
          ? { sessionId: sessionId.trim(), password }
          : { bookingEmail: bookingEmail.trim(), password }
      const res = await fetch('/api/organizer/field-rental-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = (await res.json()) as { error?: string; ok?: boolean }
      if (!res.ok) {
        setError(data.error ?? 'Signup failed')
        return
      }
      setMessage('Account created. You can sign in on the next screen.')
      setPassword('')
    } catch {
      setError('Network error. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-formula-mist">Field rental</p>
      <h1 className="mt-4 font-mono text-2xl font-semibold tracking-tight text-formula-paper">Create organizer log-in</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-formula-frost/85">
        Link your <strong className="text-formula-paper">organizer</strong> account so the hub can list roster waiver links and progress for your rentals. After
        this step, use <strong className="text-formula-paper">Renter / organizer</strong> on{' '}
        <Link href="/login?role=organizer" className="text-formula-volt underline-offset-2 hover:underline">
          /login
        </Link>
        .
      </p>
      <div className="not-prose mt-6">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-formula-mist">How did you pay?</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode('checkout_session')}
            className={cn(
              'rounded-md border px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors',
              mode === 'checkout_session'
                ? 'border-formula-volt/50 bg-formula-volt/15 text-formula-paper'
                : 'border-formula-frost/18 bg-formula-paper/[0.04] text-formula-mist hover:border-formula-frost/28'
            )}
          >
            Field-rental checkout
          </button>
          <button
            type="button"
            onClick={() => setMode('booking_email')}
            className={cn(
              'rounded-md border px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors',
              mode === 'booking_email'
                ? 'border-formula-volt/50 bg-formula-volt/15 text-formula-paper'
                : 'border-formula-frost/18 bg-formula-paper/[0.04] text-formula-mist hover:border-formula-frost/28'
            )}
          >
            Invoice / other payment
          </button>
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-formula-mist/90">
          {mode === 'checkout_session'
            ? 'Use the session id from your field-rental success URL or receipt (starts with cs_).'
            : 'Use the same email we have on your field-rental roster invite (often the address on your invoice). No Stripe session id needed.'}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="not-prose mt-6 space-y-4">
        {mode === 'checkout_session' ? (
          <div>
            <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-formula-mist">Stripe checkout session id</label>
            <input
              value={sessionId}
              onChange={e => setSessionId(e.target.value)}
              placeholder="cs_…"
              required={mode === 'checkout_session'}
              autoComplete="off"
              className="mt-2 h-11 w-full rounded-md border border-formula-frost/16 bg-formula-paper/[0.05] px-3 font-mono text-[13px] text-formula-paper placeholder:text-formula-mist/70"
            />
            <p className="mt-1.5 text-[12px] text-formula-mist/90">From your payment success URL or Stripe receipt (starts with cs_).</p>
          </div>
        ) : (
          <div>
            <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-formula-mist">Booking email</label>
            <input
              type="email"
              value={bookingEmail}
              onChange={e => setBookingEmail(e.target.value)}
              placeholder="you@example.com"
              required={mode === 'booking_email'}
              autoComplete="email"
              className="mt-2 h-11 w-full rounded-md border border-formula-frost/16 bg-formula-paper/[0.05] px-3 text-[13px] text-formula-paper placeholder:text-formula-mist/70"
            />
            <p className="mt-1.5 text-[12px] text-formula-mist/90">
              Must match the payer / organizer email on your field-rental roster invite so we can attach waivers and rental details after you sign in.
            </p>
          </div>
        )}
        <div>
          <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-formula-mist">Password (min 8 characters)</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-2 h-11 w-full rounded-md border border-formula-frost/16 bg-formula-paper/[0.05] px-3 text-formula-paper placeholder:text-formula-mist/70"
          />
        </div>
        {error ? <p className="text-sm text-red-300/90">{error}</p> : null}
        {message ? <p className="text-sm text-formula-volt/95">{message}</p> : null}
        <Button type="submit" variant="primary" size="lg" loading={submitting} className="w-full">
          Create account
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-formula-mist">
        <Link href="/login?role=organizer" className="text-formula-volt underline-offset-2 hover:underline">
          Already have a password? Sign in
        </Link>
        {' · '}
        <Link href={MARKETING_HREF.bookAssessmentPortal} className="text-formula-volt underline-offset-2 hover:underline">
          Booking hub
        </Link>
      </p>
    </>
  )
}
