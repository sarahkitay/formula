import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { AdminPanel, AdminMonoTable } from '@/components/admin/admin-panel'
import {
  revenueByCategory,
  computeRevenueThresholds,
  GROWTH_PHASES,
} from '@/lib/mock-data/admin-operating-system'
import { getStripeRevenueSummary } from '@/lib/billing/stripe-purchases-server'
import { formatCurrency } from '@/lib/utils'

export default async function RevenueStrategyPage() {
  const stripe = await getStripeRevenueSummary()
  const rows =
    stripe.configured && stripe.stripeRevenueByCategory.length > 0 ? stripe.stripeRevenueByCategory : revenueByCategory
  const thresholds = computeRevenueThresholds(rows)

  return (
    <PageContainer fullWidth>
      <div className="space-y-6">
        <PageHeader
          title="Revenue + strategy"
          subtitle="Mix discipline from paid Stripe Checkout (field rentals, parties, assessments, packages, invoices). Totals match Admin → Payments."
          breadcrumb={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Revenue' },
          ]}
        />

        <AdminPanel title="Growth phase" eyebrow="ROADMAP">
          <div className="flex flex-wrap gap-2">
            {GROWTH_PHASES.map(p => (
              <span
                key={p.id}
                className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide ${
                  p.active
                    ? 'border-[#f4fe00] text-[#f4fe00]'
                    : 'border-formula-frost/12 text-formula-mist'
                }`}
              >
                {p.name}
              </span>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Revenue by category" eyebrow="STRIPE · PAID CHECKOUTS">
          {rows.length === 0 ? (
            <p className="font-mono text-[11px] text-formula-mist">
              No completed Stripe purchases yet. After the webhook writes to <code className="text-formula-frost/80">stripe_purchases</code>, amounts roll up
              here (including <strong className="text-formula-paper">field-rental-booking</strong> deposits).
            </p>
          ) : (
            <AdminMonoTable
              headers={['Category', 'Amount', 'Share of paid total']}
              rows={rows.map(r => [r.category, formatCurrency(r.amount), `${r.pct}%`])}
            />
          )}
          {stripe.configured ? (
            <p className="mt-3 font-mono text-[10px] text-formula-mist">
              Paid total in window: {formatCurrency(stripe.totalRevenue)} · {stripe.completedCount} completed ·{' '}
              <a href="/admin/payments" className="text-formula-volt underline-offset-2 hover:underline">
                Open ledger
              </a>
            </p>
          ) : null}
        </AdminPanel>

        <AdminPanel title="Warning thresholds" eyebrow="DISCIPLINE">
          <AdminMonoTable
            headers={['Metric', 'Current', 'Threshold', 'Status']}
            rows={thresholds.map(t => [
              t.label,
              `${t.currentPct.toFixed(1)}%`,
              `${t.thresholdPct}%`,
              t.breached ? (
                <span className="text-amber-500">Review</span>
              ) : (
                <span className="text-emerald-600/90">OK</span>
              ),
            ])}
          />
          <p className="mt-3 font-mono text-[10px] text-formula-mist">
            Rental &gt;35% · adult &gt;20% · camps &gt;20% · youth membership &lt;40% trigger review. Current % is share of your paid Stripe total above.
          </p>
        </AdminPanel>

        <AdminPanel title="Analytics backlog" eyebrow="STRATEGY">
          <ul className="list-inside list-disc space-y-2 font-mono text-[11px] text-formula-mist">
            <li>Utilization by asset + hour/day heatmaps</li>
            <li>Membership share vs rental / adult / camps</li>
            <li>Attendance → revenue correlation</li>
            <li>FPI pillar movement → program participation</li>
          </ul>
        </AdminPanel>
      </div>
    </PageContainer>
  )
}
