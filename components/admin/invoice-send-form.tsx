'use client'

import { useCallback, useMemo, useState } from 'react'
import { Mail, MessageSquare, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

function normalizeSmsAddress(raw: string): string | null {
  const t = raw.trim()
  const digits = t.replace(/\D/g, '')
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  if (t.startsWith('+') && digits.length >= 10) return `+${digits}`
  return null
}

function buildInvoiceText(params: { payeeName: string; amount: string; memo: string }): string {
  const who = params.payeeName.trim() || '___'
  const amt = params.amount.trim() || '___'
  const lines = ['Formula invoice', `Amount: ${amt}`, `Bill to: ${who}`]
  if (params.memo.trim()) lines.push(`Details: ${params.memo.trim()}`)
  return lines.join('\n')
}

function buildSubject(payeeName: string, amount: string): string {
  const who = payeeName.trim() || 'Customer'
  const amt = amount.trim() || 'Amount TBD'
  return `Formula invoice — ${who} — ${amt}`
}

const linkBtnClass =
  'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-control px-4 text-sm font-medium transition-[filter,opacity] sm:w-auto sm:min-h-10'

export function InvoiceSendForm() {
  const [payeeName, setPayeeName] = useState('')
  const [amount, setAmount] = useState('')
  const [memo, setMemo] = useState('')
  const [emailTo, setEmailTo] = useState('')
  const [phoneTo, setPhoneTo] = useState('')
  const [copied, setCopied] = useState(false)

  const body = useMemo(
    () => buildInvoiceText({ payeeName, amount, memo }),
    [payeeName, amount, memo]
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

  const copyBody = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(body)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy this message:', body)
    }
  }, [body])

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-text-muted">Bill to (name / org) *</span>
          <input
            value={payeeName}
            onChange={e => setPayeeName(e.target.value)}
            autoComplete="organization"
            className="h-11 rounded-lg border border-border-subtle bg-surface-elevated px-3 text-sm text-text-primary outline-none focus:border-accent/50"
            placeholder="e.g. Northside FC or Jane Smith"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-text-muted">Amount (USD) *</span>
          <input
            value={amount}
            onChange={e => setAmount(e.target.value)}
            inputMode="decimal"
            className="h-11 rounded-lg border border-border-subtle bg-surface-elevated px-3 text-sm text-text-primary outline-none focus:border-accent/50"
            placeholder="e.g. 250 or 250.00"
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-text-muted">Line items / memo (optional)</span>
        <textarea
          value={memo}
          onChange={e => setMemo(e.target.value)}
          rows={3}
          maxLength={2000}
          className="rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2 text-sm text-text-primary outline-none focus:border-accent/50"
          placeholder="What the charge is for"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-text-muted">Recipient email</span>
          <input
            value={emailTo}
            onChange={e => setEmailTo(e.target.value)}
            type="email"
            autoComplete="email"
            className="h-11 rounded-lg border border-border-subtle bg-surface-elevated px-3 text-sm text-text-primary outline-none focus:border-accent/50"
            placeholder="for Mail app link"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-text-muted">Recipient mobile</span>
          <input
            value={phoneTo}
            onChange={e => setPhoneTo(e.target.value)}
            type="tel"
            autoComplete="tel"
            className="h-11 rounded-lg border border-border-subtle bg-surface-elevated px-3 text-sm text-text-primary outline-none focus:border-accent/50"
            placeholder="10-digit US or +E.164 for Messages"
          />
        </label>
      </div>

      <div className="rounded-lg border border-border-subtle bg-surface-base/50 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-text-muted">Message preview</p>
        <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words font-mono text-[12px] leading-relaxed text-text-secondary">
          {body}
        </pre>
      </div>

      <p className="text-xs leading-relaxed text-text-muted">
        Opens your default <strong className="text-text-secondary">Mail</strong> or <strong className="text-text-secondary">Messages</strong> app on this device with the text filled in. Nothing is sent from Formula servers.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <a
          href={mailtoHref ?? undefined}
          aria-disabled={!mailtoHref}
          className={cn(
            linkBtnClass,
            'bg-primary text-primary-foreground shadow-glow-blue hover:brightness-110',
            !mailtoHref && 'pointer-events-none opacity-40'
          )}
          onClick={e => {
            if (!mailtoHref) e.preventDefault()
          }}
        >
          <Mail className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          Open Mail app
        </a>
        <a
          href={smsHref ?? undefined}
          aria-disabled={!smsHref}
          className={cn(
            linkBtnClass,
            'border border-border bg-muted text-text-primary hover:border-border-bright hover:bg-elevated',
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
          className={cn(
            linkBtnClass,
            'border border-border-subtle bg-surface-elevated text-text-primary hover:border-accent/40'
          )}
        >
          {copied ? (
            <Check className="h-4 w-4 shrink-0 text-emerald-400" strokeWidth={1.75} />
          ) : (
            <Copy className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          )}
          {copied ? 'Copied' : 'Copy message'}
        </button>
      </div>

      {!mailtoHref && emailTo.trim().length > 0 ? (
        <p className="text-xs text-amber-200/90">Enter a valid email to enable Mail.</p>
      ) : null}
      {!smsHref && phoneTo.replace(/\D/g, '').length > 0 ? (
        <p className="text-xs text-amber-200/90">Enter a valid US or international mobile to enable Messages.</p>
      ) : null}
    </div>
  )
}
