'use client'

import { useCallback, useEffect, useState } from 'react'

type ApiOk = {
  token: string
  waiver_url: string
  expected_waiver_count: number
}

export function CheckoutFieldRentalWaiverLink({ sessionId }: { sessionId: string }) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'wrong_type'>('loading')
  const [payload, setPayload] = useState<ApiOk | null>(null)
  const [copied, setCopied] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

    ;(async () => {
      try {
        for (let attempt = 0; attempt < 8; attempt += 1) {
          if (cancelled) return
          const res = await fetch('/api/field-rental/waiver-invite-by-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId }),
          })
          const data = (await res.json()) as ApiOk & { error?: string }
          if (cancelled) return
          if (res.status === 400 && data.error === 'not_field_rental_checkout') {
            setStatus('wrong_type')
            return
          }
          if (res.status === 409 && data.error === 'checkout_not_paid') {
            await sleep(900 + attempt * 400)
            continue
          }
          if (!res.ok) {
            setStatus('error')
            setMessage(data.error ?? 'Could not load waiver link')
            return
          }
          setPayload({
            token: data.token,
            waiver_url: data.waiver_url,
            expected_waiver_count: data.expected_waiver_count,
          })
          setStatus('ready')
          return
        }
        if (!cancelled) {
          setStatus('error')
          setMessage('Payment is still confirming. Refresh this page in a moment or open Field rentals from the email receipt.')
        }
      } catch {
        if (!cancelled) {
          setStatus('error')
          setMessage('Network error')
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [sessionId])

  const copy = useCallback(async () => {
    if (!payload?.waiver_url) return
    try {
      await navigator.clipboard.writeText(payload.waiver_url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setMessage('Copy failed — select the link and copy manually.')
    }
  }, [payload])

  if (status === 'wrong_type') return null

  if (status === 'loading') {
    return (
      <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.14em] text-formula-mist">Loading roster waiver link…</p>
    )
  }

  if (status === 'error' || !payload) {
    return (
      <div className="not-prose mt-8 rounded-sm border border-formula-frost/14 bg-formula-paper/[0.03] p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-formula-mist">Roster waiver link</p>
        <p className="mt-2 text-sm text-red-300/90">{message ?? 'Something went wrong'}</p>
      </div>
    )
  }

  return (
    <div className="not-prose mt-8 rounded-sm border border-formula-frost/14 bg-formula-paper/[0.03] p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-formula-mist">Share with participants</p>
      <p className="mt-2 text-sm leading-relaxed text-formula-frost/88">
        Send this link so each person can sign the field rental waiver. Admin tracks progress until{' '}
        <strong className="text-formula-paper">{payload.expected_waiver_count}</strong> waivers are received.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <code className="max-w-full break-all rounded border border-formula-frost/12 bg-black/25 px-2 py-1.5 font-mono text-[11px] text-formula-frost/90">
          {payload.waiver_url}
        </code>
      </div>
      <button
        type="button"
        onClick={() => void copy()}
        className="mt-4 inline-flex h-10 items-center border border-black/20 bg-formula-volt px-5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-black hover:brightness-105"
      >
        {copied ? 'Copied' : 'Copy link'}
      </button>
    </div>
  )
}
