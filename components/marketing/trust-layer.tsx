import { ScrollFadeIn } from '@/components/marketing/scroll-fade-in'

const ITEMS: { title: string; body: string }[] = [
  {
    title: 'Published session blocks',
    body: 'You always know when and what your athlete is doing.',
  },
  {
    title: 'Capped enrollment',
    body: 'Quality protected, not volume maximized.',
  },
  {
    title: 'On-time starts and finishes',
    body: 'Professional floor operations, every session.',
  },
  {
    title: 'Protected transitions',
    body: 'No overlap, no chaos between groups.',
  },
  {
    title: 'Coaching standards',
    body: 'Consistent staff, consistent feedback, consistent expectations.',
  },
  {
    title: 'Measurement with care',
    body: 'The Formula coaches athletes internally. No public leaderboard culture.',
  },
]

export function TrustLayer({ id = 'trust' }: { id?: string }) {
  return (
    <section id={id} className="bg-formula-deep/35 py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6">
        <ScrollFadeIn>
          <div className="flex items-center gap-2.5">
            <span className="h-[0.625rem] w-px shrink-0 bg-formula-volt/90" aria-hidden />
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-formula-mist">Operational standards</p>
          </div>
          <h2 className="mt-4 font-mono text-2xl font-semibold leading-tight tracking-tight text-formula-paper md:text-[1.65rem]">
            How we run the floor
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
