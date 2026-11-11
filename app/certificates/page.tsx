import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import { SERVICES, type Product } from "@/lib/data";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Certificates of Analysis",
  description: `Third-party assay certificates for ${SITE_NAME} research reference peptides, independently tested by Janoshik Analytical. Batch numbers, HPLC purity and verified content for every assayed lot.`,
  alternates: { canonical: "/certificates" },
};

/* A lot is only listed once it has both the measured figures and a published
   report to check them against. Lots still in testing simply don't appear —
   their product pages already carry the "certificate pending" note. */
const ASSAYED = SERVICES.filter((p) => p.analysis && p.janoshikUrl);

/* The compound table repeats the modal's columns so a lot reads the same
   whether it's reached from here or from the product page. */
function CompoundTable({ product }: { product: Product }) {
  const { analysis } = product;
  if (!analysis) return null;

  return (
    <table className="mt-6 w-full text-left text-sm">
      <caption className="sr-only">
        Compounds measured in batch {analysis.batchNumber}
      </caption>
      <thead>
        <tr className="border-b border-pink/30">
          <th scope="col" className="pb-2 text-xs font-medium text-pink/70">
            Compound
          </th>
          <th scope="col" className="pb-2 text-xs font-medium text-pink/70">
            Per mL
          </th>
          <th
            scope="col"
            className="pb-2 text-right text-xs font-medium text-pink/70"
          >
            Verified
          </th>
        </tr>
      </thead>
      <tbody>
        {analysis.compounds.map((c) => (
          <tr key={c.compound} className="border-b border-pink/15">
            <th scope="row" className="py-3 pr-3 font-bold text-pink">
              {c.compound}
            </th>
            <td className="py-3 pr-3 tabular-nums text-pink/80">
              {c.concentration}
            </td>
            <td className="py-3 text-right font-bold tabular-nums text-pink">
              {c.verifiedContent}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function LotCard({ product }: { product: Product }) {
  const { analysis } = product;
  if (!analysis) return null;

  return (
    <article className="flex flex-col overflow-hidden rounded-[12px] bg-pale ring-1 ring-pink/15">
      {/* Headline figure on blue — the same treatment the assay dialog uses,
          so the data reads identically wherever it surfaces. */}
      <div className="bg-blue px-7 py-8 text-pale md:px-9">
        {analysis.purity ? (
          <>
            <p className="text-[56px] font-bold leading-[0.9] tracking-[-0.03em] tabular-nums text-yellow md:text-[72px]">
              {analysis.purity}
            </p>
            <p className="mt-3 text-sm leading-snug text-pale">
              purity, independently assayed
            </p>
          </>
        ) : (
          /* Blends carry no single purity figure on the report, so the
             verified content per compound leads instead. */
          <>
            <ul className="space-y-2">
              {analysis.compounds.map((c) => (
                <li key={c.compound} className="flex items-baseline gap-3">
                  <span className="text-[34px] font-bold leading-none tracking-[-0.02em] tabular-nums text-yellow md:text-[42px]">
                    {c.verifiedContent}
                  </span>
                  <span className="text-sm text-pale/80">{c.compound}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm leading-snug text-pale">
              verified content, independently assayed
            </p>
          </>
        )}

        <dl className="mt-7 grid grid-cols-2 gap-4 border-t border-pale/20 pt-5 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-[1px] text-pale/65">
              Batch
            </dt>
            <dd className="mt-1 font-medium tabular-nums text-pale">
              {analysis.batchNumber}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[1px] text-pale/65">
              Fill volume
            </dt>
            <dd className="mt-1 font-medium tabular-nums text-pale">
              {analysis.fillVolume}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-1 flex-col px-7 py-8 md:px-9">
        <h2 className="by-card-title text-[17px]">
          <Link href={`/product/${product.slug}`} className="by-link">
            {product.title}
          </Link>
        </h2>

        <CompoundTable product={product} />

        <p className="mt-3 text-xs leading-relaxed text-pink/70">
          Concentration is measured per mL; verified content is the total
          assayed mass across the {analysis.fillVolume} fill.
        </p>

        {product.certificateImages?.length ? (
          <div className="mt-7">
            <h3 className="text-xs font-medium uppercase tracking-[1px] text-blue">
              Report scans
            </h3>
            <ul className="mt-3 flex flex-wrap gap-3">
              {product.certificateImages.map((src, i) => (
                <li key={src}>
                  {/* Opens the raw scan. A lightbox would need client JS for
                      no real gain — the page stays static this way. */}
                  <a
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block overflow-hidden rounded-[7px] ring-1 ring-pink/20 transition-colors duration-[var(--dur)] ease-[var(--ease)] hover:ring-pink"
                  >
                    <Image
                      src={src}
                      alt={`${product.title} certificate of analysis, page ${i + 1}`}
                      width={92}
                      height={130}
                      className="by-banner-zoom h-[130px] w-[92px] object-cover object-top"
                    />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-auto pt-7">
          <a
            href={product.janoshikUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="by-btn by-btn-soft w-full sm:w-auto"
          >
            View full report
            <ExternalLink size={14} aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>
    </article>
  );
}

export default function CertificatesPage() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="bg-pale py-16 sm:py-20">
        <div className="by-page">
          <h1 className="by-h-section max-w-[18ch]">Certificates of analysis</h1>
          <p className="mt-5 max-w-[62ch] text-[15px] leading-relaxed tracking-[0.6px] text-pink">
            Every assayed lot below was independently characterised by Janoshik
            Analytical. Figures are taken from the published batch report — the
            same report you can open and read yourself.
          </p>

          <p className="mt-6 text-[15px] uppercase tracking-[1px] tabular-nums text-blue">
            {ASSAYED.length} lots independently assayed
          </p>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {ASSAYED.map((p) => (
              <LotCard key={p.slug} product={p} />
            ))}
          </div>

          <div className="mt-14 border-t border-pink/20 pt-8">
            <p className="max-w-[72ch] text-[11px] leading-relaxed text-pink/70">
              For research purposes only. Not intended for human or veterinary
              use. Not intended to diagnose, treat, cure, or prevent any disease.
            </p>
            <Button href="/shop" variant="primary" className="mt-7">
              Shop all
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
