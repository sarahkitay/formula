import { NextResponse } from 'next/server'
import { fetchFacilityScheduleConfig } from '@/lib/schedule/facility-schedule-config-server'

export const runtime = 'nodejs'

/** Read-only published schedule configuration (overrides, blackout days, cycle labels). */
export async function GET() {
  try {
    const config = await fetchFacilityScheduleConfig()
    return NextResponse.json({ config })
  } catch (e) {
    console.error('[facility-config]', e)
    return NextResponse.json({ error: 'Failed to load facility schedule config' }, { status: 500 })
  }
}
