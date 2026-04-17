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
}

export function ModuleBlock({
  id,
  title,
  summary,
  dataPoints,
  href,
  className,
}: ModuleBlockProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative flex min-h-[220px] w-full flex-col justify-between border border-formula-frost/14 bg-formula-paper/[0.04] p-6 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)] transition-colors sm:aspect-[4/3] sm:min-h-0',
        'cursor-pointer touch-manipulation outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-formula-volt/50',
        'hover:border-formula-volt/30 hover:bg-formula-paper/[0.07]',
        className
      )}
    >
      <div className="pointer-events-none absolute right-0 top-0 p-2 text-[8px] font-bold text-formula-mist/90">
        REF_{id}
      </div>

      <div className="relative min-w-0">
        <h3 className="mb-2 font-sans text-xl font-black uppercase leading-none tracking-tight text-formula-paper">
          {title}
        </h3>
        <p className="max-w-[200px] text-xs font-medium leading-tight text-formula-frost/80">{summary}</p>
      </div>

      <div className="space-y-1 border-t border-formula-frost/10 pt-4 font-mono">
        {dataPoints.map((dp, i) => (
          <div key={i} className="flex items-baseline justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-tight text-formula-mist">{dp.label}</span>
            <span
              className={cn(
                'text-right text-sm font-bold text-formula-paper',
                dp.highlight === 'green' && 'text-formula-volt',
                dp.highlight === 'volt' &&
                  'bg-formula-volt px-1 py-px text-formula-base [box-decoration-break:clone]'
              )}
            >
              {dp.value}
            </span>
          </div>
        ))}
      </div>

      <div
        className="pointer-events-none absolute bottom-0 right-0 h-4 w-4 border-l border-t border-formula-frost/20 opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden
      />
    </Link>
  )
}
