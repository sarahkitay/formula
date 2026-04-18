import { AppShell } from '@/components/layout/app-shell'
import { adminNav } from '@/lib/nav/admin'

/** Admin reads live DB (waivers, parties, schedule). Static prerender would freeze lists at build time. */
export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      role="admin"
      identityName="Front Desk"
      identityEmail="desk@formulafc.com"
      dashboardHref="/admin/dashboard"
      navItems={adminNav}
      operatorLine="FACILITY_OS // ADMIN"
      operatorContextLabel="OPERATOR_CONTEXT"
      surface="admin-os"
      endSessionVariant="logout-button"
      logoutRedirectTo="/login?role=admin"
    >
      {children}
    </AppShell>
  )
}
