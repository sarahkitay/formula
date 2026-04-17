import { NextResponse } from 'next/server'
import { startOfScheduleWeek } from '@/lib/schedule/generator'
import { fetchFacilityScheduleConfig } from '@/lib/schedule/facility-schedule-config-server'
import { buildPublishedWeek } from '@/lib/schedule/published-week'

export const runtime = 'nodejs'

/**
 * Published facility week (slots) + cycle headline fields for grids and portals.
 * GET ?weekStart=YYYY-MM-DD (optional; defaults to current schedule week Sunday).
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const weekStartRaw = searchParams.get('weekStart')?.trim()
    const base = weekStartRaw ? new Date(`${weekStartRaw}T12:00:00`) : new Date()
    const sun = startOfScheduleWeek(base)
    const config = await fetchFacilityScheduleConfig()
    const week = buildPublishedWeek(sun, config)

    return NextResponse.json({
      week,
      cycle: {
        currentCycleLabel: config.currentCycleLabel,
        weekInCycle: config.weekInCycle,
        totalWeeksInCycle: config.totalWeeksInCycle,
        nextCycleStartDisplay: config.nextCycleStartDisplay,
      },
    })
  } catch (e) {
    console.error('[published-week]', e)
    return NextResponse.json({ error: 'Failed to load published week' }, { status: 500 })
  }
}
