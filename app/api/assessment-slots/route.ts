import { NextResponse } from 'next/server'
import { fetchSlotsWithAvailability } from '@/lib/assessment/slots-server'

export const runtime = 'nodejs'

/** Published Skills Check windows with booked vs available counts (service role aggregate). */
export async function GET() {
  try {
    const slots = await fetchSlotsWithAvailability()
    return NextResponse.json({ slots })
  } catch (e) {
    console.error('[assessment-slots]', e)
    return NextResponse.json({ error: 'Failed to load slots' }, { status: 500 })
  }
}
