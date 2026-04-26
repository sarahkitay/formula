import { NextResponse } from 'next/server'
import { startOfScheduleWeek } from '@/lib/schedule/generator'
import { fetchFacilityScheduleConfig } from '@/lib/schedule/facility-schedule-config-server'
import { buildPublishedWeek } from '@/lib/schedule/published-week'
import { getBookableYouthSlots } from '@/lib/schedule/parent'
import { fetchYouthBlockEnrollmentBySlotRef } from '@/lib/schedule/youth-block-enrollment'
import type { ScheduleAgeBand } from '@/types/schedule'

export const runtime = 'nodejs'

const BANDS: ScheduleAgeBand[] = ['2-3', '4-5', '6-8', '9-11', '12-14', '15-19']

/**
 * Published youth training blocks (Performance Center anchors) by age band for one facility week.
 * GET ?weekStart=YYYY-MM-DD (optional; defaults to current week Sunday in server-local schedule math).
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const weekStartRaw = searchParams.get('weekStart')?.trim()
    const base = weekStartRaw ? new Date(`${weekStartRaw}T12:00:00`) : new Date()
    const sun = startOfScheduleWeek(base)
    const config = await fetchFacilityScheduleConfig()
    const week = buildPublishedWeek(sun, config)
    const enrollment = await fetchYouthBlockEnrollmentBySlotRef(week.weekStart)

    const bands: Record<string, ReturnType<typeof getBookableYouthSlots>> = {}
    for (const b of BANDS) {
      bands[b] = getBookableYouthSlots(week, b, enrollment)
    }

    return NextResponse.json({
      weekStart: week.weekStart,
      bands,
      cycle: {
        currentCycleLabel: config.currentCycleLabel,
        weekInCycle: config.weekInCycle,
        totalWeeksInCycle: config.totalWeeksInCycle,
        nextCycleStartDisplay: config.nextCycleStartDisplay,
      },
    })
  } catch (e) {
    console.error('[published-blocks]', e)
    return NextResponse.json({ error: 'Failed to load published blocks' }, { status: 500 })
  }
}
