'use client'

import * as React from 'react'
import { FACILITY_ZONES, type PublicFacilityZoneId } from '@/lib/marketing/facility-zones'
import { cn } from '@/lib/utils'

export type { PublicFacilityZoneId }

export function PublicFacilityMap({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = React.useState<PublicFacilityZoneId | null>(null)
  const detail = selected ? FACILITY_ZONES.find(z => z.id === selected) : null

  return (
  <div
  className={cn(
  'grid lg:grid-cols-[1fr_minmax(260px,320px)] lg:items-start',
  compact ? 'gap-4 md:gap-5' : 'gap-8'
  )}
  >
  <div
  className={cn(
  'marketing-glass overflow-hidden border border-white/[0.08] bg-white/[0.02]',
  compact ? 'p-2.5 md:p-3' : 'p-4 md:p-5'
  )}
  >
  <svg
  viewBox="0 0 1000 520"
  className={cn(
  'h-auto w-full max-w-full select-none',
  compact && 'max-h-[min(52vw,220px)] sm:max-h-[240px] md:max-h-[260px]'
  )}
  preserveAspectRatio="xMidYMid meet"
  aria-label="Facility plan - select a zone"
  >
  <rect x="8" y="8" width="984" height="504" fill="none" stroke="rgb(255 255 255 / 0.07)" strokeWidth={1} />
  <text x="24" y="36" className="fill-formula-olive font-mono text-[10px] uppercase tracking-[0.22em]">
  ASSET_GRID // SELECT
  </text>
  {FACILITY_ZONES.map(z => {
  const sel = selected === z.id
  return (
  <g
  key={z.id}
  role="button"
  tabIndex={0}
  className="cursor-pointer outline-none"
  onClick={() => setSelected(z.id)}
  onKeyDown={e => {
  if (e.key === 'Enter' || e.key === ' ') {
  e.preventDefault()
  setSelected(z.id)
  }
  }}
  >
  <rect
  x={z.x}
  y={z.y}
  width={z.w}
  height={z.h}
  fill={sel ? 'rgb(220 255 0 / 0.07)' : 'rgb(246 249 247 / 0.03)'}
  stroke={sel ? 'rgb(220 255 0 / 0.5)' : 'rgb(205 225 225 / 0.16)'}
  strokeWidth={sel ? 1.25 : 0.75}
  className="transition-[stroke,fill,stroke-width] duration-500"
  style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)' }}
  />
  <text
  x={z.x + z.w / 2}
  y={z.y + (z.sub ? 22 : 28)}
  textAnchor="middle"
  className="fill-formula-paper font-mono text-[10px] font-semibold uppercase tracking-[0.12em]"
  pointerEvents="none"
  >
  {z.label}
  </text>
  {z.sub && (
  <text
  x={z.x + z.w / 2}
  y={z.y + 38}
  textAnchor="middle"
  className="fill-formula-mist font-mono text-[8px] uppercase tracking-[0.14em]"
  pointerEvents="none"
  >
  {z.sub}
  </text>
  )}
  </g>
  )
  })}
  </svg>
  </div>
  <aside
  className={cn(
  'marketing-glass flex flex-col border border-white/[0.08] bg-white/[0.02]',
  compact ? 'min-h-[140px] p-3.5 md:min-h-[180px] md:p-4' : 'min-h-[200px] p-5 md:min-h-[280px]',
  !detail && 'justify-center'
  )}
  aria-live="polite"
  >
  {detail ? (
  <>
  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-formula-mist">Zone detail</p>
  <h3 className="mt-3 font-mono text-lg font-semibold tracking-tight text-formula-paper">
  {detail.label}
  {detail.sub && <span className="block text-xs font-normal uppercase tracking-[0.16em] text-formula-volt/90">{detail.sub}</span>}
  </h3>
  <p className="mt-4 text-sm leading-relaxed text-formula-frost/85">{detail.copy}</p>
  <div className={cn('mt-auto font-mono text-[9px] uppercase tracking-[0.18em] text-formula-olive', compact ? 'pt-4' : 'pt-8')}>Click another zone to compare</div>
  </>
  ) : (
  <p className="text-center text-sm text-formula-mist">Select a zone on the plan to read how that asset supports progression.</p>
  )}
  </aside>
  </div>
  )
}
