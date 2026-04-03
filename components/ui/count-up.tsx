'use client'

import { useEffect, useState } from 'react'
import { formatCurrency } from '@/lib/utils'

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export function CountUp({
  end,
  durationMs = 1100,
  format = 'integer',
  className,
}: {
  end: number
  durationMs?: number
  format?: 'integer' | 'currency'
  className?: string
}) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(end)
      return
    }

    let raf = 0
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const t = Math.min(1, elapsed / durationMs)
      const eased = easeOutCubic(t)
      const raw = end * eased
      const next = format === 'currency' ? Math.round(raw * 100) / 100 : Math.round(raw)
      setDisplay(next)
      if (t < 1) raf = requestAnimationFrame(tick)
      else setDisplay(end)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [end, durationMs, format])

  const text =
    format === 'currency' ? formatCurrency(display) : String(display)

  return <span className={className}>{text}</span>
}
