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
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; img-src 'self' data:; font-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self'; upgrade-insecure-requests",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
