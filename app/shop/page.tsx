import type { Metadata } from "next";
import { Suspense } from "react";
import { SITE_NAME } from "@/lib/seo";
import ShopPageClient from "./ShopPageClient";

export const metadata: Metadata = {
  title: "Shop Research Peptides",
  description:
    "Browse the full LUXEN catalog of independently lab-tested research reference peptides. HPLC-verified purity, batch certificates of analysis, for laboratory R&D only.",
  alternates: { canonical: "/shop" },
  openGraph: {
    type: "website",
    url: "/shop",
    title: `Shop Research Peptides | ${SITE_NAME}`,
    description:
      "Browse the full LUXEN catalog of independently lab-tested research reference peptides.",
  },
};

export default function ShopPage() {
  /* ShopPageClient seeds its filter from `?q=`, so it needs a Suspense
     boundary to stay statically prerenderable. */
  return (
    <Suspense fallback={<div className="min-h-screen bg-pale" />}>
      <ShopPageClient />
    </Suspense>
  );
}
