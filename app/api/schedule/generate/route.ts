import { NextResponse } from 'next/server'
import { generate12WeekCycle, generateWeeklySchedule, startOfScheduleWeek } from '@/lib/schedule/generator'
import type { ScheduleOverride } from '@/types/schedule'

/**
 * GET /api/schedule/generate?weekStart=YYYY-MM-DD&weeks=1|12
 * Returns system-generated facility schedule (no drag/drop authoring).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const weekStartRaw = searchParams.get('weekStart')
  const weeksRaw = searchParams.get('weeks') ?? '1'

  const base = weekStartRaw ? new Date(`${weekStartRaw}T12:00:00`) : new Date()
  const sun = startOfScheduleWeek(base)
  const weeks = Math.min(12, Math.max(1, parseInt(weeksRaw, 10) || 1))

  let overrides: ScheduleOverride[] = []
  const ov = searchParams.get('overrides')
  if (ov) {
    try {
      overrides = JSON.parse(ov) as ScheduleOverride[]
    } catch {
      return NextResponse.json({ error: 'Invalid overrides JSON' }, { status: 400 })
    }
  }

  if (weeks === 1) {
    const week = generateWeeklySchedule(sun, overrides, 0)
    return NextResponse.json({ mode: 'single', week })
  }

  const multi = generate12WeekCycle(sun, overrides)
  return NextResponse.json({ mode: 'cycle', ...multi })
}
