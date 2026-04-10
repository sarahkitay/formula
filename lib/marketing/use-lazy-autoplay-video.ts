'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Defer mounting a <video> until the container is near the viewport, then autoplay (unless reduced motion).
 * Tighter rootMargin = less upfront bandwidth; pair `<video preload="none">` so the file isn’t fetched until mount.
 */
export function useLazyAutoplayVideo(rootMargin = '140px') {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setReady(true)
          obs.disconnect()
        }
      },
      { rootMargin, threshold: 0 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [rootMargin])

  useEffect(() => {
    const el = videoRef.current
    if (!el || !ready) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      if (mq.matches) el.pause()
      else void el.play().catch(() => {})
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [ready])

  return { containerRef, videoRef, ready }
}
