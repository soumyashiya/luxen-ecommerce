"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { FlaskConical, ShieldCheck, Truck } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { SITE_NAME } from "@/lib/seo";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   About page — editorial brand story, in the same shape as a beauty-brand
   "about us" page:

     1  full-bleed poster banner
     2  centred intro: oversized uppercase heading + paragraph with bold-caps
        keywords
     3  alternating statement banners
     4  yellow perks band

   The banner artwork (`/images/about-page/`) is ~3:1 and split down the
   middle: a photo on one half, a flat colour field on the other. From `lg`
   the copy sits on that field; below `lg` the photo is cropped to its own
   half and the copy drops underneath on the matching colour.

   Copy only makes claims the catalogue already makes (independent testing,
   ≥99% HPLC, lot-level certificates, refrigerated handling, research use
   only). Section ids keep the nav/footer anchors (`#about`, `#process`,
   `#stats`) resolving. "Research Team" links go to the
   homepage's `#team` section.
--------------------------------------------------------------------------- */

const DIR = "/images/about-page";

type Field = "pale" | "yellow";

const FIELD: Record<Field, string> = {
  pale: "bg-[#fbe4f3]",
  yellow: "bg-yellow",
};

type Block = {
  id: string;
  image: string;
  alt: string;
  /* Which half holds the flat field the copy sits on. */
  textSide: "left" | "right";
  field: Field;
  statement: string;
  body: string;
};

const BLOCKS: Block[] = [
  {
    id: "process",
    image: `${DIR}/we belive.png`,
    alt: "Smiling model holding a Glow pre-filled research pen against a yellow backdrop",
    textSide: "right",
    field: "pale",
    statement: "We believe research material should arrive with proof.",
    body: "Not a promise on a label — a certificate you can read. That idea sits behind every reference peptide we supply.",
  },
  {
    id: "stats",
    image: `${DIR}/everylot.png`,
    alt: "Smiling man in a blue shirt in front of colour-blocked panels",
    textSide: "left",
    field: "yellow",
    statement: "Every lot independently tested. Every certificate shared.",
    body: "Identity, purity and content are checked by a third-party laboratory before release, and batch numbers trace each result back to the material used.",
  },
  {
    id: "standards",
    image: `${DIR}/science.png`,
    alt: "Smiling model holding a Retatrutide pre-filled research pen against a lilac backdrop",
    textSide: "right",
    field: "pale",
    statement: "Science that's simple to verify.",
    body: "≥99% purity by HPLC, sealed fixed-volume formats and refrigerated handling — so your analytical work starts from a known quantity.",
  },
  {
    id: "handling",
    image: `${DIR}/Alluvi NAD+ portrait product banner.png`,
    alt: "Model holding an NAD+ 1,000 mg research reference carton against a sky-blue backdrop",
    textSide: "left",
    field: "yellow",
    statement: "Kept cold. Shipped tracked.",
    body: "Reference material is stored refrigerated and ships with tracking — free on orders over $250 — so it reaches your bench the way it left ours.",
  },
];

const PERKS = [
  { icon: ShieldCheck, label: "Every batch independently lab tested" },
  { icon: Truck, label: "Free tracked shipping on orders over $250" },
  { icon: FlaskConical, label: "For laboratory research use only" },
];

/* Split banner: artwork full-bleed, copy on its flat half from `lg`. */
function SplitBanner({
  id,
  image,
  alt,
  textSide,
  field,
  repaint = false,
  children,
}: Pick<Block, "image" | "alt" | "textSide" | "field"> & {
  id: string;
  /* Paints `field` over the artwork's flat half from `lg`, for when the
     section should differ from the colour baked into the image. The split
     sits at exactly 50% in every banner, so the edge lands on the seam. */
  repaint?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("relative overflow-hidden", FIELD[field])}>
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[2172/724]">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="100vw"
          /* Narrow crops land on the photo half, not the empty field. */
          className={cn(
            "object-cover lg:object-center",
            textSide === "right" ? "object-[22%_center]" : "object-[78%_center]",
          )}
        />
        {repaint && (
          <div
            aria-hidden
            className={cn(
              "absolute inset-y-0 hidden w-1/2 lg:block",
              textSide === "left" ? "left-0" : "right-0",
              FIELD[field],
            )}
          />
        )}
      </div>

      <div className="by-page py-12 sm:py-14 lg:absolute lg:inset-0 lg:flex lg:max-w-none lg:items-center lg:px-0 lg:py-0">
        <Reveal
          className={cn(
            "lg:w-[38vw]",
            textSide === "right" ? "lg:ml-[55vw]" : "lg:ml-[6vw]",
          )}
        >
          {children}
        </Reveal>
      </div>
    </section>
  );
}

export default function AboutStory() {
  return (
    <>
      {/* 1 — poster banner */}
      <section aria-label={`About ${SITE_NAME}`} className="relative bg-pink">
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/7] lg:aspect-[2123/741]">
          <Image
            src={`${DIR}/about-hero.png`}
            alt="Model in sunglasses holding a BPC-157 & TB-500 pre-filled research pen against a magenta backdrop"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[68%_center] lg:object-center"
          />
        </div>

        {/* Title on the open magenta field left of the model. From `lg` it
            overlays the artwork, kept above the colour blocks in its lower-left
            corner; below `lg` the crop has no free field, so it drops under
            the photo on the matching pink. */}
        <div className="by-page py-10 text-center lg:absolute lg:inset-0 lg:flex lg:max-w-none lg:items-center lg:px-0 lg:py-0 lg:text-left">
          <Reveal className="lg:ml-[6vw] lg:-mt-[6vw] lg:w-[36vw]">
            <p className="text-[clamp(13px,1.1vw,18px)] font-bold uppercase tracking-[3px] text-yellow/90">
              Research, verified
            </p>
            <h2 className="mt-3 text-[clamp(38px,4.5vw,86px)] font-bold uppercase leading-[0.98] tracking-[0.5px] text-yellow">
              <span className="block">Proof,</span>
              <span className="block">not promises</span>
            </h2>
          </Reveal>
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
        <SplitBanner key={b.id} {...b}>
          <h2 className="text-[clamp(28px,3.2vw,52px)] font-bold uppercase leading-[1.05] tracking-[0.5px] text-pink">
            {b.statement}
          </h2>
          <p className="mt-5 max-w-[520px] text-[clamp(15px,1.3vw,19px)] leading-relaxed tracking-[0.4px] text-pink/90">
            {b.body}
          </p>
        </SplitBanner>
      ))}

      {/* 4 — perks band */}
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
