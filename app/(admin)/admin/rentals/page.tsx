import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { AdminPanel, AdminMonoTable } from '@/components/admin/admin-panel'
import { rentalPackages } from '@/lib/mock-data/admin-operating-system'
import { ManualWaiverInviteForm } from '@/components/admin/manual-waiver-invite-form'
import { listFieldRentalAgreementsRecent } from '@/lib/rentals/field-rental-agreements-server'
import { listWaiverInvitesWithProgress } from '@/lib/rentals/waiver-invites-server'
import { BOOKING_HUB_PUBLIC } from '@/lib/marketing/book-assessment-paths'
import { getSiteOrigin } from '@/lib/stripe/server'
import { FACILITY_TIMEZONE } from '@/lib/facility/facility-day'
import { formatFacilityDateTimeShort } from '@/lib/facility/format-facility-datetime'
import { listPartyBookingsRecent } from '@/lib/party/party-bookings-server'
import { formatCheckoutAmount, formatFieldRentalBookingSummaryLine } from '@/lib/rentals/field-rental-agreement-admin-display'
import { formatCurrency } from '@/lib/utils'
import { SITE } from '@/lib/site-config'

function clip(s: string | null, max: number) {
  if (!s) return '—'
  return s.length <= max ? s : `${s.slice(0, max)}…`
}

export default async function RentalsPage() {
  const waiverRows = await listFieldRentalAgreementsRecent(100)
  const partyRows = await listPartyBookingsRecent(80)
  const waiverInvites = await listWaiverInvitesWithProgress(50)
  const siteOrigin = getSiteOrigin()
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

        <AdminPanel title="Party deposits (Stripe)" eyebrow="PARTIES · $1K">
          {!serviceConfigured ? (
            <p className="font-mono text-[11px] text-amber-200/90">
              Paid party bookings can’t be loaded right now. Try again in a few minutes; if this keeps happening, contact
              support.
            </p>
          ) : partyRows.length === 0 ? (
            <p className="font-mono text-[11px] text-formula-mist">
              No party deposits on file yet. When guests pay the deposit on the{' '}
              <Link className="text-formula-volt underline" href="/events/parties">
                birthday parties
              </Link>{' '}
              page, confirmations show up here.
            </p>
          ) : (
            <AdminMonoTable
              headers={[
                'Paid at',
                'Contact',
                'Email',
                'Party date',
                'Guests',
                'Field',
                'Rental date',
                'Window',
                'Rental HC',
                'Amount',
                'Stripe',
              ]}
              rows={partyRows.map(r => [
                formatFacilityDateTimeShort(r.created_at),
                r.contact_name,
                r.customer_email ?? '—',
                r.party_preferred_date,
                String(r.party_guest_count),
                r.rental_field_id,
                r.rental_session_date,
                clip(r.rental_time_slot, 28),
                String(r.rental_headcount),
                `$${(r.amount_total_cents / 100).toFixed(0)}`,
                clip(r.stripe_checkout_session_id, 20),
              ])}
            />
          )}
          <p className="mt-2 font-mono text-[10px] text-formula-mist/80">
            Ops and the guest each get a confirmation email when outbound mail is enabled for this site.
          </p>
        </AdminPanel>

        <AdminPanel title="Roster waiver links" eyebrow="FIELD RENTAL">
          {!serviceConfigured ? (
            <p className="font-mono text-[11px] text-amber-200/90">Invite progress requires Supabase service role.</p>
          ) : (
            <>
              <p className="mb-4 font-mono text-[11px] text-formula-mist">
                Paid field-rental checkouts get a link on the checkout success page. Manual links (walk-ins, comps) can be created below. Each signed waiver
                through the link increments the count until the expected number is reached.
              </p>
              <ManualWaiverInviteForm />
              {waiverInvites.length === 0 ? (
                <p className="mt-6 font-mono text-[11px] text-formula-mist">No roster links yet.</p>
              ) : (
                <div className="mt-6">
                  <AdminMonoTable
                  headers={['Created', 'Done / expected', 'Left', 'Ref', 'Type', 'Stripe session', 'URL']}
                  rows={waiverInvites.map(inv => [
                    formatFacilityDateTimeShort(inv.created_at),
                    `${inv.completed_count} / ${inv.expected_waiver_count}`,
                    String(inv.remaining_count),
                    clip(inv.rental_ref, 24),
                    clip(inv.rental_type, 20),
                    clip(inv.stripe_checkout_session_id, 18),
                    <span key={inv.id} className="font-mono text-[9px] text-formula-frost/85">
                      {siteOrigin}/rentals/waiver/{inv.token.slice(0, 10)}…
                    </span>,
                  ])}
                  />
                </div>
              )}
            </>
          )}
        </AdminPanel>

        <AdminPanel title="Signed rental waivers" eyebrow="FIELD RENTAL">
          <p className="mb-4 font-mono text-[11px] text-formula-mist">
            <Link
              href={BOOKING_HUB_PUBLIC.waiver}
              target="_blank"
              rel="noopener noreferrer"
              className="text-formula-volt underline-offset-2 hover:underline"
            >
              Open full waiver form (reference — same as guests)
            </Link>
            . Each signed row links to the full record, agreement language, and signature.
          </p>
          {!serviceConfigured ? (
            <p className="font-mono text-[11px] text-amber-200/90">
              Signed waivers can’t be loaded right now. Try again in a few minutes; if this keeps happening, contact support.
            </p>
          ) : waiverRows.length === 0 ? (
            <p className="font-mono text-[11px] text-formula-mist">
              No signed waivers on file yet. Completed rental waivers from the public{' '}
              <Link className="text-formula-volt underline" href="/rentals">
                Rentals
              </Link>{' '}
              or{' '}
              <Link className="text-formula-volt underline" href="/book-assessment">
                Book assessment
              </Link>{' '}
              flow will appear here after guests submit them.
            </p>
          ) : (
            <AdminMonoTable
              headers={[
                'Submitted',
                'Paid',
                'Booking',
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
                formatFacilityDateTimeShort(r.submitted_at),
                formatCheckoutAmount(r.checkout_amount_total_cents ?? null, r.checkout_currency ?? null),
                clip(formatFieldRentalBookingSummaryLine(r), 52),
                r.rental_type,
                <span key={`${r.id}-name`} className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <Link href={`/admin/rentals/waivers/${r.id}`} className="text-formula-volt underline-offset-2 hover:underline">
                    {r.participant_name}
                  </Link>
                  <Link
                    href={`/admin/rentals/waivers/${r.id}`}
                    className="font-mono text-[9px] uppercase tracking-wide text-formula-mist hover:text-formula-paper"
                  >
                    Full record + agreement
                  </Link>
                </span>,
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
          <p className="mt-3 font-mono text-[10px] text-formula-mist/80">
            Open a row for submitted answers, the complete agreement text shown to signers, acknowledgments, signature image, PDF download, and a link to the live
            public waiver form. Submitted times use the facility timezone ({FACILITY_TIMEZONE}). “Count” is the headcount on this waiver line (roster links are 1 per
            signer); team size from checkout appears in Booking. Paid / Booking populate when the waiver was submitted through a paid roster link (snapshot from
            Stripe at submit).
          </p>
        </AdminPanel>

        <AdminPanel title="Categories" eyebrow="PACKAGES">
          <AdminMonoTable
            headers={['Category', 'Active contracts', 'MRR']}
            rows={rentalPackages.map((r) => [r.category, r.active, r.mrr ? formatCurrency(r.mrr) : '-'])}
          />
        </AdminPanel>

        <p className="font-mono text-[10px] text-formula-mist">
          {SITE.membershipPolicy} · Rental share monitored vs threshold in Revenue console.
        </p>
      </div>
    </PageContainer>
  )
}
