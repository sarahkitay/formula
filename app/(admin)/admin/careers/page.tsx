import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { AdminPanel, AdminMonoTable } from '@/components/admin/admin-panel'
import { listCareerApplicationsRecent } from '@/lib/careers/career-applications-server'
import { careerPositionLabel } from '@/lib/careers/career-positions'
import { formatFacilityDateTimeShort } from '@/lib/facility/format-facility-datetime'

function clip(s: string | null | undefined, max: number) {
  if (!s) return '—'
  return s.length <= max ? s : `${s.slice(0, max)}…`
}

export default async function AdminCareersPage() {
  const rows = await listCareerApplicationsRecent(200)
  const serviceConfigured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim())

  return (
    <PageContainer fullWidth>
      <div className="space-y-6">
        <PageHeader
          title="Careers"
          subtitle="Applications from the public /careers form"
          breadcrumb={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Careers' },
          ]}
        />

        <AdminPanel title="Applications" eyebrow="HIRING">
          {!serviceConfigured ? (
            <p className="font-mono text-[11px] text-amber-200/90">
              Supabase service role is not set — applications cannot be loaded. Configure the key to enable this list.
            </p>
          ) : rows.length === 0 ? (
            <p className="font-mono text-[11px] text-formula-mist">
              No applications yet. When candidates submit the form on{' '}
              <Link className="text-formula-volt underline" href="/careers">
                /careers
              </Link>
              , rows appear here and ops get an email alert.
            </p>
          ) : (
            <AdminMonoTable
              headers={[
                'Submitted',
                'Role',
                'Name',
                'Email',
                'Phone',
                'Availability',
                'Coach background',
                'Message',
              ]}
              rows={rows.map((r) => [
                formatFacilityDateTimeShort(r.submitted_at),
                careerPositionLabel(r.position),
                r.full_name,
                r.email,
                r.phone ?? '—',
                clip(r.availability, 36),
                clip(r.coaching_background, 40),
                clip(r.message, 72),
              ])}
            />
          )}
        </AdminPanel>
      </div>
    </PageContainer>
  )
}
