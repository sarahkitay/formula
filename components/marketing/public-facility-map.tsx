'use client'

import * as React from 'react'
import { FACILITY_ZONES, type PublicFacilityZoneId } from '@/lib/marketing/facility-zones'
import { cn } from '@/lib/utils'

export type { PublicFacilityZoneId }

const GRID_AREAS = `
  "f3 f1 perf f2"
  "ds f1 perf fb"
  "st f1 sup fb"
`

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
        <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.22em] text-formula-olive md:text-[10px]">
          Floor plan · select a zone
        </p>
        <div
          className={cn(
            'grid w-full gap-1 rounded-sm border border-white/[0.07] bg-formula-deep/40 p-1 md:gap-1.5 md:p-1.5',
            compact ? 'min-h-[200px] max-h-[min(52vw,240px)]' : 'min-h-[min(52vw,380px)] md:min-h-[420px]'
          )}
          style={{
            gridTemplateAreas: GRID_AREAS,
            gridTemplateColumns: 'minmax(0,0.9fr) minmax(0,2.1fr) minmax(0,1fr) minmax(0,1fr)',
            gridTemplateRows: 'minmax(2.5rem,1fr) minmax(2.5rem,1fr) minmax(3rem,1.2fr)',
          }}
          role="group"
          aria-label="Facility floor plan. Select a zone"
        >
          {FACILITY_ZONES.map(z => {
            const sel = selected === z.id
            const support = z.emphasis === 'support'
            return (
              <button
                key={z.id}
                type="button"
                style={{ gridArea: z.gridArea }}
                onClick={() => setSelected(z.id)}
                className={cn(
                  'group relative flex min-h-0 min-w-0 flex-col items-center justify-start border px-1.5 py-2 text-center transition-[border-color,background-color,box-shadow] duration-300 md:px-2 md:py-2.5',
                  support
                    ? 'border-white/[0.06] bg-white/[0.015] md:py-2'
                    : 'border-white/[0.1] bg-white/[0.03]',
                  sel
                    ? 'border-formula-volt/50 bg-formula-volt/[0.07] shadow-[inset_0_0_0_1px_rgb(220_255_0/0.2)]'
                    : 'hover:border-white/20 hover:bg-white/[0.05]'
                )}
              >
                <span
                  className={cn(
                    'font-mono uppercase leading-tight tracking-[0.1em]',
                    support ? 'text-[8px] text-formula-mist/80 md:text-[9px]' : 'text-[9px] text-formula-paper md:text-[10px]',
                    sel && !support && 'text-formula-paper'
                  )}
                >
                  {z.label}
                </span>
                {z.sub ? (
                  <span
                    className={cn(
                      'mt-0.5 font-mono text-[7px] uppercase tracking-[0.14em] md:text-[8px]',
                      support ? 'text-formula-olive/90' : 'text-formula-volt/85'
                    )}
                  >
                    {z.sub}
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
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
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-formula-mist">
              Zone detail
            </p>
            <h3 className="mt-3 font-mono text-lg font-semibold tracking-tight text-formula-paper">
              {detail.label}
              {detail.sub && (
                <span className="block text-xs font-normal uppercase tracking-[0.16em] text-formula-volt/90">
                  {detail.sub}
                </span>
              )}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-formula-frost/85">{detail.copy}</p>
            <div
              className={cn(
                'mt-auto font-mono text-[9px] uppercase tracking-[0.18em] text-formula-olive',
                compact ? 'pt-4' : 'pt-8'
              )}
            >
              Click another zone to compare
            </div>
          </>
        ) : (
          <p className="text-center text-sm text-formula-mist">
            Select a zone on the plan to read how that asset supports progression.
          </p>
        )}
      </aside>
    </div>
  )
}
