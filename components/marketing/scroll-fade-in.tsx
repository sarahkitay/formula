'use client'

import type { ReactNode } from 'react'
import { useFadeInOnView } from '@/lib/use-fade-in-on-view'
import { cn } from '@/lib/utils'

/** Scroll-triggered opacity fade (respects `prefers-reduced-motion` via hook). */
export function ScrollFadeIn({ children, className }: { children: ReactNode; className?: string }) {
  const { ref, visible } = useFadeInOnView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={cn(
        'transition-opacity duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
        visible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      {children}
    </div>
  )
}
