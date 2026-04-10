'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

export function LogoutButton({ className, label = 'Log out' }: { className?: string; label?: string }) {
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={() => void handleLogout()}
      className={cn(
        'inline-flex items-center border border-formula-frost/20 bg-formula-paper/[0.04] px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-frost transition-colors hover:border-formula-frost/35 hover:text-formula-paper',
        className
      )}
    >
      {label}
    </button>
  )
}
