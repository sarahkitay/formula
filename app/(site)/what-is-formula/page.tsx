import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'
import { MARKETING_HREF } from '@/lib/marketing/nav'

export const metadata: Metadata = {
  title: 'What Formula Is',
  description:
    'Cutting-edge club-complementary development: structured blocks, The Formula, Friday circuit, clinics, camps, adults, rentals, premium events.',
}

export default function WhatIsFormulaPage() {
  return (
  <MarketingInnerPage
  eyebrow="Positioning"
  title="Club-complementary. Built for the next tier."
  intro="Not a club replacement - an operating layer: structure, measurement, and application when the team calendar can’t carry it all."
  >
  <h2>The idea</h2>
  <p>
  Clubs build identity and minutes. Formula builds <strong>repeatable habits</strong>, <strong>measured progression</strong>, and{' '}
  <strong>controlled application</strong> - visible, coachable, long-term athletic literacy.
  </p>
  <h2>What Formula combines</h2>
  <ul>
  <li>
  <strong>Youth blocks</strong>  -  published schedules, capped density, no drop-in chaos.
  </li>
  <li>
  <strong>The Formula</strong>  -  coach + family signal. Internal science, not public ranking.
  </li>
  <li>
  <strong>Application</strong>  -  Friday circuit + arena scenarios; training → execution.
  </li>
  <li>
  <strong>Clinics & camps</strong>  -  scarce, coach-led labs + full-facility immersion.
  </li>
  <li>
  <strong>Adults</strong>  -  hosted pickup + leagues, respectful intensity.
  </li>
  <li>
  <strong>Rentals</strong>  -  packaged inventory: clubs, teams, private training.
  </li>
  <li>
  <strong>Events</strong>  -  parties, tournaments, Footbot - same ops standard.
  </li>
  </ul>
  <h2>Who it is for</h2>
  <p>
  Athletes who want <strong>standards</strong>, <strong>continuity</strong>, and a building that runs like a performance brand - on time, buffered, coaching that
  holds.
  </p>
  <p>
  Next: <Link href={MARKETING_HREF.youthMembership}>Youth membership</Link> · <Link href={MARKETING_HREF.fpi}>The Formula</Link> ·{' '}
  <Link href={MARKETING_HREF.fridayCircuit}>Friday circuit</Link>
  </p>
  </MarketingInnerPage>
  )
}
