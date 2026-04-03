'use client'

import { cn } from '@/lib/utils'

/** Mount point for Recharts / custom viz; wire to performance API in V2. */
export function ChartPlaceholder({
  title = 'Chart mount // API V2',
  className,
}: {
  title?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'border border-dashed border-white/15 bg-black/20 p-10 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-zinc-500',
        className
      )}
    >
      {title}
    </div>
  )
}
