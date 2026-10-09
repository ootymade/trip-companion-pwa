import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Vercel sets VERCEL_GIT_COMMIT_SHA at build time but doesn't expose it
    // to the browser itself; re-expose a short form under NEXT_PUBLIC_ so
    // the footer can show which deploy is actually live (see SiteFooter).
    NEXT_PUBLIC_BUILD_SHA: (process.env.VERCEL_GIT_COMMIT_SHA ?? "").slice(0, 7),
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        // Never let a stale service worker linger — every deploy must be
        // able to replace it immediately.
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
