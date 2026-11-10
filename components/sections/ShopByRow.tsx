"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

/* ---------------------------------------------------------------------------
   Shop-by row — the reference's `shop_by_row`: four 12px-rounded image tiles
   with a centred yellow uppercase label sitting over the art. Four across on
   desktop, two across on mobile, 8px gutters.
--------------------------------------------------------------------------- */

const TILES = [
  {
    label: "Metabolic Research",
    href: "/product/retatrutide",
    img: "/images/promo/reta-box.png",
    field: "bg-[#0e9e86]",
  },
  {
    label: "Repair & Recovery",
    href: "/product/bpc-157-tb-500",
    img: "/images/promo/cjc-box.png",
    field: "bg-[#5b6fd4]",
  },
  {
    label: "Longevity",
    href: "/product/nad-plus-1000mg",
    img: "/images/promo/nad-carton.png",
    field: "bg-pink",
  },
  {
    label: "Cellular Research",
    href: "/product/glow-ghk-cu",
    img: "/images/promo/glow-pen.png",
    field: "bg-[#000f9f]",
  },
];

export default function ShopByRow() {
  return (
    <section className="bg-pale py-12 sm:py-16">
      <Reveal className="by-page grid grid-cols-2 gap-1 lg:grid-cols-4 lg:gap-2">
        {TILES.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className={`by-card group relative flex aspect-square flex-col overflow-hidden rounded-[12px] ${t.field}`}
          >
            {/* Art occupies the upper two-thirds; the label owns the lower
                third, so the two never collide the way a centred overlay
                would with a product cutout. */}
            <span className="relative block flex-1">
              <Image
                src={t.img}
                alt=""
                fill
                sizes="(min-width:990px) 24vw, 48vw"
                className="by-media-zoom object-contain p-5"
              />
            </span>

            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent"
            />

            <span className="relative z-10 px-3 pb-5 text-center text-[clamp(15px,2vw,24px)] font-bold uppercase leading-tight tracking-[0.6px] text-yellow">
              {t.label}
            </span>
          </Link>
        ))}
      </Reveal>
    </section>
  );
}
