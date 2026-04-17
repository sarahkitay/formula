import { NextResponse } from 'next/server'
import { getSupabaseUserIdFromAccessToken } from '@/lib/auth/verify-access-token'
import { escapeHtml, sendAdminNotification } from '@/lib/email/send-admin-notification'
import { getServiceSupabase } from '@/lib/supabase/service'

export const runtime = 'nodejs'

type BookingRow = {
  parent_user_id: string
  player_id: string
  slot_ref: string
  week_start: string
  title: string
  starts_at: string
  ends_at: string | null
}

/**
 * After a guardian saves a youth block / schedule row, notify ops (Resend).
 * Caller must send `Authorization: Bearer <Supabase access_token>` and own the booking row.
 */
export async function POST(req: Request) {
  const auth = req.headers.get('authorization')
  const token = auth?.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : ''
  if (!token) {
    return NextResponse.json({ error: 'Missing Authorization Bearer token' }, { status: 401 })
  }

  const userId = await getSupabaseUserIdFromAccessToken(token)
  if (!userId) {
    return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const bookingId =
    typeof (body as { bookingId?: unknown }).bookingId === 'string'
      ? (body as { bookingId: string }).bookingId.trim()
      : ''
  if (!bookingId) {
    return NextResponse.json({ error: 'bookingId is required' }, { status: 400 })
  }

  const sb = getServiceSupabase()
  if (!sb) {
    return NextResponse.json({ error: 'Server is not configured' }, { status: 503 })
  }

  const { data: row, error } = await sb
    .from('parent_block_bookings')
    .select('parent_user_id, player_id, slot_ref, week_start, title, starts_at, ends_at')
    .eq('id', bookingId)
    .maybeSingle()

  if (error || !row) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  const b = row as BookingRow
  if (b.parent_user_id !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await sendAdminNotification({
    subject: `[Formula] Parent saved schedule hold · ${b.title}`,
    html: `
      <p><strong>Parent portal · block / hold saved</strong></p>
      <ul>
        <li><strong>Booking id</strong>: ${escapeHtml(bookingId)}</li>
        <li><strong>Parent user id</strong>: ${escapeHtml(b.parent_user_id)}</li>
        <li><strong>Player id</strong>: ${escapeHtml(b.player_id)}</li>
        <li><strong>Slot ref</strong>: ${escapeHtml(b.slot_ref)}</li>
        <li><strong>Week start</strong>: ${escapeHtml(String(b.week_start))}</li>
        <li><strong>Title</strong>: ${escapeHtml(b.title)}</li>
        <li><strong>Starts</strong>: ${escapeHtml(b.starts_at)}</li>
        <li><strong>Ends</strong>: ${escapeHtml(b.ends_at ?? '—')}</li>
      </ul>
    `,
    text: `Parent block booking\nid: ${bookingId}\nslot_ref: ${b.slot_ref}\nweek: ${b.week_start}\n${b.title}`,
  })

  return NextResponse.json({ ok: true })
}
