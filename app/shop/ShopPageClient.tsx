"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, Search, X } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/sections/Footer";
import ProductCard from "@/components/product/ProductCard";
import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import { SERVICES } from "@/lib/data";

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "name", label: "Name A–Z" },
] as const;

type SortId = (typeof SORTS)[number]["id"];

export default function ShopPageClient() {
  /* The header's search overlay routes here with `?q=`, so seed the filter
     from the URL on first render. Filtering stays client-side as before. */
  const params = useSearchParams();
  const [query, setQuery] = useState(() => params.get("q") ?? "");
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

      <main id="main" className="bg-pale pb-20">
        {/* Page banner */}
        <section className="by-page py-12 text-center sm:py-16">
          <Reveal className="flex flex-col items-center">
            <Eyebrow center>Research catalog</Eyebrow>
            <h1 className="by-h-product mt-4">Shop research peptides</h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed tracking-[0.6px] text-pink">
              Every batch is supplied for laboratory and in-vitro research use only —
              independently documented for identity, purity, and content.
            </p>
          </Reveal>
        </section>

        <div className="by-page">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-y border-pink/20 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={17}
                aria-hidden
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-pink"
              />
              <label htmlFor="shop-search" className="sr-only">
                Search products
              </label>
              <input
                id="shop-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search research peptides…"
                className="by-field pl-11 pr-10"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="by-icon absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center text-pink"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="relative flex items-center gap-2">
              <label
                htmlFor="sort"
                className="shrink-0 text-[13px] font-bold uppercase tracking-[1px] text-pink"
              >
                Sort by
              </label>
              <div className="relative">
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortId)}
                  className="by-field cursor-pointer appearance-none pr-10 text-[15px] font-bold uppercase tracking-[1px]"
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
                  aria-hidden
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-pink"
                />
              </div>
            </div>
          </div>

          <p className="mt-4 text-[13px] font-bold uppercase tracking-[1px] text-pink">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>

          {/* Grid — 8px gutters desktop / 4px mobile, as on the reference */}
          {products.length > 0 ? (
            <ul className="mt-5 grid grid-cols-2 gap-1 lg:grid-cols-4 lg:gap-2">
              {products.map((p, i) => (
                <li key={p.slug}>
                  <ProductCard
                    product={p}
                    priority={i < 2}
                    sizes="(min-width:990px) 24vw, 46vw"
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-12 flex flex-col items-center gap-3 rounded-[12px] bg-yellow py-16 text-center">
              <p className="by-h-section">No products match &ldquo;{query}&rdquo;</p>
              <p className="text-[15px] tracking-[0.6px] text-pink">
                Try a different compound name or clear your search.
              </p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-14 rounded-[12px] bg-yellow p-6">
            <p className="text-xs leading-relaxed tracking-[0.6px] text-pink">
              <span className="font-bold uppercase tracking-[1px]">
                For research purposes only.
              </span>{" "}
              Not intended for human or veterinary use. Not intended to diagnose, treat,
              cure, or prevent any disease. Products are supplied strictly for laboratory
              and analytical research conducted by qualified professionals.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
