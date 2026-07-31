"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Atom,
  ChevronDown,
  Dna,
  Droplet,
  FlaskConical,
  Microscope,
  Search,
  ShieldCheck,
  ShoppingBag,
  TestTube,
  X,
  type LucideIcon,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/sections/Footer";
import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import { SERVICES, type Product } from "@/lib/data";
import { useCart, formatUSD } from "@/lib/cart";
import { EASE } from "@/lib/motion";

const ICONS: Record<string, LucideIcon> = {
  flask: FlaskConical,
  atom: Atom,
  dna: Dna,
  microscope: Microscope,
  droplet: Droplet,
  "test-tube": TestTube,
};

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "name", label: "Name A–Z" },
] as const;

type SortId = (typeof SORTS)[number]["id"];

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { add, openCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const Icon = ICONS[product.icon] ?? FlaskConical;

  const handleAdd = () => {
    add(product.slug, 1);
    openCart();
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <Reveal delay={Math.min(index * 0.05, 0.3)}>
      <article className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-white ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.3)]">
        <Link href={`/product/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-white">
          <Image
            src={product.img}
            alt={product.title}
            fill
            className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 90vw"
          />
          {!product.analysis && (
            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-muted shadow-sm">
              Cert. pending
            </span>
          )}
        </Link>

        <div className="flex flex-1 flex-col p-6">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface text-brand">
            <Icon size={22} strokeWidth={1.8} />
          </span>
          <Link href={`/product/${product.slug}`}>
            <h3 className="mt-3 text-lg font-bold text-ink transition-colors group-hover:text-brand">
              {product.title}
            </h3>
          </Link>
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
            {product.desc}
          </p>

          <div className="mt-5 flex items-center justify-between gap-3">
            <span className="text-xl font-extrabold text-brand">{formatUSD(product.price)}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAdd}
                aria-label={`Add ${product.title} to cart`}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark"
              >
                <ShoppingBag size={14} />
                {justAdded ? "Added" : "Add"}
              </button>
              <Link
                href={`/product/${product.slug}`}
                aria-label={`View details for ${product.title}`}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-black/10 text-ink transition-colors group-hover:border-brand/40 group-hover:text-brand"
              >
                <ArrowUpRight size={16} strokeWidth={2.4} />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function ShopPageClient() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortId>("featured");

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? SERVICES.filter(
          (p) => p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q),
        )
      : SERVICES;

    const sorted = [...filtered];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "name") sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }, [query, sort]);

  return (
    <>
      <SiteHeader />

      <main id="main" className="pb-24 pt-28">
        {/* Banner */}
        <section className="py-14 sm:py-20">
          <div className="container-luxen">
            <Reveal className="flex flex-col items-center text-center">
              <Eyebrow center>Research Catalog</Eyebrow>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="h-display mt-5 text-[clamp(2.4rem,5vw,3.8rem)]"
              >
                Shop Research Peptides
              </motion.h1>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base">
                Every batch is supplied for laboratory and in-vitro research use only —
                independently documented for identity, purity, and content.
              </p>
            </Reveal>
          </div>
        </section>

        <div className="container-luxen mt-8">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search research peptides…"
                aria-label="Search products"
                className="w-full rounded-full border border-black/10 bg-white py-3 pl-11 pr-10 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-brand/40"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-surface"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5 rounded-full border border-black/10 bg-white py-1.5 pl-4 pr-2 text-sm transition-colors focus-within:border-brand/40">
              <label htmlFor="sort" className="font-semibold text-muted">
                Sort by
              </label>
              <span className="h-4 w-px bg-black/10" aria-hidden="true" />
              <div className="relative">
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortId)}
                  className="cursor-pointer appearance-none rounded-full bg-transparent py-1.5 pl-3 pr-8 font-semibold text-ink outline-none"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  strokeWidth={2.5}
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted"
                />
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-muted">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>

          {/* Grid */}
          {products.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="mt-16 flex flex-col items-center gap-3 rounded-[28px] bg-surface py-20 text-center">
              <FlaskConical className="text-muted" size={32} />
              <p className="text-lg font-bold text-ink">No products match &ldquo;{query}&rdquo;</p>
              <p className="text-sm text-muted">Try a different compound name or clear your search.</p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-16 flex gap-3 rounded-2xl border-l-4 border-brand bg-surface p-5">
            <ShieldCheck className="mt-0.5 shrink-0 text-brand" size={18} aria-hidden="true" />
            <p className="text-xs leading-relaxed text-ink">
              <span className="font-bold uppercase tracking-wide">For research purposes only.</span>{" "}
              <span className="text-muted">
                Not intended for human or veterinary use. Not intended to diagnose, treat, cure, or
                prevent any disease. Products are supplied strictly for laboratory and analytical
                research conducted by qualified professionals.
              </span>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
