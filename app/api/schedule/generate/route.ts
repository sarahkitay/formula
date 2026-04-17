import { NextResponse } from 'next/server'
import { generate12WeekCycle, startOfScheduleWeek } from '@/lib/schedule/generator'
import { fetchFacilityScheduleConfig } from '@/lib/schedule/facility-schedule-config-server'
import { buildPublishedWeek } from '@/lib/schedule/published-week'
import type { ScheduleOverride } from '@/types/schedule'

/**
 * GET /api/schedule/generate?weekStart=YYYY-MM-DD&weeks=1|12
 * Returns facility schedule merged with saved config (unless `overrides` query replaces overrides only).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const weekStartRaw = searchParams.get('weekStart')
  const weeksRaw = searchParams.get('weeks') ?? '1'

  const base = weekStartRaw ? new Date(`${weekStartRaw}T12:00:00`) : new Date()
  const sun = startOfScheduleWeek(base)
  const weeks = Math.min(12, Math.max(1, parseInt(weeksRaw, 10) || 1))

  const dbConfig = await fetchFacilityScheduleConfig()
  let overrides = dbConfig.overrides
  const ov = searchParams.get('overrides')
  if (ov) {
    try {
      overrides = JSON.parse(ov) as ScheduleOverride[]
    } catch {
      return NextResponse.json({ error: 'Invalid overrides JSON' }, { status: 400 })
    }
  }

  const mergedConfig = { ...dbConfig, overrides }

  if (weeks === 1) {
    const week = buildPublishedWeek(sun, mergedConfig)
    return NextResponse.json({ mode: 'single', week })
  }

  const multi = generate12WeekCycle(sun, mergedConfig.overrides, mergedConfig.blockedDates)
  return NextResponse.json({ mode: 'cycle', ...multi })
}
