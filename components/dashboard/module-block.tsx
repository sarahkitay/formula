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

export function ModuleBlock({ id, title, summary, dataPoints, href, className }: ModuleBlockProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative flex min-h-[220px] w-full flex-col justify-between border border-black/10 bg-white p-6 transition-colors hover:border-black sm:aspect-[4/3] sm:min-h-0',
        'cursor-pointer touch-manipulation outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#005700]',
        className
      )}
    >
      <div className="pointer-events-none absolute right-0 top-0 p-2 text-[8px] font-bold text-zinc-300">
        REF_{id}
      </div>

      <div className="relative min-w-0">
        <h3 className="mb-2 font-sans text-xl font-black uppercase leading-none tracking-tight text-[#1a1a1a]">
          {title}
        </h3>
        <p className="max-w-[200px] text-xs font-medium leading-tight text-zinc-500">{summary}</p>
      </div>

      <div className="space-y-1 border-t border-black/5 pt-4 font-mono">
        {dataPoints.map((dp, i) => (
          <div key={i} className="flex items-baseline justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-tight text-zinc-400">{dp.label}</span>
            <span
              className={cn(
                'text-right text-sm font-bold text-[#1a1a1a]',
                dp.highlight === 'green' && 'text-[#005700]',
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
        className="pointer-events-none absolute bottom-0 right-0 h-4 w-4 border-l border-t border-black/10 opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden
      />
    </Link>
  )
}
