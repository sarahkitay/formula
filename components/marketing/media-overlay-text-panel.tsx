'use client'

import type { ReactNode } from 'react'
import { MEDIA_OVERLAY_PANEL_CLASS } from '@/lib/marketing/media-overlay-panel'
import { useFadeInOnView } from '@/lib/use-fade-in-on-view'
import { cn } from '@/lib/utils'

type MediaOverlayTextPanelProps = {
  children: ReactNode
  className?: string
}

/**
 * Copy card over full-bleed media: stays hidden until intersecting viewport, then fades in so photo/video stays visible first.
 *
 * Do not paste `<Image alt="…">` or `aria-label` text as visible body copy here — `aria-hidden` on a child does **not** hide it on screen, only from assistive tech.
 */
export function MediaOverlayTextPanel({ children, className }: MediaOverlayTextPanelProps) {
  const { ref, visible } = useFadeInOnView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={cn(
        MEDIA_OVERLAY_PANEL_CLASS,
        'transition-[opacity_900ms_cubic-bezier(0.22,1,0.36,1),transform_900ms_cubic-bezier(0.22,1,0.36,1),background-color_280ms_ease-out,box-shadow_280ms_ease-out,border-color_280ms_ease-out] motion-reduce:transition-none',
        '[@media(hover:hover)]:hover:bg-formula-deep/48 [@media(hover:hover)]:hover:border-formula-frost/12 [@media(hover:hover)]:hover:shadow-[0_14px_44px_-12px_rgba(0,0,0,0.4)]',
        'active:bg-formula-deep/48 active:border-formula-frost/12 active:shadow-[0_14px_44px_-12px_rgba(0,0,0,0.4)]',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-7 opacity-0',
        className
      )}
    >
      {children}
    </div>
  )
}
