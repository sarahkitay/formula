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
        className="mx-auto min-h-[min(180px,30vh)] w-full max-w-[min(100%,720px)] rounded-sm bg-formula-deep/20 sm:min-h-[min(200px,34vh)] md:min-h-[min(240px,40vh)]"
        aria-hidden
      />
    ),
  }
)

const WORD = 'FORMULA'

const READOUT_STAGGER_MS = 88
const readoutDelay = (step: number) => ({ animationDelay: `${520 + step * READOUT_STAGGER_MS}ms` })

function HexLetterO({ index }: { index: number }) {
  const delay = `${60 + index * 78}ms`
  return (
    <span
      className="marketing-hero-char inline-flex translate-y-[0.04em] align-middle"
      style={{ animationDelay: delay }}
    >
      <span className="marketing-hero-hex-spin-outer inline-flex">
        <svg
          viewBox="0 0 32 36"
          className="marketing-hero-hex h-[0.64em] w-[0.54em] sm:h-[0.68em] sm:w-[0.58em]"
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
    </span>
  )
}

export function MarketingHero() {
  return (
    <section className="marketing-hero relative flex min-h-[100dvh] flex-col overflow-x-clip overscroll-x-none touch-pan-y">
      <FieldAmbient />
      <div className="absolute inset-0 z-[1] hidden md:block">
        <AmbientGeometry />
      </div>
      <div className="marketing-hero-system-grid" aria-hidden />
      <div className="marketing-hud-edge pointer-events-none absolute inset-x-0 top-0 z-[5] h-px bg-gradient-to-r from-transparent via-formula-frost/18 to-transparent" />
      <div className="marketing-hud-edge pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-px bg-gradient-to-r from-transparent via-formula-frost/10 to-transparent" />

      <div className="relative z-10 mx-auto flex w-full min-w-0 max-w-[min(100%,1360px)] flex-1 flex-col overflow-x-clip px-5 pb-12 pt-44 max-sm:pt-[max(11.5rem,calc(env(safe-area-inset-top,0px)+10rem))] sm:px-6 sm:pt-48 md:pt-48 lg:pb-16 lg:pt-52">
        {/* Centered wordmark — primary title */}
        <div className="flex w-full min-w-0 justify-center px-2 py-6 sm:px-2 sm:py-0">
          <h1
            className={cn(marketingHeroWordmarkClassName, 'marketing-hero-wordmark-anim max-w-[min(100%,100vw-1.5rem)]')}
            aria-label={WORD}
          >
            <span
              aria-hidden="true"
              className="inline-flex min-w-0 max-w-full flex-nowrap justify-center whitespace-nowrap"
            >
              {WORD.split('').map((ch, i) =>
                ch === 'O' ? (
                  <HexLetterO key={`hex-o-${i}`} index={i} />
                ) : (
                  <span key={`${ch}-${i}`} className="marketing-hero-char inline-block" style={{ animationDelay: `${60 + i * 78}ms` }}>
                    {ch}
                  </span>
                )
              )}
            </span>
          </h1>
        </div>

        {/* Readout column + field: tucked under wordmark; field anchors low on large screens */}
        <div className="mt-5 flex min-h-0 min-w-0 flex-1 flex-col gap-5 max-lg:mt-4 max-lg:gap-5 lg:mt-7 lg:flex-row lg:items-start lg:justify-between lg:gap-5 xl:gap-8">
          <div className="relative z-20 flex min-w-0 max-w-[min(100%,26.5rem)] flex-col border-l border-formula-frost/18 pl-4 sm:pl-5 lg:max-w-[min(100%,28rem)] lg:shrink-0 lg:pb-1">
            <Link
              href={MARKETING_HREF.youthMembership}
              className="marketing-hero-readout group -mx-1 block rounded-md border border-transparent px-2 py-1.5 text-left outline-none transition-colors hover:border-formula-frost/20 hover:bg-formula-paper/[0.04] focus-visible:ring-2 focus-visible:ring-formula-volt/40 focus-visible:ring-offset-2 focus-visible:ring-offset-formula-deep"
              style={readoutDelay(0)}
            >
              <span className="block font-mono text-[9px] font-medium uppercase tracking-[0.28em] text-formula-mist/90 [text-shadow:0_1px_14px_rgba(0,0,0,0.45)]">
                Formula Soccer Center
              </span>
              <span className="mt-2.5 block max-w-[38rem] font-mono text-[clamp(0.95rem,2.2vw,1.2rem)] font-semibold leading-[1.22] tracking-[0.06em] text-formula-paper [text-shadow:0_2px_20px_rgba(0,0,0,0.48)]">
                {SITE_VOICE.heroHeadlineLines.map((line, i) => (
                  <Fragment key={`hero-headline-${i}`}>
                    {i > 0 ? <br /> : null}
                    {line}
                  </Fragment>
                ))}
              </span>
              <span className="mt-2.5 block max-w-[38rem] font-mono text-[12px] font-medium leading-[1.42] tracking-[0.04em] text-formula-frost/76 [text-shadow:0_1px_12px_rgba(0,0,0,0.35)]">
                {SITE_VOICE.homeHeroLead}
              </span>
              <span className="mt-2 block max-w-[38rem] font-mono text-[11px] font-semibold leading-[1.38] tracking-[0.08em] text-formula-frost/82 [text-shadow:0_1px_12px_rgba(0,0,0,0.32)]">
                {SITE_VOICE.homeHeroTagline}
              </span>
              <span className="mt-3 block font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-formula-volt opacity-0 transition-opacity group-hover:opacity-100">
                View programs
              </span>
            </Link>
            <div
              className="marketing-hero-readout mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3"
              style={readoutDelay(4)}
            >
              <Link
                href={MARKETING_HREF.bookAssessmentDirectory}
                className="inline-flex h-10 w-fit items-center border border-formula-volt/50 bg-formula-volt px-5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-base transition-[filter,transform] duration-300 hover:brightness-105 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 sm:h-11 sm:px-6 sm:text-[11px] sm:tracking-[0.14em]"
              >
                Book
              </Link>
              <Link
                href={MARKETING_HREF.youthMembership}
                className="inline-flex h-10 w-fit items-center border border-formula-paper/32 bg-transparent px-5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-paper shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] transition-[colors,transform] duration-300 hover:border-formula-volt/45 hover:bg-formula-paper/[0.06] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 sm:h-11 sm:px-6 sm:text-[11px] sm:tracking-[0.14em]"
              >
                View Programs
              </Link>
            </div>
          </div>

          <div
            id="field-3d"
            className="relative z-10 flex min-h-0 w-full min-w-0 flex-1 flex-col justify-end lg:relative lg:min-h-[min(260px,32vh)] lg:overflow-visible lg:pb-0"
          >
            <div className="relative mx-auto w-full min-w-0 max-w-[min(100%,760px)] translate-x-0 scale-[0.46] max-sm:origin-[18%_86%] max-sm:translate-y-1 sm:scale-[0.82] sm:origin-[50%_88%] md:max-lg:scale-[0.88] lg:mx-0 lg:ml-auto lg:max-w-[min(100%,820px)] lg:translate-x-[min(6%,3.5rem)] lg:translate-y-2 lg:scale-[0.88] lg:origin-[85%_92%] xl:translate-x-[min(8%,4.5rem)] xl:scale-[0.92]">
              <div className="marketing-hero-field-enter will-change-[opacity,transform]">
                <HomeField3DHero />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
