import { describe, expect, it } from 'vitest'
import { getPortalRoute } from '@/lib/getPortalRoute'

describe('getPortalRoute', () => {
  it('routes parents to parent dashboard', () => {
    expect(getPortalRoute('parent')).toBe('/parent/dashboard')
    expect(getPortalRoute('PARENT')).toBe('/parent/dashboard')
    expect(getPortalRoute('  Parent  ')).toBe('/parent/dashboard')
  })

  it('routes staff and admin to staff hub', () => {
    expect(getPortalRoute('staff')).toBe('/staff-portal')
    expect(getPortalRoute('admin')).toBe('/staff-portal')
    expect(getPortalRoute('ADMIN')).toBe('/staff-portal')
  })

  it('routes coaches to coach execution hub', () => {
    expect(getPortalRoute('coach')).toBe('/coach/today')
    expect(getPortalRoute('COACH')).toBe('/coach/today')
  })

  it('returns login for unknown roles', () => {
    expect(getPortalRoute('guardian')).toBe('/login')
    expect(getPortalRoute('')).toBe('/login')
    expect(getPortalRoute(null)).toBe('/login')
    expect(getPortalRoute(undefined)).toBe('/login')
    expect(getPortalRoute('   ')).toBe('/login')
  })
})
