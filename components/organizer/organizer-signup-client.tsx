'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MARKETING_HREF } from '@/lib/marketing/nav'

export function OrganizerSignupClient() {
  const searchParams = useSearchParams()
  const sessionIdFromQuery = searchParams.get('session_id')?.trim() ?? ''
  const [sessionId, setSessionId] = useState(sessionIdFromQuery)
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/organizer/field-rental-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessionId.trim(), password }),
      })
      const data = (await res.json()) as { error?: string; ok?: boolean }
      if (!res.ok) {
        setError(data.error ?? 'Signup failed')
        return
      }
      setMessage('Account created. You can sign in on the next screen.')
      setPassword('')
    } catch {
      setError('Network error — try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-formula-mist">Field rental</p>
      <h1 className="mt-4 font-mono text-2xl font-semibold tracking-tight text-formula-paper">Create organizer log-in</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-formula-frost/85">
        Use the same email Stripe captured on your paid field-rental checkout. After this step, open <strong className="text-formula-paper">Renter / organizer</strong> on{' '}
        <Link href="/login?role=organizer" className="text-formula-volt underline-offset-2 hover:underline">
          /login
        </Link>{' '}
        to see roster links and waiver progress.
      </p>
      <form onSubmit={handleSubmit} className="not-prose mt-8 space-y-4">
        <div>
          <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-formula-mist">Stripe checkout session id</label>
          <input
            value={sessionId}
            onChange={e => setSessionId(e.target.value)}
            placeholder="cs_…"
            required
            className="mt-2 h-11 w-full rounded-md border border-formula-frost/16 bg-formula-paper/[0.05] px-3 font-mono text-[13px] text-formula-paper placeholder:text-formula-mist/70"
          />
          <p className="mt-1.5 text-[12px] text-formula-mist/90">From your payment success URL or Stripe receipt (starts with cs_).</p>
        </div>
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
