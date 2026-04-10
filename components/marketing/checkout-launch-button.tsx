'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import type { CheckoutType } from '@/lib/stripe/checkout-types'

const primaryCtaClass =
  'inline-flex h-11 items-center justify-center border border-black/20 bg-formula-volt px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] !text-black transition-[filter] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50'

export type CheckoutSuccessNext = 'portal-assessment' | 'field-rental'

type Props = {
  checkoutType: CheckoutType
  label: string
  className?: string
  /** Allowed server values; extends Stripe success URL for post-checkout UX (e.g. portal assessment). */
  successNext?: CheckoutSuccessNext
  /** Merged into Stripe session metadata (string values only; server sanitizes). */
  metadata?: Record<string, string>
  /** Hide SMS opt-in toggle (default: show). Consent is still recorded as false when hidden. */
  hideSmsConsent?: boolean
}

export function CheckoutLaunchButton({
  checkoutType,
  label,
  className,
  successNext,
  metadata,
  hideSmsConsent = false,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [smsOptIn, setSmsOptIn] = useState(false)
  const [smsLegalOpen, setSmsLegalOpen] = useState(false)

  async function handleClick() {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: checkoutType,
          smsConsent: smsOptIn,
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
    <span className="inline-flex max-w-md flex-col gap-3">
      {!hideSmsConsent ? (
        <div
          className="cursor-pointer rounded-sm border border-formula-frost/14 bg-formula-paper/[0.03] p-4 transition-colors hover:border-formula-frost/22"
          onClick={() => setSmsLegalOpen(o => !o)}
        >
          <div className="flex items-start gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={smsOptIn}
              id="sms-consent-switch"
              aria-labelledby="sms-consent-label"
              onClick={e => {
                e.stopPropagation()
                setSmsOptIn(v => !v)
                setSmsLegalOpen(true)
              }}
              className={cn(
                'mt-0.5 flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border p-1 transition-colors',
                smsOptIn ? 'border-formula-volt/60 bg-formula-volt/25' : 'border-formula-frost/25 bg-formula-base/80'
              )}
            >
              <span
                className={cn(
                  'pointer-events-none h-5 w-5 shrink-0 rounded-full bg-formula-paper shadow-md ring-1 ring-black/5 transition-all duration-200 ease-out',
                  /* Knob flush left (off) / flush right (on) inside padded track */
                  smsOptIn ? 'ml-auto' : 'ml-0'
                )}
                aria-hidden
              />
            </button>
            <div className="min-w-0 flex-1 text-[13px] leading-relaxed text-formula-frost/88">
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium text-formula-paper" id="sms-consent-label">
                  SMS notifications (optional)
                </span>
                <ChevronDown
                  className={cn(
                    'mt-0.5 h-4 w-4 shrink-0 text-formula-mist transition-transform duration-200',
                    smsLegalOpen && 'rotate-180'
                  )}
                  aria-hidden
                />
              </div>
              <p className="mt-1 text-[11px] leading-snug text-formula-mist">
                Tap this box or the switch to read terms. Opt-in is optional.
              </p>
              {smsLegalOpen ? (
                <div
                  id="sms-consent-legal"
                  role="region"
                  aria-labelledby="sms-consent-label"
                  className="mt-3 border-t border-formula-frost/10 pt-3"
                  onClick={e => e.stopPropagation()}
                >
                  <p>
                    If you opt in, Formula Soccer Center may send text messages about your purchase, scheduling, and facility updates using{' '}
                    <a
                      href="https://www.twilio.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-formula-volt underline-offset-2 hover:underline"
                      onClick={e => e.stopPropagation()}
                    >
                      Twilio
                    </a>
                    , our messaging provider. Message and data rates may apply. Message frequency varies. Reply STOP to opt out, HELP for help. Opting in is not
                    required to complete your purchase.
                  </p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-formula-mist">
                    <Link
                      href={MARKETING_HREF.privacy}
                      className="text-formula-volt/90 underline-offset-2 hover:underline"
                      onClick={e => e.stopPropagation()}
                    >
                      Privacy policy
                    </Link>
                    <span className="mx-2 text-formula-frost/40">·</span>
                    <Link
                      href={MARKETING_HREF.terms}
                      className="text-formula-volt/90 underline-offset-2 hover:underline"
                      onClick={e => e.stopPropagation()}
                    >
                      Terms
                    </Link>
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
      <button type="button" disabled={loading} onClick={() => void handleClick()} className={cn(primaryCtaClass, className)}>
        {loading ? 'Redirecting…' : label}
      </button>
      {error ? <span className="max-w-xs font-mono text-[10px] text-red-300/95">{error}</span> : null}
    </span>
  )
}
