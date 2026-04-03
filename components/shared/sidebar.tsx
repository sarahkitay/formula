'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/lib/nav/types'
import { NavIcon } from '@/components/shared/nav-icons'
import { SITE } from '@/lib/site-config'

export interface SidebarProps {
  role: 'admin' | 'coach' | 'parent'
  items: NavItem[]
  dashboardHref: string
  onNavigate?: () => void
  className?: string
}

const ROLE_LABEL: Record<SidebarProps['role'], string> = {
  admin: 'Facility',
  coach: 'Coach',
  parent: 'Family',
}

export function Sidebar({ role, items, dashboardHref, onNavigate, className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'flex h-full w-56 shrink-0 flex-col border-r border-white/10 bg-[#0a0a0a]',
        className
      )}
    >
      <div className="border-b border-white/10 px-4 py-4">
        <Link
          href={dashboardHref}
          onClick={onNavigate}
          className="block font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f4fe00]"
        >
          {SITE.orgShortName}
        </Link>
        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">{ROLE_LABEL[role]}</p>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2 lab-scrollbar">
        {items.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-2.5 border-l-2 px-2.5 py-2 text-left font-mono text-[11px] uppercase tracking-wide transition-colors',
                active
                  ? 'border-[#f4fe00] bg-white/[0.04] text-zinc-100'
                  : 'border-transparent text-zinc-500 hover:border-zinc-600 hover:bg-white/[0.02] hover:text-zinc-300'
              )}
            >
              <NavIcon name={item.icon} />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    'shrink-0 px-1 py-px font-mono text-[9px] font-bold',
                    item.badgeVariant === 'accent' && 'bg-[#f4fe00] text-black',
                    item.badgeVariant === 'error' && 'bg-destructive text-destructive-foreground',
                    item.badgeVariant === 'warning' && 'bg-warning text-black',
                    !item.badgeVariant && 'bg-zinc-700 text-zinc-200'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <p className="font-mono text-[9px] leading-relaxed text-zinc-600">{SITE.facilityName}</p>
      </div>
    </aside>
  )
}
