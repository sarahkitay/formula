'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { FormulaBoot } from './formula-boot'

export function ShellRoot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPortalApp =
    pathname.startsWith('/admin') || pathname.startsWith('/coach') || pathname.startsWith('/parent')

  return (
    <>
      {isPortalApp && <FormulaBoot />}
      {children}
    </>
  )
}
