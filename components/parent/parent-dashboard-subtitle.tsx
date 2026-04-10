'use client'

import { useParentPortalSession } from '@/components/parent/parent-portal-context'
import { SITE } from '@/lib/site-config'

/** First name or whole display name for “Welcome back”. */
function welcomeName(displayName: string) {
  const t = displayName.trim()
  if (!t) return 'there'
  const first = t.split(/\s+/)[0]
  return first ?? t
}

export function ParentDashboardSubtitle() {
  const session = useParentPortalSession()
  const name = welcomeName(session?.displayName ?? '')
  return (
    <>
      {SITE.facilityName} · Welcome back, {name} · structured development, private to your family
    </>
  )
}
