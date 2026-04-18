import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { AdminPanel, AdminMonoTable } from '@/components/admin/admin-panel'
import { clinicRows } from '@/lib/mock-data/admin-operating-system'

export default function ClinicsPage() {
  return (
    <PageContainer fullWidth>
      <div className="space-y-6">
        <PageHeader
          title="Clinics"
          subtitle="Scarce · premium · members-first · FPI-driven recommendations"
          breadcrumb={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Clinics' },
          ]}
          actions={
            <Link href="/admin/fpi">
              <Button variant="secondary" size="sm">
                FPI gaps
              </Button>
            </Link>
          }
        />

        <AdminPanel title="Scheduled labs" eyebrow="CAPACITY_CONTROLLED">
          <AdminMonoTable
            headers={['Lab', 'Type', 'Next', 'Seats', 'Coach', 'Conv.']}
            rows={clinicRows.map(c => [c.name, c.type, c.nextDate, c.seats, c.coach, c.conversion])}
          />
        </AdminPanel>

        <AdminPanel title="Operating rules" eyebrow="CLINIC_OS">
          <ul className="list-inside list-disc space-y-2 font-mono text-[11px] text-formula-mist">
            <li>Standard + specialty labs; rotation across age groups</li>
            <li>Attendance + outcome correlation to reassessment (dashboard tie-in)</li>
            <li>Early access for recommended athletes from FPI queue</li>
          </ul>
        </AdminPanel>
      </div>
    </PageContainer>
  )
}
