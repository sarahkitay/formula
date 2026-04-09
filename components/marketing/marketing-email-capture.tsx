'use client'

import { useCallback, useId, useState } from 'react'
import { ScrollFadeIn } from '@/components/marketing/scroll-fade-in'
import { cn } from '@/lib/utils'

type Status = 'idle' | 'loading' | 'success' | 'error'

/**
 * Site-wide email capture directly above the marketing footer; posts to `/api/waitlist` with source tagging.
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

  const labelClass =
    'mb-1.5 block text-center font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-formula-mist'

  return (
    <section
      className="border-t border-formula-frost/10 bg-formula-deep/30 py-14 md:py-16"
      aria-labelledby="marketing-email-capture-heading"
    >
      <div className="mx-auto max-w-[1200px] px-6 text-center">
        <ScrollFadeIn>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-formula-olive">Email</p>
          <h2
            id="marketing-email-capture-heading"
            className="mx-auto mt-3 max-w-xl font-mono text-lg font-semibold tracking-tight text-formula-paper md:text-xl"
          >
            Stay in the loop.
          </h2>
          <p className="mx-auto mt-2 max-w-[46ch] text-[14px] leading-relaxed text-formula-frost/80">
            Memberships are coming. So are new programs, clinic dates, and facility updates. Get notified first. No spam, low volume.
          </p>

          {status === 'success' ? (
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-formula-frost/90" role="status">
              {message}
            </p>
          ) : (
            <form
              onSubmit={submit}
              className="mx-auto mt-8 flex w-full max-w-lg flex-col items-center gap-4 sm:max-w-2xl sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-3 sm:gap-y-3"
            >
              <div className="w-full min-w-0 sm:w-auto sm:min-w-[220px] sm:flex-1 sm:max-w-[280px]">
                <label htmlFor={emailId} className={labelClass}>
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
                  placeholder="you@example.com"
                  className="w-full border border-formula-frost/14 bg-formula-base/80 px-3 py-2.5 text-center font-sans text-sm text-formula-paper placeholder:text-formula-mist/45 focus:border-formula-volt/40 focus:outline-none focus:ring-1 focus:ring-formula-volt/30 sm:text-left"
                />
              </div>
              <div className="w-full min-w-0 sm:w-auto sm:min-w-[200px] sm:flex-1 sm:max-w-[260px]">
                <label htmlFor={nameId} className={labelClass}>
                  Name <span className="normal-case tracking-normal text-formula-frost/55">(optional)</span>
                </label>
                <input
                  id={nameId}
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full border border-formula-frost/14 bg-formula-base/80 px-3 py-2.5 text-center font-sans text-sm text-formula-paper placeholder:text-formula-mist/45 focus:border-formula-volt/40 focus:outline-none focus:ring-1 focus:ring-formula-volt/30 sm:text-left"
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
              <div className="flex w-full justify-center sm:w-auto sm:shrink-0 sm:pt-[1.625rem]">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={cn(
                    'h-11 w-full max-w-xs border border-formula-volt/45 bg-formula-volt/[0.14] px-8 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-volt transition-colors hover:bg-formula-volt/[0.22] disabled:opacity-50',
                    'sm:w-auto sm:max-w-none'
                  )}
                >
                  {status === 'loading' ? 'Sending…' : 'Subscribe'}
                </button>
              </div>
              {status === 'error' ? (
                <p className="w-full text-center text-sm text-red-300/90 sm:basis-full">{message}</p>
              ) : null}
            </form>
          )}
        </ScrollFadeIn>
      </div>
    </section>
  )
}
