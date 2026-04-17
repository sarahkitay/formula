'use client'

import { supabase } from '@/lib/supabase'

/** Fire-and-forget admin email via `/api/notify/parent-block-booking` (requires active session). */
export async function notifyParentBlockBookingCreated(bookingId: string): Promise<void> {
  try {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    if (!token) return

    await fetch('/api/notify/parent-block-booking', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookingId }),
    })
  } catch {
    // non-blocking
  }
}
