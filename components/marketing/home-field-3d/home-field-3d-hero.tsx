'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import './home-field-3d.css'

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

/**
 * 3D field for marketing hero: tilt follows pointer inside the hit area (disabled when `prefers-reduced-motion`).
 */
export function HomeField3DHero() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)
  const [motionOk, setMotionOk] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setMotionOk(!mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const applyPointer = useCallback(
    (clientX: number, clientY: number) => {
      if (!motionOk || !wrapRef.current || !tiltRef.current) return
      const r = wrapRef.current.getBoundingClientRect()
      if (r.width < 1 || r.height < 1) return
      const nx = ((clientX - r.left) / r.width) * 2 - 1
      const ny = ((clientY - r.top) / r.height) * 2 - 1
      const tiltY = clamp(nx * 18, -18, 18)
      const tiltX = clamp(-ny * 14, -14, 14)
      tiltRef.current.style.setProperty('--field-mouse-y', `${tiltY}deg`)
      tiltRef.current.style.setProperty('--field-mouse-x', `${tiltX}deg`)
    },
    [motionOk]
  )

  const resetTilt = useCallback(() => {
    tiltRef.current?.style.setProperty('--field-mouse-y', '0deg')
    tiltRef.current?.style.setProperty('--field-mouse-x', '0deg')
  }, [])

  useEffect(() => {
    if (!motionOk) return
    const steps: { y: number; x: number; at: number }[] = [
      { y: 11, x: -7, at: 520 },
      { y: -9, x: 6, at: 920 },
      { y: 5, x: -4, at: 1320 },
      { y: 0, x: 0, at: 1720 },
    ]
    const timers = steps.map(({ y, x, at }) =>
      window.setTimeout(() => {
        const el = tiltRef.current
        if (!el) return
        el.style.setProperty('--field-mouse-y', `${y}deg`)
        el.style.setProperty('--field-mouse-x', `${x}deg`)
      }, at)
    )
    return () => timers.forEach(clearTimeout)
  }, [motionOk])

  return (
    <div
      ref={wrapRef}
      className="home-field-3d home-field-3d--hero-interactive cursor-grab active:cursor-grabbing"
      onMouseMove={e => applyPointer(e.clientX, e.clientY)}
      onMouseLeave={resetTilt}
      onTouchMove={e => {
        const t = e.touches[0]
        if (t) applyPointer(t.clientX, t.clientY)
      }}
      onTouchEnd={resetTilt}
      role="img"
      aria-label="Interactive preview of the indoor field: move your pointer or drag to tilt the view"
    >
      <div className="home-field-3d__stage mx-auto w-full max-w-[min(100%,680px)] px-1 pt-3 pb-4 max-sm:ml-0 max-sm:mr-auto md:px-2 md:pt-6 md:pb-6 lg:max-w-[min(100%,760px)]">
        <div className="container act">
          <div ref={tiltRef} className="i act">
            <div className="cont">
              <div className="mf-soccer-field-outlines">
                <div className="gen-bdr">
                  <div className="lines">
                    <div className="line l0 c st" />
                    <div id="l2" className="line c" />
                    <div id="l4" className="line c" />
                    <div id="l6" className="line c" />
                    <div id="l7" className="line" />
                    <div id="l10" className="line c nd" />
                  </div>
                  <div className="left">
                    <div className="s">
                      <div className="goal" />
                    </div>
                  </div>
                  <div className="center">
                    <div className="dot" />
                  </div>
                  <div className="center-glow" />
                  <div className="right">
                    <div className="s">
                      <div className="goal" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="goal-r" />
        </div>
      </div>
    </div>
  )
}
