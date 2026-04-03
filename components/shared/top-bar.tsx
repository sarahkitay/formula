'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Bell, ChevronDown, Search, PanelLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TopBarProps {
  role: 'admin' | 'coach' | 'parent'
  userName?: string
  userEmail?: string
  pageTitle?: string
  dashboardHref: string
  /** Mobile: toggles sidebar drawer */
  onMenuClick?: () => void
  showMenuButton?: boolean
}

const NOTIFICATIONS = [
  { id: 1, text: 'Noah Patel // membership expired', time: '5m ago', unread: true },
  { id: 2, text: 'New booking // Sofia Martinez (U14)', time: '12m ago', unread: true },
  { id: 3, text: 'Taylor Brooks // 0 sessions remaining', time: '1h ago', unread: false },
]

export function TopBar({
  role,
  userName = 'Staff',
  userEmail: _userEmail,
  pageTitle,
  dashboardHref,
  onMenuClick,
  showMenuButton,
}: TopBarProps) {
  const pathname = usePathname()
  const [notifOpen, setNotifOpen] = React.useState(false)
  const [profileOpen, setProfileOpen] = React.useState(false)

  const derivedTitle = React.useMemo(() => {
    if (pageTitle) return pageTitle
    const segment = pathname.split('/').pop() ?? ''
    return segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Dashboard'
  }, [pathname, pageTitle])

  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length
  const onDashboard = pathname === dashboardHref

  React.useEffect(() => {
    const handler = () => {
      setNotifOpen(false)
      setProfileOpen(false)
    }
    if (notifOpen || profileOpen) document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [notifOpen, profileOpen])

  return (
    <header className="topbar-glass sticky top-0 z-30 flex h-12 shrink-0 items-center gap-3 px-3 md:gap-4 md:px-5">
      {showMenuButton && (
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px] border border-white/10 bg-black/20 text-text-secondary transition-colors hover:bg-white/[0.06] hover:text-text-primary lg:hidden"
          aria-label="Open menu"
        >
          <PanelLeft className="h-4 w-4" strokeWidth={1.75} />
        </button>
      )}

      <Link
        href={dashboardHref}
        className={cn(
          'flex shrink-0 items-center gap-2 rounded-[2px] px-2 py-1.5 text-text-secondary transition-colors duration-150 hover:bg-white/[0.06] hover:text-text-primary',
          onDashboard && 'bg-white/[0.06] text-text-primary'
        )}
      >
        <LayoutDashboard className="h-4 w-4 shrink-0" strokeWidth={1.75} />
        <span className="hidden text-[13px] font-medium sm:inline">Overview</span>
      </Link>

      <div className="hidden h-4 w-px shrink-0 bg-white/10 sm:block" />

      <div className="min-w-0 flex-1">
        <p className="font-mono text-[9px] font-medium uppercase tracking-[0.2em] text-text-muted">View</p>
        <h2 className="truncate text-base font-semibold tracking-tight text-text-primary md:text-lg">
          {derivedTitle}
        </h2>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          className="hidden min-w-[180px] max-w-[240px] items-center gap-2 rounded-[2px] border border-white/10 bg-black/25 px-3 py-1.5 text-left text-text-muted backdrop-blur-sm transition-colors duration-150 hover:border-white/15 hover:bg-black/35 md:flex"
        >
          <Search className="h-3.5 w-3.5 shrink-0 opacity-60" strokeWidth={1.75} />
          <span className="truncate font-mono text-[12px]">Search…</span>
          <kbd className="ml-auto rounded-[2px] border border-white/10 bg-black/40 px-1 py-0.5 font-mono text-[10px] text-text-muted">
            ⌘K
          </kbd>
        </button>

        <div className="relative" onClick={e => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => {
              setNotifOpen(p => !p)
              setProfileOpen(false)
            }}
            className={cn(
              'relative flex h-9 w-9 items-center justify-center rounded-[2px] text-text-secondary transition-colors duration-150 hover:bg-white/[0.06]',
              notifOpen && 'bg-white/[0.06] text-text-primary'
            )}
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" strokeWidth={1.75} />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 bg-[#f4fe00] shadow-[0_0_6px_#f4fe00]" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full z-50 mt-1.5 w-80 overflow-hidden rounded-[2px] border border-white/10 bg-[#141414]/95 shadow-depth-lg backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5">
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-text-muted">
                  Alerts
                </span>
                {unreadCount > 0 && (
                  <span className="font-mono text-[11px] font-medium text-[#f4fe00]">{unreadCount} new</span>
                )}
              </div>
              <div>
                {NOTIFICATIONS.map(n => (
                  <div
                    key={n.id}
                    className={cn(
                      'border-b border-white/[0.06] px-3 py-2.5 transition-colors duration-150 last:border-b-0',
                      n.unread && 'bg-[#f4fe00]/[0.06]'
                    )}
                  >
                    <div className="flex items-start gap-2.5">
                      {n.unread ? (
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 bg-[#f4fe00]" />
                      ) : (
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 bg-zinc-600" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            'text-[13px] leading-snug',
                            n.unread ? 'text-text-primary' : 'text-text-secondary'
                          )}
                        >
                          {n.text}
                        </p>
                        <p className="mt-0.5 font-mono text-[11px] text-text-muted">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 px-3 py-2">
                <button
                  type="button"
                  className="font-mono text-[11px] font-medium text-text-primary transition-colors duration-150 hover:text-[#f4fe00]"
                >
                  View all
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mx-1 hidden h-4 w-px bg-white/10 sm:block" />

        <div className="relative" onClick={e => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => {
              setProfileOpen(p => !p)
              setNotifOpen(false)
            }}
            className={cn(
              'flex h-9 items-center gap-2 rounded-[2px] px-1.5 text-text-secondary transition-colors duration-150 hover:bg-white/[0.06]',
              profileOpen && 'bg-white/[0.06] text-text-primary'
            )}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-[2px] bg-primary font-mono text-[11px] font-semibold text-primary-foreground">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden max-w-[120px] truncate text-[13px] font-medium sm:block">{userName}</span>
            <ChevronDown
              className={cn('h-3 w-3 opacity-50 transition-transform duration-150', profileOpen && 'rotate-180')}
              strokeWidth={1.75}
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full z-50 mt-1.5 w-44 overflow-hidden rounded-[2px] border border-white/10 bg-[#141414]/95 shadow-depth-lg backdrop-blur-md">
              <div className="border-b border-white/10 px-3 py-2.5">
                <p className="text-[13px] font-medium text-text-primary">{userName}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-text-muted">{role}</p>
              </div>
              <div className="p-1">
                <button
                  type="button"
                  className="w-full rounded-[2px] px-2.5 py-2 text-left text-[13px] text-text-secondary transition-colors duration-150 hover:bg-white/[0.06]"
                >
                  Profile
                </button>
                <Link
                  href="/login"
                  className="block w-full rounded-[2px] px-2.5 py-2 text-left text-[13px] text-text-primary transition-colors duration-150 hover:bg-white/[0.06]"
                >
                  Sign out
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
