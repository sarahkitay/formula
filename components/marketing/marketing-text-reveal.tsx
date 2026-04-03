'use client'

import type { ReactNode } from 'react'
import { useFadeInOnView } from '@/lib/use-fade-in-on-view'
import { cn } from '@/lib/utils'

/** Scroll-triggered fade for marketing headings + lead copy (respects `prefers-reduced-motion` via hook). */
export function MarketingTextReveal({ children, className }: { children: ReactNode; className?: string }) {
  const { ref, visible } = useFadeInOnView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={cn(
        'transition-[opacity,transform] duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0',
        className
      )}
    >
      {children}
    </div>
  )
}
