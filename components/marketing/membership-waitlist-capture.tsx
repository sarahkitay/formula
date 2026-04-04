'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function MembershipWaitlistCapture({
  buttonClassName,
  label = 'Membership waitlist',
  source,
}: {
  buttonClassName: string
  label?: string
  /** Analytics / webhook: hero | start-here | pathways | youth-membership */
  source: string
}) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [hp, setHp] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const emailId = useId()
  const nameId = useId()

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  useEffect(() => {
    if (!open) {
      setStatus('idle')
      setMessage('')
    }
  }, [open])

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
            source,
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
    [email, name, hp, source]
  )

  return (
    <div ref={rootRef} className="relative inline-block text-left">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`waitlist-panel-${source}`}
        onClick={() => setOpen(o => !o)}
        className={buttonClassName}
      >
        {label}
      </button>

      {open ? (
        <div
          id={`waitlist-panel-${source}`}
          role="region"
          aria-label="Membership waitlist signup"
          className="absolute left-1/2 top-[calc(100%+0.5rem)] z-50 w-[min(calc(100vw-2rem),22rem)] -translate-x-1/2 border border-formula-frost/18 bg-formula-deep/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-md"
        >
          {status === 'success' ? (
            <p className="font-sans text-sm leading-relaxed text-formula-frost/90">{message}</p>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <p className="font-mono text-[9px] font-medium uppercase tracking-[0.2em] text-formula-mist">
                Join the waitlist
              </p>
              <div>
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
              <div>
                <label htmlFor={nameId} className="sr-only">
                  Parent or guardian name (optional)
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
                className="absolute h-0 w-0 opacity-0"
                aria-hidden
              />
              {status === 'error' ? <p className="text-sm text-red-300/90">{message}</p> : null}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full border border-formula-volt/45 bg-formula-volt/[0.15] py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-volt transition-colors hover:bg-formula-volt/[0.22] disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending…' : 'Request spot'}
              </button>
              <p className="font-sans text-[11px] leading-snug text-formula-mist/70">
                We’ll email you when capacity opens. No parent portal required yet.
              </p>
            </form>
          )}
        </div>
      ) : null}
    </div>
  )
}
