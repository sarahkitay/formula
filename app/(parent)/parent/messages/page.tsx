import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/ui/page-header'
import { ParentPanel } from '@/components/parent/parent-panel'
import { parentMessages } from '@/lib/mock-data/parent-portal'

const categoryLabel: Record<(typeof parentMessages)[0]['category'], string> = {
  reminder: 'Reminder',
  change: 'Schedule',
  checkin: 'Check-in',
  reassessment: 'Assessment',
  clinic: 'Clinic',
  announcement: 'News',
}

export default function ParentMessagesPage() {
  const sorted = [...parentMessages].sort(
  (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  )

  return (
  <PageContainer>
  <div className="space-y-8">
  <PageHeader
  title="Messages"
  subtitle="Session reminders, schedule changes, check-in confirmations, and invitations - in one place."
  />

  <ParentPanel title="Inbox" eyebrow="COMMUNICATION">
  <ul className="space-y-3">
  {sorted.map(m => (
  <li
  key={m.id}
  className="border border-white/10 bg-black/25 px-4 py-3 transition-colors hover:border-white/20"
  >
  <div className="flex flex-wrap items-center justify-between gap-2">
  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#22c55e]/90">
  {categoryLabel[m.category]}
  </span>
  <time className="text-xs text-zinc-500" dateTime={m.sentAt}>
  {new Date(m.sentAt).toLocaleString('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  })}
  </time>
  </div>
  <p className="mt-1 font-medium text-zinc-100">{m.title}</p>
  <p className="mt-1 text-sm text-zinc-400">{m.preview}</p>
  </li>
  ))}
  </ul>
  <p className="mt-6 text-center text-xs text-text-muted">Push & SMS preferences - coming with mobile app.</p>
  </ParentPanel>
  </div>
  </PageContainer>
  )
}
