import { AdminFacilityEventsClient } from '@/components/admin/admin-facility-events-client'
import { listFacilityEvents } from '@/lib/events/facility-events-server'
import { getWaiverInviteById } from '@/lib/rentals/waiver-invites-server'
import { getSiteOrigin } from '@/lib/stripe/server'

export const dynamic = 'force-dynamic'

export default async function AdminEventsPage() {
  try {
    const events = await listFacilityEvents(400)
    const siteOrigin = getSiteOrigin()
    const waiverUrlByEventId: Record<string, string> = {}
    const withInvites = events.filter(ev => ev.waiver_invite_id)
    const inviteRows = await Promise.all(
      withInvites.map(async ev => {
        const inv = ev.waiver_invite_id ? await getWaiverInviteById(ev.waiver_invite_id) : null
        return { eventId: ev.id, inv }
      })
    )
    for (const { eventId, inv } of inviteRows) {
      if (inv?.token) {
        waiverUrlByEventId[eventId] = `${siteOrigin}/rentals/waiver/${inv.token}`
      }
    }
    const dbConfigured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim())

    return (
      <AdminFacilityEventsClient
        events={events}
        waiverUrlByEventId={waiverUrlByEventId}
        siteOrigin={siteOrigin}
        dbConfigured={dbConfigured}
      />
    )
  } catch (e) {
    console.error('[admin/events] page:', e)
    return (
      <div className="admin-os p-6 font-mono text-[12px] text-formula-paper">
        <p className="text-amber-200">Events page failed to load.</p>
        <p className="mt-2 text-formula-mist/90">Check Supabase env and server logs, then reload.</p>
      </div>
    )
  }
}
