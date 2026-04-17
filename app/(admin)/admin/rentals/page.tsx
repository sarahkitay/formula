import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { AdminPanel, AdminMonoTable } from '@/components/admin/admin-panel'
import { rentalPackages } from '@/lib/mock-data/admin-operating-system'
import { listFieldRentalAgreementsRecent } from '@/lib/rentals/field-rental-agreements-server'
import { formatCurrency } from '@/lib/utils'
import { SITE } from '@/lib/site-config'

function formatSubmittedAt(iso: string) {
  try {
    return new Date(iso).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })
  } catch {
    return iso
  }
}

function clip(s: string | null, max: number) {
  if (!s) return '—'
  return s.length <= max ? s : `${s.slice(0, max)}…`
}

export default async function RentalsPage() {
  const waiverRows = await listFieldRentalAgreementsRecent(100)
  const serviceConfigured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim())

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

        <AdminPanel title="Signed rental waivers" eyebrow="FIELD RENTAL">
          {!serviceConfigured ? (
            <p className="font-mono text-[11px] text-amber-200/90">
              Set <code className="text-zinc-300">SUPABASE_SERVICE_ROLE_KEY</code> on the server so submissions can be
              saved and listed here.
            </p>
          ) : waiverRows.length === 0 ? (
            <p className="font-mono text-[11px] text-zinc-500">
              No rows yet. Run <code className="text-zinc-400">supabase/field_rental_agreements.sql</code> in the
              Supabase SQL editor, then submit the form on the public rentals / book-assessment page.
            </p>
          ) : (
            <AdminMonoTable
              headers={[
                'Submitted',
                'Rental type',
                'Participant',
                'Email',
                'DOB',
                'Count',
                'Signer',
                'Guardian',
                'Org',
                'Notes',
              ]}
              rows={waiverRows.map((r) => [
                formatSubmittedAt(r.submitted_at),
                r.rental_type,
                r.participant_name,
                r.participant_email,
                r.participant_dob,
                r.participant_count != null ? String(r.participant_count) : '—',
                r.signature_name,
                r.parent_guardian_name ?? '—',
                r.organization_name ?? '—',
                clip(r.notes, 48),
              ])}
            />
          )}
          <p className="mt-3 font-mono text-[10px] text-zinc-600">
            Full signature images live in <code className="text-zinc-500">signature_data_url</code> (not shown in
            this table). Open a row in Supabase Table Editor to view or export.
          </p>
        </AdminPanel>

        <AdminPanel title="Categories" eyebrow="PACKAGES">
          <AdminMonoTable
            headers={['Category', 'Active contracts', 'MRR']}
            rows={rentalPackages.map((r) => [r.category, r.active, r.mrr ? formatCurrency(r.mrr) : '-'])}
          />
        </AdminPanel>

        <p className="font-mono text-[10px] text-zinc-500">
          {SITE.membershipPolicy} · Rental share monitored vs threshold in Revenue console.
        </p>
      </div>
    </PageContainer>
  )
}
