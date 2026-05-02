'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import type { FormulaPillar } from '@/lib/marketing/formula-pillars'
import { cn } from '@/lib/utils'

export type FpiPillar = FormulaPillar

export type FpiPillarsInteractiveProps = {
  intro: string
  pillars: readonly FpiPillar[]
  /**
   * `toggle` — tap/hover reveals assessment copy (e.g. Skills Check page).
   * `expanded` — kicker, title, optional shared photo, and assessment sentence always visible (e.g. The Formula page).
   */
  cardLayout?: 'toggle' | 'expanded'
  /** Used with `cardLayout="expanded"` — one action shot reused on every pillar card until pillar-specific art exists. */
  expandedCardImageSrc?: string
}

export function FpiPillarsInteractive({
  intro,
  pillars,
  cardLayout = 'toggle',
  expandedCardImageSrc,
}: FpiPillarsInteractiveProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = useCallback((i: number) => {
    setOpenIndex(prev => (prev === i ? null : i))
  }, [])

  const onPillarClick = useCallback(
    (i: number) => {
      if (typeof window === 'undefined') return
      if (window.matchMedia('(max-width: 767px)').matches) toggle(i)
    },
    [toggle]
  )

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const clear = () => {
      if (mq.matches) setOpenIndex(null)
    }
    mq.addEventListener('change', clear)
    return () => mq.removeEventListener('change', clear)
  }, [])

  const expanded = cardLayout === 'expanded'

  return (
    <div className="not-prose my-10">
      <p className="mb-8 max-w-[52ch] text-[15px] leading-relaxed text-formula-frost/85">{intro}</p>
      <ul
        className={cn(
          'm-0 grid list-none gap-3 p-0',
          expanded ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4'
        )}
        role="list"
      >
        {pillars.map((p, i) => {
          if (expanded) {
            return (
              <li key={p.title} className="m-0 p-0 before:hidden">
                <article className="flex h-full flex-col rounded-sm border border-white/[0.12] bg-formula-deep/50 p-3 sm:p-4">
                  {p.kicker ? (
                    <p className="mb-1 font-mono text-[8px] font-semibold uppercase leading-snug tracking-[0.14em] text-formula-volt sm:text-[9px]">
                      {p.kicker}
                    </p>
                  ) : null}
                  <h3 className="m-0 font-mono text-[12px] font-semibold leading-snug tracking-wide text-formula-paper sm:text-[13px]">{p.title}</h3>
                  {expandedCardImageSrc ? (
                    <div className="relative mt-3 aspect-[4/3] w-full shrink-0 overflow-hidden rounded border border-white/[0.12]">
                      <Image
                        src={expandedCardImageSrc}
                        alt="Youth athletes on indoor turf at Formula Soccer Center — representative of the assessment environment."
                        fill
                        className="object-cover"
                        sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                      />
                    </div>
                  ) : null}
                  <p className="mt-3 text-left text-[13px] leading-relaxed text-zinc-300">{p.description}</p>
                </article>
              </li>
            )
          }

          const open = openIndex === i
          return (
            <li key={p.title} className="m-0 p-0 before:hidden">
              <button
                type="button"
                onClick={() => onPillarClick(i)}
                className={cn(
                  'group flex h-full min-h-[150px] w-full flex-col rounded-sm border border-white/[0.08] bg-formula-deep/40 p-3 text-left transition-[border-color,background-color,box-shadow] duration-300 sm:min-h-[180px]',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-formula-volt/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-formula-deep)]',
                  'md:min-h-[300px] md:p-4',
                  open && 'border-formula-volt/30 bg-formula-deep/55 shadow-[inset_0_0_0_1px_rgb(220_255_0_/_.08)]',
                  'md:hover:border-formula-frost/20 md:hover:bg-formula-deep/48 md:hover:shadow-[inset_0_0_0_1px_rgb(205_225_225_/_.1)]'
                )}
                aria-expanded={open}
                aria-controls={`fpi-pillar-panel-${i}`}
                id={`fpi-pillar-trigger-${i}`}
              >
                {p.kicker ? (
                  <p className="mb-1 font-mono text-[8px] font-semibold uppercase leading-snug tracking-[0.14em] text-formula-volt sm:text-[9px]">
                    {p.kicker}
                  </p>
                ) : null}
                <h3 className="m-0 min-h-[2.5rem] font-mono text-[11px] font-semibold leading-snug tracking-wide text-formula-paper sm:min-h-0 sm:text-[12px] md:tracking-tight">
                  {p.title}
                </h3>
                <div className="relative mt-2 flex min-h-[88px] flex-1 flex-col justify-end sm:min-h-[100px] md:mt-3 md:min-h-[132px]">
                  <div
                    className="relative w-full overflow-hidden rounded-[2px] border border-white/[0.12] bg-white/[0.04] shadow-[inset_0_1px_0_0_rgb(255_255_255_/_.06)]"
                    style={{
                      height: `${52 + (i % 5) * 7}%`,
                      animationDelay: `${100 + i * 70}ms`,
                    }}
                    aria-hidden
                  />
                </div>
                <div
                  id={`fpi-pillar-panel-${i}`}
                  role="region"
                  aria-labelledby={`fpi-pillar-trigger-${i}`}
                  className={cn(
                    'overflow-hidden transition-[max-height,opacity,margin,padding] duration-300 ease-out',
                    open
                      ? 'max-md:mt-3 max-md:max-h-[min(24rem,55vh)] max-md:border-t max-md:border-white/[0.06] max-md:pt-3 max-md:opacity-100'
                      : 'max-md:max-h-0 max-md:opacity-0',
                    'md:mt-0 md:max-h-0 md:border-t-0 md:pt-0 md:opacity-0',
                    'md:group-hover:mt-3 md:group-hover:max-h-[min(20rem,40vh)] md:group-hover:border-t md:group-hover:border-white/[0.06] md:group-hover:pt-3 md:group-hover:opacity-100',
                    'md:group-focus-within:mt-3 md:group-focus-within:max-h-[min(20rem,40vh)] md:group-focus-within:border-t md:group-focus-within:border-white/[0.06] md:group-focus-within:pt-3 md:group-focus-within:opacity-100'
                  )}
                >
                  <p className="m-0 text-left text-[13px] leading-relaxed text-formula-frost/88">{p.description}</p>
                </div>
                <span className="mt-auto pt-2 font-mono text-[8px] uppercase tracking-[0.14em] text-formula-olive md:hidden">
                  {open ? 'Tap to close' : 'Tap for detail'}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      {expanded ? null : (
        <p className="mt-5 hidden font-mono text-[9px] uppercase tracking-[0.16em] text-formula-olive md:block">
          Hover or focus a pillar for detail
        </p>
      )}
    </div>
  )
}
