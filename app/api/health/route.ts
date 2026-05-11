import { NextResponse } from 'next/server'
import { FORMULA_ADMIN_SHELL_MARKER } from '@/lib/admin-shell-version'

/** Future: Stripe webhooks, scanner ingest, etc. */
export function GET() {
  return NextResponse.json({
    ok: true,
    service: 'formula-api',
    ts: new Date().toISOString(),
    /** If this is missing or stale on www, production is not running this Git tree. */
    adminShellMarker: FORMULA_ADMIN_SHELL_MARKER,
    vercelGitSha: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
  })
}
