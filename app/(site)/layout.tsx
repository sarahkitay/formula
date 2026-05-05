import { MarketingEmailCapture } from '@/components/marketing/marketing-email-capture'
import { SiteHeader } from '@/components/marketing/site-header'
import { MarketingFooter } from '@/components/marketing/marketing-footer'

export default function PublicSiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="marketing-site min-h-[100dvh] w-full min-w-0 antialiased">
      <SiteHeader />
      <main className="min-w-0 w-full overflow-x-clip">{children}</main>
      <MarketingEmailCapture />
      <MarketingFooter />
    </div>
  )
}
