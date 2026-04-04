'use client'

import type { ReactNode } from 'react'
import { MEDIA_OVERLAY_PANEL_CLASS } from '@/lib/marketing/media-overlay-panel'
import { useFadeInOnView } from '@/lib/use-fade-in-on-view'
import { cn } from '@/lib/utils'

type MediaOverlayTextPanelProps = {
  children: ReactNode
  className?: string
  /** `panel` = glass card; `bare` = motion only (e.g. left-aligned copy on scrim without a box). */
  variant?: 'panel' | 'bare'
}

/**
 * Copy over full-bleed media: on scroll, fades in and slides in from the right.
 *
 * Do not paste `<Image alt="…">` or `aria-label` text as visible body copy here. `aria-hidden` on a child does **not** hide it on screen, only from assistive tech.
 */
export function MediaOverlayTextPanel({ children, className, variant = 'panel' }: MediaOverlayTextPanelProps) {
  const { ref, visible } = useFadeInOnView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={cn(
        variant === 'panel' && MEDIA_OVERLAY_PANEL_CLASS,
        'transition-[opacity_900ms_cubic-bezier(0.22,1,0.36,1),transform_900ms_cubic-bezier(0.22,1,0.36,1),background-color_280ms_ease-out,box-shadow_280ms_ease-out,border-color_280ms_ease-out] motion-reduce:transition-none',
        variant === 'panel' &&
          '[@media(hover:hover)]:hover:bg-formula-deep/48 [@media(hover:hover)]:hover:border-formula-frost/12 [@media(hover:hover)]:hover:shadow-[0_14px_44px_-12px_rgba(0,0,0,0.4)]',
        variant === 'panel' && 'active:bg-formula-deep/48 active:border-formula-frost/12 active:shadow-[0_14px_44px_-12px_rgba(0,0,0,0.4)]',
        visible ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-10 opacity-0 motion-reduce:translate-x-0',
        className
      )}
    >
      {children}
    </div>
  )
}
