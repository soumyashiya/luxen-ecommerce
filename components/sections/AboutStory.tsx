"use client";

import Image from "next/image";
import Link from "next/link";
import { FlaskConical, ShieldCheck, Truck } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { IMG } from "@/lib/data";
import { SITE_NAME } from "@/lib/seo";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   About page — editorial brand story, in the same shape as a beauty-brand
   "about us" page:

     1  full-bleed poster banner
     2  centred intro: oversized uppercase heading + paragraph with bold-caps
        keywords
     3  three alternating image / statement blocks, each statement on a flat
        brand-colour panel
     4  "Meet the lab" feature: photo + large blockquote
     5  yellow perks band

   Copy only makes claims the catalogue already makes (independent testing,
   ≥99% HPLC, lot-level certificates, refrigerated handling, research use
   only). Section ids keep the nav/footer anchors (`#about`, `#process`,
   `#stats`, `#team`) resolving.
--------------------------------------------------------------------------- */

type Panel = "pink" | "yellow" | "blue";

const PANEL: Record<Panel, { bg: string; ink: string; sub: string }> = {
  pink: { bg: "bg-pink", ink: "text-yellow", sub: "text-yellow/90" },
  yellow: { bg: "bg-yellow", ink: "text-pink", sub: "text-pink/90" },
  blue: { bg: "bg-blue", ink: "text-yellow", sub: "text-yellow/90" },
};

const BLOCKS: {
  id: string;
  image: string;
  alt: string;
  panel: Panel;
  imageSide: "left" | "right";
  statement: string;
  body: string;
}[] = [
  {
    id: "process",
    image: "/images/On-Time Delivery.webp",
    alt: "Row of laboratory microscopes on a research bench",
    panel: "pink",
    imageSide: "left",
    statement: "We believe research material should arrive with proof.",
    body: "Not a promise on a label — a certificate you can read. That idea sits behind every reference peptide we supply.",
  },
  {
    id: "stats",
    image: "/images/Quote-right-img.webp",
    alt: "Two scientists reviewing a research reference kit in the laboratory",
    panel: "yellow",
    imageSide: "right",
    statement: "Every lot independently tested. Every certificate shared.",
    body: "Identity, purity and content are checked by a third-party laboratory before release, and batch numbers trace each result back to the material used.",
  },
  {
    id: "standards",
    image: "/images/On-Time Delivery (2).webp",
    alt: "Illustration of a DNA double helix",
    panel: "blue",
    imageSide: "left",
    statement: "Science that's simple to verify.",
    body: "≥99% purity by HPLC, sealed fixed-volume formats and refrigerated handling — so your analytical work starts from a known quantity.",
  },
];

const PERKS = [
  { icon: ShieldCheck, label: "Every batch independently lab tested" },
  { icon: Truck, label: "Free tracked shipping on orders over $250" },
  { icon: FlaskConical, label: "For laboratory research use only" },
];

function Statement({ block }: { block: (typeof BLOCKS)[number] }) {
  const p = PANEL[block.panel];
  const imageFirst = block.imageSide === "left";

  return (
    <section id={block.id} className="grid lg:grid-cols-2">
      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[560px]",
          !imageFirst && "lg:order-2",
        )}
      >
        <Image
          src={block.image}
          alt={block.alt}
          fill
          sizes="(min-width:1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1.2s] ease-out hover:scale-[1.03] motion-reduce:transition-none"
        />
      </div>

      <div className={cn("flex items-center", p.bg)}>
        <Reveal className="w-full px-[30px] py-14 sm:px-14 lg:px-[min(7vw,110px)] lg:py-20">
          <h2
            className={cn(
              "text-[clamp(28px,3.2vw,46px)] font-bold uppercase leading-[1.05] tracking-[0.5px]",
              p.ink,
            )}
          >
            {block.statement}
          </h2>
          <p
            className={cn(
              "mt-6 max-w-[520px] text-[clamp(15px,1.4vw,18px)] leading-relaxed tracking-[0.4px]",
              p.sub,
            )}
          >
            {block.body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export default function AboutStory() {
  return (
    <>
      {/* 1 — poster banner */}
      <section aria-label={`About ${SITE_NAME}`} className="relative bg-[#bfe9f1]">
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/7] lg:aspect-[2078/757]">
          <Image
            src="/images/hero-banner.png"
            alt="Model holding a Tirzepatide research reference carton against a field of bubbles"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[75%_center]"
          />
        </div>
      </section>

      {/* 2 — intro */}
      <section id="about" className="bg-pale py-16 sm:py-24">
        <Reveal className="by-page flex flex-col items-center text-center">
          <h1 className="text-[clamp(40px,8vw,104px)] font-bold uppercase leading-[0.95] tracking-[1px] text-pink">
            About {SITE_NAME}
          </h1>
          <p className="mt-8 max-w-[860px] text-[clamp(16px,1.8vw,21px)] leading-[1.7] tracking-[0.4px] text-pink">
            {SITE_NAME}{" "}supplies research reference peptides for{" "}
            <strong className="font-bold uppercase">laboratory</strong> and{" "}
            <strong className="font-bold uppercase">in-vitro</strong> analytical
            work. Every lot is{" "}
            <strong className="font-bold uppercase">independently tested</strong>,
            documented to the milligram and shipped with its{" "}
            <strong className="font-bold uppercase">certificate of analysis</strong>{" "}
            — because good science starts with material you can{" "}
            <strong className="font-bold uppercase">verify</strong>.
          </p>
        </Reveal>
      </section>

      {/* 3 — alternating statements */}
      {BLOCKS.map((b) => (
        <Statement key={b.id} block={b} />
      ))}

      {/* 4 — meet the lab */}
      <section id="team" className="bg-pale py-16 sm:py-24">
        <div className="by-page grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[7px] bg-yellow">
            <Image
              src={IMG.discover}
              alt={`${SITE_NAME} research scientist holding a Retatrutide 40mg reference carton in the laboratory`}
              fill
              sizes="(min-width:1024px) 45vw, 100vw"
              className="object-cover object-[50%_25%]"
            />
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="by-h-section">Meet the lab</h2>
            <blockquote className="mt-8">
              <p className="text-[clamp(24px,3vw,40px)] font-medium uppercase leading-[1.2] tracking-[0.5px] text-blue">
                <span aria-hidden className="text-pink">“</span>
                We don&apos;t ask researchers to take our word for it. We hand
                them the certificate.
                <span aria-hidden className="text-pink">”</span>
              </p>
              <footer className="mt-6 text-[14px] font-bold uppercase tracking-[2px] text-pink">
                — The {SITE_NAME} lab team
              </footer>
            </blockquote>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/shop" className="by-btn">
                Shop the catalog
              </Link>
              <Link href="/track-order" className="by-btn by-btn-soft">
                Track an order
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5 — perks band */}
      <section aria-label="Why order from us" className="bg-yellow py-10 sm:py-12">
        <ul className="by-page grid gap-6 text-center sm:grid-cols-3">
          {PERKS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex flex-col items-center gap-3">
              <Icon className="h-7 w-7 text-pink" strokeWidth={1.75} aria-hidden />
              <span className="max-w-[260px] text-[14px] font-bold uppercase tracking-[1px] text-pink">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
