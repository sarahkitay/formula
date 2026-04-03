'use client'

import React from 'react'
import { DollarSign, Download } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { CountUp } from '@/components/ui/count-up'
import { StatusPill } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable, Column } from '@/components/ui/data-table'
import { mockPayments, getTotalRevenue } from '@/lib/mock-data/payments'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { Payment } from '@/types'

const METHOD_LABELS: Record<string, string> = {
  card: 'Card',
  cash: 'Cash',
  'bank-transfer': 'Bank Transfer',
  comp: 'Comp',
}

export default function PaymentsPage() {
  const completed = mockPayments.filter(p => p.status === 'completed')
  const pending = mockPayments.filter(p => p.status === 'pending')
  const totalRevenue = getTotalRevenue()
  const pendingAmount = pending.reduce((s, p) => s + p.amount, 0)
  const avgTransaction = totalRevenue / (completed.length || 1)

  const columns: Column<Payment>[] = [
    {
      key: 'invoiceNumber',
      header: 'Invoice',
      render: (p) => <span className="font-mono text-xs text-text-muted">{p.invoiceNumber}</span>,
    },
    {
      key: 'playerName',
      header: 'Player',
      render: (p) => <span className="font-medium text-text-primary">{p.playerName}</span>,
    },
    {
      key: 'description',
      header: 'Description',
      render: (p) => <span className="text-text-secondary text-sm truncate max-w-[200px] block">{p.description}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (p) => (
        <span className={cn('font-semibold', p.status === 'refunded' ? 'text-error line-through' : 'text-text-primary')}>
          {formatCurrency(p.amount)}
        </span>
      ),
    },
    {
      key: 'paymentMethod',
      header: 'Method',
      render: (p) => <span className="text-text-secondary text-sm">{METHOD_LABELS[p.paymentMethod] ?? p.paymentMethod}</span>,
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (p) => <span className="text-text-secondary text-sm">{formatDate(p.createdAt, 'datetime')}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (p) => <StatusPill status={p.status} />,
    },
  ]

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Payments"
          subtitle="Revenue tracking and payment history"
          actions={
            <Button variant="secondary" leftIcon={<Download className="h-4 w-4" />}>
              Export CSV
            </Button>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Revenue"
            value={<CountUp end={totalRevenue} format="currency" />}
            accent
          />
          <StatCard
            label="Completed"
            value={<CountUp end={completed.length} format="integer" />}
            sublabel="payments"
          />
          <StatCard
            label="Pending"
            value={<CountUp end={pending.length} format="integer" />}
            sublabel={<CountUp end={pendingAmount} format="currency" />}
          />
          <StatCard
            label="Avg. Transaction"
            value={<CountUp end={avgTransaction} format="currency" />}
          />
        </div>

        {/* Pending alerts */}
        {pending.length > 0 && (
          <div className="rounded-xl border border-warning/25 bg-warning/5 p-4 space-y-2">
            <p className="text-sm font-semibold text-warning">{pending.length} payments pending</p>
            {pending.map(p => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">{p.playerName} · {p.description}</span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-text-primary">{formatCurrency(p.amount)}</span>
                  <Button variant="primary" size="sm">Mark Paid</Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Full table */}
        <DataTable
          columns={columns}
          data={[...mockPayments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
          keyField="id"
          emptyTitle="No payments yet"
          emptyIcon={<DollarSign />}
        />
      </div>
    </PageContainer>
  )
}
