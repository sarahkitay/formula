import { redirect } from 'next/navigation'

/** @deprecated Use `/admin/program-layers` (program KPIs + Friendlies sign-ups). */
export default function LegacyEventsLayerRedirect() {
  redirect('/admin/program-layers')
}
