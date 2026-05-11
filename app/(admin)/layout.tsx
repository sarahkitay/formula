import { AppShell } from '@/components/layout/app-shell'
import { PortalHubToolbar } from '@/components/portal/portal-hub-toolbar'
import { adminNav, getAdminPortalSearchLinks } from '@/lib/nav/admin'
import { FACILITY_APPLE_MAPS_URL, SITE } from '@/lib/site-config'

/** Admin reads live DB (waivers, parties, schedule). Static prerender would freeze lists at build time. */
export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navLinks = getAdminPortalSearchLinks()

  return (
    <AppShell
      role="admin"
      identityName="Front Desk"
      identityEmail="info@formulasoccer.com"
      dashboardHref="/admin/schedule"
      primaryNavPresentation="select"
      navItems={adminNav}
      operatorLine="FACILITY_OS // ADMIN"
      operatorContextLabel="OPERATOR_CONTEXT"
      surface="admin-os"
      endSessionVariant="logout-button"
      logoutRedirectTo="/login?role=admin"
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
