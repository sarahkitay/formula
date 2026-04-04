/** Matches `public.profiles` (sync with Supabase). */
export type ProfileRole = 'parent' | 'staff' | 'coach' | 'admin'

export type ProfileRow = {
  id: string
  role: ProfileRole | string | null
  email?: string | null
  full_name?: string | null
  created_at?: string | null
  updated_at?: string | null
}
