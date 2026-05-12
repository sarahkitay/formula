'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Mail, MessageSquare, Copy, Check, CreditCard, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import type { WaiverInviteWithProgress } from '@/lib/rentals/waiver-invites-server'
import { formatRosterInviteBookingSummary } from '@/lib/rentals/field-rental-agreement-admin-display'
import { staffApiFetch } from '@/lib/auth/staff-api-fetch'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

function normalizeSmsAddress(raw: string): string | null {
  const t = raw.trim()
  const digits = t.replace(/\D/g, '')
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  if (t.startsWith('+') && digits.length >= 10) return `+${digits}`
  return null
}

function clientAmountLooksValid(amountRaw: string): boolean {
  const cleaned = amountRaw.replace(/[$,\s]/g, '').trim()
  if (!cleaned) return false
  const n = parseFloat(cleaned)
  if (!Number.isFinite(n) || n < 0.5) return false
  if (n > 100_000) return false
  return true
}

function trimMemo(s: string, max: number): string {
  const t = s.trim()
  if (t.length <= max) return t
  return `${t.slice(0, Math.max(0, max - 1))}…`
}

function sessionLineForInvite(inv: WaiverInviteWithProgress): string {
  return formatRosterInviteBookingSummary({
    booking_rental_field: inv.booking_rental_field ?? null,
    booking_rental_window: inv.booking_rental_window ?? null,
    booking_rental_date: inv.booking_rental_date ?? null,
    booking_rental_dates_compact: inv.booking_rental_dates_compact ?? null,
    booking_session_weeks: inv.booking_session_weeks ?? null,
    expected_waiver_count: inv.expected_waiver_count,
  })
}

function defaultPayeeName(inv: WaiverInviteWithProgress): string {
  const n = inv.purchaser_name?.trim()
  if (n && n.length >= 2) return n
  const e = inv.purchaser_email?.trim()
  if (e) {
    const local = e.split('@')[0]?.trim()
    if (local && local.length >= 2) return local
  }
  return 'Rental customer'
}

function defaultAmountUsd(inv: WaiverInviteWithProgress): string {
  if (inv.checkout_amount_total_cents != null && inv.checkout_amount_total_cents > 0) {
    return (inv.checkout_amount_total_cents / 100).toFixed(2)
  }
  return ''
}

function defaultMemo(inv: WaiverInviteWithProgress, siteOrigin: string): string {
  const session = sessionLineForInvite(inv)
  const waiverUrl = `${siteOrigin}/rentals/waiver/${inv.token}`
  const parts = [`Session: ${session}`, `Roster waivers (share): ${waiverUrl}`, `Roster invite id: ${inv.id}`]
  return trimMemo(parts.join('\n'), 450)
}

function buildShareBody(params: {
  payeeName: string
  amount: string
  memo: string
  paymentUrl?: string | null
}): string {
  const who = params.payeeName.trim() || '___'
  const amt = params.amount.trim() || '___'
  const lines = ['Formula field rental payment', `Amount: ${amt}`, `Bill to: ${who}`]
  if (params.memo.trim()) lines.push('', params.memo.trim())
  if (params.paymentUrl?.trim()) lines.push('', 'Pay online (secure):', params.paymentUrl.trim())
  return lines.join('\n')
}

function buildSubject(payeeName: string, amount: string): string {
  const who = payeeName.trim() || 'Customer'
  const amt = amount.trim() || 'Amount TBD'
  return `Formula field rental - ${who} - ${amt}`
}

const btnClass =
  'inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border px-4 text-[13px] font-medium transition-colors sm:w-auto sm:min-h-10'

type Props = {
  invites: WaiverInviteWithProgress[]
  siteOrigin: string
}

export function RentalRosterPaymentLinkForm({ invites, siteOrigin }: Props) {
  const [inviteId, setInviteId] = useState(() => invites[0]?.id ?? '')
  const [payeeName, setPayeeName] = useState('')
  const [amount, setAmount] = useState('')
  const [memo, setMemo] = useState('')
  const [emailTo, setEmailTo] = useState('')
  const [phoneTo, setPhoneTo] = useState('')
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const [linkLoading, setLinkLoading] = useState(false)
  const [linkError, setLinkError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [copiedPayUrl, setCopiedPayUrl] = useState(false)

  const selected = useMemo(() => invites.find(i => i.id === inviteId) ?? null, [invites, inviteId])

  useEffect(() => {
    if (invites.length === 0) return
    if (!inviteId || !invites.some(i => i.id === inviteId)) {
      setInviteId(invites[0]!.id)
    }
  }, [invites, inviteId])

  useEffect(() => {
    if (!selected) return
    setPayeeName(defaultPayeeName(selected))
    setAmount(defaultAmountUsd(selected))
    setMemo(defaultMemo(selected, siteOrigin))
    setEmailTo(selected.purchaser_email?.trim() ?? '')
    setPhoneTo('')
    setPaymentUrl(null)
    setLinkError(null)
  }, [selected, siteOrigin])

  const clearPaymentLink = useCallback(() => {
    setPaymentUrl(null)
    setLinkError(null)
  }, [])

  const body = useMemo(
    () => buildShareBody({ payeeName, amount, memo, paymentUrl }),
    [payeeName, amount, memo, paymentUrl]
  )
  const subject = useMemo(() => buildSubject(payeeName, amount), [payeeName, amount])

  const mailtoHref = useMemo(() => {
    const to = emailTo.trim()
    if (!to.includes('@')) return null
    return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }, [emailTo, subject, body])

  const smsHref = useMemo(() => {
    const addr = normalizeSmsAddress(phoneTo)
    if (!addr) return null
    return `sms:${addr}?body=${encodeURIComponent(body)}`
  }, [phoneTo, body])

  const canCreate =
    Boolean(selected) && payeeName.trim().length >= 2 && clientAmountLooksValid(amount) && !linkLoading

  const createPaymentLink = useCallback(async () => {
    if (!selected) return
    setLinkError(null)
    setLinkLoading(true)
    try {
      const res = await staffApiFetch('/api/admin/invoice-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payeeName: payeeName.trim(),
          amountUsd: amount.trim(),
          memo: memo.trim(),
          customerEmail: emailTo.trim(),
          waiverInviteId: selected.id,
        }),
      })
      const data = (await res.json()) as { url?: string; error?: string }
      if (!res.ok) {
        setLinkError(data.error ?? 'Could not create payment link')
        setPaymentUrl(null)
        return
      }
      if (!data.url) {
        setLinkError('No checkout URL returned')
        setPaymentUrl(null)
        return
      }
      setPaymentUrl(data.url)
    } catch {
      setLinkError('Network error - try again')
      setPaymentUrl(null)
    } finally {
      setLinkLoading(false)
    }
  }, [selected, payeeName, amount, memo, emailTo])

  const copyBody = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(body)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy this message:', body)
    }
  }, [body])

  const copyPayUrl = useCallback(async () => {
    if (!paymentUrl) return
    try {
      await navigator.clipboard.writeText(paymentUrl)
      setCopiedPayUrl(true)
      window.setTimeout(() => setCopiedPayUrl(false), 2000)
    } catch {
      window.prompt('Copy payment link:', paymentUrl)
    }
  }, [paymentUrl])

  if (invites.length === 0) {
    return (
      <p className="font-mono text-[11px] text-formula-mist">
        Create a roster invite with <strong className="text-formula-paper/90">Add roster link</strong> above first. Then you can generate a Stripe payment link
        tied to that invite (metadata includes <span className="font-mono text-formula-frost/90">waiver_invite_id</span> for audit).
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <p className="font-mono text-[10px] leading-relaxed text-formula-mist/90">
        Same Checkout path as{' '}
        <Link href="/admin/invoices" className="text-formula-volt underline-offset-2 hover:underline">
          Admin → Invoices
        </Link>
        , prefilled from the roster invite you pick. After payment, update the invite&apos;s paid snapshot if needed (see{' '}
        <span className="text-formula-paper/90">Add full info</span> on the list below).
      </p>

      <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-formula-mist">
        Roster invite *
        <select
          className="mt-1 w-full max-w-xl border border-formula-frost/14 bg-formula-base/50 px-2 py-2 text-[12px] text-formula-paper"
          value={inviteId}
          onChange={e => {
            setInviteId(e.target.value)
            clearPaymentLink()
          }}
        >
          {invites.map(inv => {
            const org = defaultPayeeName(inv)
            return (
              <option key={inv.id} value={inv.id}>
                {org} · {inv.completed_count}/{inv.expected_waiver_count} · {inv.token.slice(0, 8)}…
              </option>
            )
          })}
        </select>
      </label>

      {selected ? (
        <p className="font-mono text-[10px] text-formula-frost/80">
          Session: <span className="text-formula-paper/90">{sessionLineForInvite(selected)}</span>
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-formula-mist">
          Bill to (name / org) *
          <input
            value={payeeName}
            onChange={e => {
              setPayeeName(e.target.value)
              clearPaymentLink()
            }}
            autoComplete="organization"
            className="border border-formula-frost/16 bg-formula-paper/[0.04] px-3 py-2 text-[13px] text-formula-paper outline-none focus:border-formula-volt/45"
            placeholder="Organizer or club name"
          />
        </label>
        <label className="flex flex-col gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-formula-mist">
          Amount (USD) *
          <input
            value={amount}
            onChange={e => {
              setAmount(e.target.value)
              clearPaymentLink()
            }}
            inputMode="decimal"
            className="border border-formula-frost/16 bg-formula-paper/[0.04] px-3 py-2 text-[13px] text-formula-paper outline-none focus:border-formula-volt/45"
            placeholder="e.g. 360 (min $0.50)"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-formula-mist">
        Memo (Stripe description · max 450 chars)
        <textarea
          value={memo}
          onChange={e => {
            setMemo(e.target.value)
            clearPaymentLink()
          }}
          rows={4}
          maxLength={2000}
          className="resize-y border border-formula-frost/16 bg-formula-paper/[0.04] px-3 py-2 text-[13px] text-formula-paper outline-none focus:border-formula-volt/45"
        />
      </label>

      <div className="rounded-md border border-formula-frost/14 bg-formula-base/40 p-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-formula-volt">Stripe payment link</p>
        <p className="mt-1 font-mono text-[10px] leading-relaxed text-formula-mist/90">
          Checkout session is tagged <span className="font-mono text-formula-paper/90">manual-invoice</span> plus{' '}
          <span className="font-mono text-formula-paper/90">waiver_invite_id</span> for this roster row.
        </p>
        <div className="mt-3 flex flex-col flex-wrap gap-2 sm:flex-row">
          <Button type="button" variant="primary" size="sm" disabled={!canCreate} onClick={() => void createPaymentLink()}>
            <CreditCard className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            {linkLoading ? 'Creating…' : 'Create payment link'}
          </Button>
          {paymentUrl ? (
            <a
              href={paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                btnClass,
                'border border-formula-frost/20 bg-formula-paper/[0.06] text-formula-paper hover:border-formula-volt/35'
              )}
            >
              <ExternalLink className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              Open Checkout
            </a>
          ) : null}
          {paymentUrl ? (
            <button
              type="button"
              onClick={() => void copyPayUrl()}
              className={cn(
                btnClass,
                'border border-formula-frost/16 bg-formula-base/60 text-formula-paper hover:border-formula-volt/35'
              )}
            >
              {copiedPayUrl ? (
                <Check className="h-4 w-4 shrink-0 text-emerald-400" strokeWidth={1.75} />
              ) : (
                <Copy className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              )}
              {copiedPayUrl ? 'Link copied' : 'Copy link only'}
            </button>
          ) : null}
        </div>
        {linkError ? <p className="mt-2 font-mono text-[11px] text-amber-200/90">{linkError}</p> : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-formula-mist">
          Recipient email
          <input
            value={emailTo}
            onChange={e => setEmailTo(e.target.value)}
            type="email"
            autoComplete="email"
            className="border border-formula-frost/16 bg-formula-paper/[0.04] px-3 py-2 text-[13px] text-formula-paper outline-none focus:border-formula-volt/45"
            placeholder="Prefilled from invite; edit if needed"
          />
        </label>
        <label className="flex flex-col gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-formula-mist">
          Recipient mobile (SMS)
          <input
            value={phoneTo}
            onChange={e => setPhoneTo(e.target.value)}
            type="tel"
            autoComplete="tel"
            className="border border-formula-frost/16 bg-formula-paper/[0.04] px-3 py-2 text-[13px] text-formula-paper outline-none focus:border-formula-volt/45"
            placeholder="10-digit US or +E.164"
          />
        </label>
      </div>

      <div className="rounded-md border border-formula-frost/12 bg-black/20 p-3">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-formula-mist">Message preview</p>
        <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-formula-frost/90">
          {body}
        </pre>
      </div>

      <div className="flex flex-col flex-wrap gap-2 sm:flex-row">
        <a
          href={mailtoHref ?? undefined}
          aria-disabled={!mailtoHref}
          className={cn(
            btnClass,
            'border border-formula-volt/40 bg-formula-volt/90 text-formula-base hover:brightness-105',
            !mailtoHref && 'pointer-events-none opacity-40'
          )}
          onClick={e => {
            if (!mailtoHref) e.preventDefault()
          }}
        >
          <Mail className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          Open Mail
        </a>
        <a
          href={smsHref ?? undefined}
          aria-disabled={!smsHref}
          className={cn(
            btnClass,
            'border border-formula-frost/20 bg-formula-paper/[0.06] text-formula-paper hover:border-formula-volt/35',
            !smsHref && 'pointer-events-none opacity-40'
          )}
          onClick={e => {
            if (!smsHref) e.preventDefault()
          }}
        >
          <MessageSquare className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          Open Messages
        </a>
        <button
          type="button"
          onClick={() => void copyBody()}
          className={cn(btnClass, 'border border-formula-frost/16 bg-formula-base/60 text-formula-paper hover:border-formula-volt/35')}
        >
          {copied ? (
            <Check className="h-4 w-4 shrink-0 text-emerald-400" strokeWidth={1.75} />
          ) : (
            <Copy className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          )}
          {copied ? 'Copied' : 'Copy message'}
        </button>
      </div>
    </div>
  )
}
