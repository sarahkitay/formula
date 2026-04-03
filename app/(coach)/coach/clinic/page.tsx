import Link from 'next/link'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { clinicDeliveryDemo } from '@/lib/mock-data/coach-operating'

export default function CoachClinicPage() {
  const c = clinicDeliveryDemo
  return (
    <PageContainer fullWidth>
      <div className="space-y-6">
        <PageHeader
          title="Clinic delivery"
          subtitle="Scarce labs · ratio discipline · technical emphasis · follow-ups"
          actions={
            <Link href="/coach/today">
              <Button variant="ghost" size="sm">
                Today
              </Button>
            </Link>
          }
        />

        <div className="grid gap-4 border border-white/10 bg-[#0f0f0f] p-5 md:grid-cols-2">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">Session</p>
            <p className="mt-1 text-[15px] text-zinc-100">{c.title}</p>
            <p className="mt-2 font-mono text-[11px] text-zinc-400">{c.focus}</p>
          </div>
          <div className="font-mono text-[11px] text-zinc-400">
            <p>
              <span className="text-zinc-600">Ratio</span> · {c.ratio}
            </p>
            <p className="mt-2">
              <span className="text-zinc-600">Format</span> · {c.format}
            </p>
            <p className="mt-2">
              <span className="text-zinc-600">Roster</span> · {c.rosterCount}
            </p>
          </div>
        </div>

        <div className="border border-white/10 bg-[#0f0f0f] p-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">Post-clinic</p>
          <p className="mt-2 text-[13px] text-zinc-300">{c.nextSteps}</p>
          <textarea
            rows={3}
            disabled
            className="mt-3 w-full border border-white/10 bg-black/30 px-3 py-2 font-mono text-[12px] text-zinc-500"
            placeholder="Notes sync to FPI + parent comms (TBD)"
          />
        </div>
      </div>
    </PageContainer>
  )
}
