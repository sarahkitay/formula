import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { AdminPanel, AdminMonoTable } from '@/components/admin/admin-panel'
import {
  revenueByCategory,
  computeRevenueThresholds,
  GROWTH_PHASES,
} from '@/lib/mock-data/admin-operating-system'

export default function RevenueStrategyPage() {
  const thresholds = computeRevenueThresholds(revenueByCategory)

  return (
    <PageContainer fullWidth>
      <div className="space-y-6">
        <PageHeader
          title="Revenue + strategy"
          subtitle="Mix discipline · utilization · correlation views · phase framing"
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
                    : 'border-white/10 text-zinc-500'
                }`}
              >
                {p.name}
              </span>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Revenue by category (demo)" eyebrow="YTD">
          <AdminMonoTable
            headers={['Category', 'Amount', 'Share']}
            rows={revenueByCategory.map(r => [
              r.category,
              r.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
              `${r.pct}%`,
            ])}
          />
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
          <p className="mt-3 font-mono text-[10px] text-zinc-500">
            Rental &gt;35% · adult &gt;20% · camps &gt;20% · youth membership &lt;40% trigger review.
          </p>
        </AdminPanel>

        <AdminPanel title="Analytics backlog" eyebrow="STRATEGY">
          <ul className="list-inside list-disc space-y-2 font-mono text-[11px] text-zinc-400">
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
