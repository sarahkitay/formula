/** Mono header tag, e.g. `S_KITAY` from full name or email local-part. */
export function guardianOperatorSlug(fullName: string | null | undefined, email: string | null | undefined): string {
  const name = (fullName ?? '').trim()
  if (name.length > 0) {
    const parts = name.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      const first = parts[0]!.replace(/[^a-zA-Z]/g, '').slice(0, 1).toUpperCase()
      const last = parts[parts.length - 1]!.replace(/[^a-zA-Z]/g, '').slice(0, 14).toUpperCase()
      if (last.length > 0) return `${first}_${last}`
    }
    const compact = name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').toUpperCase()
    if (compact.length > 0) return compact.slice(0, 18)
  }
  const local = (email ?? '').split('@')[0]?.replace(/[^a-zA-Z0-9]/g, '') ?? 'GUARDIAN'
  return local.toUpperCase().slice(0, 18)
}
