import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { AdminPanel, AdminMonoTable } from '@/components/admin/admin-panel'
import { fridayCircuitRosters } from '@/lib/mock-data/admin-operating-system'

export default function FridayCircuitPage() {
  return (
    <PageContainer fullWidth>
      <div className="space-y-6">
        <PageHeader
          title="Friday Youth Game Circuit"
          subtitle="Pre-registration only · membership priority · teams formed before arrival · no friend-team requests"
          breadcrumb={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Friday circuit' },
          ]}
          actions={
            <Link href="/admin/fpi">
              <Button variant="secondary" size="sm">
                FPI inputs
              </Button>
            </Link>
          }
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {['Rotation', 'Rosters locked', 'Field windows'].map((label, i) => (
            <div key={label} className="border border-white/10 bg-[#0f0f0f] px-4 py-3 font-mono text-[11px] text-zinc-400">
              <span className="text-zinc-600">0{i + 1}</span> · {label}
            </div>
          ))}
        </div>

        <AdminPanel title="Locked rosters (demo)" eyebrow="FRIDAY">
          <AdminMonoTable
            headers={['Age band', 'Team', 'Field', 'Window', 'FPI avg', 'Coach notes']}
            rows={fridayCircuitRosters.map(r => [
              r.ageBand,
              r.team,
              r.field,
              r.window,
              r.fpiAvg,
              r.coachNotes,
            ])}
          />
        </AdminPanel>

        <AdminPanel title="Match ops" eyebrow="CAPTURE">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <ul className="space-y-2 font-mono text-[11px] text-zinc-400">
              <li>• Coach observation rubric (structured)</li>
              <li>• Actions-per-minute + competitive telemetry</li>
              <li>• Social post / winner photo workflow (opt-in, non-ranking)</li>
            </ul>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" size="sm" disabled>
                Lock rosters
              </Button>
              <Button variant="secondary" size="sm" disabled>
                Assign fields
              </Button>
              <Button variant="ghost" size="sm" disabled>
                Export observation
              </Button>
            </div>
          </div>
        </AdminPanel>
      </div>
    </PageContainer>
  )
}
