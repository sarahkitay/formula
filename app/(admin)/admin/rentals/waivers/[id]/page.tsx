import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FieldRentalWaiverDetail } from '@/components/admin/field-rental-waiver-detail'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { getFieldRentalAgreementById } from '@/lib/rentals/field-rental-agreements-server'
import { formatRentalTypeForDisplay, isUuid } from '@/lib/rentals/field-rental-waiver-labels'
import '../waiver-print.css'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  if (!isUuid(id)) return { title: 'Waiver' }
  const agreement = await getFieldRentalAgreementById(id)
  if (!agreement) return { title: 'Waiver not found' }
  return {
    title: `Waiver · ${agreement.participant_name}`,
    description: `${formatRentalTypeForDisplay(agreement.rental_type)} — submitted ${agreement.submitted_at ?? ''}`,
  }
}

export default async function FieldRentalWaiverPage({ params }: Props) {
  const { id } = await params
  if (!isUuid(id)) notFound()

  const serviceConfigured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim())
  if (!serviceConfigured) {
    return (
      <PageContainer fullWidth>
        <PageHeader
          title="Signed waiver"
          subtitle="Supabase service role is not configured in this environment."
          breadcrumb={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Rentals', href: '/admin/rentals' },
            { label: 'Waiver' },
          ]}
        />
        <p className="font-mono text-sm text-amber-200/90">
          Set <code className="text-formula-volt">SUPABASE_SERVICE_ROLE_KEY</code> to load waiver records.
        </p>
        <Link href="/admin/rentals" className="mt-4 inline-block font-mono text-[11px] text-formula-volt underline">
          ← Back to rentals
        </Link>
      </PageContainer>
    )
  }

  const agreement = await getFieldRentalAgreementById(id)
  if (!agreement) notFound()

  return (
    <PageContainer fullWidth>
      <PageHeader
        title={agreement.participant_name}
        subtitle={`${formatRentalTypeForDisplay(agreement.rental_type)} · Full waiver record`}
        breadcrumb={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Rentals', href: '/admin/rentals' },
          { label: 'Signed waiver' },
        ]}
      />
      <FieldRentalWaiverDetail agreement={agreement} />
    </PageContainer>
  )
}
