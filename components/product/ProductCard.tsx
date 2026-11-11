"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart, formatUSD } from "@/lib/cart";
import type { Product } from "@/lib/data";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   Product card — measured off the reference:

     wrapper   padding 20px 7px, centred text, transparent background
     media     square corners, object-contain, 1.04 zoom on hover
     badge     pill (40px radius, 12px/1px tracking) pinned top-right
     title     17.5px / 500 / uppercase / 1px tracking, blue #000F9F
     price     16px / 700 / 1px tracking, pink
     button    full-width 47px pink button, inverts to yellow on hover
--------------------------------------------------------------------------- */
const GROUND_SHADOW =
  "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(0, 15, 80, 0.32), rgba(0, 15, 80, 0.12) 45%, transparent 75%)";

export default function ProductCard({
  product,
  priority = false,
  sizes = "(min-width:990px) 24vw, (min-width:750px) 48vw, 50vw",
  className,
  large = false,
  hoverSrc,
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** Crop the transparent padding baked into the card PNGs so the carton
      fills the card width instead of sitting small in the middle. */
  large?: boolean;
  /** Overrides `product.hover` for this placement only — lets one row run a
      different hover set without changing the product everywhere it appears.
      Falls back to `product.hover` when omitted. */
  hoverSrc?: string;
}) {
  const { add, openCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    add(product.slug, 1);
    openCart();
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1500);
  };

  /* Merchandising pill — Bestseller / New / Limited, as the reference flags
     its cards. Untagged products show none. */
  const badge = product.tag;

  return (
    <article
      className={cn("by-card group flex h-full flex-col px-[7px] py-5 text-center", className)}
    >
      <Link
        href={`/product/${product.slug}`}
        /* 4:3 suits these landscape cartons — a square box letterboxes them
           into a small strip and wastes most of the card. */
        className="relative block aspect-[4/3] overflow-hidden"
      >
        {/* Ground shadow only — a soft ellipse on the surface beneath the
            pen (whose base sits ~88% down the carton + pen cutouts), drawn
            before the image so the product paints over it. */}
        {large && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-[10%] top-[83%] h-[11%]"
            style={{ background: GROUND_SHADOW }}
          />
        )}
        <Image
          src={product.card ?? product.img}
          alt={product.title}
          fill
          priority={priority}
          sizes={sizes}
          className={cn(
            "by-media-zoom",
            large ? "object-contain" : "object-contain p-2",
          )}
        />
        {/* Alternate packshot (carton + pen on a coloured ground) that
            cross-fades over the cutout and its shadow on hover / focus. */}
        {large && (hoverSrc ?? product.hover) && (
          <Image
            src={(hoverSrc ?? product.hover)!}
            alt=""
            aria-hidden
            fill
            sizes={sizes}
            /* .4s on an ease-out-quad, matching the reference's own
               `.card__media img` cross-fade rather than the global `--ease`. */
            style={{
              transitionDuration: "var(--dur-media)",
              transitionTimingFunction: "var(--ease-media)",
            }}
            className="object-cover opacity-0 transition-opacity group-hover:opacity-100 group-has-[:focus-visible]:opacity-100 motion-reduce:transition-none"
          />
        )}
        {badge && (
          <span
            className={cn(
              "by-badge absolute right-2 top-2",
              badge === "New" && "by-badge-yellow",
              badge === "Limited" && "!bg-blue !text-yellow",
            )}
          >
            {badge}
          </span>
        )}
      </Link>

      <Link href={`/product/${product.slug}`} className="mt-[15px] block">
        <h3 className="by-card-title transition-opacity hover:opacity-75">
          {product.title}
        </h3>
      </Link>

      {/* `mb-5` guarantees a minimum gap when `mt-auto` has no slack left. */}
      <p className="by-price mb-5 mt-[7px]">{formatUSD(product.price)}</p>

      {/* `mt-auto` keeps every button on one baseline across the row even
          when a title wraps to two lines — as it does on the reference. */}
      <button
        type="button"
        onClick={handleAdd}
        aria-label={`Add ${product.title} to cart`}
        className="by-btn mt-auto w-full px-2"
      >
        {justAdded ? "Added" : "Add to cart"}
      </button>
    </article>
  );
}
