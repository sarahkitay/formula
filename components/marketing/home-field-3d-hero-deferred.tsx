'use client'

import { lazy, Suspense, useEffect, useState } from 'react'

const HomeField3DHero = lazy(() =>
  import('@/components/marketing/home-field-3d/home-field-3d-hero').then((m) => ({ default: m.HomeField3DHero }))
)

function Placeholder() {
  return (
    <div
      className="mx-auto min-h-[min(180px,30vh)] w-full max-w-[min(100%,720px)] rounded-sm bg-formula-deep/20 sm:min-h-[min(200px,34vh)] md:min-h-[min(240px,40vh)]"
      aria-hidden
    />
  )
}

/**
 * Defers loading the WebGL hero chunk until after first paint / idle time so the
 * main thread can commit text and layout first (better LCP / TBT on home).
 */
export function HomeField3DHeroDeferred() {
  const [mount, setMount] = useState(false)

  useEffect(() => {
    let idle: number | undefined
    let timeout: ReturnType<typeof setTimeout> | undefined
    const run = () => setMount(true)
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idle = window.requestIdleCallback(run, { timeout: 520 })
      return () => {
        if (idle !== undefined) window.cancelIdleCallback(idle)
      }
    }
    timeout = setTimeout(run, 340)
    return () => {
      if (timeout !== undefined) clearTimeout(timeout)
    }
  }, [])

  if (!mount) return <Placeholder />

  return (
    <Suspense fallback={<Placeholder />}>
      <HomeField3DHero />
    </Suspense>
  )
}
