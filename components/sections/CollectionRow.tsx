"use client";

import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import Reveal from "@/components/ui/Reveal";
import type { Product } from "@/lib/data";

/* ---------------------------------------------------------------------------
   Collection row — the reference's `featured_collection` section:

     header   35px uppercase heading left, pink "VIEW ALL" button right
     body     4-up grid at ≥990px with 8px gutters; below that it becomes a
              horizontal snap slider showing ~2.2 cards with 4px gutters,
              exactly as the live site behaves on mobile.
--------------------------------------------------------------------------- */
export default function CollectionRow({
  id,
  title,
  products,
  viewAllHref = "/shop",
  priority = false,
  largeMedia = false,
  hoverImages,
}: {
  id?: string;
  title: string;
  products: Product[];
  viewAllHref?: string;
  priority?: boolean;
  largeMedia?: boolean;
  /* Hover artwork for this row only, keyed by slug so reordering the row
     can't shuffle the images onto the wrong cards. Any slug left out keeps
     its own `product.hover`. */
  hoverImages?: Record<string, string>;
}) {
  if (products.length === 0) return null;

  return (
    <section id={id} className="bg-pale py-12 sm:py-16">
      <div className="by-page">
        {/* ~95px between the heading row and the grid, as on the reference. */}
        <Reveal className="mb-12 flex items-center justify-between gap-4 sm:mb-[90px]">
          <h2 className="by-h-section">{title}</h2>
          <Link href={viewAllHref} className="by-btn shrink-0">
            View all
          </Link>
        </Reveal>

        <Reveal>
          <ul
            className="no-scrollbar -mx-[7px] flex snap-x snap-mandatory gap-1 overflow-x-auto lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-2 lg:overflow-visible"
            /* Padding on the scroller keeps the first/last card off the
               viewport edge while still letting the next card peek. */
          >
            {products.map((p, i) => (
              <li
                key={p.slug}
                className="w-[46%] shrink-0 snap-start sm:w-[32%] lg:w-auto"
              >
                <ProductCard
                  product={p}
                  priority={priority && i === 0}
                  large={largeMedia}
                  hoverSrc={hoverImages?.[p.slug]}
                  sizes="(min-width:990px) 24vw, 46vw"
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
