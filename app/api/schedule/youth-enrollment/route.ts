import { NextResponse } from 'next/server'
import { fetchYouthBlockEnrollmentBySlotRef } from '@/lib/schedule/youth-block-enrollment'

export const runtime = 'nodejs'

/** GET ?weekStart=YYYY-MM-DD — confirmed booking counts per `book-*` slot_ref for that schedule week. */
export async function GET(req: Request) {
  const weekStart = new URL(req.url).searchParams.get('weekStart')?.trim()
  if (!weekStart || !/^\d{4}-\d{2}-\d{2}$/.test(weekStart)) {
    return NextResponse.json({ error: 'weekStart=YYYY-MM-DD is required' }, { status: 400 })
  }
  try {
    const map = await fetchYouthBlockEnrollmentBySlotRef(weekStart)
    return NextResponse.json({ counts: Object.fromEntries(map) })
  } catch (e) {
    console.error('[youth-enrollment]', e)
    return NextResponse.json({ error: 'Failed to load enrollment' }, { status: 500 })
  }
}
