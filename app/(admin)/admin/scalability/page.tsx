import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { AdminPanel } from '@/components/admin/admin-panel'
import { scalabilityLayer } from '@/lib/mock-data/admin-operating-system'

export default function ScalabilityPage() {
  return (
    <PageContainer fullWidth>
      <div className="space-y-6">
        <PageHeader
          title="Scalability layer"
          subtitle="Multi-location · central FPI · SOP-driven expansion · partner workflows"
          breadcrumb={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Scale' },
          ]}
        />

        <AdminPanel title="Design targets" eyebrow="SYSTEM">
          <ol className="list-inside list-decimal space-y-3 font-mono text-[11px] leading-relaxed text-formula-frost/90">
            {scalabilityLayer.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ol>
        </AdminPanel>

        <AdminPanel title="RBAC + audit" eyebrow="SECURITY">
          <p className="font-mono text-[11px] text-formula-mist">
            All schedule overrides, roster locks, revenue reclassifications, and FPI QC actions require signed
            actor + role + immutable log entry. Demo UI surfaces audit samples on Operations map and Schedule
            flows.
          </p>
        </AdminPanel>
      </div>
    </PageContainer>
  )
}
