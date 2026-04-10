import { ParentPortalShell } from '@/components/parent/parent-portal-shell'

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return <ParentPortalShell>{children}</ParentPortalShell>
}
