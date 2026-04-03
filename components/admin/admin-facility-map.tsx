'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { FacilityAsset, AssetStatus } from '@/lib/mock-data/admin-operating-system'

const STATUS_STROKE: Record<AssetStatus, string> = {
  'in-use': 'rgb(34 197 94 / 0.85)',
  available: 'rgb(113 113 122 / 0.6)',
  reserved: 'rgb(234 179 8 / 0.85)',
  closed: 'rgb(239 68 68 / 0.75)',
}

const STATUS_FILL: Record<AssetStatus, string> = {
  'in-use': 'rgb(34 197 94 / 0.12)',
  available: 'rgb(255 255 255 / 0.03)',
  reserved: 'rgb(234 179 8 / 0.1)',
  closed: 'rgb(239 68 68 / 0.08)',
}

function heatOverlay(load: number) {
  const o = Math.min(1, Math.max(0, load))
  return `rgb(244 254 0 / ${0.05 + o * 0.2})`
}

export interface AdminFacilityMapProps {
  assets: FacilityAsset[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function AdminFacilityMap({ assets, selectedId, onSelect }: AdminFacilityMapProps) {
  const byId = React.useMemo(() => new Map(assets.map(a => [a.id, a])), [assets])

  const Zone = ({
    id,
    x,
    y,
    w,
    h,
    label,
  }: {
    id: string
    x: number
    y: number
    w: number
    h: number
    label: string
  }) => {
    const a = byId.get(id)
    if (!a) return null
    const sel = selectedId === id
    return (
      <g
        role="button"
        tabIndex={0}
        className="cursor-pointer outline-none"
        onClick={() => onSelect(id)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect(id)
          }
        }}
      >
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          fill={heatOverlay(a.load)}
          stroke={STATUS_STROKE[a.status]}
          strokeWidth={sel ? 3 : 1.5}
          className="transition-[stroke-width] duration-150"
        />
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          fill={STATUS_FILL[a.status]}
          pointerEvents="none"
        />
        <text
          x={x + w / 2}
          y={y + 22}
          textAnchor="middle"
          className="fill-zinc-100 font-mono text-[11px] font-bold uppercase tracking-wide"
          pointerEvents="none"
        >
          {label}
        </text>
        <text
          x={x + w / 2}
          y={y + 40}
          textAnchor="middle"
          className="fill-zinc-400 font-mono text-[9px] uppercase"
          pointerEvents="none"
        >
          {a.status.replace('-', ' ')}
        </text>
        <text
          x={x + w / 2}
          y={y + h - 12}
          textAnchor="middle"
          className="fill-zinc-500 font-mono text-[8px]"
          pointerEvents="none"
        >
          {a.utilizationPct}% util
        </text>
      </g>
    )
  }

  return (
    <div className="border border-white/10 bg-[#0f0f0f] p-4">
      <svg viewBox="0 0 1000 520" className="h-auto w-full" aria-label="Facility operations map">
        <rect x="8" y="8" width="984" height="504" fill="none" stroke="rgb(255 255 255 / 0.06)" strokeWidth="1" />
        <text x="24" y="36" className="fill-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em]">
          OPERATIONS_GRID // LIVE
        </text>

        <Zone id="field-1" x={24} y={80} w={200} h={120} label="Field 1" />
        <Zone id="field-2" x={232} y={80} w={200} h={120} label="Field 2" />
        <Zone id="field-3" x={440} y={80} w={200} h={120} label="Field 3" />
        <Zone id="match-arena" x={648} y={80} w={328} h={120} label="Match Arena" />

        <Zone id="speed-track" x={24} y={216} w={952} h={72} label="Speed Track" />

        <Zone id="double-speed" x={24} y={304} w={470} h={100} label="Double Speed Courts" />
        <Zone id="speed-court" x={506} y={304} w={470} h={100} label="Speed Court" />

        <Zone id="footbot" x={24} y={420} w={220} h={88} label="Footbot" />
        <Zone id="gym" x={252} y={420} w={220} h={88} label="Gym" />
        <Zone id="flex-room" x={480} y={420} w={220} h={88} label="Flex Room" />
        <Zone id="party-room" x={708} y={420} w={268} h={88} label="Party Room" />
      </svg>
    </div>
  )
}

export function AdminFacilityMapLegend({ className }: { className?: string }) {
  const items: { label: string; status: AssetStatus }[] = [
    { label: 'In use', status: 'in-use' },
    { label: 'Available', status: 'available' },
    { label: 'Reserved', status: 'reserved' },
    { label: 'Closed', status: 'closed' },
  ]
  return (
    <div className={cn('flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-wide text-zinc-400', className)}>
      {items.map(i => (
        <div key={i.status} className="flex items-center gap-2">
          <span className="h-2 w-4 border" style={{ borderColor: STATUS_STROKE[i.status], background: STATUS_FILL[i.status] }} />
          {i.label}
        </div>
      ))}
      <span className="text-zinc-600">· Heat = load</span>
    </div>
  )
}
