import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The photos in public/ are pre-sized for their sections; serving them
  // directly avoids the /_next/image optimizer, which 404s under the
  // services-mode Vercel deployment.
  images: { unoptimized: true },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
