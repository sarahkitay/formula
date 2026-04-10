'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface ModuleDataPoint {
  label: string
  value: string | number
  /** When true, render value in pitch green / volt accent */
  highlight?: 'green' | 'volt'
}

export interface ModuleBlockProps {
  id: string
  title: string
  summary: string
  dataPoints: ModuleDataPoint[]
  href: string
  className?: string
  /** Parent portal OS: frosted green-tinted tile on gradient canvas */
  surface?: 'light' | 'portal'
}

export function ModuleBlock({
  id,
  title,
  summary,
  dataPoints,
  href,
  className,
  surface = 'light',
}: ModuleBlockProps) {
  const portal = surface === 'portal'

  return (
    <Link
      href={href}
      className={cn(
        'group relative flex min-h-[220px] w-full flex-col justify-between p-6 transition-colors sm:aspect-[4/3] sm:min-h-0',
        'cursor-pointer touch-manipulation outline-offset-2 focus-visible:outline focus-visible:outline-2',
        portal
          ? 'border border-formula-frost/14 bg-formula-paper/[0.04] shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)] hover:border-formula-volt/30 hover:bg-formula-paper/[0.07] focus-visible:outline-formula-volt/50'
          : 'border border-black/10 bg-white hover:border-black focus-visible:outline-[#005700]',
        className
      )}
    >
      <div
        className={cn(
          'pointer-events-none absolute right-0 top-0 p-2 text-[8px] font-bold',
          portal ? 'text-formula-mist/90' : 'text-zinc-300'
        )}
      >
        REF_{id}
      </div>

      <div className="relative min-w-0">
        <h3
          className={cn(
            'mb-2 font-sans text-xl font-black uppercase leading-none tracking-tight',
            portal ? 'text-formula-paper' : 'text-[#1a1a1a]'
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            'max-w-[200px] text-xs font-medium leading-tight',
            portal ? 'text-formula-frost/80' : 'text-zinc-500'
          )}
        >
          {summary}
        </p>
      </div>

      <div
        className={cn(
          'space-y-1 border-t pt-4 font-mono',
          portal ? 'border-formula-frost/10' : 'border-black/5'
        )}
      >
        {dataPoints.map((dp, i) => (
          <div key={i} className="flex items-baseline justify-between gap-2">
            <span
              className={cn(
                'text-[10px] font-bold uppercase tracking-tight',
                portal ? 'text-formula-mist' : 'text-zinc-400'
              )}
            >
              {dp.label}
            </span>
            <span
              className={cn(
                'text-right text-sm font-bold',
                portal ? 'text-formula-paper' : 'text-[#1a1a1a]',
                dp.highlight === 'green' && (portal ? 'text-formula-volt' : 'text-[#005700]'),
                dp.highlight === 'volt' &&
                  'bg-[#f4fe00] px-1 py-px text-[#1a1a1a] [box-decoration-break:clone]'
              )}
            >
              {dp.value}
            </span>
          </div>
        ))}
      </div>

      <div
        className={cn(
          'pointer-events-none absolute bottom-0 right-0 h-4 w-4 border-l border-t opacity-0 transition-opacity group-hover:opacity-100',
          portal ? 'border-formula-frost/20' : 'border-black/10'
        )}
        aria-hidden
      />
    </Link>
  )
}
