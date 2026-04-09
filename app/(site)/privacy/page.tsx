import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingInnerPage } from '@/components/marketing/marketing-inner'
import { MARKETING_HREF } from '@/lib/marketing/nav'

export const metadata: Metadata = {
  title: 'Privacy policy',
  description:
    'How Formula Soccer Center collects, uses, and shares information, including SMS and messaging through Twilio.',
  robots: { index: true, follow: true },
}

export default function PrivacyPolicyPage() {
  return (
    <MarketingInnerPage
      eyebrow="Legal"
      title="Privacy policy"
      intro="Last updated: March 31, 2026. This policy describes how Formula Soccer Center (“Formula,” “we,” “us”) handles personal information when you use our website, book services, or receive messages from us."
      wide
    >
      <h2>Who we are</h2>
      <p>
        Formula Soccer Center operates this site and our training facility. For questions about this policy or your data, contact us through the email or phone
        number we publish on our website or at the front desk.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Contact and account data:</strong> name, email address, phone number, and similar identifiers you provide when you register, book, join a
          waitlist, or pay through our checkout flow.
        </li>
        <li>
          <strong>Payment data:</strong> payments are processed by Stripe. We receive payment status, amounts, and limited billing details from Stripe; we do
          not store full card numbers on our servers.
        </li>
        <li>
          <strong>Booking and program data:</strong> assessment slots, rental requests, participant counts, waivers, and related operational details you submit
          in forms or portals.
        </li>
        <li>
          <strong>Device and log data:</strong> standard server logs, IP address, browser type, and similar technical data used to secure and improve the site.
        </li>
      </ul>

      <h2>How we use information</h2>
      <ul>
        <li>To provide services you request: scheduling, facility access, memberships, assessments, and rentals.</li>
        <li>To process payments and send receipts or service-related emails.</li>
        <li>
          <strong>SMS and text messages:</strong> if you opt in at checkout (or through another explicit consent flow we provide), we may use your mobile number
          to send transactional or informational texts about your purchases, bookings, and facility updates. We do not require SMS opt-in to complete a
          purchase.
        </li>
        <li>To comply with law, enforce our agreements, and protect the safety of athletes, families, and staff.</li>
      </ul>

      <h2>Twilio and SMS infrastructure</h2>
      <p>
        We use <strong>Twilio Inc.</strong> and its affiliates as a <strong>service provider</strong> to send and receive text messages on our behalf. When you
        receive an SMS from Formula, Twilio processes message content and delivery metadata according to Twilio&apos;s own privacy practices. We encourage you to
        review Twilio&apos;s privacy policy at{' '}
        <a href="https://www.twilio.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-formula-volt underline-offset-2 hover:underline">
          twilio.com/legal/privacy
        </a>
        .
      </p>
      <p>
        <strong>Opt-out:</strong> you can cancel SMS marketing or non-essential texts at any time by replying <strong>STOP</strong> to a message. After you opt
        out, we may still send a short confirmation and, where allowed by law, a small number of purely transactional messages related to services you already
        purchased. Reply <strong>HELP</strong> for assistance or contact us directly.
      </p>
      <p>
        <strong>Carriers:</strong> wireless carriers are not liable for delayed or undelivered messages. <strong>Message and data rates may apply.</strong>{' '}
        Message frequency varies based on your activity and program enrollment.
      </p>

      <h2>Sharing of information</h2>
      <p>We share information with:</p>
      <ul>
        <li>
          <strong>Stripe</strong> for payments.
        </li>
        <li>
          <strong>Twilio</strong> for SMS when you have opted in or when we send messages permitted without marketing consent under applicable law.
        </li>
        <li>Service providers who help us host the site, store data, or run operations, under confidentiality and processing terms.</li>
        <li>Authorities when required by law or to protect rights and safety.</li>
      </ul>
      <p>We do not sell your personal information for money. Where state privacy laws apply, we honor applicable rights to access, delete, or opt out as required.</p>

      <h2>Children</h2>
      <p>
        Our services involve youth athletes. Parents or guardians provide information about minors and control portal access. If you believe we have collected
        information from a child in error, contact us and we will take appropriate steps.
      </p>

      <h2>Retention and security</h2>
      <p>
        We retain information as long as needed to operate the facility, meet legal obligations, and resolve disputes. We use reasonable administrative,
        technical, and organizational measures to protect personal data.
      </p>

      <h2>Changes</h2>
      <p>We may update this policy from time to time. We will post the revised version on this page and update the “Last updated” date.</p>

      <p className="not-prose mt-10 text-sm text-formula-frost/80">
        Related:{' '}
        <Link href={MARKETING_HREF.terms} className="text-formula-volt underline-offset-2 hover:underline">
          Terms and conditions
        </Link>
        {' · '}
        <Link href={MARKETING_HREF.home} className="text-formula-volt underline-offset-2 hover:underline">
          Home
        </Link>
      </p>
    </MarketingInnerPage>
  )
}
