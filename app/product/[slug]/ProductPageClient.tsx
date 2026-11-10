"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  FlaskConical,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Snowflake,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import ProductCard from "@/components/product/ProductCard";
import Footer from "@/components/sections/Footer";
import JanoshikModal from "@/components/JanoshikModal";
import { SERVICES, type Product } from "@/lib/data";
import { useCart, formatUSD } from "@/lib/cart";
import { EASE } from "@/lib/motion";

const TRUST = [
  { icon: ShieldCheck, label: "≥99% HPLC purity" },
  { icon: FlaskConical, label: "Independently tested" },
  { icon: FileText, label: "Batch-level certificates" },
];

const TABS = [
  { id: "package", label: "Package Contents", icon: Package },
  { id: "storage", label: "Storage Logic", icon: Snowflake },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ProductPageClient({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const gallery = product.gallery?.length ? product.gallery : [product.img];
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState<TabId>("package");
  const [showCert, setShowCert] = useState(false);
  const [assayOpen, setAssayOpen] = useState(false);
  const assayTriggerRef = useRef<HTMLButtonElement>(null);
  const closeAssay = useCallback(() => setAssayOpen(false), []);

  // Show the assay dialog every time a product page with assay data opens;
  // the "See assay results" button reopens it after it is closed.
  const hasAssay = !!product.analysis;
  useEffect(() => {
    if (!hasAssay) return;
    const t = window.setTimeout(() => setAssayOpen(true), 400);
    return () => {
      window.clearTimeout(t);
      setAssayOpen(false);
    };
  }, [hasAssay, product.slug]);

  const tabContent: Record<TabId, string[]> = {
    package: product.packageContents,
    storage: product.storage,
  };

  return (
    <>
      <SiteHeader />
      <JanoshikModal
        product={product}
        open={assayOpen}
        onClose={closeAssay}
        returnFocusRef={assayTriggerRef}
      />

      <main id="main" className="bg-pale pb-20">
        <div className="by-page">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm font-semibold text-pink/75">
              <li>
                <Link href="/" className="transition-colors hover:text-pink">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 transition-colors hover:text-pink"
                >
                  <ArrowLeft size={16} /> Catalog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="truncate text-pink">
                {product.title}
              </li>
            </ol>
          </nav>

          {/* Product */}
          <div className="mt-8 grid items-start gap-10 lg:grid-cols-2">
            {/* Left — image + thumbnails (sticky on desktop) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="lg:sticky lg:top-24 lg:self-start"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[12px]">
                <Image
                  key={gallery[activeImg]}
                  src={gallery[activeImg] ?? product.img}
                  alt={`${product.title} — research-grade peptide`}
                  fill
                  priority
                  fetchPriority="high"
                  className="object-contain p-8"
                  sizes="(min-width:1024px) 45vw, (min-width:640px) 90vw, 100vw"
                />
              </div>
              {gallery.length > 1 && (
                <div
                  className="mt-4 flex flex-wrap justify-center gap-3"
                  role="tablist"
                  aria-label="Product images"
                >
                  {gallery.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      role="tab"
                      onClick={() => setActiveImg(i)}
                      aria-label={`Show image ${i + 1} of ${gallery.length}`}
                      aria-selected={activeImg === i}
                      aria-current={activeImg === i}
                      className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-[7px] ring-1 transition-all sm:h-20 sm:w-20 ${
                        activeImg === i
                          ? "ring-2 ring-pink"
                          : "ring-pink/20 hover:ring-pink/40"
                      }`}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        className="object-contain p-1.5"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Right — details */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
            >
              <p className="eyebrow">Compound Analysis</p>
              <h1 className="by-h-product mt-2">{product.title}</h1>
              {/* 18px/700 at 1.3px tracking — the reference's PDP price. */}
              <p className="by-price mt-3 text-[18px] tracking-[1.3px]">
                <span className="sr-only">Price: </span>
                {formatUSD(product.price)}
                <span className="ml-2 text-xs font-normal text-pink/70">USD</span>
              </p>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed tracking-[0.6px] text-pink">
                {product.long}
              </p>

              {/* Safety protocol callout */}
              <div className="mt-5 flex gap-3 rounded-[12px] border border-pink/20 bg-yellow p-4">
                <ShieldCheck className="mt-0.5 shrink-0 text-pink" size={18} aria-hidden="true" />
                <p className="text-sm leading-relaxed text-pink">
                  <span className="font-bold">Safety Protocol:</span>{" "}
                  <span className="text-pink/75">
                    Produced for laboratory research only. Not for human or veterinary consumption.
                  </span>
                </p>
              </div>

              {/* Janoshik verified report button */}
              {product.janoshikUrl && (
                <a
                  href={product.janoshikUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-[7px] border-2 border-pink bg-pale px-5 py-3 text-sm font-bold uppercase tracking-wide text-pink transition-all hover:-translate-y-0.5 hover:bg-pink hover:text-yellow"
                >
                  <FileText size={16} aria-hidden="true" />
                  View Janoshik Analytical Report
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              )}

              {/* Janoshik lab analysis card */}
              {product.analysis ? (
                <div className="mt-6 overflow-hidden rounded-[12px] border border-pink/20 bg-pale shadow-[0_20px_60px_-40px_rgba(0,0,0,0.25)]">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink/20 bg-yellow px-5 py-4">
                    <div>
                      <h2 className="text-base font-bold text-pink">
                        Janoshik Third-Party Lab Analysis
                      </h2>
                      <p className="mt-1 text-xs text-pink/75">
                        Independently tested and verified by Janoshik Analytical.
                      </p>
                    </div>
                    <button
                      ref={assayTriggerRef}
                      type="button"
                      onClick={() => setAssayOpen(true)}
                      aria-haspopup="dialog"
                      className="by-btn shrink-0"
                    >
                      <FlaskConical size={16} aria-hidden="true" />
                      See assay results
                    </button>
                  </div>

                  <div
                    className={`grid gap-px bg-pink/10 ${
                      product.analysis.purity ? "grid-cols-3" : "grid-cols-2"
                    }`}
                  >
                    <div className="bg-pale px-5 py-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-pink/75">
                        Batch Number
                      </p>
                      <p className="mt-1 text-sm font-bold text-pink">
                        {product.analysis.batchNumber}
                      </p>
                    </div>
                    <div className="bg-pale px-5 py-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-pink/75">
                        Fill Volume
                      </p>
                      <p className="mt-1 text-sm font-bold text-pink">
                        {product.analysis.fillVolume}
                      </p>
                    </div>
                    {product.analysis.purity && (
                      <div className="bg-pale px-5 py-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-pink/75">
                          Purity
                        </p>
                        <p className="mt-1 text-sm font-bold text-pink">
                          {product.analysis.purity}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-pink/5">
                        <tr>
                          <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-pink/75">
                            Compound
                          </th>
                          <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-pink/75">
                            Concentration
                          </th>
                          <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-pink/75">
                            Verified Content
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.analysis.compounds.map((c) => (
                          <tr key={c.compound} className="border-t border-pink/15">
                            <td className="px-5 py-3 font-bold text-pink">{c.compound}</td>
                            <td className="px-5 py-3 text-pink">{c.concentration}</td>
                            <td className="px-5 py-3 font-semibold text-pink">
                              {c.verifiedContent}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="border-t border-pink/20 px-5 py-3 text-xs leading-relaxed text-pink/75">
                    Concentration is measured per ml; verified content reflects the total assayed
                    mass across the stated fill volume.
                  </p>

                  {(product.certificateImages?.length ?? 0) > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowCert((v) => !v)}
                      aria-expanded={showCert}
                      className="flex w-full items-center justify-between border-t border-pink/20 bg-yellow px-5 py-3 text-sm font-bold text-pink transition-colors hover:bg-pink hover:text-yellow"
                    >
                      <span className="inline-flex items-center gap-2">
                        <FileText size={14} aria-hidden="true" />
                        {showCert ? "Hide certificate images" : "View certificate images"}
                      </span>
                      <span aria-hidden="true">{showCert ? "−" : "+"}</span>
                    </button>
                  )}

                  {showCert && (
                    <div className="grid gap-3 border-t border-pink/20 bg-pale p-4 sm:grid-cols-2">
                      {product.certificateImages?.map((src, i) => (
                        <a
                          key={src}
                          href={src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative block aspect-[3/4] overflow-hidden rounded-[7px] ring-1 ring-pink/20 transition-all hover:ring-pink"
                        >
                          <Image
                            src={src}
                            alt={`${product.title} Janoshik certificate page ${i + 1}`}
                            fill
                            loading="lazy"
                            className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                            sizes="(min-width:640px) 45vw, 90vw"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                !product.hideCertNotice && (
                  <div className="mt-6 flex gap-3 rounded-[12px] border border-dashed border-pink/25 bg-yellow p-4">
                    <FlaskConical className="mt-0.5 shrink-0 text-pink/75" size={18} aria-hidden="true" />
                    <p className="text-sm leading-relaxed text-pink/75">
                      <span className="font-bold text-pink">Certificate of analysis pending.</span>{" "}
                      This batch is awaiting third-party Janoshik verification — check back soon.
                    </p>
                  </div>
                )
              )}

              {/* Specs */}
              <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-[12px] border border-pink/20 bg-pink/15">
                {product.specs.map((s) => (
                  <div key={s.label} className="bg-pale p-4">
                    <dt className="text-xs font-medium uppercase tracking-wide text-pink/75">
                      {s.label}
                    </dt>
                    <dd className="mt-1 text-sm font-bold text-pink">{s.value}</dd>
                  </div>
                ))}
              </dl>

              {/* Info tabs (Package / Storage / Supply) */}
              <div className="mt-6 overflow-hidden rounded-[12px] border border-pink/20 bg-pale">
                <div
                  role="tablist"
                  aria-label="Product information"
                  className="flex flex-wrap gap-px bg-pink/15"
                >
                  {TABS.map((t) => {
                    const active = activeTab === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setActiveTab(t.id)}
                        className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${
                          active
                            ? "bg-pink text-yellow"
                            : "bg-pale text-pink hover:bg-yellow"
                        }`}
                      >
                        <t.icon size={14} aria-hidden="true" />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
                <ul className="space-y-2 p-5 text-sm leading-relaxed text-pink/75">
                  {tabContent[activeTab].map((line, i) => (
                    <li key={i} className={i === 0 ? "font-semibold text-pink" : ""}>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Qty + add to cart */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                {/* Square stepper — the reference uses no pill controls. */}
                <div
                  className="flex w-fit items-center border border-pink/55"
                  role="group"
                  aria-label="Quantity selector"
                >
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="grid h-[45px] w-[45px] place-items-center text-pink transition-colors duration-[var(--dur)] ease-[var(--ease)] hover:bg-pink hover:text-yellow"
                  >
                    <Minus size={16} />
                  </button>
                  <span
                    className="w-12 text-center text-lg font-bold text-pink"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="grid h-[45px] w-[45px] place-items-center text-pink transition-colors duration-[var(--dur)] ease-[var(--ease)] hover:bg-pink hover:text-yellow"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={() => add(product.slug, qty)}
                  aria-label={`Add ${qty} × ${product.title} to cart`}
                  className="by-btn by-btn-soft w-full sm:w-auto sm:min-w-[290px]"
                >
                  <ShoppingBag size={18} aria-hidden /> Add to Cart
                </button>
              </div>

              {/* Research-only disclaimer near Add to Cart */}
              <div className="mt-5 flex gap-3 rounded-[12px] border-l-4 border-pink bg-yellow p-4">
                <ShieldCheck className="mt-0.5 shrink-0 text-pink" size={18} aria-hidden="true" />
                <p className="text-xs leading-relaxed text-pink">
                  <span className="font-bold uppercase tracking-wide">
                    For research purposes only.
                  </span>{" "}
                  <span className="text-pink/75">
                    Not intended for human or veterinary use. Not intended to diagnose, treat,
                    cure, or prevent any disease. Products are supplied strictly for laboratory
                    and analytical research conducted by qualified professionals.
                  </span>
                </p>
              </div>

              {/* Trust row */}
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-pink/20 pt-6">
                {TRUST.map((t) => (
                  <li key={t.label} className="flex items-center gap-2 text-sm font-medium text-pink">
                    <t.icon size={18} className="text-pink" aria-hidden="true" /> {t.label}
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-xs leading-relaxed text-pink/75">
                FOR RESEARCH PURPOSES ONLY. Not intended for human or veterinary use. Not intended
                to diagnose, treat, cure, or prevent any disease. Products are supplied strictly
                for laboratory and analytical research conducted by qualified professionals.
              </p>
            </motion.div>
          </div>

          {/* Related products — same card and grid as every other
              collection row on the site. */}
          <section className="mt-20" aria-labelledby="related-heading">
            <div className="flex items-center justify-between gap-4">
              <h2 id="related-heading" className="by-h-section">
                Continue your research
              </h2>
              <Link href="/shop" className="by-btn shrink-0">
                View all
              </Link>
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-1 lg:grid-cols-4 lg:gap-2">
              {SERVICES.filter((p) => p.slug !== product.slug)
                .slice(0, 4)
                .map((p) => (
                  <li key={p.slug}>
                    <ProductCard product={p} sizes="(min-width:990px) 24vw, 46vw" />
                  </li>
                ))}
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
