'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

function elementMayBeVisible(el: HTMLElement) {
  const r = el.getBoundingClientRect()
  const h = typeof window !== 'undefined' ? window.innerHeight : 0
  const w = typeof window !== 'undefined' ? window.innerWidth : 0
  return r.bottom > 0 && r.right > 0 && r.top < h && r.left < w
}

/**
 * Sets `visible` true once the element intersects the viewport (or immediately when `prefers-reduced-motion`).
 * Uses threshold 0 + isIntersecting, a generous rootMargin, and a layout-time check so below-the-fold
 * content still reveals reliably (avoids sections stuck at opacity-0).
 */
export function useFadeInOnView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }
    if (elementMayBeVisible(el)) setVisible(true)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const obs = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) setVisible(true)
      },
      { root: null, rootMargin: '120px 0px 20% 0px', threshold: 0 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return { ref, visible }
}
