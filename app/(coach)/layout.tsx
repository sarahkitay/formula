import { AppShell } from '@/components/layout/app-shell'
import { PortalHubToolbar } from '@/components/portal/portal-hub-toolbar'
import { coachNav } from '@/lib/nav/coach'
import { FACILITY_APPLE_MAPS_URL, SITE } from '@/lib/site-config'

export default function CoachLayout({ children }: { children: React.ReactNode }) {
  const navLinks = coachNav.map(n => ({ label: n.label, href: n.href }))

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
      mainTop={
        <PortalHubToolbar
          variant="admin"
          navLinks={navLinks}
          facilityAddress={SITE.facilityAddressLine}
          mapsUrl={FACILITY_APPLE_MAPS_URL}
        />
      }
      facilityAddressLine={SITE.facilityAddressLine}
      facilityAddressHref={FACILITY_APPLE_MAPS_URL}
    >
      {children}
    </AppShell>
  )
}
