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
            className="object-cover object-[30%_center] lg:object-center"
          />
        </div>

        {/* Lockup — in flow below the photo on small screens, overlaid on the
            clean right field from `lg` up. */}
        <div className="by-page py-10 lg:absolute lg:inset-0 lg:flex lg:max-w-none lg:items-center lg:px-0 lg:py-0">
          <div className="lg:ml-[63vw] lg:w-[33vw]">
            <span className="by-badge inline-block italic">New</span>

            <h1 className="mt-4 text-[clamp(34px,5.4vw,64px)] font-bold uppercase leading-[0.95] tracking-[0.6px] text-blue lg:text-[clamp(26px,2.6vw,46px)]">
              <span className="block">Research Grade</span>
              <span className="block">Reference Peptides</span>
            </h1>

            {/* Rule-flanked strapline */}
            <p className="mt-5 flex items-center gap-3 text-[clamp(13px,1.5vw,19px)] font-bold uppercase tracking-[1px] text-blue lg:text-[clamp(12px,1.1vw,17px)]">
              <span aria-hidden className="h-px w-8 shrink-0 bg-blue" />
              Verified to the milligram
              <span aria-hidden className="h-px w-8 shrink-0 bg-blue" />
            </p>

            <Link
              href="/shop"
              className="by-btn mt-7 min-h-[54px] px-10 text-[clamp(15px,1.5vw,20px)]"
            >
              Shop now
            </Link>

            <p className="mt-6 max-w-sm text-[11px] leading-relaxed tracking-[0.4px] text-blue lg:max-w-none">
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
