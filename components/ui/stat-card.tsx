import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export type StatDataModule = 'revenue' | 'performance' | 'alerts'

export interface StatCardProps {
  label: string
  value: string | number | React.ReactNode
  delta?: {
    value: string | React.ReactNode
    direction: 'up' | 'down' | 'neutral'
    label?: string
  }
  /** Live / signal emphasis (brand yellow) */
  accent?: boolean
  dataModule?: StatDataModule
  /**
   * `full` = diagonal gradient across the entire tile (brand pitch green #005700 family). Default.
   * `corner` = top-right glow only (opt out of full wash).
   */
  surface?: 'corner' | 'full'
  className?: string
  sublabel?: string | React.ReactNode
  /** When set, the entire card is a link (focus ring + hover). */
  href?: string
}

/**
 * One shared ellipse (top-right): hue shifts only so rows of 4 read as a set.
 * Ellipse extends slightly past the top edge so the glow feels attached to the corner, not a floating blob.
 */
const CORNER_GLOW_BASE =
  'after:pointer-events-none after:absolute after:inset-0 after:z-0 after:rounded-[inherit] after:bg-[radial-gradient(ellipse_95%_72%_at_100%_-8%,var(--stat-glow)_0%,transparent_62%)]'

const GLOW: Record<'signal' | StatDataModule | 'default', string> = {
  signal: '[--stat-glow:rgb(0_87_0_/_0.16)]',
  performance: '[--stat-glow:rgb(0_87_0_/_0.13)]',
  revenue: '[--stat-glow:rgb(244_254_0_/_0.22)]',
  alerts: '[--stat-glow:rgb(64_64_64_/_0.07)]',
  default: '[--stat-glow:rgb(0_87_0_/_0.085)]',
}

function cornerGlowClass(accent: boolean | undefined, dataModule: StatDataModule | undefined): string {
  if (accent) return cn(CORNER_GLOW_BASE, GLOW.signal)
  if (dataModule) return cn(CORNER_GLOW_BASE, GLOW[dataModule])
  return cn(CORNER_GLOW_BASE, GLOW.default)
}

const FULL_LAYER =
  'before:pointer-events-none before:absolute before:inset-0 before:z-0 before:rounded-[inherit]'

/** One shared full-tile wash: pitch green (#005700) only, light center for legibility (low-opacity corners). */
const FULL_SURFACE_GREEN =
  `${FULL_LAYER} before:bg-gradient-to-br before:from-[#005700]/22 before:via-[#f6fbf6] before:via-44% before:to-[#005700]/12`

export function StatCard({
  label,
  value,
  delta,
  accent,
  dataModule,
  surface = 'full',
  sublabel,
  className,
  href,
}: StatCardProps) {
  const deltaColor =
    delta?.direction === 'up'
      ? 'text-success'
      : delta?.direction === 'down'
        ? 'text-error'
        : 'text-text-muted'

  const useFullSurface = surface === 'full'

  const shellClass = cn(
    'relative grid min-h-[120px] grid-rows-[auto_minmax(0,1fr)_auto] gap-y-2 px-5 pb-4 pt-5',
    accent ? 'stat-module--signal' : 'stat-module',
    useFullSurface ? FULL_SURFACE_GREEN : cornerGlowClass(accent, dataModule),
    href &&
      'cursor-pointer transition-[opacity,filter] duration-150 hover:brightness-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005700]',
    className
  )

  const inner = (
    <>
      <p
        className={cn(
          'relative z-[1] row-start-1 ml-auto max-w-[75%] text-right text-[10px] font-medium uppercase leading-snug tracking-[0.14em]',
          accent ? 'text-foreground/80' : 'text-text-muted'
        )}
      >
        {label}
      </p>

      <div className="relative z-[1] row-start-2 flex min-h-0 min-w-0 items-end self-stretch">
        <p
          className={cn(
            'w-full text-4xl font-semibold tabular-nums tracking-tight text-text-primary md:text-[2.35rem] md:leading-none',
            accent && 'text-foreground'
          )}
        >
          {value}
        </p>
      </div>

      <div className="relative z-[1] row-start-3 flex min-h-[1.25rem] flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] leading-snug">
        {delta && (
          <>
            <span className={cn('font-medium', deltaColor)}>{delta.value}</span>
            {delta.label && <span className="text-text-muted">{delta.label}</span>}
          </>
        )}
        {sublabel != null && !delta && (
          <span className="text-text-muted">{typeof sublabel === 'string' ? sublabel : sublabel}</span>
        )}
      </div>
    </>
  )

  if (href) {
    return (
      <Link href={href} className={cn(shellClass, 'block text-inherit no-underline')}>
        {inner}
      </Link>
    )
  }

  return <div className={shellClass}>{inner}</div>
}
