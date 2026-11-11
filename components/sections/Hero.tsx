"use client";

import Image from "next/image";
import Link from "next/link";
import { IMG } from "@/lib/data";

/* ---------------------------------------------------------------------------
   Hero — the reference's lead `responsive_image_banner`.

   The banner is a 1600×574 (~2.79:1) field: NAD+ and Glow cartons on the left, a
   clean teal wash on the right. The lockup therefore sits in the right-hand
   field and the type is blue — on this teal (#14cfc1) blue clears 6.8:1 where
   the brand pink only reaches 2.2:1. At 1440px the natural ratio lands at
   ~520px tall, matching the reference's banner height.

   The pen tip reaches ~62% of the artwork's width, so from `lg` the copy is
   offset to 63vw rather than constrained by `.by-page` — the container caps
   at 1600px while the full-bleed image keeps scaling, and a percentage of the
   capped container would drift back over the product on wide displays.

   Below `lg` the copy moves under the photo rather than over it: a narrow
   viewport crops away the clean field entirely. One `<Image>` serves both
   layouts so there's a single LCP fetch.
--------------------------------------------------------------------------- */
export default function Hero() {
  return (
    <section
      id="home"
      /* Matches the artwork's teal field so the band blends on ultrawide. */
      className="relative overflow-hidden bg-[#14cfc1]"
      aria-label="Featured research reference peptides"
    >
      <div className="relative flex flex-col lg:block">
        {/* Media — cropped toward the product on narrow viewports. */}
        <div className="relative order-1 aspect-[4/3] w-full sm:aspect-[16/9] lg:order-none lg:aspect-[1600/574]">
          <Image
            src={IMG.heroBanner}
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            /* Full-bleed artwork — 75 leaves visible mush in the gradients. */
            quality={90}
            className="object-cover object-[30%_center] lg:object-center"
          />
        </div>

        {/* Deepens the clean right field toward a jade so the pale-yellow
            lockup holds against it; fades out before the cartons. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden lg:block bg-[linear-gradient(270deg,rgba(0,120,104,0.55)_0%,rgba(0,120,104,0.45)_34%,rgba(0,120,104,0)_52%)]"
        />

        {/* Lockup — in flow below the photo on small screens, overlaid on the
            clean right field from `lg` up. Centred, stacked, pale yellow. */}
        <div className="relative by-page bg-[#0a9e8a] py-12 text-center lg:absolute lg:inset-0 lg:flex lg:max-w-none lg:items-center lg:bg-transparent lg:px-0 lg:py-0">
          <div className="mx-auto lg:ml-[62vw] lg:mr-0 lg:w-[34vw]">
            <h1 className="text-[clamp(40px,8vw,72px)] font-semibold uppercase leading-[1.04] tracking-[1px] text-yellow lg:text-[clamp(44px,4.9vw,96px)]">
              <span className="block">Research</span>
              <span className="block">Grade</span>
              <span className="block">Peptides</span>
            </h1>

            <Link
              href="/shop"
              className="mt-8 inline-flex min-h-[clamp(52px,5.2vw,96px)] items-center justify-center rounded-[10px] bg-yellow px-[1.1em] text-[clamp(18px,2.3vw,42px)] font-medium uppercase tracking-[1px] text-pink transition-colors duration-[var(--dur)] ease-[var(--ease)] hover:bg-pink hover:text-yellow"
            >
              Shop now
            </Link>

            <p className="mx-auto mt-6 max-w-md text-[11px] leading-relaxed tracking-[0.4px] text-yellow/90">
              *Every batch independently characterised by Janoshik Analytical for
              identity, purity and content. For laboratory and in-vitro research use
              only — not for human or veterinary use.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
