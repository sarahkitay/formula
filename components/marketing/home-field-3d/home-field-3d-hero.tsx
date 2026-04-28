'use client'

import { useCallback, useEffect, useRef } from 'react'
import './home-field-3d.css'

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

/**
 * 3D field for marketing hero: slow idle drift (sine) plus a subtle pointer nudge.
 * Single rAF loop + lerped targets avoids fighting the old setTimeout choreography + CSS transition jank.
 */
export function HomeField3DHero() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)
  const motionOkRef = useRef(true)
  const pointerInsideRef = useRef(false)
  const pointerNormRef = useRef({ x: 0, y: 0 })
  const smoothRef = useRef({ rx: 0, ry: 0 })

  const rafRef = useRef(0)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      motionOkRef.current = !mq.matches
      const el = tiltRef.current
      if (mq.matches && el) {
        el.style.setProperty('--field-mouse-x', '0deg')
        el.style.setProperty('--field-mouse-y', '0deg')
      }
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const tick = () => {
      const tilt = tiltRef.current
      if (!tilt) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      if (!motionOkRef.current) {
        tilt.style.setProperty('--field-mouse-x', '0deg')
        tilt.style.setProperty('--field-mouse-y', '0deg')
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      const t = performance.now() / 1000
      // ~18–22s feel: small coefficients on `t`
      const autoRx = Math.sin(t * 0.32 + 0.45) * 5
      const autoRy = Math.sin(t * 0.27 + 1.05) * 5.8

      const { x: nx, y: ny } = pointerNormRef.current
      const ptrRx = pointerInsideRef.current ? clamp(-ny * 3.2, -3.8, 3.8) : 0
      const ptrRy = pointerInsideRef.current ? clamp(nx * 3.6, -4.2, 4.2) : 0

      const targetRx = autoRx + ptrRx
      const targetRy = autoRy + ptrRy

      const k = 0.1
      smoothRef.current.rx += (targetRx - smoothRef.current.rx) * k
      smoothRef.current.ry += (targetRy - smoothRef.current.ry) * k

      tilt.style.setProperty('--field-mouse-x', `${smoothRef.current.rx}deg`)
      tilt.style.setProperty('--field-mouse-y', `${smoothRef.current.ry}deg`)

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const applyPointer = useCallback((clientX: number, clientY: number) => {
    if (!wrapRef.current) return
    const r = wrapRef.current.getBoundingClientRect()
    if (r.width < 1 || r.height < 1) return
    const nx = ((clientX - r.left) / r.width) * 2 - 1
    const ny = ((clientY - r.top) / r.height) * 2 - 1
    pointerNormRef.current = { x: clamp(nx, -1, 1), y: clamp(ny, -1, 1) }
    pointerInsideRef.current = true
  }, [])

  const resetPointer = useCallback(() => {
    pointerInsideRef.current = false
  }, [])

  return (
    <div
      ref={wrapRef}
      className="home-field-3d home-field-3d--hero-interactive cursor-grab active:cursor-grabbing"
      onMouseMove={e => applyPointer(e.clientX, e.clientY)}
      onMouseLeave={resetPointer}
      onTouchMove={e => {
        const t = e.touches[0]
        if (t) applyPointer(t.clientX, t.clientY)
      }}
      onTouchEnd={resetPointer}
      role="img"
      aria-label="Preview of the indoor field: it drifts slowly; move your pointer for a slight tilt"
    >
      <div className="home-field-3d__stage mx-auto w-full max-w-[min(100%,680px)] px-1 pt-3 pb-4 max-sm:ml-0 max-sm:mr-auto max-sm:pt-2 max-sm:pb-3 md:px-2 md:py-6 lg:max-w-[min(100%,760px)]">
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
