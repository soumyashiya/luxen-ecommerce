"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
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

  const tabContent: Record<TabId, string[]> = {
    package: product.packageContents,
    storage: product.storage,
  };

  return (
    <>
      <SiteHeader />
      <JanoshikModal product={product} />

      <main id="main" className="pb-24 pt-28">
        <div className="container-luxen">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm font-semibold text-muted">
              <li>
                <Link href="/" className="transition-colors hover:text-brand">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/#services"
                  className="inline-flex items-center gap-2 transition-colors hover:text-brand"
                >
                  <ArrowLeft size={16} /> Catalog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="truncate text-ink">
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
              <div className="relative aspect-[4/3] overflow-hidden rounded-[28px]">
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
                      className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-1 transition-all sm:h-20 sm:w-20 ${
                        activeImg === i
                          ? "ring-2 ring-brand"
                          : "ring-black/10 hover:ring-brand/40"
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
              <p className="eyebrow text-brand">Compound Analysis</p>
              <h1 className="mt-2 h-display text-[clamp(2rem,4vw,3rem)]">{product.title}</h1>
              <p className="mt-3 text-3xl font-extrabold text-brand">
                <span className="sr-only">Price: </span>
                {formatUSD(product.price)}
                <span className="ml-2 text-sm font-medium text-muted">USD</span>
              </p>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted">
                {product.long}
              </p>

              {/* Safety protocol callout */}
              <div className="mt-5 flex gap-3 rounded-2xl border border-brand/20 bg-surface p-4">
                <ShieldCheck className="mt-0.5 shrink-0 text-brand" size={18} aria-hidden="true" />
                <p className="text-sm leading-relaxed text-ink">
                  <span className="font-bold">Safety Protocol:</span>{" "}
                  <span className="text-muted">
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
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border-2 border-brand bg-white px-5 py-3 text-sm font-bold uppercase tracking-wide text-brand transition-all hover:-translate-y-0.5 hover:bg-brand hover:text-white"
                >
                  <FileText size={16} aria-hidden="true" />
                  View Janoshik Analytical Report
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              )}

              {/* Janoshik lab analysis card */}
              {product.analysis ? (
                <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_20px_60px_-40px_rgba(0,0,0,0.25)]">
                  <div className="border-b border-black/10 bg-surface px-5 py-4">
                    <h2 className="text-base font-bold text-ink">
                      Janoshik Third-Party Lab Analysis
                    </h2>
                    <p className="mt-1 text-xs text-muted">
                      Independently tested and verified by Janoshik Analytical.
                    </p>
                  </div>

                  <div
                    className={`grid gap-px bg-black/5 ${
                      product.analysis.purity ? "grid-cols-3" : "grid-cols-2"
                    }`}
                  >
                    <div className="bg-white px-5 py-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                        Batch Number
                      </p>
                      <p className="mt-1 text-sm font-bold text-ink">
                        {product.analysis.batchNumber}
                      </p>
                    </div>
                    <div className="bg-white px-5 py-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                        Fill Volume
                      </p>
                      <p className="mt-1 text-sm font-bold text-ink">
                        {product.analysis.fillVolume}
                      </p>
                    </div>
                    {product.analysis.purity && (
                      <div className="bg-white px-5 py-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                          Purity
                        </p>
                        <p className="mt-1 text-sm font-bold text-brand">
                          {product.analysis.purity}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-black/[0.03]">
                        <tr>
                          <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted">
                            Compound
                          </th>
                          <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted">
                            Concentration
                          </th>
                          <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted">
                            Verified Content
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.analysis.compounds.map((c) => (
                          <tr key={c.compound} className="border-t border-black/5">
                            <td className="px-5 py-3 font-bold text-ink">{c.compound}</td>
                            <td className="px-5 py-3 text-ink">{c.concentration}</td>
                            <td className="px-5 py-3 font-semibold text-brand">
                              {c.verifiedContent}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="border-t border-black/10 px-5 py-3 text-xs leading-relaxed text-muted">
                    Concentration is measured per ml; verified content reflects the total assayed
                    mass across the stated fill volume.
                  </p>

                  {(product.certificateImages?.length ?? 0) > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowCert((v) => !v)}
                      aria-expanded={showCert}
                      className="flex w-full items-center justify-between border-t border-black/10 bg-surface px-5 py-3 text-sm font-bold text-brand transition-colors hover:bg-brand hover:text-white"
                    >
                      <span className="inline-flex items-center gap-2">
                        <FileText size={14} aria-hidden="true" />
                        {showCert ? "Hide certificate images" : "View certificate images"}
                      </span>
                      <span aria-hidden="true">{showCert ? "−" : "+"}</span>
                    </button>
                  )}

                  {showCert && (
                    <div className="grid gap-3 border-t border-black/10 bg-white p-4 sm:grid-cols-2">
                      {product.certificateImages?.map((src, i) => (
                        <a
                          key={src}
                          href={src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative block aspect-[3/4] overflow-hidden rounded-xl ring-1 ring-black/10 transition-all hover:ring-brand"
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
                  <div className="mt-6 flex gap-3 rounded-2xl border border-dashed border-black/15 bg-surface p-4">
                    <FlaskConical className="mt-0.5 shrink-0 text-muted" size={18} aria-hidden="true" />
                    <p className="text-sm leading-relaxed text-muted">
                      <span className="font-bold text-ink">Certificate of analysis pending.</span>{" "}
                      This batch is awaiting third-party Janoshik verification — check back soon.
                    </p>
                  </div>
                )
              )}

              {/* Specs */}
              <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10">
                {product.specs.map((s) => (
                  <div key={s.label} className="bg-white p-4">
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                      {s.label}
                    </dt>
                    <dd className="mt-1 text-sm font-bold text-ink">{s.value}</dd>
                  </div>
                ))}
              </dl>

              {/* Info tabs (Package / Storage / Supply) */}
              <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white">
                <div
                  role="tablist"
                  aria-label="Product information"
                  className="flex flex-wrap gap-px bg-black/10"
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
                            ? "bg-brand text-white"
                            : "bg-white text-ink hover:bg-surface"
                        }`}
                      >
                        <t.icon size={14} aria-hidden="true" />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
                <ul className="space-y-2 p-5 text-sm leading-relaxed text-muted">
                  {tabContent[activeTab].map((line, i) => (
                    <li key={i} className={i === 0 ? "font-semibold text-ink" : ""}>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Qty + add to cart */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div
                  className="flex w-fit items-center gap-1 rounded-full border border-black/10 p-1"
                  role="group"
                  aria-label="Quantity selector"
                >
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="grid h-11 w-11 place-items-center rounded-full text-ink transition-colors hover:bg-surface"
                  >
                    <Minus size={16} />
                  </button>
                  <span
                    className="w-10 text-center text-lg font-bold"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="grid h-11 w-11 place-items-center rounded-full text-ink transition-colors hover:bg-surface"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={() => add(product.slug, qty)}
                  aria-label={`Add ${qty} × ${product.title} to cart`}
                  className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-brand px-7 py-4 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-brand-dark hover:-translate-y-0.5 sm:w-auto"
                >
                  <ShoppingBag size={18} /> Add to Cart
                </button>
              </div>

              {/* Research-only disclaimer near Add to Cart */}
              <div className="mt-5 flex gap-3 rounded-2xl border-l-4 border-brand bg-surface p-4">
                <ShieldCheck className="mt-0.5 shrink-0 text-brand" size={18} aria-hidden="true" />
                <p className="text-xs leading-relaxed text-ink">
                  <span className="font-bold uppercase tracking-wide">
                    For research purposes only.
                  </span>{" "}
                  <span className="text-muted">
                    Not intended for human or veterinary use. Not intended to diagnose, treat,
                    cure, or prevent any disease. Products are supplied strictly for laboratory
                    and analytical research conducted by qualified professionals.
                  </span>
                </p>
              </div>

              {/* Trust row */}
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-black/10 pt-6">
                {TRUST.map((t) => (
                  <li key={t.label} className="flex items-center gap-2 text-sm font-medium text-ink">
                    <t.icon size={18} className="text-brand" aria-hidden="true" /> {t.label}
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-xs leading-relaxed text-muted">
                FOR RESEARCH PURPOSES ONLY. Not intended for human or veterinary use. Not intended
                to diagnose, treat, cure, or prevent any disease. Products are supplied strictly
                for laboratory and analytical research conducted by qualified professionals.
              </p>
            </motion.div>
          </div>

          {/* Related products */}
          <section className="mt-24" aria-labelledby="related-heading">
            <div className="flex items-end justify-between">
              <h2 id="related-heading" className="h-display text-[clamp(1.6rem,3vw,2.4rem)]">
                Continue Your Research
              </h2>
              <Link
                href="/#services"
                className="hidden text-sm font-semibold text-brand transition-colors hover:text-brand-dark sm:inline"
              >
                View all
              </Link>
            </div>
            <p className="mt-2 text-sm text-muted">
              Handpicked research kits that pair well with {product.title}.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES.filter((p) => p.slug !== product.slug).map((p) => (
                <Link key={p.slug} href={`/product/${p.slug}`} className="group">
                  <article className="flex h-full flex-col overflow-hidden rounded-[24px] bg-white ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.3)]">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={p.img}
                        alt={`${p.title} — research peptide`}
                        fill
                        loading="lazy"
                        className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                        sizes="(min-width:1024px) 30vw, (min-width:640px) 50vw, 100vw"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-brand">
                        Compound
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-ink">{p.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{p.desc}</p>
                      <div className="mt-4 flex items-center justify-between pt-2">
                        <span className="text-lg font-extrabold text-brand">
                          {formatUSD(p.price)}
                        </span>
                        <span
                          className="grid h-9 w-9 place-items-center rounded-full bg-surface text-brand transition-colors group-hover:bg-brand group-hover:text-white"
                          aria-hidden="true"
                        >
                          <ArrowUpRight size={18} strokeWidth={2.4} />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
