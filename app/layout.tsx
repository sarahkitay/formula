import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ShellRoot } from '@/components/shell/shell-root'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
  default: 'Formula Soccer Center',
  template: '%s | Formula Soccer Center',
  },
  description:
    'Elevate your game - Formula Soccer Center: elite training programs, cutting-edge technology, structured development and premium facilities.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
  <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
  <body className="h-full font-sans text-foreground">
  <ShellRoot>{children}</ShellRoot>
  </body>
  </html>
  )
}
