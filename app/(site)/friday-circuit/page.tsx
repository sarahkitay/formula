import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'
import { MARKETING_HREF } from '@/lib/marketing/nav'

export const metadata: Metadata = {
  title: 'Friday Youth Game Circuit',
  description:
    'Cutting-edge application layer: pre-registered, balanced teams - execution under structure, no standings theater.',
}

export default function FridayCircuitPage() {
  return (
  <MarketingInnerPage
  eyebrow="Application"
  title="Friday circuit - training → behavior."
  intro="Competitive application: structured, pre-registered, coached for execution - not door scrimmages or standings."
  >
  <h2>Competitive application</h2>
  <p>
  Game-density reps, tempo discipline, feedback tied to weekly work - <strong>execution under pressure</strong>.
  </p>
  <h2>Structured & pre-registered</h2>
  <p>
  Planned rosters - quality, balance, <strong>respectful, coachable</strong> floors.
  </p>
  <h2>Balanced teams</h2>
  <p>
  Matchups for decisions - not blowouts. Learning under pressure, not a public scoreboard product.
  </p>
  <h2>No standings</h2>
  <p>
  No youth standings league here. Signal lives in <Link href={MARKETING_HREF.fpi}>The Formula</Link>, notes, behavior - not a table chasing wrong incentives.
  </p>
  <h2>No chaos</h2>
  <p>
  Rules, roles, interventions that hold. Energy <strong>inside</strong> structure.
  </p>
  <h2>Entry & fit</h2>
  <p>
  Aligned to attendance, readiness, coach nomination - application only works when athletes can sustain it safely.
  </p>
  <p>
  Start with <Link href={MARKETING_HREF.bookAssessmentPortal}>assessment booking</Link> and <Link href={MARKETING_HREF.youthMembership}>membership</Link>. Parents can coordinate through the{' '}
  <Link href="/login?role=parent">parent portal</Link>.
  </p>
  </MarketingInnerPage>
  )
}
