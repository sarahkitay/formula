'use client'

import React from 'react'
import { PiggyBank, Download } from 'lucide-react'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { SectionHeader } from '@/components/ui/section-header'
import { StatCard } from '@/components/ui/stat-card'
import { CountUp } from '@/components/ui/count-up'
import { StatusPill } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable, Column } from '@/components/ui/data-table'
import { getPaymentsByPlayer } from '@/lib/mock-data/payments'
import { getParentTotalSaved } from '@/lib/mock-data/parent-savings'
import { parentPortalPanel } from '@/lib/parent/portal-surface'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { Payment } from '@/types'

const PARENT_ID = 'parent-6'
const PARENT_PLAYER_IDS = ['player-6', 'player-7']
const payments = PARENT_PLAYER_IDS.flatMap(id => getPaymentsByPlayer(id))
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

const columns: Column<Payment>[] = [
  { key: 'invoiceNumber', header: 'Invoice', render: (p) => <span className="font-mono text-xs text-text-muted">{p.invoiceNumber}</span> },
  { key: 'playerName', header: 'Player', render: (p) => <span className="text-text-primary font-medium">{p.playerName}</span> },
  { key: 'description', header: 'Description', render: (p) => <span className="text-text-secondary text-sm">{p.description}</span> },
  { key: 'amount', header: 'Amount', render: (p) => <span className="font-semibold text-text-primary">{formatCurrency(p.amount)}</span> },
  { key: 'createdAt', header: 'Date', render: (p) => <span className="text-text-secondary text-sm">{formatDate(p.createdAt)}</span> },
  { key: 'status', header: 'Status', render: (p) => <StatusPill status={p.status} /> },
]

export default function ParentPaymentsPage() {
  const totalSaved = getParentTotalSaved(PARENT_PLAYER_IDS, PARENT_ID)

  return (
  <PageContainer>
  <div className="space-y-6">
  <PageHeader
  title="Billing & account"
  subtitle="Membership billing, add-ons, assessments, clinics, and camps - one ledger."
  actions={<Button variant="secondary" leftIcon={<Download className="h-4 w-4" />}>Download PDF</Button>}
  />

  <div className={cn('p-5', parentPortalPanel)}>
  <SectionHeader title="Payment method" description="Card on file · update with front desk or when billing portal connects." />
  <p className="mt-2 font-mono text-xs text-formula-mist">•••• •••• •••• 4242 · Visa · exp 08/28 (demo)</p>
  </div>

  <SectionHeader title="Invoices & receipts" description="Completed and pending charges across membership and add-ons." />

  <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
  <StatCard
  label="Total saved"
  value={<CountUp end={totalSaved} format="currency" />}
  sublabel="Vs drop-in sessions and walk-up field rates (demo)"
  accent
  />
  <StatCard
  label="Transactions"
  value={<CountUp end={payments.filter(p => p.status === 'completed').length} format="integer" />}
  sublabel="completed"
  />
  <StatCard
  label="Pending"
  value={<CountUp end={payments.filter(p => p.status === 'pending').length} format="integer" />}
  sublabel="awaiting payment"
  />
  </div>

  <DataTable columns={columns} data={payments} keyField="id" emptyTitle="No payments yet" emptyIcon={<PiggyBank />} />
  </div>
  </PageContainer>
  )
}
