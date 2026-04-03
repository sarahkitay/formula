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
    <div className="border border-black/10 bg-white p-5 font-mono shadow-lab">
      <h4 className="mb-4 text-[10px] uppercase tracking-[0.2em] text-zinc-500">Facility load</h4>
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-black/10 pb-2 text-xs uppercase text-zinc-500">
          <span>Queue // bookings</span>
          <span className="bg-[#f4fe00] px-1 font-bold text-[#1a1a1a]">{bookingCount}</span>
        </div>
        <div className="flex items-center justify-between border-b border-black/10 pb-2 text-xs uppercase text-zinc-500">
          <span>Checked in</span>
          <span className="font-bold text-[#005700]">{checkedInCount}</span>
        </div>
        <div className="flex items-center justify-between pb-1 text-xs uppercase text-zinc-500">
          <span>Next block ({nextBlockLabel})</span>
          <span className="font-bold text-[#1a1a1a]">
            {nextBlockBooked}/{nextBlockCapacity}
          </span>
        </div>
      </div>
    </div>
  )
}
