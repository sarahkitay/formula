'use client'

import dynamic from 'next/dynamic'
import { Fragment } from 'react'
import Link from 'next/link'
import { AmbientGeometry } from '@/components/marketing/ambient-geometry'
import { FieldAmbient } from '@/components/marketing/field-ambient'
import { marketingHeroWordmarkClassName } from '@/lib/marketing/display-typography'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { SITE_VOICE } from '@/lib/marketing/site-voice'
import { cn } from '@/lib/utils'

const HomeField3DHero = dynamic(
  () => import('@/components/marketing/home-field-3d/home-field-3d-hero').then(m => ({ default: m.HomeField3DHero })),
  {
    ssr: true,
    loading: () => (
      <div
        className="mx-auto min-h-[min(200px,34vh)] w-full max-w-[min(100%,720px)] rounded-sm bg-formula-deep/20 md:min-h-[min(240px,40vh)]"
        aria-hidden
      />
    ),
  }
)

const WORD = 'FORMULA'

function HexLetterO({ index }: { index: number }) {
  const delay = `${80 + index * 58}ms`
  return (
    <span className="marketing-hero-char inline-flex translate-y-[0.04em] align-middle" style={{ animationDelay: delay }}>
      <svg
        viewBox="0 0 32 36"
        className="h-[0.64em] w-[0.54em] sm:h-[0.68em] sm:w-[0.58em]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <polygon
          points="16,2 29.5,10 29.5,26 16,34 2.5,26 2.5,10"
          stroke="currentColor"
          strokeWidth={1.35}
          className="text-formula-volt"
        />
      </svg>
    </span>
  )
}

export function MarketingHero() {
  return (
    <section className="marketing-hero relative flex min-h-[100dvh] flex-col overflow-x-hidden">
      <FieldAmbient />
      <div className="absolute inset-0 z-[1] hidden md:block">
        <AmbientGeometry />
      </div>
      <div className="marketing-hero-system-grid" aria-hidden />
      <div className="marketing-hud-edge pointer-events-none absolute inset-x-0 top-0 z-[5] h-px bg-gradient-to-r from-transparent via-formula-frost/18 to-transparent" />
      <div className="marketing-hud-edge pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-px bg-gradient-to-r from-transparent via-formula-frost/10 to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-[min(100%,1360px)] flex-1 flex-col px-5 pb-12 pt-24 max-sm:mt-2 max-sm:pt-40 sm:px-6 sm:mt-0 sm:pt-24 lg:pb-16 lg:pt-20">
        {/* Centered wordmark — primary title */}
        <div className="flex w-full justify-center px-1 sm:px-2">
          <h1 className={cn(marketingHeroWordmarkClassName, 'max-w-[100%]')} aria-label={WORD}>
            <span aria-hidden="true" className="inline-flex flex-nowrap justify-center whitespace-nowrap">
              {WORD.split('').map((ch, i) =>
                ch === 'O' ? (
                  <HexLetterO key={`hex-o-${i}`} index={i} />
                ) : (
                  <span key={`${ch}-${i}`} className="marketing-hero-char inline-block" style={{ animationDelay: `${80 + i * 58}ms` }}>
                    {ch}
                  </span>
                )
              )}
            </span>
          </h1>
        </div>

        {/* Readout column + field: aligned to bottom band on large screens */}
        <div className="mt-6 flex min-h-0 flex-1 flex-col gap-8 max-lg:mt-5 max-lg:gap-6 lg:mt-7 lg:flex-row lg:items-end lg:justify-between lg:gap-6 xl:gap-10">
          <div className="relative z-20 flex min-w-0 max-w-[min(100%,26.5rem)] flex-col border-l border-formula-frost/18 pl-4 sm:pl-5 lg:max-w-[min(100%,28rem)] lg:shrink-0 lg:pb-1">
            <p className="font-mono text-[9px] font-medium uppercase tracking-[0.28em] text-formula-mist/90 [text-shadow:0_1px_14px_rgba(0,0,0,0.45)]">
              Formula Soccer Center
            </p>
            <p className="mt-2.5 max-w-[38rem] font-mono text-[clamp(0.95rem,2.2vw,1.2rem)] font-semibold leading-[1.22] tracking-[0.06em] text-formula-paper [text-shadow:0_2px_20px_rgba(0,0,0,0.48)]">
              {SITE_VOICE.heroHeadlineLines.map((line, i) => (
                <Fragment key={`hero-headline-${i}`}>
                  {i > 0 ? <br /> : null}
                  {line}
                </Fragment>
              ))}
            </p>
            <p className="mt-2.5 max-w-[38rem] font-mono text-[12px] font-medium leading-[1.42] tracking-[0.04em] text-formula-frost/76 [text-shadow:0_1px_12px_rgba(0,0,0,0.35)]">
              {SITE_VOICE.homeHeroLead}
            </p>
            <p className="mt-2 max-w-[38rem] font-mono text-[11px] font-semibold leading-[1.38] tracking-[0.08em] text-formula-frost/82 [text-shadow:0_1px_12px_rgba(0,0,0,0.32)]">
              {SITE_VOICE.homeHeroTagline}
            </p>
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <Link
                href={MARKETING_HREF.bookAssessmentPortal}
                className="inline-flex h-10 w-fit items-center border border-formula-volt/50 bg-formula-volt px-5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-base transition-[filter] duration-300 hover:brightness-105 sm:h-11 sm:px-6 sm:text-[11px] sm:tracking-[0.14em]"
              >
                Book an Assessment
              </Link>
              <Link
                href={MARKETING_HREF.youthMembership}
                className="inline-flex h-10 w-fit items-center border border-formula-paper/32 bg-transparent px-5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-paper shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] transition-colors duration-300 hover:border-formula-volt/45 hover:bg-formula-paper/[0.06] sm:h-11 sm:px-6 sm:text-[11px] sm:tracking-[0.14em]"
              >
                View Programs
              </Link>
            </div>
          </div>

          <div
            id="field-3d"
            className="relative z-10 flex min-h-0 w-full min-w-0 flex-1 flex-col justify-end lg:relative lg:min-h-[min(260px,32vh)] lg:overflow-visible lg:pb-0"
          >
            <div className="relative mx-auto w-full max-w-[min(100%,760px)] translate-x-0 scale-[0.56] max-sm:origin-[18%_85%] max-sm:translate-y-1 sm:scale-[0.82] sm:origin-[50%_88%] md:max-lg:scale-[0.88] lg:mx-0 lg:ml-auto lg:max-w-[min(100%,820px)] lg:translate-x-[min(6%,3.5rem)] lg:translate-y-2 lg:scale-[0.88] lg:origin-[85%_92%] xl:translate-x-[min(8%,4.5rem)] xl:scale-[0.92]">
              <HomeField3DHero />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
