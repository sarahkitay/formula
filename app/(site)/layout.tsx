import { SiteHeader } from '@/components/marketing/site-header'
import { MarketingFooter } from '@/components/marketing/marketing-footer'

export default function PublicSiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="marketing-site min-h-[100dvh] antialiased">
      <SiteHeader />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  )
}
