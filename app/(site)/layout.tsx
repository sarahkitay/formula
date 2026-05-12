import { HomeIntentDialog } from '@/components/marketing/home-intent-dialog'
import { MarketingEmailCapture } from '@/components/marketing/marketing-email-capture'
import { MarketingFooter } from '@/components/marketing/marketing-footer'
import { MarketingSiteJsonLd } from '@/components/marketing/marketing-site-json-ld'
import { SiteHeader } from '@/components/marketing/site-header'

export default function PublicSiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="marketing-site min-h-[100dvh] w-full min-w-0 antialiased">
      <MarketingSiteJsonLd />
      <SiteHeader />
      <HomeIntentDialog />
      <main className="min-w-0 w-full overflow-x-clip">{children}</main>
      <MarketingEmailCapture />
      <MarketingFooter />
    </div>
  )
}
