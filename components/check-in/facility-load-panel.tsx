'use client'

interface FacilityLoadPanelProps {
  checkedInCount: number
  bookingCount: number
  nextBlockLabel: string
  nextBlockBooked: number
  nextBlockCapacity: number
}

export function FacilityLoadPanel({
  checkedInCount,
  bookingCount,
  nextBlockLabel,
  nextBlockBooked,
  nextBlockCapacity,
}: FacilityLoadPanelProps) {
  return (
    <div className="border border-formula-frost/12 bg-formula-paper/[0.04] p-5 font-mono shadow-[inset_0_1px_0_0_rgb(255_255_255_/_.04)]">
      <h4 className="mb-4 text-[10px] uppercase tracking-[0.2em] text-formula-mist">Facility load</h4>
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-formula-frost/10 pb-2 text-xs uppercase text-formula-frost/75">
          <span>Queue // bookings</span>
          <span className="bg-formula-volt/90 px-2 py-0.5 font-bold text-formula-base">{bookingCount}</span>
        </div>
        <div className="flex items-center justify-between border-b border-formula-frost/10 pb-2 text-xs uppercase text-formula-frost/75">
          <span>Checked in</span>
          <span className="font-bold text-success">{checkedInCount}</span>
        </div>
        <div className="flex items-center justify-between pb-1 text-xs uppercase text-formula-frost/75">
          <span>Next block ({nextBlockLabel})</span>
          <span className="font-bold text-formula-paper">
            {nextBlockBooked}/{nextBlockCapacity}
          </span>
        </div>
      </div>
    </div>
  )
}
