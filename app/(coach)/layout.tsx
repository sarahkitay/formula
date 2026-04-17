import { AppShell } from '@/components/layout/app-shell'
import { coachNav } from '@/lib/nav/coach'

export default function CoachLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      role="coach"
      identityName="Marcus Rivera"
      identityEmail="marcus.rivera@formulafc.com"
      dashboardHref="/coach/today"
      navItems={coachNav}
      operatorLine="COACH_STATION // M_RIVERA"
      operatorContextLabel="OPERATOR_CONTEXT"
      surface="coach-os"
      endSessionVariant="logout-button"
      logoutRedirectTo="/login?role=coach"
    >
      {children}
    </AppShell>
  )
}
