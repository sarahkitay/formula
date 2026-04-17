/** Same weekday/time, N weeks apart, starting from anchor `YYYY-MM-DD` (local noon math). */
export function weeklyOccurrenceDatesIso(anchorYmd: string, weekCount: number): string[] {
  const n = Math.min(52, Math.max(1, Math.floor(weekCount)))
  const dates: string[] = []
  for (let i = 0; i < n; i++) {
    const d = new Date(`${anchorYmd}T12:00:00`)
    d.setDate(d.getDate() + i * 7)
    const y = d.getFullYear()
    const mo = String(d.getMonth() + 1).padStart(2, '0')
    const da = String(d.getDate()).padStart(2, '0')
    dates.push(`${y}-${mo}-${da}`)
  }
  return dates
}
