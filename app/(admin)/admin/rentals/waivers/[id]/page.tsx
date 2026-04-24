import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FieldRentalWaiverDetail, type RosterOrganizerContext } from '@/components/admin/field-rental-waiver-detail'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { formatCheckoutAmount, formatRosterInviteBookingSummary } from '@/lib/rentals/field-rental-agreement-admin-display'
import { getFieldRentalAgreementById } from '@/lib/rentals/field-rental-agreements-server'
import { formatRentalTypeForDisplay, isUuid } from '@/lib/rentals/field-rental-waiver-labels'
import { countWaiversForInviteId, getWaiverInviteById } from '@/lib/rentals/waiver-invites-server'
import { formatFacilityDateTimeShort } from '@/lib/facility/format-facility-datetime'
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

  let rosterOrganizer: RosterOrganizerContext | null = null
  if (agreement.waiver_invite_id) {
    const inv = await getWaiverInviteById(agreement.waiver_invite_id)
    if (inv) {
      const done = await countWaiversForInviteId(inv.id)
      rosterOrganizer = {
        purchaserName: inv.purchaser_name ?? null,
        purchaserEmail: inv.purchaser_email ?? null,
        paidLabel: formatCheckoutAmount(inv.checkout_amount_total_cents ?? null, inv.checkout_currency ?? null),
        paidAtLabel: inv.checkout_completed_at ? formatFacilityDateTimeShort(inv.checkout_completed_at) : '—',
        sessionSummary: formatRosterInviteBookingSummary({
          booking_rental_field: inv.booking_rental_field ?? null,
          booking_rental_window: inv.booking_rental_window ?? null,
          booking_rental_date: inv.booking_rental_date ?? null,
          booking_rental_dates_compact: inv.booking_rental_dates_compact ?? null,
          booking_session_weeks: inv.booking_session_weeks ?? null,
          expected_waiver_count: inv.expected_waiver_count,
        }),
        rosterProgress: `${done} / ${inv.expected_waiver_count}`,
        inviteToken: inv.token,
      }
    }
  }

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
      <FieldRentalWaiverDetail agreement={agreement} rosterOrganizer={rosterOrganizer} />
    </PageContainer>
  )
}
