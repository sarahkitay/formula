'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function AdminClientProfileSearch() {
  const router = useRouter()
  const [email, setEmail] = useState('')

  return (
    <form
      className="flex max-w-md flex-col gap-3 sm:flex-row sm:items-end"
      onSubmit={e => {
        e.preventDefault()
        const q = email.trim()
        if (!q) return
        router.push(`/admin/clients/profile?email=${encodeURIComponent(q)}`)
      }}
    >
      <label className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-formula-mist">
          Receipt email
        </span>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="parent@example.com"
          className="min-h-10 rounded-md border border-formula-frost/20 bg-formula-paper/[0.06] px-3 py-2 font-mono text-[13px] text-formula-paper placeholder:text-formula-mist/50"
        />
      </label>
      <Button type="submit" variant="secondary" className="shrink-0">
        Open profile
      </Button>
    </form>
  )
}
