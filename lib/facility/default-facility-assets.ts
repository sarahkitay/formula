import type { FacilityAsset } from '@/lib/mock-data/admin-operating-system'
import { SCHEDULE_ASSETS } from '@/lib/schedule/assets'

/** When no live telemetry exists, show facility zones as idle so the ops map still renders. */
export function defaultIdleFacilityAssets(): FacilityAsset[] {
  return SCHEDULE_ASSETS.map(a => ({
    id: a.id,
    label: a.label,
    shortLabel: a.label
      .split(/\s+/)
      .map(w => w[0])
      .join('')
      .slice(0, 3)
      .toUpperCase(),
    status: 'available',
    utilizationPct: 0,
    currentProgram: '—',
    nextProgram: '—',
    load: 0,
  }))
}
