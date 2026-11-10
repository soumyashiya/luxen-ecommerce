"use client";

import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { SITE_NAME } from "@/lib/seo";

/* Yellow rich-text band — the reference's `rich_text` section: a full-bleed
   yellow field with a centred 40px pink heading, a short centred paragraph
   capped around 780px, and a single solid pink CTA. */
export default function WelcomeBand() {
  /* `#about` belongs to the Discover section, so this band is unanchored. */
  return (
    <section className="bg-yellow py-16 sm:py-20">
      <Reveal className="by-page flex flex-col items-center text-center">
        <h2 className="by-h-band">Welcome to {SITE_NAME}</h2>

        <p className="mt-6 max-w-[780px] text-[clamp(15px,1.8vw,19px)] leading-relaxed tracking-[0.6px] text-pink">
          Meet {SITE_NAME}. Research reference peptides, characterised by
          accredited third-party laboratories and documented to the milligram.
          Every lot ships with a certificate of analysis covering identity,
          purity and content — so your analytical work stays reproducible.
        </p>

        <Link href="/about" className="by-btn mt-8">
          About {SITE_NAME}
        </Link>
      </Reveal>
    </section>
  );
}
