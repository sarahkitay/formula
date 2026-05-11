import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/** Browsers still request `/favicon.ico` by default; serve the app `icon.png` route so the Vercel default is never used. */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/favicon.ico') {
    return NextResponse.rewrite(new URL('/icon.png', request.url))
  }

  // Staff OS: never cache HTML/RSC at the edge or in the browser — avoids stale admin chrome after deploys.
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const res = NextResponse.next()
    res.headers.set('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate')
    res.headers.set('Vary', 'Cookie')
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/favicon.ico', '/admin', '/admin/:path*'],
}
