'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { CheckoutType } from '@/lib/stripe/checkout-types'

const primaryCtaClass =
  'inline-flex h-11 items-center justify-center border border-black/20 bg-formula-volt px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] !text-black transition-[filter] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50'

type Props = {
  checkoutType: CheckoutType
  label: string
  className?: string
  /** Allowed server values — extends Stripe success URL for post-checkout UX (e.g. portal assessment). */
  successNext?: 'portal-assessment'
  /** Merged into Stripe session metadata (string values only; server sanitizes). */
  metadata?: Record<string, string>
}

export function CheckoutLaunchButton({ checkoutType, label, className, successNext, metadata }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: checkoutType,
          ...(successNext ? { successNext } : {}),
          ...(metadata && Object.keys(metadata).length > 0 ? { metadata } : {}),
        }),
      })
      const data = (await res.json()) as { url?: string; error?: string }
      if (!res.ok) {
        throw new Error(data.error ?? 'Checkout failed')
      }
      if (data.url) {
        window.location.href = data.url
        return
      }
      throw new Error('No checkout URL returned')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <span className="inline-flex flex-col gap-1">
      <button type="button" disabled={loading} onClick={() => void handleClick()} className={cn(primaryCtaClass, className)}>
        {loading ? 'Redirecting…' : label}
      </button>
      {error ? <span className="max-w-xs font-mono text-[10px] text-red-300/95">{error}</span> : null}
    </span>
  )
}
