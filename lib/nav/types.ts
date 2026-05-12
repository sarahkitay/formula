export interface NavItem {
  label: string
  href: string
  icon: string
  badge?: string
  badgeVariant?: 'accent' | 'error' | 'warning'
  /** Copy for Lab grid cards */
  description?: string
  /** Optional monospace metric on grid card */
  metric?: string
  gridStatus?: 'active' | 'warning' | 'neutral'
  /**
   * Extra path prefixes for this primary nav section (admin header select).
   * Longest-prefix wins; `href` is always a candidate.
   */
  navSectionPaths?: readonly string[]
}

export interface NavSection {
  title?: string
  items: NavItem[]
}
