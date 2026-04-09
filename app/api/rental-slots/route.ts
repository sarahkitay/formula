import { NextResponse } from 'next/server'
import { listUnavailableSlotsForDate, releasePendingSlotByRef } from '@/lib/rentals/rental-slots'

export const runtime = 'nodejs'

/** Calendar availability for the booking UI (same field + date + window cannot double-book). */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')?.trim()
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Query ?date=YYYY-MM-DD is required' }, { status: 400 })
  }

  try {
    const booked = await listUnavailableSlotsForDate(date)
    return NextResponse.json({ date, booked })
  } catch (e) {
    console.error('[rental-slots GET]', e)
    return NextResponse.json({ error: 'Failed to load availability' }, { status: 500 })
  }
}

/** Release a pending hold when the renter backs out before paying (checkout not completed). */
export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const action = (body as { action?: unknown }).action
  if (action !== 'release_pending') {
    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 })
  }

  const rentalRef = typeof (body as { rentalRef?: unknown }).rentalRef === 'string' ? (body as { rentalRef: string }).rentalRef.trim() : ''
  if (!rentalRef) {
    return NextResponse.json({ error: 'rentalRef is required' }, { status: 400 })
  }

  try {
    await releasePendingSlotByRef(rentalRef)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[rental-slots POST]', e)
    return NextResponse.json({ error: 'Failed to release hold' }, { status: 500 })
  }
}
