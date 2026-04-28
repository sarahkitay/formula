import { getServiceSupabase } from '@/lib/supabase/service'

export type CareerPosition = 'front_desk' | 'coach'

export type CareerApplicationInsert = {
  position: CareerPosition
  full_name: string
  email: string
  phone: string | null
  message: string
  availability: string | null
  coaching_background: string | null
}

export type CareerApplicationRow = CareerApplicationInsert & { id: string; submitted_at: string | null }

export async function insertCareerApplication(
  row: CareerApplicationInsert
): Promise<{ ok: true; id: string } | { ok: false; message: string }> {
  const sb = getServiceSupabase()
  if (!sb) {
    return { ok: false, message: 'Database not configured (set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY).' }
  }

  const { data, error } = await sb
    .from('career_applications')
    .insert({
      position: row.position,
      full_name: row.full_name,
      email: row.email,
      phone: row.phone,
      message: row.message,
      availability: row.availability,
      coaching_background: row.coaching_background,
    })
    .select('id')
    .single()

  if (error) {
    console.error('[career_applications] insert:', error.message)
    return { ok: false, message: 'Could not save your application. Try again later or email the facility directly.' }
  }
  return { ok: true, id: (data as { id: string }).id }
}

export async function listCareerApplicationsRecent(limit = 200): Promise<CareerApplicationRow[]> {
  const sb = getServiceSupabase()
  if (!sb) return []

  const { data, error } = await sb
    .from('career_applications')
    .select('id, submitted_at, position, full_name, email, phone, message, availability, coaching_background')
    .order('submitted_at', { ascending: false })
    .limit(Math.min(500, Math.max(1, limit)))

  if (error) {
    console.warn('[career_applications] list:', error.message)
    return []
  }
  return (data ?? []) as CareerApplicationRow[]
}
