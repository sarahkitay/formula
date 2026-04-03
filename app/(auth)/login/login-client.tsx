'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { LoginFormulaBallBackground } from '@/components/auth/login-formula-ball-background'
import { FormulaLogoMarkLink } from '@/components/shared/formula-logo-mark'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SITE } from '@/lib/site-config'

type StaffRole = 'admin' | 'coach'

const staffRoleConfig: Record<StaffRole, { label: string; href: string }> = {
  admin: { label: 'Admin / Front Desk', href: '/admin/dashboard' },
  coach: { label: 'Coach', href: '/coach/dashboard' },
}

const PARENT_HREF = '/parent/dashboard'

const rolePillActive =
  'border-formula-volt/55 bg-formula-volt/[0.14] text-formula-volt shadow-[inset_0_0_0_1px_rgb(220_255_0_/_0.2)]'

function staffRoleFromQuery(value: string | null): StaffRole | null {
  if (value === 'admin' || value === 'coach') return value
  return null
}

export function LoginPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [portal, setPortal] = useState<'parent' | 'staff'>('parent')
  const [staffRole, setStaffRole] = useState<StaffRole>('coach')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const q = searchParams.get('role')
    const s = staffRoleFromQuery(q)
    if (s) {
      setPortal('staff')
      setStaffRole(s)
      return
    }
    if (q === 'parent') {
      setPortal('parent')
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    const href = portal === 'parent' ? PARENT_HREF : staffRoleConfig[staffRole].href
    router.push(href)
  }

  const signInLabel =
    portal === 'parent' ? 'Parent portal' : staffRoleConfig[staffRole].label

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-x-hidden text-formula-paper">
      <LoginFormulaBallBackground />

      <div
        className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-5 py-10"
        style={{
          background:
            'radial-gradient(ellipse 85% 75% at 50% 42%, rgb(36 54 51 / 0.08) 0%, rgb(26 29 28 / 0.42) 55%, rgb(26 29 28 / 0.72) 100%)',
        }}
      >
        <div className="pointer-events-auto w-full max-w-md space-y-8">
          <div className="space-y-4 text-center">
            <h1 className="m-0 flex justify-center">
              <FormulaLogoMarkLink
                href="/"
                className="h-[4.25rem] max-w-[min(24rem,92vw)] opacity-95 sm:h-[5.25rem] md:h-24"
                ariaLabel={`${SITE.facilityName} home`}
              />
            </h1>
            <div>
              <p className="mt-1 text-lg text-formula-frost/90">{SITE.facilityName}</p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-formula-mist">{SITE.tagline}</p>
            </div>
          </div>

          <div className="rounded-xl border border-formula-frost/12 bg-formula-deep/45 p-8 shadow-[0_24px_64px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10">
            {portal === 'parent' ? (
              <>
                <h2 className="text-xl font-semibold text-formula-paper">Parent portal</h2>
                <p className="mt-2 text-sm leading-relaxed text-formula-mist">
                  Sign in with your guardian account to manage schedules, payments, and progress.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-formula-paper">Staff sign-in</h2>
                <div className="mt-5 space-y-1.5">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-formula-mist">Portal</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {(Object.entries(staffRoleConfig) as [StaffRole, (typeof staffRoleConfig)[StaffRole]][]).map(
                      ([r, meta]) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setStaffRole(r)}
                          className={cn(
                            'rounded border px-2 py-3 text-center text-[13px] leading-snug transition-all duration-200',
                            staffRole === r
                              ? rolePillActive
                              : 'border-formula-frost/12 bg-formula-paper/[0.04] text-formula-mist hover:border-formula-frost/20 hover:bg-formula-paper/[0.07] hover:text-formula-frost'
                          )}
                        >
                          {meta.label}
                        </button>
                      )
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPortal('parent')}
                  className="mt-4 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-volt/75 transition-opacity hover:opacity-100"
                >
                  ← Parent portal
                </button>
              </>
            )}

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-formula-frost/95">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="h-12 w-full rounded-md border border-formula-frost/15 bg-formula-paper/[0.06] px-4 text-[15px] text-formula-paper placeholder:text-formula-mist/80 transition-colors focus:border-formula-volt/45 focus:bg-formula-paper/[0.09] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-formula-frost/95">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="h-12 w-full rounded-md border border-formula-frost/15 bg-formula-paper/[0.06] px-4 pr-11 text-[15px] text-formula-paper placeholder:text-formula-mist/80 transition-colors focus:border-formula-volt/45 focus:bg-formula-paper/[0.09] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(p => !p)}
                    className="absolute inset-y-0 right-3 flex items-center text-formula-mist transition-colors hover:text-formula-frost"
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                loading={loading}
                className="mt-2 h-14 w-full rounded-md border border-black/25 !bg-formula-volt !text-base !font-semibold !text-black shadow-[0_4px_24px_rgb(220_255_0_/_0.28)] transition-[filter,transform,box-shadow] hover:!brightness-110 hover:shadow-[0_6px_28px_rgb(220_255_0_/_0.35)] active:translate-y-px"
              >
                {portal === 'parent' ? 'Sign in to parent portal' : `Sign in as ${signInLabel}`}
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-formula-mist">
              Forgot your password?{' '}
              <Link
                href="#"
                className="font-medium text-formula-paper underline-offset-4 transition-colors hover:text-formula-volt hover:underline"
              >
                Reset it
              </Link>
            </p>
          </div>

          <p className="text-center text-sm text-formula-mist">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-formula-mist underline-offset-4 transition-colors hover:text-formula-paper hover:underline"
            >
              ← Back to Formula home
            </Link>
          </p>
        </div>
      </div>

      {portal === 'parent' ? (
        <div className="relative z-10 pb-5 pt-2 text-center">
          <button
            type="button"
            onClick={() => setPortal('staff')}
            className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-formula-mist/80 underline-offset-4 transition-colors hover:text-formula-frost hover:underline"
          >
            Staff sign-in
          </button>
        </div>
      ) : null}

      <div className="pointer-events-none fixed bottom-5 right-5 z-20 rounded-lg border border-formula-frost/15 bg-formula-deep/80 px-3 py-2 text-xs text-formula-mist backdrop-blur-sm">
        Press <span className="font-mono text-formula-volt">Enter</span> to toggle wireframe
      </div>
    </div>
  )
}
