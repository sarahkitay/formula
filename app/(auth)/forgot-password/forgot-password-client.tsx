'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { LoginFormulaBallBackground } from '@/components/auth/login-formula-ball-background'
import { FormulaLogoMarkLink } from '@/components/shared/formula-logo-mark'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { SITE } from '@/lib/site-config'

export function ForgotPasswordClient() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${origin}/login`,
    })

    setLoading(false)
    if (resetErr) {
      setError(resetErr.message)
      return
    }
    setMessage('If an account exists for that email, you’ll get a reset link shortly.')
  }

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
            <p className="mt-1 text-lg text-formula-frost/90">{SITE.facilityName}</p>
          </div>

          <div className="rounded-xl border border-formula-frost/12 bg-formula-deep/45 p-8 shadow-[0_24px_64px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10">
            <h2 className="text-xl font-semibold text-formula-paper">Reset password</h2>
            <p className="mt-2 text-sm leading-relaxed text-formula-mist">
              Enter the email on your account. We’ll send a link to set a new password.
            </p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-formula-frost/95">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-md border border-formula-frost/15 bg-formula-paper/[0.06] px-4 text-[15px] text-formula-paper placeholder:text-formula-mist/80 transition-colors focus:border-formula-volt/45 focus:bg-formula-paper/[0.09] focus:outline-none"
                />
              </div>
              {error ? <p className="text-sm text-red-300/90">{error}</p> : null}
              {message ? <p className="text-sm text-formula-frost/85">{message}</p> : null}
              <Button
                variant="primary"
                size="lg"
                loading={loading}
                className="mt-2 h-14 w-full rounded-md border border-black/25 !bg-formula-volt !text-base !font-semibold !text-black"
              >
                Send reset link
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-formula-mist">
              <Link href="/login" className="font-medium text-formula-paper underline-offset-4 hover:text-formula-volt hover:underline">
                ← Back to sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
