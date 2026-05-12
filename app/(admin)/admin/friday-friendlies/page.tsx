import type { ReactNode } from 'react'
import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { AdminPanel, AdminMonoTable } from '@/components/admin/admin-panel'
import { BOOKING_HUB_PUBLIC } from '@/lib/marketing/book-assessment-paths'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { formatFacilityDateTimeShort } from '@/lib/facility/format-facility-datetime'
import { type FridayFriendliesSignupRow, listFridayFriendliesSignups } from '@/lib/billing/stripe-purchases-server'

export const dynamic = 'force-dynamic'

function splitAthleteNames(raw: string | null): string[] {
  if (!raw?.trim()) return []
  return raw
    .split(/[,/&]|\s+and\s+/i)
    .map(s => s.trim())
    .filter(Boolean)
}

function ageBandLabel(row: FridayFriendliesSignupRow): string {
  const { ageYoungest, ageOldest } = row
  if (ageYoungest == null && ageOldest == null) return '—'
  if (ageYoungest != null && ageOldest != null && ageYoungest !== ageOldest) {
    return `${ageYoungest}–${ageOldest} yr`
  }
  return ageYoungest != null ? `${ageYoungest} yr` : ageOldest != null ? `${ageOldest} yr` : '—'
}

export default async function AdminFridayFriendliesPage() {
  const signups = await listFridayFriendliesSignups(500)

  const tableRows: (string | ReactNode)[][] = []

  for (const row of signups) {
    const names = splitAthleteNames(row.playerNames)
    const displayNames = names.length > 0 ? names : row.playerCount > 0 ? [`(${row.playerCount} player(s) — see roster text)`] : ['—']

    for (let i = 0; i < displayNames.length; i++) {
      const athlete = displayNames[i]!
      const waiverCell = (
        <div className="max-w-xs space-y-1.5 text-left normal-case tracking-normal">
          <p className="text-formula-mist">
            Pre-reg now requires waiver completion on the public page (full sign or RSVP). Rows appear in{' '}
            <Link href="/admin/rentals" className="text-formula-volt underline-offset-2 hover:underline">
              Admin → Rentals
            </Link>{' '}
            with source <span className="font-mono text-formula-frost/90">Friday Friendlies</span>. Cross-check athlete name / email there if needed.
          </p>
          <Link
            href={BOOKING_HUB_PUBLIC.waiver}
            className="inline-block text-formula-volt underline-offset-2 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open public waiver hub
          </Link>
        </div>
      )

      tableRows.push([
        i === 0 ? formatFacilityDateTimeShort(row.createdAt) : '—',
        i === 0 ? row.guardianName?.trim() || '—' : '—',
        i === 0 ? row.email?.trim() || '—' : '—',
        athlete,
        ageBandLabel(row),
        i === 0 ? `$${row.amountUsd.toFixed(0)}` : '—',
        i === 0 ? (
          <span className="font-mono text-[10px] text-formula-mist" title={row.stripeSessionId}>
            {row.stripeSessionId.slice(0, 14)}…
          </span>
        ) : (
          '—'
        ),
        i === 0 ? waiverCell : <span className="text-formula-mist/65 text-[10px]">Same checkout</span>,
      ])
    }
  }

  return (
    <PageContainer fullWidth>
      <div className="space-y-6">
        <PageHeader
          title="Friday Night Friendlies"
          subtitle="Paid pre-registrations from the public Friendlies checkout (Stripe → stripe_purchases). Waivers and RSVPs are stored as field rental agreements (source Friday Friendlies) from the same landing page."
          breadcrumb={[
            { label: 'Schedule', href: '/admin/schedule' },
            { label: 'Friday Friendlies' },
          ]}
          actions={
            <Link
              href={MARKETING_HREF.fridayNightFriendlies}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-7 items-center gap-1.5 border border-formula-frost/16 bg-formula-paper/[0.06] px-2.5 text-xs font-medium text-formula-paper transition-colors hover:border-formula-volt/35"
            >
              Public landing
            </Link>
          }
        />

        {signups.length === 0 ? (
          <AdminPanel title="No paid sign-ups yet" eyebrow="FNF">
            <p className="max-w-2xl text-[13px] leading-relaxed text-formula-mist">
              When guardians complete checkout for <strong className="text-formula-paper">Friday Friendlies</strong>, rows appear here (service role reads{' '}
              <code className="text-formula-frost/90">stripe_purchases</code> with type{' '}
              <code className="text-formula-frost/90">friday-friendlies-player</code>). If Stripe is live but this stays empty, confirm the purchase webhook is
              writing to Supabase.
            </p>
          </AdminPanel>
        ) : (
          <AdminPanel title={`Paid pre-registrations (${signups.length} checkout${signups.length === 1 ? '' : 's'})`} eyebrow="FNF">
            <AdminMonoTable
              headers={['Registered', 'Guardian', 'Email', 'Athlete', 'Ages', 'Paid', 'Session ref', 'Waiver']}
              rows={tableRows}
            />
          </AdminPanel>
        )}
      </div>
    </PageContainer>
  )
}
