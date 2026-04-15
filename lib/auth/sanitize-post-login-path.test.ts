import { describe, expect, it } from 'vitest'
import { sanitizePostLoginPath } from '@/lib/auth/sanitize-post-login-path'

describe('sanitizePostLoginPath', () => {
  it('allows same-origin absolute paths', () => {
    expect(sanitizePostLoginPath('/parent/dashboard')).toBe('/parent/dashboard')
    expect(sanitizePostLoginPath(' /parent/bookings ')).toBe('/parent/bookings')
    expect(sanitizePostLoginPath('/parent/book-assessment#booking-hub-directory')).toBe(
      '/parent/book-assessment#booking-hub-directory'
    )
  })

  it('rejects open redirects and protocol-relative URLs', () => {
    expect(sanitizePostLoginPath('//evil.com')).toBeNull()
    expect(sanitizePostLoginPath('https://evil.com')).toBeNull()
    expect(sanitizePostLoginPath('http://evil.com')).toBeNull()
  })

  it('rejects relative and empty inputs', () => {
    expect(sanitizePostLoginPath('relative')).toBeNull()
    expect(sanitizePostLoginPath('')).toBeNull()
    expect(sanitizePostLoginPath(null)).toBeNull()
    expect(sanitizePostLoginPath(undefined)).toBeNull()
  })

  it('rejects backslashes and null bytes', () => {
    expect(sanitizePostLoginPath('/ok\\no')).toBeNull()
    expect(sanitizePostLoginPath('/ok\0no')).toBeNull()
  })
})
