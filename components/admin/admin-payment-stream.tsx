'use client'

import Link from 'next/link'
import { useCallback, useState } from 'react'
import { ChevronRight, DollarSign, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeader } from '@/components/ui/section-header'
import { StatusPill } from '@/components/ui/badge'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import type { Payment } from '@/types'

async function requestDeleteStripePurchase(id: string): Promise<void> {
  const res = await fetch('/api/admin/stripe-purchases', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
  const body = (await res.json()) as { error?: string }
  if (!res.ok) {
    throw new Error(body.error ?? 'Could not remove payment')
  }
}

type AdminPaymentStreamProps = {
  configured: boolean
  initialPayments: Payment[]
  maxRows?: number
}

export function AdminPaymentStream({ configured, initialPayments, maxRows = 10 }: AdminPaymentStreamProps) {
  const [payments, setPayments] = useState<Payment[]>(() => initialPayments.slice(0, maxRows))
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const remove = useCallback(async (payment: Payment) => {
    const ok = window.confirm(
      'Remove this entry from the admin ledger? This does not refund or cancel anything in Stripe — it only deletes the stored row.'
    )
    if (!ok) return
    setDeletingId(payment.id)
    try {
      await requestDeleteStripePurchase(payment.id)
      setPayments(prev => prev.filter(p => p.id !== payment.id))
    } catch (e) {
      window.alert(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }, [])

  return (
    <div className="panel-technical space-y-4 p-5">
      <SectionHeader
        title="Payment stream"
        action={
          <Link href="/admin/payments">
            <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="h-3 w-3" strokeWidth={2} />}>
              Ledger
            </Button>
          </Link>
        }
      />
      <div className="divide-y divide-border">
        {payments.length === 0 && (
          <p className="py-6 text-center text-[13px] text-text-muted">
            {configured
              ? 'No Stripe purchases in the recent window yet. Field rental deposits and other checkouts appear after successful payment and webhook insert.'
              : 'Payment history is unavailable right now. Try again later or contact support.'}
          </p>
        )}
        {payments.map(payment => (
          <div
            key={payment.id}
            className="flex items-center gap-2 py-2.5 first:pt-0 last:pb-0 hover:bg-muted/50"
          >
            <Link
              href="/admin/payments"
              className="flex min-w-0 flex-1 items-center gap-4 text-inherit no-underline transition-colors duration-150 focus-visible:bg-muted/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005700]"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-border bg-muted text-text-muted">
                <DollarSign className="h-3.5 w-3.5" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] text-text-primary">{payment.playerName}</p>
                <p className="truncate text-[11px] text-text-muted">{payment.description}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[13px] font-medium tabular-nums text-text-primary">{formatCurrency(payment.amount)}</p>
                <p className="font-mono text-[11px] text-text-muted">{formatDate(payment.createdAt)}</p>
              </div>
              <StatusPill status={payment.status} />
            </Link>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn('h-8 w-8 shrink-0 p-0 text-text-muted hover:text-destructive')}
              aria-label="Remove from ledger"
              disabled={deletingId === payment.id}
              onClick={e => {
                e.preventDefault()
                void remove(payment)
              }}
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
