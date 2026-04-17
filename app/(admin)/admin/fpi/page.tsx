import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { AdminPanel, AdminMonoTable } from '@/components/admin/admin-panel'
import { FPI_PILLARS, FPI_WEIGHTS_BY_AGE, type AgeBandId } from '@/lib/admin/fpi-weights'
import { fpiWorkflowQueue } from '@/lib/mock-data/admin-operating-system'
import { SITE } from '@/lib/site-config'
import { ChevronRight } from 'lucide-react'

function WeightRow({ band }: { band: AgeBandId }) {
  const w = FPI_WEIGHTS_BY_AGE[band]
  return (
  <div className="grid grid-cols-5 gap-2 font-mono text-[11px] text-formula-frost/90">
  {FPI_PILLARS.map(p => (
  <div key={p} className="border border-formula-frost/12 bg-formula-paper/[0.05] px-2 py-2 text-center shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]">
  <p className="text-[9px] uppercase text-formula-mist">{p}</p>
  <p className="tabular-nums text-formula-paper">{(w[p] * 100).toFixed(0)}%</p>
  </div>
  ))}
  </div>
  )
}

export default function AdminFpiPage() {
  return (
  <PageContainer fullWidth>
  <div className="space-y-6">
  <PageHeader
  title="FPI management"
  subtitle="Internal scientific model · no public leaderboards · staff-only percentile bands"
  breadcrumb={[
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'FPI' },
  ]}
  actions={
  <Link href="/admin/performance">
  <Button variant="secondary" size="sm" rightIcon={<ChevronRight className="h-3 w-3" strokeWidth={2} />}>
  Athlete records
  </Button>
  </Link>
  }
  />

  <div className="border border-amber-500/20 bg-amber-500/5 px-4 py-3 font-mono text-[11px] text-zinc-300">
  <span className="text-amber-500/90">POLICY</span> · FPI is not merchandised. Display tiers, trends, and
  priorities to staff only. {SITE.performanceDataPolicy}
  </div>

  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
  <AdminPanel title="Age-based weighting" eyebrow="FIVE_PILLARS">
  <p className="mb-4 font-mono text-[10px] text-zinc-500">Ages 6–11</p>
  <WeightRow band="6-11" />
  <p className="mb-4 mt-6 font-mono text-[10px] text-zinc-500">Ages 12–19</p>
  <WeightRow band="12-19" />
  </AdminPanel>

  <AdminPanel title="Assessment workflow" eyebrow="QUEUE">
  <AdminMonoTable
  headers={['Athlete', 'Type', 'Due', 'Gap']}
  rows={fpiWorkflowQueue.map(w => [w.athlete, w.type, w.due, w.pillarGap])}
  />
  <div className="mt-4 flex flex-wrap gap-2">
  <Button variant="primary" size="sm" disabled>
  Data entry
  </Button>
  <Button variant="secondary" size="sm" disabled>
  QC sign-off
  </Button>
  <Button variant="ghost" size="sm" disabled>
  Generate report
  </Button>
  </div>
  </AdminPanel>
  </div>

  <AdminPanel title="Quality controls" eyebrow="FPI_LAB">
  <ul className="list-inside list-disc space-y-2 font-mono text-[11px] text-zinc-400">
  <li>Baseline + 6-month reassessment cadence; off-cycle exceptions flagged</li>
  <li>Historical trend + percentile within age band (staff view)</li>
  <li>Clinic recommendations tied to pillar gaps - conversion tracked in Clinics console</li>
  <li>Machine + coach inputs merged with versioned audit trail</li>
  </ul>
  </AdminPanel>
  </div>
  </PageContainer>
  )
}
