import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    /** Cache optimized marketing images longer on the CDN / browser (repeat visits). */
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
