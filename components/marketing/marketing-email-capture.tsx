'use client'

import { useCallback, useId, useState } from 'react'
import { ScrollFadeIn } from '@/components/marketing/scroll-fade-in'
import { cn } from '@/lib/utils'

type Status = 'idle' | 'loading' | 'success' | 'error'

/**
 * Inline email capture before the closing “Start here” band — posts to `/api/waitlist` with source tagging.
 */
export function MarketingEmailCapture() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [hp, setHp] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const emailId = useId()
  const nameId = useId()

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (hp.trim()) return
      setStatus('loading')
      setMessage('')
      try {
        const res = await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            name: name.trim() || undefined,
            source: 'homepage-email',
          }),
        })
        const data = (await res.json()) as { ok?: boolean; error?: string }
        if (!res.ok || !data.ok) {
          setStatus('error')
          setMessage(data.error ?? 'Something went wrong')
          return
        }
        setStatus('success')
        setMessage("You're on the list. We'll be in touch.")
        setEmail('')
        setName('')
      } catch {
        setStatus('error')
        setMessage('Network error. Try again.')
      }
    },
    [email, name, hp]
  )

  return (
    <section
      className="border-t border-formula-frost/10 bg-formula-deep/30 py-14 md:py-16"
      aria-labelledby="marketing-email-capture-heading"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <ScrollFadeIn>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-formula-olive">Email</p>
          <h2
            id="marketing-email-capture-heading"
            className="mt-3 max-w-xl font-mono text-lg font-semibold tracking-tight text-formula-paper md:text-xl"
          >
            Get Formula updates
          </h2>
          <p className="mt-2 max-w-[46ch] text-[14px] leading-relaxed text-formula-frost/80">
            Openings, programs, and facility notes — low volume, no spam.
          </p>

          {status === 'success' ? (
            <p className="mt-6 text-sm leading-relaxed text-formula-frost/90" role="status">
              {message}
            </p>
          ) : (
            <form onSubmit={submit} className="mt-6 flex max-w-xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
              <div className="min-w-0 flex-1 sm:min-w-[200px]">
                <label htmlFor={emailId} className="sr-only">
                  Email
                </label>
                <input
                  id={emailId}
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full border border-formula-frost/14 bg-formula-base/80 px-3 py-2.5 font-sans text-sm text-formula-paper placeholder:text-formula-mist/50 focus:border-formula-volt/40 focus:outline-none focus:ring-1 focus:ring-formula-volt/30"
                />
              </div>
              <div className="min-w-0 flex-1 sm:min-w-[180px]">
                <label htmlFor={nameId} className="sr-only">
                  Name (optional)
                </label>
                <input
                  id={nameId}
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Name (optional)"
                  className="w-full border border-formula-frost/14 bg-formula-base/80 px-3 py-2.5 font-sans text-sm text-formula-paper placeholder:text-formula-mist/50 focus:border-formula-volt/40 focus:outline-none focus:ring-1 focus:ring-formula-volt/30"
                />
              </div>
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                value={hp}
                onChange={e => setHp(e.target.value)}
                className="sr-only"
                aria-hidden
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className={cn(
                  'h-11 shrink-0 border border-formula-volt/45 bg-formula-volt/[0.14] px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-volt transition-colors hover:bg-formula-volt/[0.22] disabled:opacity-50',
                  'sm:w-auto sm:self-end'
                )}
              >
                {status === 'loading' ? 'Sending…' : 'Subscribe'}
              </button>
              {status === 'error' ? <p className="w-full text-sm text-red-300/90 sm:order-last">{message}</p> : null}
            </form>
          )}
        </ScrollFadeIn>
      </div>
    </section>
  )
}
