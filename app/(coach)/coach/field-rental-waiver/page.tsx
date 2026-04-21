import Link from 'next/link'
import { FieldRentalAgreementForm } from '@/components/marketing/field-rental-agreement-form'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { SITE } from '@/lib/site-config'

export default function CoachFieldRentalWaiverPage() {
  return (
    <PageContainer fullWidth>
      <div className="space-y-6">
        <PageHeader
          title="Field rental waiver (booking)"
          subtitle={`${SITE.facilityName} · after you place or confirm a rental, record classification + headcount here. Participant-facing links do not ask for these fields.`}
          actions={
            <Link
              href="/coach/today"
              className="inline-flex h-7 items-center rounded-control border border-border bg-muted px-2.5 text-xs font-medium text-text-primary hover:border-border-bright hover:bg-elevated"
            >
              Today
            </Link>
          }
        />
        <p className="max-w-2xl text-sm text-formula-frost/80">
          Public waivers and roster share links only collect identity and signature. This coach flow keeps rental type and participant count on the booking
          record.
        </p>
        <div className="max-w-3xl">
          <FieldRentalAgreementForm variant="coach" />
        </div>
      </div>
    </PageContainer>
  )
}
