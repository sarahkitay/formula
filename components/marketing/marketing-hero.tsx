'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { AmbientGeometry } from '@/components/marketing/ambient-geometry'
import { FieldAmbient } from '@/components/marketing/field-ambient'
import { HomeField3DHero } from '@/components/marketing/home-field-3d/home-field-3d-hero'
import { MembershipWaitlistCapture } from '@/components/marketing/membership-waitlist-capture'
import { marketingDisplayH1ClassName } from '@/lib/marketing/display-typography'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { SITE_VOICE } from '@/lib/marketing/site-voice'
import { cn } from '@/lib/utils'

const WORD = 'FORMULA'

function HexLetterO({ index }: { index: number }) {
  const delay = `${80 + index * 58}ms`
  return (
    <span className="marketing-hero-char inline-flex translate-y-[0.04em] align-middle" style={{ animationDelay: delay }}>
      <svg
        viewBox="0 0 32 36"
        className="h-[0.68em] w-[0.58em] sm:h-[0.72em] sm:w-[0.62em]"
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
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative flex min-h-[100dvh] flex-col overflow-x-hidden">
      <FieldAmbient />
      <div className="absolute inset-0 z-[1] hidden md:block">
        <AmbientGeometry />
      </div>
      <div className="marketing-hud-edge pointer-events-none absolute inset-x-0 top-0 z-[5] h-px bg-gradient-to-r from-transparent via-formula-frost/18 to-transparent" />
      <div className="marketing-hud-edge pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-px bg-gradient-to-r from-transparent via-formula-frost/10 to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col justify-center gap-8 px-6 pt-24 pb-12 max-lg:gap-6 max-lg:pb-14 lg:flex-row lg:items-center lg:gap-10 lg:pb-16 lg:pt-20 xl:gap-12">
        <div className="relative z-20 flex min-w-0 flex-col max-lg:flex-none lg:flex-1 lg:max-w-[min(100%,28rem)] xl:max-w-[min(100%,32rem)]">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.35em] text-formula-mist [text-shadow:0_1px_18px_rgba(0,0,0,0.45)]">
            Formula Soccer Center
          </p>
          <h1 className={cn(marketingDisplayH1ClassName, 'mt-4')} aria-label={WORD}>
            <span aria-hidden="true">
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
          <p className="mt-4 max-w-[38rem] font-mono text-[clamp(1.05rem,2.8vw,1.5rem)] font-semibold leading-snug tracking-[0.04em] text-formula-paper [text-shadow:0_2px_24px_rgba(0,0,0,0.5)]">
            {SITE_VOICE.heroHeadline}
          </p>
          <p className="mt-3 font-mono text-[10px] font-medium uppercase tracking-[0.26em] text-formula-frost/88 [text-shadow:0_1px_16px_rgba(0,0,0,0.45)]">
            {SITE_VOICE.heroProtocolLine}
          </p>
          <p className="mt-2 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-formula-mist [text-shadow:0_1px_14px_rgba(0,0,0,0.4)]">
            {SITE_VOICE.heroAudienceLine}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={MARKETING_HREF.bookAssessmentPortal}
              className="inline-flex h-11 items-center border border-formula-volt/50 bg-formula-volt px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-base transition-[filter] duration-300 hover:brightness-105"
            >
              Book assessment
            </Link>
            <MembershipWaitlistCapture
              source="hero"
              buttonClassName="inline-flex h-11 items-center border border-formula-paper/35 bg-transparent px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-paper shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] transition-colors duration-300 hover:border-formula-volt/45 hover:bg-formula-paper/[0.06] hover:text-formula-paper"
            />
          </div>
        </div>

        <div
          id="field-3d"
          className="relative z-10 flex w-full shrink-0 flex-col items-center justify-center border-t border-formula-frost/10 bg-formula-deep/20 py-6 max-lg:pointer-events-auto max-lg:w-full max-lg:border-t max-lg:border-formula-frost/10 max-lg:bg-formula-deep/[0.12] max-lg:px-0 max-lg:pb-6 max-lg:pt-2 max-sm:items-start max-sm:pt-1 lg:z-auto lg:max-w-[min(520px,46%)] lg:flex-1 lg:items-center lg:border-l lg:border-t-0 lg:bg-formula-deep/12 lg:py-5 lg:pl-6 xl:max-w-[min(560px,44%)]"
        >
          <div className="w-full max-w-[min(100%,720px)] max-lg:translate-y-0 scale-[0.44] max-sm:origin-left sm:origin-center sm:scale-[0.92] md:max-lg:scale-[0.96] lg:max-w-none lg:scale-[0.9] xl:scale-[0.96]">
            <HomeField3DHero />
          </div>
          <motion.p
            initial={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4, margin: '0px 0px -8% 0px' }}
            transition={{ duration: 0.65, delay: reduceMotion ? 0 : 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20 mt-2 max-w-[16rem] text-center font-mono text-[9px] uppercase tracking-[0.28em] text-formula-mist [text-shadow:0_1px_12px_rgba(0,0,0,0.55)] max-sm:text-left lg:mt-2 lg:text-center"
          >
            Move pointer or drag to tilt the field
          </motion.p>
        </div>
      </div>
    </section>
  )
}
