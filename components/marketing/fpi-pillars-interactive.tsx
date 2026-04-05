'use client'

import { useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export type FpiPillar = { title: string; description: string }

export function FpiPillarsInteractive({ intro, pillars }: { intro: string; pillars: readonly FpiPillar[] }) {
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

  return (
    <div className="not-prose my-10">
      <p className="mb-8 max-w-[52ch] text-[15px] leading-relaxed text-formula-frost/85">{intro}</p>
      <ul
        className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4"
        role="list"
      >
        {pillars.map((p, i) => {
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
                <h3 className="m-0 min-h-[2.5rem] font-mono text-[10px] font-semibold uppercase leading-snug tracking-[0.1em] text-formula-paper sm:min-h-0 sm:text-[11px] sm:tracking-[0.12em]">
                  {p.title}
                </h3>
                <div className="relative mt-2 flex min-h-[88px] flex-1 flex-col justify-end sm:min-h-[100px] md:mt-3 md:min-h-[132px]">
                  <div
                    className="fpi-pillar-bar relative w-full overflow-hidden rounded-[1px] border border-formula-frost/18 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-formula-volt)_22%,transparent)_0%,color-mix(in_srgb,var(--color-formula-frost)_10%,transparent)_38%,transparent_95%)] shadow-[inset_0_1px_0_0_rgb(255_255_255_/_.07)]"
                    style={{
                      height: `${52 + (i % 5) * 7}%`,
                      animationDelay: `${100 + i * 70}ms`,
                    }}
                    aria-hidden
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,rgb(255_255_255_/_.05),transparent)] opacity-50" />
                    <div className="pointer-events-none absolute left-0 top-0 h-full w-px bg-formula-volt/25" />
                  </div>
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
      <p className="mt-5 hidden font-mono text-[9px] uppercase tracking-[0.16em] text-formula-olive md:block">
        Hover or focus a pillar for detail
      </p>
    </div>
  )
}
