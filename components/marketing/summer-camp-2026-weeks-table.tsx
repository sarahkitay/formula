'use client'

import { Fragment, useId, useState } from 'react'
import Link from 'next/link'
import {
  SUMMER_CAMP_2026_WEEKS,
  SUMMER_CAMP_THEME_EXPLANATIONS,
  type SummerCampThemeTitle,
} from '@/lib/marketing/summer-camp-2026-data'
import { cn } from '@/lib/utils'

const THEME_ANCHOR: Record<SummerCampThemeTitle, string> = {
  'Play Sharp': 'theme-play-sharp',
  'Speed Lab': 'theme-speed-lab',
  'Finish Strong': 'theme-finish-strong',
  'Duel & Dominate': 'theme-duel-dominate',
}

function themeRowAnchorId(week: number): string | undefined {
  if (week === 1) return 'theme-play-sharp'
  if (week === 2) return 'theme-speed-lab'
  if (week === 3) return 'theme-finish-strong'
  if (week === 4) return 'theme-duel-dominate'
  return undefined
}

function isThemeTitle(value: string): value is SummerCampThemeTitle {
  return value in SUMMER_CAMP_THEME_EXPLANATIONS
}

export function SummerCamp2026WeeksTable() {
  const baseId = useId()
  const [openWeek, setOpenWeek] = useState<number | null>(null)

  return (
    <div className="-mx-4 mt-5 overflow-x-auto border-y border-formula-frost/12 sm:mx-0 sm:mt-6 sm:rounded-lg sm:border">
      <table className="w-full min-w-[560px] border-collapse text-left text-[13px] sm:text-sm">
        <thead>
          <tr className="border-b border-formula-frost/12 bg-formula-paper/[0.04] font-mono text-[9px] uppercase tracking-[0.12em] text-formula-mist sm:text-[10px] sm:tracking-[0.14em]">
            <th className="w-10 px-2 py-3 font-medium sm:w-12 sm:px-3 sm:py-2.5" scope="col">
              <span className="sr-only">Expand</span>
            </th>
            <th className="px-3 py-3 font-medium sm:py-2.5" scope="col">
              Week
            </th>
            <th className="px-3 py-3 font-medium sm:py-2.5" scope="col">
              Dates
            </th>
            <th className="min-w-[7.5rem] px-3 py-3 font-medium sm:py-2.5" scope="col">
              Theme
            </th>
            <th className="px-3 py-3 font-medium sm:py-2.5" scope="col">
              Featured assets
            </th>
          </tr>
        </thead>
        <tbody className="text-formula-frost/85">
          {SUMMER_CAMP_2026_WEEKS.map(row => {
            const anchorId = themeRowAnchorId(row.week)
            const isOpen = openWeek === row.week
            const panelId = `${baseId}-week-${row.week}-panel`
            const themeKey = isThemeTitle(row.themeTitle) ? row.themeTitle : null
            const explanation = themeKey ? SUMMER_CAMP_THEME_EXPLANATIONS[themeKey] : ''
            const themeHash = themeKey ? THEME_ANCHOR[themeKey] : null

            return (
              <Fragment key={row.week}>
                <tr
                  id={anchorId}
                  className={cn(
                    'scroll-mt-20 border-b border-formula-frost/8 last:border-0',
                    isOpen && 'bg-formula-paper/[0.03]'
                  )}
                >
                  <td className="align-top px-2 py-3 sm:px-3 sm:py-2.5">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenWeek(isOpen ? null : row.week)}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-formula-frost/16 text-formula-paper transition-colors hover:border-formula-volt/40 hover:bg-formula-frost/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-formula-volt/45"
                    >
                      <span className="sr-only">
                        {isOpen ? 'Collapse' : 'Expand'} week {row.week} details
                      </span>
                      <svg
                        className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden
                      >
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </td>
                  <td className="align-top px-3 py-3.5 font-mono text-[11px] text-formula-paper sm:py-2.5">{row.week}</td>
                  <td className="align-top whitespace-nowrap px-3 py-3.5 text-[12px] sm:py-2.5 sm:text-[inherit]">
                    {row.datesLabel}
                  </td>
                  <td className="align-top px-3 py-3.5 sm:py-2.5">
                    {themeHash ? (
                      <Link
                        href={`#${themeHash}`}
                        className="group -mx-1 block rounded-md px-1 py-1.5 text-left no-underline transition-colors hover:bg-formula-frost/5 hover:text-formula-volt active:bg-formula-frost/10 sm:py-0.5"
                        onClick={e => e.stopPropagation()}
                      >
                        <span className="font-medium text-formula-paper group-hover:underline">{row.themeTitle}</span>
                        <span className="mt-0.5 block text-[12px] leading-snug text-formula-frost/70 group-hover:text-formula-frost/90">
                          {row.themeTagline}
                        </span>
                      </Link>
                    ) : (
                      <>
                        <span className="font-medium text-formula-paper">{row.themeTitle}</span>
                        <span className="mt-0.5 block text-[12px] leading-snug text-formula-frost/70">{row.themeTagline}</span>
                      </>
                    )}
                  </td>
                  <td className="align-top px-3 py-3.5 text-[12px] leading-snug sm:py-2.5 sm:text-[13px]">{row.primaryAssets}</td>
                </tr>
                {isOpen ? (
                  <tr className="border-b border-formula-frost/8 bg-formula-paper/[0.04] last:border-0">
                    <td colSpan={5} id={panelId} className="px-3 py-4 sm:px-5 sm:py-5">
                      <p className="max-w-[62ch] text-[13px] leading-relaxed text-formula-frost/88 sm:text-sm">{explanation}</p>
                      <p className="mt-2 max-w-[62ch] font-mono text-[10px] uppercase tracking-[0.12em] text-formula-mist/90">
                        Week {row.week} of 8 · staff confirms roster after payment
                      </p>
                      <div className="mt-4">
                        <Link
                          href="#register"
                          className="inline-flex h-10 items-center border border-formula-volt/55 bg-formula-volt px-5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-base no-underline transition-[filter,transform] hover:brightness-105 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
                        >
                          Pay now
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
