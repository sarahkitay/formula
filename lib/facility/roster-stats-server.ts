import { getServiceSupabase } from '@/lib/supabase/service'

export type RosterStats = {
  configured: boolean
  total: number
  joinedLast45Days: number
  error?: string
}

/** Head counts from `players` for admin dashboards (no mock roster). */
export async function getRosterStats(): Promise<RosterStats> {
  const sb = getServiceSupabase()
  if (!sb) {
    return { configured: false, total: 0, joinedLast45Days: 0 }
  }

  const since = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
  const [totalRes, recentRes] = await Promise.all([
    sb.from('players').select('*', { count: 'exact', head: true }),
    sb.from('players').select('*', { count: 'exact', head: true }).gte('created_at', since),
  ])

  const err = totalRes.error ?? recentRes.error
  if (err) {
    return { configured: true, total: 0, joinedLast45Days: 0, error: err.message }
  }

  return {
    configured: true,
    total: totalRes.count ?? 0,
    joinedLast45Days: recentRes.count ?? 0,
  }
}
