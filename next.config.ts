import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Turbopack only resolves modules inside its detected root (this
    // project's package-lock.json). The send-order-confirmation API route
    // imports ../../../../../shared-email/order-email.js, which lives
    // outside that root, so widen it to the common Dev/ ancestor.
    root: path.join(import.meta.dirname, "../.."),
  },
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  images: {
    // Prefer AVIF, fall back to WebP. next/image negotiates via Accept.
    formats: ["image/avif", "image/webp"],
    // Next 16 only emits qualities on this allowlist (default [75]). 90 is for
    // the full-bleed banners, where 75 leaves visible mush in gradients and
    // skin at 2560px. Everything else stays on 75.
    qualities: [75, 90],
    // Cache generated variants aggressively — content-hashed public assets
    // are effectively immutable, so a long TTL is safe.
    minimumCacheTTL: 60 * 60 * 24 * 365,
    // Trim the srcset ladder to sizes real breakpoints actually request.
    deviceSizes: [360, 430, 640, 768, 1024, 1280, 1440, 1600, 1920, 2400],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico|gif|woff2?)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
