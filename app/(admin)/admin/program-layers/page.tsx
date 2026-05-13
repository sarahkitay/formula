import { listFridayFriendliesSignups } from '@/lib/billing/stripe-purchases-server'
import { AdminEventsLayerClient } from '@/components/admin/admin-events-layer-client'
import { eventsLayerSummary } from '@/lib/mock-data/admin-operating-system'

export const dynamic = 'force-dynamic'

export default async function ProgramLayersPage() {
  const friendliesSignups = await listFridayFriendliesSignups(400)
  const dbConfigured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim())

  return (
    <AdminEventsLayerClient
      overview={eventsLayerSummary}
      friendliesSignups={friendliesSignups}
      dbConfigured={dbConfigured}
    />
  )
}
