'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Sets `visible` true once the element intersects the viewport (or immediately when `prefers-reduced-motion`).
 */
export function useFadeInOnView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const obs = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) setVisible(true)
      },
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return { ref, visible }
}
