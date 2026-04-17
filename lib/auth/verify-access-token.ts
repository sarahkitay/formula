/**
 * Validates a Supabase access JWT via Auth REST (no service role required).
 * Use in Route Handlers when the browser sends `Authorization: Bearer <access_token>`.
 */
export async function getSupabaseUserIdFromAccessToken(accessToken: string): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  if (!url || !anon || !accessToken) return null

  const r = await fetch(`${url.replace(/\/$/, '')}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      apikey: anon,
    },
    cache: 'no-store',
  })

  if (!r.ok) return null
  const body = (await r.json()) as { id?: string }
  return typeof body.id === 'string' ? body.id : null
}
