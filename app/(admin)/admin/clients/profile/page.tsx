import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { AdminClientProfileView } from '@/components/admin/admin-client-profile-view'
import { AdminClientProfileSearch } from '@/components/admin/admin-client-profile-search'
import { fetchClientLedgerProfile } from '@/lib/billing/client-ledger-profile-server'

export const dynamic = 'force-dynamic'

export default async function AdminClientProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; purchaseId?: string }>
}) {
  const sp = await searchParams
  const email = typeof sp.email === 'string' ? sp.email : ''
  const purchaseId = typeof sp.purchaseId === 'string' ? sp.purchaseId : ''

  const hasQuery = email.trim().length > 0 || purchaseId.trim().length > 0

  if (!hasQuery) {
    return (
      <PageContainer>
        <PageHeader
          title="Client profile"
          subtitle="Look up everyone we’ve seen on the Stripe ledger by receipt email, or open a single purchase by id when no email is stored."
          breadcrumb={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Clients', href: '/admin/clients/profile' },
          ]}
        />
        <div className="mt-8 max-w-xl space-y-4 rounded-xl border border-formula-frost/12 bg-formula-paper/[0.03] p-6">
          <p className="text-sm text-formula-frost/85">
            From <strong className="text-formula-paper">Payments</strong> or <strong className="text-formula-paper">Events → Friendlies</strong>, click a row to
            open this profile. You can also search by email here.
          </p>
          <AdminClientProfileSearch />
        </div>
      </PageContainer>
    )
  }

  const profile = await fetchClientLedgerProfile({
    email: email.trim() || null,
    purchaseId: purchaseId.trim() || null,
  })

  if (!profile) {
    return (
      <PageContainer>
        <PageHeader
          title="Client profile"
          subtitle="No matching ledger rows."
          breadcrumb={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Clients', href: '/admin/clients/profile' },
          ]}
        />
        <p className="mt-6 rounded-lg border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
          Nothing found for that email or purchase id. Confirm the receipt email matches Stripe, or open the row from Payments to use its internal id.
        </p>
        <div className="mt-8">
          <AdminClientProfileSearch />
        </div>
        <p className="mt-6">
          <Link href="/admin/payments" className="font-mono text-[11px] text-formula-volt underline-offset-2 hover:underline">
            Payments ledger
          </Link>
        </p>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Client profile"
        subtitle="Stripe ledger history and stored checkout metadata for this payer."
        breadcrumb={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Clients', href: '/admin/clients/profile' },
          { label: profile.displayName },
        ]}
      />
      <div className="mt-8">
        <AdminClientProfileView profile={profile} />
      </div>
    </PageContainer>
  )
}
