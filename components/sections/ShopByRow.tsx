"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

/* ---------------------------------------------------------------------------
   Shop-by row — the reference's `shop_by_row`: four 12px-rounded image tiles.
   Four across on desktop, two across on mobile, 8px gutters.

   The artwork carries its own yellow uppercase label, so unlike the rest of
   the site's tiles this one renders no label of its own — a second one would
   sit on top of the baked one. `label` is still the link's accessible name,
   so it has to stay word-for-word what the art says.

   `field` only backs the tile while the photo loads; each value is the
   artwork's own dominant ground, so that first paint isn't a colour flash.
--------------------------------------------------------------------------- */

const TILES = [
  {
    label: "Body Balance",
    href: "/shop?theme=body-balance",
    img: "/images/shop-by/body-balance.webp",
    field: "bg-[#c8d8d8]",
  },
  {
    label: "Energy & Movement",
    href: "/shop?theme=energy-movement",
    img: "/images/shop-by/energy-movement.webp",
    field: "bg-[#d2b8d8]",
  },
  {
    label: "Rest & Recovery",
    href: "/shop?theme=rest-recovery",
    img: "/images/shop-by/rest-recovery.webp",
    field: "bg-[#b8c8a8]",
  },
  {
    label: "Skin Radiance",
    href: "/shop?theme=skin-radiance",
    img: "/images/shop-by/skin-radiance.webp",
    field: "bg-[#ead2ea]",
  },
];

export default function ShopByRow() {
  return (
    <section className="bg-pale py-12 sm:py-16">
      {/* From `lg` the strip breaks out of the page container and runs
          edge-to-edge — 16px inset, 20px gutters, no max-width — so the tiles
          keep growing on wide screens instead of capping at `--page-max`.
          Below `lg` it stays on the page grid, so it still lines up with the
          sections above and below. */}
      <Reveal className="by-page grid grid-cols-2 gap-1 lg:max-w-none lg:grid-cols-4 lg:gap-5 lg:px-4">
        {TILES.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className={`by-card group relative block aspect-square overflow-hidden rounded-[12px] ${t.field}`}
          >
            {/* Full-bleed: these are photographs that fill the tile, not
                product cutouts floating on the field. */}
            <Image
              src={t.img}
              alt=""
              fill
              sizes="(min-width:990px) 24vw, 48vw"
              className="by-media-zoom object-cover"
            />

            {/* The art already says this; carried for the link's name. */}
            <span className="sr-only">{t.label}</span>
          </Link>
        ))}
      </Reveal>
    </section>
  );
}
