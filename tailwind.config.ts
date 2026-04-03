import type { Config } from 'tailwindcss'

/**
 * Tailwind CSS v4 uses `app/globals.css` (`@import "tailwindcss"` + `@theme`) as the source of truth
 * for colors, radii, shadows, and component-layer classes (`.card-surface`, `.shell-sidebar`, etc.).
 *
 * This file keeps a conventional entry point for tooling and documents content paths.
 */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
} satisfies Config
