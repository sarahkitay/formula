import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { AdminPanel, AdminMonoTable } from '@/components/admin/admin-panel'
import { rentalPackages } from '@/lib/mock-data/admin-operating-system'
import { formatCurrency } from '@/lib/utils'
import { SITE } from '@/lib/site-config'

export default function RentalsPage() {
  return (
  <PageContainer fullWidth>
  <div className="space-y-6">
  <PageHeader
  title="Rentals"
  subtitle="Structured inventory · prime/off-peak · 12-week alignment preferred · membership windows protected"
  breadcrumb={[
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Rentals' },
  ]}
  actions={
  <Link href="/admin/revenue-strategy">
  <Button variant="secondary" size="sm">
  Revenue mix
  </Button>
  </Link>
  }
  />

  <AdminPanel title="Categories" eyebrow="PACKAGES">
  <AdminMonoTable
  headers={['Category', 'Active contracts', 'MRR']}
  rows={rentalPackages.map(r => [
  r.category,
  r.active,
  r.mrr ? formatCurrency(r.mrr) : '-',
  ])}
  />
  </AdminPanel>

  <p className="font-mono text-[10px] text-zinc-500">
  {SITE.membershipPolicy} · Rental share monitored vs threshold in Revenue console.
  </p>
  </div>
  </PageContainer>
  )
}
