import { NextResponse } from 'next/server'
import { startOfScheduleWeek } from '@/lib/schedule/generator'
import { buildFacilityCalendarFeed } from '@/lib/schedule/calendar-feed'

export const runtime = 'nodejs'

/** Merged facility week: published program + assessments + rental holds + agreements. */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const weekStartRaw = searchParams.get('weekStart')?.trim()
    const base = weekStartRaw ? new Date(`${weekStartRaw}T12:00:00`) : new Date()
    const sun = startOfScheduleWeek(base)
    const { week, blocks } = await buildFacilityCalendarFeed(sun)
    return NextResponse.json({ weekStart: week.weekStart, weekEnd: week.weekEnd, blocks })
  } catch (e) {
    console.error('[calendar-feed]', e)
    return NextResponse.json({ error: 'Failed to build calendar feed' }, { status: 500 })
  }
}
