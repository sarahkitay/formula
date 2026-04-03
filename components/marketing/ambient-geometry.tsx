'use client'

import { useEffect, useRef } from 'react'

/** Sparse rotating wireframe - inspired by canvas demos, reduced to monochrome ambient (not a hero graphic). */
const EDGES: [number, number][] = [
  [0, 1],
  [1, 3],
  [3, 2],
  [2, 0],
  [4, 5],
  [5, 7],
  [7, 6],
  [6, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
]

export function AmbientGeometry() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
  const el = ref.current
  if (!el) return
  const ctxRaw = el.getContext('2d')
  if (!ctxRaw) return
  const drawCtx: CanvasRenderingContext2D = ctxRaw

  const s = 100
  const verts: [number, number, number][] = [
  [-s, -s, -s],
  [s, -s, -s],
  [s, s, -s],
  [-s, s, -s],
  [-s, -s, s],
  [s, -s, s],
  [s, s, s],
  [-s, s, s],
  ]

  function persp(x: number, y: number, z: number, w: number, h: number) {
  const d = z + 1400
  return [w / 2 + (820 * x) / d, h / 2 + (820 * y) / d]
  }

  function rotY(v: [number, number, number], a: number): [number, number, number] {
  const [x, y, z] = v
  const c = Math.cos(a)
  const s2 = Math.sin(a)
  return [x * c - z * s2, y, x * s2 + z * c]
  }

  let raf = 0
  let ang = 0

  function frame() {
  const node = ref.current
  if (!node) return
  const w = node.width
  const h = node.height
  drawCtx.clearRect(0, 0, w, h)
  drawCtx.strokeStyle = 'rgba(205, 225, 225, 0.055)'
  drawCtx.lineWidth = 0.55
  ang += 0.0009

  for (const [i, j] of EDGES) {
  const u = rotY(verts[i], ang)
  const v = rotY(verts[j], ang)
  const [x1, y1] = persp(u[0], u[1], u[2], w, h)
  const [x2, y2] = persp(v[0], v[1], v[2], w, h)
  drawCtx.beginPath()
  drawCtx.moveTo(x1, y1)
  drawCtx.lineTo(x2, y2)
  drawCtx.stroke()
  }

  raf = requestAnimationFrame(frame)
  }

  const ro = new ResizeObserver(() => {
  const p = el.parentElement
  if (!p) return
  const r = p.getBoundingClientRect()
  el.width = Math.max(1, Math.floor(r.width))
  el.height = Math.max(1, Math.floor(r.height))
  })

  const p = el.parentElement
  if (p) {
  ro.observe(p)
  const r = p.getBoundingClientRect()
  el.width = Math.max(1, Math.floor(r.width))
  el.height = Math.max(1, Math.floor(r.height))
  }

  raf = requestAnimationFrame(frame)
  return () => {
  cancelAnimationFrame(raf)
  ro.disconnect()
  }
  }, [])

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-[0.85]" aria-hidden />
}
