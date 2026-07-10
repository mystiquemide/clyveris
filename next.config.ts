import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The photos in public/ are pre-sized for their sections; serving them
  // directly avoids the /_next/image optimizer, which 404s under the
  // services-mode Vercel deployment.
  images: { unoptimized: true },
};

export default nextConfig;
