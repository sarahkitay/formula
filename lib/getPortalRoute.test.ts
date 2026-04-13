import { describe, expect, it } from 'vitest'
import { getPortalRoute } from '@/lib/getPortalRoute'

describe('getPortalRoute', () => {
  it('routes parent to parent dashboard', () => {
    expect(getPortalRoute('parent')).toBe('/parent/dashboard')
    expect(getPortalRoute('PARENT')).toBe('/parent/dashboard')
    expect(getPortalRoute('  Parent  ')).toBe('/parent/dashboard')
  })

  it('routes staff roles to staff portal', () => {
    expect(getPortalRoute('staff')).toBe('/staff-portal')
    expect(getPortalRoute('admin')).toBe('/staff-portal')
    expect(getPortalRoute('coach')).toBe('/staff-portal')
    expect(getPortalRoute('COACH')).toBe('/staff-portal')
  })

  it('returns /login for unknown or empty roles (gate)', () => {
    expect(getPortalRoute('guardian')).toBe('/login')
    expect(getPortalRoute('')).toBe('/login')
    expect(getPortalRoute(null)).toBe('/login')
    expect(getPortalRoute(undefined)).toBe('/login')
    expect(getPortalRoute('   ')).toBe('/login')
  })
})
