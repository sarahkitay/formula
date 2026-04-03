import { AppShell } from '@/components/layout/app-shell'
import { parentNav } from '@/lib/nav/parent'

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      role="parent"
      userName="Jennifer Williams"
      userEmail="j.williams@email.com"
      dashboardHref="/parent/dashboard"
      navItems={parentNav}
      operatorLine="GUARDIAN_PORTAL // J_WILLIAMS"
      operatorContextLabel="OPERATOR_CONTEXT"
      surface="parent-os"
    >
      {children}
    </AppShell>
  )
}
