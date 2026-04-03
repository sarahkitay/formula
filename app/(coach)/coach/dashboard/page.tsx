import { redirect } from 'next/navigation'

/** Legacy entry - coach execution hub is Today */
export default function CoachDashboardRedirectPage() {
  redirect('/coach/today')
}
