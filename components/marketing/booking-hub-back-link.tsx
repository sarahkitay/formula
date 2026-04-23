import Link from 'next/link'

export function BookingHubBackLink({ href }: { href: string }) {
  return (
    <p className="not-prose mb-8 font-mono text-[10px] uppercase tracking-[0.18em] text-formula-frost/70">
      <Link href={href} className="text-formula-volt underline-offset-2 hover:underline">
        ← Back to booking hub
      </Link>
    </p>
  )
}
