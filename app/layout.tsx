import type { Metadata, Viewport } from "next";
import { Jost, Share_Tech } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { CartProvider } from "@/lib/cart";
import { AuthProvider } from "@/lib/auth";
import CartDrawer from "@/components/cart/CartDrawer";
import WelcomeModal from "@/components/WelcomeModal";
import {
  OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  TWITTER_HANDLE,
} from "@/lib/seo";

/* The reference ships Cera Pro, a commercial typeface we can't redistribute.
   Jost is the closest freely-licensed match: same geometric construction,
   double-storey `a`, near-identical cap height and round bowls. */
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica",
    "Arial",
    "sans-serif",
  ],
});

/* Squared monoline display face, used only for the "lab" banner lockup.
   Not preloaded: it sits below the fold. */
const shareTech = Share_Tech({
  variable: "--font-tech",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  generator: "Next.js",
  keywords: [
    "research peptides",
    "research reference material",
    "HPLC verified peptides",
    "laboratory peptides",
    "in-vitro research compounds",
    "analytical reference standard",
    "BPC-157",
    "TB-500",
    "retatrutide",
    "tirzepatide",
    "GHK-Cu",
    "batch certificates of analysis",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Laboratory research supplies",
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE.url,
        width: OG_IMAGE.width,
        height: OG_IMAGE.height,
        alt: OG_IMAGE.alt,
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e31d93" },
    { media: "(prefers-color-scheme: dark)", color: "#e31d93" },
  ],
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  legalName: `${SITE_NAME} Laboratories`,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  description: SITE_DESCRIPTION,
  slogan: SITE_TAGLINE,
  areaServed: "Worldwide",
  sameAs: [
    "https://twitter.com/luxenlabs",
    "https://www.linkedin.com/company/luxen",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@luxen.co",
      availableLanguage: ["English"],
      areaServed: "Worldwide",
    },
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "en",
  publisher: { "@type": "Organization", name: SITE_NAME },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jost.variable} ${shareTech.variable} antialiased`}>
      <head>
        {/* Warm up the connection used by next/image for CDN'd variants. */}
        <link rel="dns-prefetch" href="//images.unsplash.com" />
      </head>
      <body className="bg-pale text-pink">
        {/* Bypass hidden by default; visible only on keyboard focus. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[7px] focus:bg-pink focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:uppercase focus:tracking-[1px] focus:text-yellow"
        >
          Skip to main content
        </a>
        <AuthProvider>
          <CartProvider>
            <SmoothScroll>{children}</SmoothScroll>
            <CartDrawer />
            <WelcomeModal />
          </CartProvider>
        </AuthProvider>
        <Script
          id="ld-organization"
          type="application/ld+json"
          strategy="afterInteractive"
          // Object is a constant — serialising in-place keeps the script static.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Script
          id="ld-website"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
