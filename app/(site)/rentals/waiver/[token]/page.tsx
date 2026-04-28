import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { FieldRentalRosterInvite } from '@/components/marketing/field-rental-agreement-form'
import { RosterWaiverInviteFlow } from '@/components/marketing/roster-waiver-invite-flow'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { formatRentalTypeForDisplay } from '@/lib/rentals/field-rental-waiver-labels'
import { countWaiversForInviteId, getWaiverInviteByToken } from '@/lib/rentals/waiver-invites-server'
import { getSiteOrigin } from '@/lib/stripe/server'

const VALID_RENTAL = new Set(['club_team_practice', 'private_semi_private', 'general_pickup'])

type Props = { params: Promise<{ token: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params
  const invite = await getWaiverInviteByToken(token)
  if (!invite) return { title: 'Waiver link', robots: { index: false, follow: false } }
  return {
    title: `Roster waiver (${invite.expected_waiver_count} expected)`,
    description: 'Sign the field rental agreement for this booking.',
    robots: { index: false, follow: false },
  }
}

export default async function FieldRentalWaiverInvitePage({ params }: Props) {
  const { token } = await params
  const invite = await getWaiverInviteByToken(token)
  if (!invite) notFound()

  const completed = await countWaiversForInviteId(invite.id)
  const remaining = Math.max(0, invite.expected_waiver_count - completed)
  const rosterFull = completed >= invite.expected_waiver_count

  const rosterInvite: FieldRentalRosterInvite = {
    token: invite.token,
    expected: invite.expected_waiver_count,
    completed,
  }

  const shareUrl = `${getSiteOrigin()}/rentals/waiver/${invite.token}`

  return (
    <MarketingInnerPage
      wide
      eyebrow="Field rental"
      title="Roster waiver link"
      intro="Choose whether to sign the full waiver or RSVP if you already have a signed Formula waiver on file with the same email. Staff see how many spots are filled vs how many this booking expects."
      articleClassName="max-w-[920px]"
    >
      <div className="not-prose mb-10 rounded-sm border border-formula-frost/14 bg-formula-paper/[0.03] p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-formula-mist">Progress</p>
        <p className="mt-3 text-lg font-mono text-formula-paper">
          <strong>{completed}</strong> of <strong>{invite.expected_waiver_count}</strong> signed
          {remaining > 0 ? (
            <>
              {' '}
              · <span className="text-formula-volt">{remaining}</span> remaining
            </>
          ) : (
            <span className="text-formula-volt"> · complete</span>
          )}
        </p>
        {invite.rental_ref ? (
          <p className="mt-2 font-mono text-[11px] text-formula-mist">
            Booking ref: <span className="text-formula-frost/90">{invite.rental_ref}</span>
          </p>
        ) : null}
        {invite.rental_type && VALID_RENTAL.has(invite.rental_type) ? (
          <p className="mt-2 font-mono text-[11px] text-formula-mist">
            Booking type (from checkout):{' '}
            <span className="text-formula-frost/90">{formatRentalTypeForDisplay(invite.rental_type)}</span>
          </p>
        ) : null}
        <p className="mt-3 break-all font-mono text-[10px] text-formula-mist/90">
          Share (same link for everyone): {shareUrl}
        </p>
        <p className="mt-2 text-xs text-formula-frost/75">
          Coaches: send this URL once — parents pick <strong className="text-formula-paper/90">Sign the waiver</strong> or{' '}
          <strong className="text-formula-paper/90">RSVP only</strong> if they already signed digitally with us.
        </p>
      </div>

      {rosterFull ? (
        <div className="not-prose rounded-sm border border-formula-frost/14 bg-formula-base/80 p-6">
          <p className="text-sm text-formula-paper">All expected waivers for this link are already on file.</p>
          <p className="mt-3 text-sm text-formula-mist">
            If someone still needs to sign, ask the organizer to confirm the participant count or send an updated link from checkout.
          </p>
          <Link
            href={MARKETING_HREF.rentals}
            className="mt-6 inline-flex text-sm text-formula-volt underline-offset-2 hover:underline"
          >
            Field rentals
          </Link>
        </div>
      ) : (
        <RosterWaiverInviteFlow inviteToken={invite.token} rosterInvite={rosterInvite} />
      )}
    </MarketingInnerPage>
  )
}
