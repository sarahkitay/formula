'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { DollarSign, Download, Trash2 } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { CountUp } from '@/components/ui/count-up'
import { StatusPill } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable, Column } from '@/components/ui/data-table'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import type { Payment } from '@/types'

const METHOD_LABELS: Record<string, string> = {
  card: 'Card',
  cash: 'Cash',
  'bank-transfer': 'Bank Transfer',
  comp: 'Comp',
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoadError(null)
    try {
      const res = await fetch('/api/admin/stripe-purchases')
      const body = (await res.json()) as { payments?: Payment[]; error?: string }
      if (!res.ok) throw new Error(body.error ?? 'Failed to load payments')
      setPayments(body.payments ?? [])
    } catch (e) {
      setPayments([])
      setLoadError(e instanceof Error ? e.message : 'Failed to load')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const removePayment = useCallback(async (p: Payment) => {
    const ok = window.confirm(
      'Remove this entry from the ledger? This does not refund or cancel anything in Stripe — it only deletes the stored row.'
    )
    if (!ok) return
    setDeletingId(p.id)
    try {
      const res = await fetch('/api/admin/stripe-purchases', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id }),
      })
      const body = (await res.json()) as { error?: string }
      if (!res.ok) throw new Error(body.error ?? 'Failed to remove payment')
      setPayments(prev => prev.filter(x => x.id !== p.id))
    } catch (e) {
      window.alert(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }, [])

  const completed = useMemo(() => payments.filter(p => p.status === 'completed'), [payments])
  const pending = useMemo(() => payments.filter(p => p.status === 'pending'), [payments])
  const totalRevenue = useMemo(() => completed.reduce((s, p) => s + p.amount, 0), [completed])
  const pendingAmount = useMemo(() => pending.reduce((s, p) => s + p.amount, 0), [pending])
  const avgTransaction = totalRevenue / (completed.length || 1)

  const columns: Column<Payment>[] = [
    {
      key: 'invoiceNumber',
      header: 'Invoice',
      render: p => <span className="font-mono text-xs text-text-muted">{p.invoiceNumber}</span>,
    },
    {
      key: 'playerName',
      header: 'Customer',
      render: p => <span className="font-medium text-text-primary">{p.playerName}</span>,
    },
    {
      key: 'description',
      header: 'Product',
      render: p => (
        <span className="block max-w-[min(280px,40vw)] truncate text-sm text-text-secondary" title={p.description}>
          {p.description}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: p => (
        <span
          className={cn(
            'font-semibold',
            p.status === 'refunded' ? 'text-error line-through' : 'text-text-primary'
          )}
        >
          {formatCurrency(p.amount)}
        </span>
      ),
    },
    {
      key: 'paymentMethod',
      header: 'Method',
      render: p => (
        <span className="text-sm text-text-secondary">{METHOD_LABELS[p.paymentMethod] ?? p.paymentMethod}</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: p => <span className="text-sm text-text-secondary">{formatDate(p.createdAt, 'datetime')}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: p => <StatusPill status={p.status} />,
    },
    {
      key: '_remove',
      header: '',
      render: p => (
        <button
          type="button"
          title="Remove from ledger (no Stripe refund)"
          aria-label="Remove from ledger"
          disabled={deletingId === p.id}
          onClick={() => void removePayment(p)}
          className={cn(
            'inline-flex h-8 w-8 items-center justify-center rounded-control text-text-muted transition-colors hover:bg-muted hover:text-destructive disabled:opacity-40'
          )}
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      ),
    },
  ]

  const sorted = useMemo(
    () => [...payments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [payments]
  )

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Payments"
          subtitle="Stripe Checkout sessions from webhook — includes field rental deposits, party deposits, assessments, packages, and custom invoices."
          actions={
            <Button variant="secondary" leftIcon={<Download className="h-4 w-4" />} type="button" disabled>
              Export CSV
            </Button>
          }
        />

        {loadError ? (
          <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-100/90">
            {loadError}
          </p>
        ) : null}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total revenue (paid)" value={<CountUp end={totalRevenue} format="currency" />} accent />
          <StatCard label="Completed" value={<CountUp end={completed.length} format="integer" />} sublabel="checkouts" />
          <StatCard
            label="Pending / other"
            value={<CountUp end={pending.length} format="integer" />}
            sublabel={<CountUp end={pendingAmount} format="currency" />}
          />
          <StatCard label="Avg. transaction" value={<CountUp end={avgTransaction} format="currency" />} />
        </div>

        {pending.length > 0 && (
          <div className="space-y-2 rounded-xl border border-warning/25 bg-warning/5 p-4">
            <p className="text-sm font-semibold text-warning">{pending.length} payments still completing</p>
            {pending.map(p => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">
                  {p.playerName} · {p.description}
                </span>
                <span className="font-semibold text-text-primary">{formatCurrency(p.amount)}</span>
              </div>
            ))}
          </div>
        )}

        <DataTable
          columns={columns}
          data={sorted}
          keyField="id"
          emptyTitle="No Stripe purchases yet"
          emptyDescription="When guests complete a paid checkout, entries appear here. If you expect to see data already, try refreshing or contact support."
          emptyIcon={<DollarSign />}
        />
      </div>
    </PageContainer>
  )
}
