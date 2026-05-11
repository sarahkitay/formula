import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { getStripeRevenueSummary } from '@/lib/billing/stripe-purchases-server'
import { formatCurrency } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminFinanceHubPage() {
  const stripe = await getStripeRevenueSummary()

  return (
    <PageContainer fullWidth>
      <div className="space-y-8">
        <PageHeader
          title="Finance"
          subtitle="Revenue discipline, Stripe ledger, and internal performance index — one hub with deep links."
          breadcrumb={[
            { label: 'Schedule', href: '/admin/schedule' },
            { label: 'Finance' },
          ]}
        />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-formula-frost/14 bg-formula-paper/[0.04] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-formula-mist">Revenue</p>
            <p className="mt-2 text-sm text-formula-frost/90">Mix thresholds · category share · phase framing.</p>
            {stripe.configured ? (
              <p className="mt-3 font-mono text-[11px] text-formula-paper">
                Paid total (window): <span className="text-formula-volt">{formatCurrency(stripe.totalRevenue)}</span>
              </p>
            ) : (
              <p className="mt-3 font-mono text-[11px] text-formula-mist">Stripe ledger not configured — set keys to see live rollups.</p>
            )}
            <Link href="/admin/revenue-strategy" className="mt-4 inline-block">
              <Button variant="secondary" size="sm">
                Open revenue strategy
              </Button>
            </Link>
          </div>

          <div className="rounded-lg border border-formula-frost/14 bg-formula-paper/[0.04] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-formula-mist">Payments</p>
            <p className="mt-2 text-sm text-formula-frost/90">Checkout ledger · categories · field rental deposits.</p>
            {stripe.configured ? (
              <p className="mt-3 font-mono text-[11px] text-formula-paper">
                {stripe.completedCount} completed · {stripe.rowCount} ledger rows
              </p>
            ) : (
              <p className="mt-3 font-mono text-[11px] text-formula-mist">Connect Supabase + Stripe to see live counts.</p>
            )}
            <Link href="/admin/payments" className="mt-4 inline-block">
              <Button variant="secondary" size="sm">
                Open payments ledger
              </Button>
            </Link>
          </div>

          <div className="rounded-lg border border-formula-frost/14 bg-formula-paper/[0.04] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-formula-mist">FPI</p>
            <p className="mt-2 text-sm text-formula-frost/90">Internal model · pillars · assessments · QC.</p>
            <Link href="/admin/fpi" className="mt-4 inline-block">
              <Button variant="secondary" size="sm">
                Open FPI console
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
