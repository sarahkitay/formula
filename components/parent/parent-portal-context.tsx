'use client'

import { createContext, useContext } from 'react'

export type ParentPortalSession = {
  displayName: string
  email: string
  athletesSummary: string
}

export const ParentPortalSessionContext = createContext<ParentPortalSession | null>(null)

export function useParentPortalSession() {
  return useContext(ParentPortalSessionContext)
}
