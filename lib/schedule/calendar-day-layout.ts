import type { CalendarFeedBlock } from '@/lib/schedule/calendar-feed'

/** Los Angeles wall clock minutes [0, 1440) — matches facility-week-calendar. */
export const CAL_DISPLAY_START = 6 * 60
export const CAL_DISPLAY_END = 23 * 60
export const CAL_PX_PER_HOUR = 44

/** Fixed header height (px) for time gutter + day columns; must match facility-week-calendar header row. */
export const CAL_GRID_HEADER_PX = 40

export type LaidOutCalendarBlock = CalendarFeedBlock & {
  /** 0–100 within the day column */
  leftPct: number
  widthPct: number
}

function overlaps(a: CalendarFeedBlock, b: CalendarFeedBlock): boolean {
  return a.startMinute < b.endMinute && b.startMinute < a.endMinute
}

/** Connected components of the overlap graph (transitive overlap). */
function overlapClusters(blocks: CalendarFeedBlock[]): CalendarFeedBlock[][] {
  const n = blocks.length
  if (n === 0) return []
  const parent = blocks.map((_, i) => i)
  function find(i: number): number {
    if (parent[i] !== i) parent[i] = find(parent[i]!)
    return parent[i]!
  }
  function union(i: number, j: number) {
    const ri = find(i)
    const rj = find(j)
    if (ri !== rj) parent[ri] = rj
  }
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (overlaps(blocks[i]!, blocks[j]!)) union(i, j)
    }
  }
  const groups = new Map<number, number[]>()
  for (let i = 0; i < n; i++) {
    const r = find(i)
    const arr = groups.get(r) ?? []
    arr.push(i)
    groups.set(r, arr)
  }
  return [...groups.values()].map(idxs => idxs.map(i => blocks[i]!))
}

function maxConcurrent(cluster: CalendarFeedBlock[]): number {
  if (cluster.length === 0) return 1
  const marks = new Set<number>()
  for (const b of cluster) {
    marks.add(b.startMinute)
    marks.add(b.endMinute)
  }
  const times = [...marks].sort((a, b) => a - b)
  let max = 0
  for (const t of times) {
    const c = cluster.filter(b => b.startMinute <= t && t < b.endMinute).length
    max = Math.max(max, c)
  }
  return Math.max(1, max)
}

/** Greedy lane assignment; `k` must be >= maxConcurrent(cluster). */
function assignLanes(cluster: CalendarFeedBlock[], k: number): Map<string, number> {
  const sorted = [...cluster].sort(
    (a, b) => a.startMinute - b.startMinute || a.endMinute - b.endMinute || a.id.localeCompare(b.id)
  )
  type Active = { end: number; lane: number }
  const active: Active[] = []
  const map = new Map<string, number>()

  for (const b of sorted) {
    for (let i = active.length - 1; i >= 0; i--) {
      if (active[i]!.end <= b.startMinute) active.splice(i, 1)
    }
    const used = new Set(active.map(a => a.lane))
    let lane = 0
    while (lane < k && used.has(lane)) lane++
    if (lane >= k) lane = k - 1
    active.push({ end: b.endMinute, lane })
    map.set(b.id, lane)
  }
  return map
}

/** Split overlapping blocks horizontally so labels stay readable. */
export function layoutCalendarBlocksForDay(dayBlocks: CalendarFeedBlock[]): LaidOutCalendarBlock[] {
  const clusters = overlapClusters(dayBlocks)
  const geom = new Map<string, { leftPct: number; widthPct: number }>()

  for (const cluster of clusters) {
    const k = maxConcurrent(cluster)
    const lanes = assignLanes(cluster, k)
    for (const b of cluster) {
      const lane = lanes.get(b.id) ?? 0
      geom.set(b.id, {
        leftPct: (lane / k) * 100,
        widthPct: 100 / k,
      })
    }
  }

  return dayBlocks.map(b => {
    const g = geom.get(b.id) ?? { leftPct: 0, widthPct: 100 }
    return { ...b, leftPct: g.leftPct, widthPct: g.widthPct }
  })
}
