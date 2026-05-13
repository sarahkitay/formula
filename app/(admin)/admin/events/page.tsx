import { AdminFacilityEventsClient } from '@/components/admin/admin-facility-events-client'
import { listFacilityEvents } from '@/lib/events/facility-events-server'
import { getWaiverInviteById } from '@/lib/rentals/waiver-invites-server'
import { getSiteOrigin } from '@/lib/stripe/server'

export const dynamic = 'force-dynamic'

export default async function AdminEventsPage() {
  const events = await listFacilityEvents(400)
  const siteOrigin = getSiteOrigin()
  const waiverUrlByEventId: Record<string, string> = {}
  for (const ev of events) {
    if (ev.waiver_invite_id) {
      const inv = await getWaiverInviteById(ev.waiver_invite_id)
      if (inv) {
        waiverUrlByEventId[ev.id] = `${siteOrigin}/rentals/waiver/${inv.token}`
      }
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
}
