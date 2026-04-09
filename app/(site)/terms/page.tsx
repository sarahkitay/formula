import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'
import { MARKETING_HREF } from '@/lib/marketing/nav'

export const metadata: Metadata = {
  title: 'Terms and conditions',
  description: 'Terms of use for Formula Soccer Center website, payments, and SMS notifications via Twilio.',
  robots: { index: true, follow: true },
}

export default function TermsPage() {
  return (
    <MarketingInnerPage
      eyebrow="Legal"
      title="Terms and conditions"
      intro="Last updated: March 31, 2026. By using our website, booking services, or opting in to text messages, you agree to these terms in addition to any separate agreement you sign at the facility (for example, waivers or rental agreements)."
      wide
    >
      <h2>Website and services</h2>
      <p>
        Formula Soccer Center provides this website and on-site programs for informational and operational purposes. Descriptions of schedules, pricing, and
        availability may change; the desk or your written confirmation controls when there is a conflict.
      </p>

      <h2>Payments</h2>
      <p>
        Online payments are processed by <strong>Stripe</strong>. When you complete checkout, you agree to Stripe&apos;s terms and to pay the amounts shown for
        the selected product or deposit. Deposits and fees may be non-refundable as disclosed at purchase. Final invoicing for rentals or packages may follow
        published rates.
      </p>

      <h2>SMS terms (Twilio)</h2>
      <p>
        If you use the <strong>SMS notifications</strong> toggle at checkout (or otherwise provide express consent where we offer it), you agree to receive text
        messages from Formula Soccer Center related to your transactions, scheduling, and facility updates, sent using <strong>Twilio</strong> as our messaging
        provider.
      </p>
      <ul>
        <li>
          <strong>Consent:</strong> you confirm you are the subscriber of the mobile number provided or have authority to consent. Opting in to SMS is{' '}
          <strong>not required</strong> to complete your purchase.
        </li>
        <li>
          <strong>Rates and frequency:</strong> message and data rates may apply. Message frequency varies.
        </li>
        <li>
          <strong>Opt-out:</strong> reply <strong>STOP</strong> to cancel non-essential or marketing texts. Reply <strong>HELP</strong> for help.
        </li>
        <li>
          <strong>Carrier disclaimer:</strong> carriers are not liable for delayed or undelivered messages.
        </li>
        <li>
          <strong>Provider policies:</strong> Twilio&apos;s acceptable use and related policies apply to the technical delivery of messages. See{' '}
          <a href="https://www.twilio.com/legal" target="_blank" rel="noopener noreferrer" className="text-formula-volt underline-offset-2 hover:underline">
            twilio.com/legal
          </a>{' '}
          for Twilio&apos;s terms and privacy policy.
        </li>
      </ul>
      <p>
        Our <Link href={MARKETING_HREF.privacy}>privacy policy</Link> explains how we collect and share phone numbers and messaging-related data, including with
        Twilio.
      </p>

      <h2>Assumption of risk and waivers</h2>
      <p>
        Soccer and athletic training involve inherent risk. On-site participation requires applicable facility waivers and rules. Nothing on this site limits
        the effect of those documents when you or your athlete train at Formula.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, Formula and its staff are not liable for indirect, incidental, or consequential damages arising from use of the
        site or third-party services (including Stripe or Twilio). Our total liability for claims relating to the site is limited to the amount you paid us for the
        transaction giving rise to the claim in the three months preceding the claim, unless a higher minimum applies under law.
      </p>

      <h2>Changes</h2>
      <p>We may update these terms. Continued use of the site or opt-in channels after changes constitutes acceptance of the revised terms where allowed by law.</p>

      <h2>Contact</h2>
      <p>For legal or privacy questions, contact Formula Soccer Center using the contact information published on our website or at the facility.</p>

      <p className="not-prose mt-10 text-sm text-formula-frost/80">
        Related:{' '}
        <Link href={MARKETING_HREF.privacy} className="text-formula-volt underline-offset-2 hover:underline">
          Privacy policy
        </Link>
        {' · '}
        <Link href={MARKETING_HREF.home} className="text-formula-volt underline-offset-2 hover:underline">
          Home
        </Link>
      </p>
    </MarketingInnerPage>
  )
}
