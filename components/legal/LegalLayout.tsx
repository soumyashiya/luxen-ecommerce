import Link from "next/link";
import type { ReactNode } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/sections/Footer";
import Eyebrow from "@/components/ui/Eyebrow";

/* Shared shell for legal / info pages (privacy, refund, shipping, terms, press).
   Keeps heading, breadcrumb, and prose spacing consistent across all five. */
export default function LegalLayout({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />

      <main id="main" className="pb-24 pt-28">
        <div className="container-luxen max-w-3xl">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm font-semibold text-muted">
              <li>
                <Link href="/" className="transition-colors hover:text-brand">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="truncate text-ink">
                {title}
              </li>
            </ol>
          </nav>

          <div className="mt-8">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="h-display mt-4 text-[clamp(2rem,4vw,3.2rem)]">{title}</h1>
            {updated && <p className="mt-3 text-sm text-muted">Last updated: {updated}</p>}
          </div>

          <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-muted">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-ink">{title}</h2>
      <div className="mt-3 space-y-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_strong]:text-ink">
        {children}
      </div>
    </section>
  );
}
