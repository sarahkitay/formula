/** Same-origin path only; avoids open redirects after login. */
export function sanitizePostLoginPath(raw: string | null | undefined): string | null {
  if (raw == null || typeof raw !== 'string') return null
  const t = raw.trim()
  if (!t.startsWith('/') || t.startsWith('//')) return null
  if (t.includes('\\') || t.includes('\0')) return null
  return t
}
