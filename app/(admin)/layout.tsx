import { AppShell } from '@/components/layout/app-shell'
import { adminNav } from '@/lib/nav/admin'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      role="admin"
      userName="Front Desk"
      userEmail="desk@formulafc.com"
      dashboardHref="/admin/dashboard"
      navItems={adminNav}
      operatorLine="FACILITY_OS // ADMIN"
      operatorContextLabel="OPERATOR_CONTEXT"
      surface="admin-os"
    >
      {children}
    </AppShell>
  )
}
