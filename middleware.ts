import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/** Browsers still request `/favicon.ico` by default; serve the app `icon.png` route so the Vercel default is never used. */
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/favicon.ico') {
    return NextResponse.rewrite(new URL('/icon.png', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/favicon.ico',
}
