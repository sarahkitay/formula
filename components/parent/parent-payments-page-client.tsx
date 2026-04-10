'use client'

import { PiggyBank, Download } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { SectionHeader } from '@/components/ui/section-header'
import { StatCard } from '@/components/ui/stat-card'
import { CountUp } from '@/components/ui/count-up'
import { StatusPill } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable, Column } from '@/components/ui/data-table'
import { parentPortalPanel } from '@/lib/parent/portal-surface'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { Payment } from '@/types'
import { useParentLinkedPlayers } from '@/components/parent/parent-linked-players-context'

const columns: Column<Payment>[] = [
  { key: 'invoiceNumber', header: 'Invoice', render: (p) => <span className="font-mono text-xs text-text-muted">{p.invoiceNumber}</span> },
  { key: 'playerName', header: 'Player', render: (p) => <span className="font-medium text-text-primary">{p.playerName}</span> },
  { key: 'description', header: 'Description', render: (p) => <span className="text-sm text-text-secondary">{p.description}</span> },
  { key: 'amount', header: 'Amount', render: (p) => <span className="font-semibold text-text-primary">{formatCurrency(p.amount)}</span> },
  { key: 'createdAt', header: 'Date', render: (p) => <span className="text-sm text-text-secondary">{formatDate(p.createdAt)}</span> },
  { key: 'status', header: 'Status', render: (p) => <StatusPill status={p.status} /> },
]

export function ParentPaymentsPageClient() {
  const { players, loading } = useParentLinkedPlayers()
  const payments: Payment[] = []

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Billing & account"
          subtitle="Membership billing, add-ons, assessments, clinics, and camps - one ledger."
          actions={
            <Button variant="secondary" leftIcon={<Download className="h-4 w-4" />}>
              Download PDF
            </Button>
          }
        />

        <div className={cn('p-5', parentPortalPanel)}>
          <SectionHeader title="Payment method" description="Card on file · update with front desk or when billing portal connects." />
          <p className="mt-2 font-mono text-xs text-formula-mist">•••• •••• •••• 4242 · Visa · exp 08/28 (demo)</p>
        </div>

        <SectionHeader
          title="Invoices & receipts"
          description={
            players.length > 0
              ? `Ledger for ${players.length} linked athlete${players.length !== 1 ? 's' : ''} will appear here when billing syncs to the portal.`
              : 'Completed and pending charges across membership and add-ons.'
          }
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <StatCard label="Total saved" value={<CountUp end={0} format="currency" />} sublabel="Vs drop-in (when tracked)" accent />
          <StatCard label="Transactions" value={<CountUp end={0} format="integer" />} sublabel="completed" />
          <StatCard label="Pending" value={<CountUp end={0} format="integer" />} sublabel="awaiting payment" />
        </div>

        {!loading && payments.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <PiggyBank className="mx-auto h-10 w-10 text-text-muted opacity-50" />
            <p className="mt-3 text-sm font-medium text-text-primary">No payments in the portal yet</p>
            <p className="mt-2 text-sm text-text-muted">
              Receipts and invoices will list here when your account is connected to live billing. For past charges, ask the front desk.
            </p>
          </div>
        ) : (
          <DataTable columns={columns} data={payments} keyField="id" emptyTitle="No payments yet" emptyIcon={<PiggyBank />} />
        )}
      </div>
    </PageContainer>
  )
}
