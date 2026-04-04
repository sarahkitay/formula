import Link from 'next/link'
import { MembershipWaitlistCapture } from '@/components/marketing/membership-waitlist-capture'
import { MARKETING_HREF } from '@/lib/marketing/nav'
import { MarketingTextReveal } from '@/components/marketing/marketing-text-reveal'
import { cn } from '@/lib/utils'

type PathTier = 'primary' | 'default' | 'quiet'

/** Homepage conversion matrix - disciplined CTAs mapped to operational next steps. */
type PathItem =
  | { label: string; line: string; tier: PathTier; waitlist: true }
  | { label: string; line: string; tier: PathTier; href: string }

const PATHS: PathItem[] = [
  {
    label: 'Book an assessment',
    line: 'Movement + ball baseline. Lane + priorities - fast.',
    href: MARKETING_HREF.assessment,
    tier: 'primary',
  },
  {
    label: 'Join membership waitlist',
    line: 'Controlled density. We’ll email you when a spot opens.',
    tier: 'default',
    waitlist: true,
  },
  {
    label: 'Register for a clinic',
    line: 'Small groups. High reps. Members-first, Formula-informed.',
    href: MARKETING_HREF.clinics,
    tier: 'default',
  },
  {
    label: 'Register for camp',
    line: 'Full facility. Structured days - summer + holidays.',
    href: MARKETING_HREF.camps,
    tier: 'default',
  },
  {
    label: 'Rental inquiry',
    line: 'Clubs · teams · private - premium inventory rules.',
    href: MARKETING_HREF.rentals,
    tier: 'quiet',
  },
  {
    label: 'Register for adult programming',
    line: 'Pickup + leagues. Controlled floor. Seasonal.',
    href: MARKETING_HREF.adults,
    tier: 'default',
  },
]

function pathLabelClass(tier: PathTier) {
  switch (tier) {
    case 'primary':
      return 'inline-flex w-fit items-center border border-formula-volt/45 bg-formula-volt/[0.12] px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-formula-volt shadow-[inset_0_0_0_1px_rgb(220_255_0_/_0.08)] transition-colors group-hover:border-formula-volt/70 group-hover:bg-formula-volt/[0.18]'
    case 'quiet':
      return 'inline-block font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-formula-mist/60 underline decoration-formula-frost/25 underline-offset-[5px] transition-colors group-hover:text-formula-frost/75 group-hover:decoration-formula-frost/40'
    default:
      return 'inline-block font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-formula-volt/95 transition-opacity group-hover:opacity-100'
  }
}

export function ConversionPathways({ id = 'convert' }: { id?: string }) {
  return (
    <section id={id} className="mx-auto max-w-[1200px] px-6 py-24 md:py-32">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-formula-mist">Next step</p>
      <MarketingTextReveal>
        <h2 className="mt-4 max-w-2xl font-mono text-2xl font-semibold tracking-tight text-formula-paper md:text-[1.65rem]">
          Pick your door. One clear action each.
        </h2>
      </MarketingTextReveal>
      <ul className="mt-12 grid gap-px bg-formula-frost/10 sm:grid-cols-2 lg:grid-cols-3">
        {PATHS.map(item => (
          <li
            key={item.label}
            className={cn(
              'marketing-glass bg-formula-base/80 p-6 transition-colors md:p-7',
              item.tier === 'primary' &&
                'relative z-[1] bg-formula-base/90 ring-1 ring-inset ring-formula-volt/25 hover:bg-formula-deep/45',
              item.tier === 'quiet' && 'bg-formula-base/[0.65] hover:bg-formula-deep/35'
            )}
          >
            {'waitlist' in item && item.waitlist ? (
              <div className="group block">
                <MembershipWaitlistCapture
                  source="pathways"
                  label={`${item.label} →`}
                  buttonClassName={cn(
                    pathLabelClass(item.tier),
                    'w-full cursor-pointer border-0 bg-transparent p-0 text-left'
                  )}
                />
                <p
                  className={cn(
                    'mt-4 text-sm leading-relaxed',
                    item.tier === 'quiet' ? 'text-formula-mist/70' : 'text-formula-mist'
                  )}
                >
                  {item.line}
                </p>
              </div>
            ) : (
              <Link href={(item as Extract<PathItem, { href: string }>).href} className="group block no-underline">
                <span className={pathLabelClass(item.tier)}>
                  {item.label}
                  {item.tier === 'quiet' ? ' →' : item.tier === 'primary' ? '' : ' →'}
                </span>
                <p
                  className={cn(
                    'mt-4 text-sm leading-relaxed',
                    item.tier === 'quiet' ? 'text-formula-mist/70' : 'text-formula-mist'
                  )}
                >
                  {item.line}
                </p>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
