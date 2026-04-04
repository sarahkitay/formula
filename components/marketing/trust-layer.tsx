import { ScrollFadeIn } from '@/components/marketing/scroll-fade-in'

const ITEMS: { title: string; body: string }[] = [
  {
  title: 'Schedule you can trust',
  body: 'Published blocks. Predictable rhythm - no last-minute chaos or packed floors.',
  },
  {
  title: 'Pro operations',
  body: 'Desk + coaching + programming = one system. Clean handoffs.',
  },
  {
  title: 'Measurement, not theater',
  body: 'The Formula coaches athletes internally - no public leaderboard culture.',
  },
  {
  title: 'Controlled density',
  body: 'Caps protect quality. On-time starts. Protected resets between blocks.',
  },
  {
  title: 'Premium environment',
  body: 'Sightlines + sound + inventory treated like performance gear - not a warehouse.',
  },
  {
  title: 'Energy inside structure',
  body: 'Tempo rules. Balanced competition. Standards that hold.',
  },
]

export function TrustLayer({ id = 'trust' }: { id?: string }) {
  return (
  <section id={id} className="bg-formula-deep/35 py-24 md:py-32">
  <div className="mx-auto max-w-[1200px] px-6">
  <ScrollFadeIn>
  <div className="flex items-center gap-2.5">
  <span className="h-[0.625rem] w-px shrink-0 bg-formula-volt/90" aria-hidden />
  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-formula-mist">Trust</p>
  </div>
  <h2 className="mt-4 font-mono text-2xl font-semibold leading-tight tracking-tight text-formula-paper md:text-[1.65rem]">
    Elite facility. Pro standards. Weekly proof.
  </h2>
  <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {ITEMS.map(item => (
  <li key={item.title} className="border border-formula-frost/10 bg-formula-base/60 p-6">
  <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-formula-paper/95">{item.title}</h3>
  <p className="mt-3 text-sm leading-relaxed text-formula-mist">{item.body}</p>
  </li>
  ))}
  </ul>
  </ScrollFadeIn>
  </div>
  </section>
  )
}
