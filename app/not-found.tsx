import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "The page you were looking for could not be found. Browse the LUXEN research peptide catalog to find what you need.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main
        id="main"
        className="by-page flex min-h-[70vh] flex-col items-center justify-center gap-5 text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pink">404</p>
        <h1 className="by-h-product">Page not found</h1>
        <p className="max-w-md text-pink/75">
          The page you were looking for doesn&apos;t exist or has moved. Head back to the catalog
          to continue browsing.
        </p>
        <Link
          href="/shop"
          className="by-btn mt-2"
        >
          Browse Catalog
        </Link>
      </main>
      <Footer />
    </>
  );
}
