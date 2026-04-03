'use client'

import { useEffect, useRef } from 'react'

const VOLT_FILL = 'rgba(220, 255, 0, 0.4)'
const VOLT_SOFT = 'rgba(220, 255, 0, 0.3)'
const VOLT_LINE = 'rgba(220, 255, 0, 0.08)'
const VOLT_GLOW = 'rgba(220, 255, 0, 0.2)'

function dist(u: number[], v: number[]) {
  return Math.sqrt((u[0] - v[0]) ** 2 + (u[1] - v[1]) ** 2 + (u[2] - v[2]) ** 2)
}

function rot(v: number[], a: number, b: number, c: number): number[] {
  const x = v[0],
    y = v[1],
    z = v[2]
  const cs = Math.cos,
    si = Math.sin
  return [
    cs(b) * cs(a) * x + (cs(b) * si(a) * si(c) - si(b) * cs(c)) * y + (cs(b) * si(a) * cs(c) + si(b) * si(c)) * z,
    si(b) * cs(a) * x + (si(b) * si(a) * si(c) + cs(b) * cs(c)) * y + (si(b) * si(a) * cs(c) - cs(b) * si(c)) * z,
    -si(a) * x + cs(a) * si(c) * y + cs(a) * cs(c) * z,
  ]
}

function persp(v: number[]): [number, number] {
  const scale = 1200 / (v[2] + 1200)
  return [v[0] * scale, v[1] * scale]
}

function buildBallGeometry(scale: number) {
  const phi = (1 + Math.sqrt(5)) / 2
  const icoVtx: number[][] = []
  for (let i = 0; i <= 1; ++i) {
    for (let j = 0; j <= 1; ++j) {
      const s1 = i === 0 ? -1 : 1,
        s2 = j === 0 ? -1 : 1
      icoVtx.push([s1, s2 * phi, 0])
      icoVtx.push([0, s1, s2 * phi])
      icoVtx.push([s2 * phi, 0, s1])
    }
  }
  for (let i = 0; i < icoVtx.length; i++) {
    icoVtx[i] = [icoVtx[i][0] * scale, icoVtx[i][1] * scale, icoVtx[i][2] * scale]
  }

  const edgeMap = new Map<string, [number, number]>()
  const truncVtx: number[][] = []
  const edgePairs: [number, number][] = []

  function getEdgeKey(i: number, j: number) {
    return i < j ? `${i},${j}` : `${j},${i}`
  }

  for (let i = 0; i < 12; i++) {
    for (let j = i + 1; j < 12; j++) {
      const d = dist(icoVtx[i], icoVtx[j])
      if (Math.abs(d - 2 * scale) < 1) {
        edgePairs.push([i, j])
        const u = icoVtx[i],
          v = icoVtx[j]
        const t1 = 1 / 3,
          t2 = 2 / 3
        const p1 = [u[0] + t1 * (v[0] - u[0]), u[1] + t1 * (v[1] - u[1]), u[2] + t1 * (v[2] - u[2])]
        const p2 = [u[0] + t2 * (v[0] - u[0]), u[1] + t2 * (v[1] - u[1]), u[2] + t2 * (v[2] - u[2])]
        const idx1 = truncVtx.length
        truncVtx.push(p1)
        const idx2 = truncVtx.length
        truncVtx.push(p2)
        edgeMap.set(getEdgeKey(i, j), [idx1, idx2])
      }
    }
  }

  const pentagons: number[][] = []
  for (let i = 0; i < 12; i++) {
    const neighbors: number[] = []
    for (let j = 0; j < 12; j++) {
      if (i !== j && dist(icoVtx[i], icoVtx[j]) < 2.1 * scale) {
        neighbors.push(j)
      }
    }
    if (neighbors.length === 0) continue
    const cycle: number[] = [neighbors[0]]
    while (cycle.length < 5) {
      const last = cycle[cycle.length - 1]
      let found = false
      for (const n of neighbors) {
        if (!cycle.includes(n) && dist(icoVtx[last], icoVtx[n]) < 2.1 * scale) {
          cycle.push(n)
          found = true
          break
        }
      }
      if (!found) break
    }
    const pent: number[] = []
    for (let k = 0; k < 5; k++) {
      const a = cycle[k],
        b = cycle[(k + 1) % 5]
      const edge = edgeMap.get(getEdgeKey(i, a))
      if (!edge) continue
      pent.push(edge[0])
    }
    if (pent.length === 5) pentagons.push(pent)
  }

  const hexagons: number[][] = []
  for (let i = 0; i < 12; i++) {
    for (let j = i + 1; j < 12; j++) {
      for (let k = j + 1; k < 12; k++) {
        const d1 = dist(icoVtx[i], icoVtx[j])
        const d2 = dist(icoVtx[j], icoVtx[k])
        const d3 = dist(icoVtx[k], icoVtx[i])
        if (Math.abs(d1 - 2 * scale) < 1 && Math.abs(d2 - 2 * scale) < 1 && Math.abs(d3 - 2 * scale) < 1) {
          const e1 = edgeMap.get(getEdgeKey(i, j))
          const e2 = edgeMap.get(getEdgeKey(j, k))
          const e3 = edgeMap.get(getEdgeKey(k, i))
          if (!e1 || !e2 || !e3) continue
          const hex = [e1[1], e1[0], e3[1], e3[0], e2[1], e2[0]]
          hexagons.push(hex)
        }
      }
    }
  }

  return { truncVtx, pentagons, hexagons }
}

function drawPolygon(
  ctx: CanvasRenderingContext2D,
  points: [number, number][],
  fillColor: string | null,
  strokeColor: string | null
) {
  if (points.length < 3) return
  ctx.beginPath()
  ctx.moveTo(points[0][0], points[0][1])
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1])
  }
  ctx.closePath()
  if (fillColor) {
    ctx.fillStyle = fillColor
    ctx.fill()
  }
  if (strokeColor) {
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = 1.5
    ctx.stroke()
  }
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width: number
) {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.stroke()
}

const GEOMETRY = buildBallGeometry(180)

/** Full-viewport canvas: truncated icosahedron soccer ball, perspective + wireframe toggle (Enter). */
export function LoginFormulaBallBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const wireframeRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const maybeCtx = canvas.getContext('2d')
    if (!maybeCtx) return
    /** Closure-safe: nested handlers keep a definite non-null ref (TS does not narrow outer `ctx` inside `function sizing()`). */
    const c2d: CanvasRenderingContext2D = maybeCtx

    const { truncVtx, pentagons, hexagons } = GEOMETRY

    let angX = 0,
      angY = 0,
      angZ = 0
    let pulse = 0
    let raf = 0

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return
      const el = e.target as HTMLElement | null
      const tag = el?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON' || tag === 'SELECT') return
      e.preventDefault()
      wireframeRef.current = !wireframeRef.current
    }

    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      }
    }

    function sizing() {
      const cvs = canvasRef.current
      if (!cvs) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      cvs.width = Math.max(1, Math.floor(w * dpr))
      cvs.height = Math.max(1, Math.floor(h * dpr))
      cvs.style.width = `${w}px`
      cvs.style.height = `${h}px`
      c2d.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function render() {
      const w = window.innerWidth
      const h = window.innerHeight
      c2d.clearRect(0, 0, w, h)

      angY += 0.005
      angX += 0.002

      const { x: mouseX, y: mouseY } = mouseRef.current
      const targetRotY = mouseX * 0.5
      const targetRotX = mouseY * 0.5

      const tVtx = truncVtx.map(v => rot(v, angX + targetRotX, angY + targetRotY, angZ))

      type Face = {
        type: 'pentagon' | 'hexagon'
        points: [number, number][]
        depth: number
        color: string
        stroke: string
      }

      const faces: Face[] = []

      for (const pent of pentagons) {
        const pts = pent.map(idx => tVtx[idx])
        const center = [0, 0, 0]
        for (const p of pts) {
          center[0] += p[0]
          center[1] += p[1]
          center[2] += p[2]
        }
        const n = pts.length
        const c = [center[0] / n, center[1] / n, center[2] / n]
        const projPts = pts.map(p => persp(p)) as [number, number][]
        const avgZ = c[2]
        faces.push({
          type: 'pentagon',
          points: projPts,
          depth: avgZ,
          color: `rgba(30, 30, 30, ${0.8 + Math.sin(pulse) * 0.1})`,
          stroke: VOLT_FILL,
        })
      }

      for (const hex of hexagons) {
        const pts = hex.map(idx => tVtx[idx])
        const center = [0, 0, 0]
        for (const p of pts) {
          center[0] += p[0]
          center[1] += p[1]
          center[2] += p[2]
        }
        const n = pts.length
        const c = [center[0] / n, center[1] / n, center[2] / n]
        const projPts = pts.map(p => persp(p)) as [number, number][]
        const avgZ = c[2]
        faces.push({
          type: 'hexagon',
          points: projPts,
          depth: avgZ,
          color: `rgba(240, 240, 240, ${0.9 + Math.sin(pulse) * 0.05})`,
          stroke: VOLT_SOFT,
        })
      }

      faces.sort((a, b) => a.depth - b.depth)

      const wireframe = wireframeRef.current

      for (const face of faces) {
        const pts = face.points.map(p => [p[0] + w / 2, p[1] + h / 2] as [number, number])
        if (wireframe) {
          drawPolygon(c2d, pts, null, face.stroke)
        } else {
          drawPolygon(c2d, pts, face.color, face.stroke)
          if (face.type === 'pentagon') {
            c2d.save()
            c2d.shadowColor = 'rgba(220, 255, 0, 0.3)'
            c2d.shadowBlur = 10
            drawPolygon(c2d, pts, null, VOLT_GLOW)
            c2d.restore()
          }
        }
      }

      if (!wireframe) {
        for (let i = 0; i < tVtx.length; i++) {
          for (let j = i + 1; j < tVtx.length; j++) {
            if (dist(tVtx[i], tVtx[j]) < 45) {
              const p1 = persp(tVtx[i])
              const p2 = persp(tVtx[j])
              drawLine(c2d, p1[0] + w / 2, p1[1] + h / 2, p2[0] + w / 2, p2[1] + h / 2, VOLT_LINE, 0.5)
            }
          }
        }
      }

      pulse += 0.02
    }

    function frame() {
      render()
      raf = requestAnimationFrame(frame)
    }

    sizing()
    window.addEventListener('resize', sizing)
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', sizing)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <canvas ref={canvasRef} id="login-formula-ball-canvas" className="block h-full w-full" />
    </div>
  )
}
