import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    /** Cache optimized marketing images longer on the CDN / browser (repeat visits). */
    minimumCacheTTL: 60 * 60 * 24 * 30,
    /** Prefer modern formats when the browser supports them (smaller than JPEG at similar quality). */
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
};

export default nextConfig;
