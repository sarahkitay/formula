import { AdminFacilityEventsClient } from '@/components/admin/admin-facility-events-client'
import { buildWaiverUrlsByEventId, listFacilityEvents } from '@/lib/events/facility-events-server'
import { getSiteOrigin } from '@/lib/site-origin'

export const dynamic = 'force-dynamic'

export default async function AdminEventsPage() {
  try {
    const events = await listFacilityEvents(400)
    const siteOrigin = getSiteOrigin()
    const waiverUrlByEventId = await buildWaiverUrlsByEventId(events, siteOrigin)
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
