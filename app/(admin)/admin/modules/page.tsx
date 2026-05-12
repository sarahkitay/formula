import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { AdminModulesGrid } from '@/components/admin/admin-modules-grid'
import { adminModuleDestinations } from '@/lib/nav/admin'

export default function AdminModulesHubPage() {
  return (
    <PageContainer fullWidth>
      <div className="space-y-8">
        <PageHeader
          title="Modules"
          subtitle="Same directory as the Dashboard grid: programming, commercial, and facility tools."
          breadcrumb={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Modules' },
          ]}
        />

        <AdminModulesGrid items={adminModuleDestinations} />
      </div>
    </PageContainer>
  )
}
