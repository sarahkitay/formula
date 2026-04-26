'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export type WaiverRosterInviteOption = {
  id: string
  label: string
  completed: number
  expected: number
}

export function WaiverRosterLinkControls({
  agreementId,
  currentInviteId,
  inviteOptions,
}: {
  agreementId: string
  currentInviteId: string | null
  inviteOptions: WaiverRosterInviteOption[]
}) {
  const router = useRouter()
  const [value, setValue] = useState(currentInviteId ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setValue(currentInviteId ?? '')
  }, [currentInviteId])

  const apply = useCallback(
    async (next: string) => {
      setError(null)
      setSaving(true)
      try {
        const waiverInviteId = next === '' ? null : next
        const res = await fetch('/api/admin/field-rental-agreement-waiver-invite', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agreementId, waiverInviteId }),
        })
        const body = (await res.json()) as { error?: string }
        if (!res.ok) throw new Error(body.error ?? 'Save failed')
        setValue(next)
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Save failed')
      } finally {
        setSaving(false)
      }
    },
    [agreementId, router]
  )

  return (
    <section className="rounded-lg border border-formula-frost/18 bg-formula-paper/[0.04] p-5 md:p-6">
      <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-formula-mist">Roster link association</h2>
      <p className="mt-2 text-xs leading-relaxed text-formula-frost/80">
        Link this signed waiver to a roster invite so it counts toward <strong className="text-formula-paper/90">waivers signed</strong> for that organizer — even
        if the participant used the public waiver form instead of the share link.
      </p>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="block min-w-[min(100%,280px)] flex-1 font-mono text-[10px] text-formula-mist">
          Roster invite
          <select
            className="mt-1 w-full border border-formula-frost/20 bg-formula-base/60 px-2 py-2 text-[12px] text-formula-paper"
            value={value}
            disabled={saving}
            onChange={e => setValue(e.target.value)}
          >
            <option value="">— Not linked</option>
            {inviteOptions.map(opt => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <Button type="button" variant="secondary" size="sm" disabled={saving || value === (currentInviteId ?? '')} onClick={() => void apply(value)}>
          {saving ? 'Saving…' : 'Save link'}
        </Button>
      </div>
      {error ? <p className="mt-2 font-mono text-[11px] text-amber-200/90">{error}</p> : null}
    </section>
  )
}
