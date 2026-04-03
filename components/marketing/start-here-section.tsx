'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { MembershipWaitlistCapture } from '@/components/marketing/membership-waitlist-capture'
import { MARKETING_HREF } from '@/lib/marketing/nav'

export function StartHereSection() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduceMotion(reduce)
    if (reduce) {
      setVisible(true)
      return
    }

    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setVisible(true)
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className={cn(
        'bg-formula-base py-20 md:py-24',
        !reduceMotion && 'will-change-[transform,opacity] transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
        visible ? 'translate-x-0 opacity-100' : '-translate-x-[min(5.5rem,14vw)] opacity-0'
      )}
    >
      <div className="mx-auto max-w-[1200px] px-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-formula-olive">Start here</p>
        <h2 className="mx-auto mt-4 max-w-lg font-mono text-[clamp(1.35rem,4vw,1.85rem)] font-semibold tracking-tight text-formula-paper">
          Assess. Lock your lane. Train the standard.
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href={MARKETING_HREF.assessment}
            className="inline-flex h-11 items-center border border-black/20 bg-formula-volt px-8 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] !text-black no-underline hover:brightness-105"
          >
            Book assessment
          </Link>
          <MembershipWaitlistCapture
            source="start-here"
            buttonClassName="inline-flex h-11 items-center border border-formula-frost/18 bg-formula-paper/[0.05] px-8 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-paper no-underline hover:border-formula-frost/28"
          />
          <Link
            href={MARKETING_HREF.clinics}
            className="inline-flex h-11 items-center border border-formula-frost/12 bg-transparent px-8 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-mist no-underline hover:border-formula-frost/22 hover:text-formula-paper"
          >
            Clinic registration
          </Link>
        </div>
      </div>
    </section>
  )
}
