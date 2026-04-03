export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="portal-brand-surface admin-os min-h-dvh w-full antialiased">
      {children}
    </div>
  )
}
