import { Suspense } from 'react'
import { LoginPageClient } from './login-client'

function LoginFallback() {
  return (
    <div className="flex w-full max-w-sm flex-col items-center justify-center gap-3 py-16 text-sm text-text-muted">
      Loading sign-in…
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginPageClient />
    </Suspense>
  )
}
