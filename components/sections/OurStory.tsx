"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowUpRight, BadgeCheck, FileSearch, Microscope, ShieldCheck } from "lucide-react";
import { IMG } from "@/lib/data";
import { SITE_NAME } from "@/lib/seo";

/* ---------------------------------------------------------------------------
   About — homepage trust section.

     55 / 45 editorial split inside the standard `.by-page` container.

     left    framed lab photograph (rounded, pink wash fading into the page),
             revealed with a clip-path wipe and drifting with a light scroll
             parallax; a floating ≥99% HPLC badge and a "third-party tested"
             pill sit on it
     right   eyebrow → two-tone headline → paragraph → three compact,
             horizontal trust cards → CTA row

   Decoration is kept quiet: a faint molecular hex pattern and two ambient
   gradients. Motion is transform/opacity/clip-path only and collapses to a
   static layout under prefers-reduced-motion.

   Claims stay within what the catalogue already states (third-party testing,
   ≥99% HPLC, lot-level certificates, refrigerated handling).
--------------------------------------------------------------------------- */

const FEATURES = [
  {
    icon: Microscope,
    title: "Research-Driven",
    body: "Reference peptides prepared to research-grade standards in sealed, fixed-volume formats built for repeatable analytical work.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Verified",
    body: "Every lot is tested by an independent laboratory for identity, purity and content before release — ≥99% by HPLC.",
  },
  {
    icon: FileSearch,
    title: "Transparency First",
    body: "Batch numbers and certificates of analysis published per lot, so every result traces back to the exact material used.",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/* Hexagonal "molecule" lattice, drawn once as an SVG pattern. */
function MolecularPattern({ className }: { className?: string }) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 240 240" fill="none">
      <defs>
        <pattern id="about-hex" width="56" height="48.5" patternUnits="userSpaceOnUse">
          <path
            d="M14 0h28l14 24.25L42 48.5H14L0 24.25Z"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx="14" cy="0" r="2.2" fill="currentColor" />
          <circle cx="56" cy="24.25" r="2.2" fill="currentColor" />
          <circle cx="14" cy="48.5" r="2.2" fill="currentColor" />
        </pattern>
        <radialGradient id="about-hex-fade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="about-hex-mask">
          <rect width="240" height="240" fill="url(#about-hex-fade)" />
        </mask>
      </defs>
      <rect width="240" height="240" fill="url(#about-hex)" mask="url(#about-hex-mask)" />
    </svg>
  );
}

export default function OurStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  /* Image drifts against the scroll; the badge drifts a touch faster so the
     two read as separate layers. */
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const badgeY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      ref={sectionRef}
      id="our-story"
      aria-labelledby="our-story-heading"
      className="relative isolate overflow-hidden bg-pale py-20 sm:py-28"
    >
      {/* Ambient light — two soft brand-tinted fields, decorative only. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/4 -z-10 h-[460px] w-[460px] rounded-full bg-pink-soft/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-[380px] w-[380px] rounded-full bg-blue/10 blur-[120px]"
      />
      <MolecularPattern className="pointer-events-none absolute -right-10 top-6 -z-10 hidden h-[340px] w-[340px] text-pink/[0.13] md:block" />

      <div className="by-page grid items-center gap-14 lg:grid-cols-[55fr_45fr] lg:gap-16 xl:gap-24">
        {/* ── Image ─────────────────────────────────────────────────── */}
        <div className="relative">
          <motion.div
            initial={reduce ? false : { clipPath: "inset(12% 12% 12% 12% round 32px)", opacity: 0 }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0% round 32px)", opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.1, ease: EASE }}
            className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-pink/10 sm:aspect-[5/5] lg:aspect-auto lg:h-[min(760px,88vh)]"
          >
            <motion.div style={reduce ? undefined : { y: imageY }} className="absolute inset-[-7%_0]">
              <Image
                src={IMG.discover}
                alt={`${SITE_NAME} research scientist in the laboratory holding a Retatrutide 40mg research reference carton`}
                fill
                sizes="(min-width:1024px) 52vw, 100vw"
                className="object-cover object-[50%_32%]"
              />
            </motion.div>

            {/* Pink wash: tints the photo's cool lab tones toward the page
                and lets the lower edge melt into the background. */}
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,238,247,0)_55%,rgba(255,238,247,0.55)_82%,rgba(255,238,247,0.9)_100%)]"
            />
            <div aria-hidden className="absolute inset-0 bg-pink/[0.06] mix-blend-multiply" />
            <div aria-hidden className="absolute inset-0 rounded-[32px] ring-1 ring-inset ring-white/40" />

            {/* Small verification indicator on the frame. */}
            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/85 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[1.5px] text-blue shadow-sm backdrop-blur sm:left-6 sm:top-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink/60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-pink" />
              </span>
              Third-party tested
            </div>
          </motion.div>

          {/* Floating research badge — breaks the frame's lower edge. */}
          <motion.div
            style={reduce ? undefined : { y: badgeY }}
            className="absolute -bottom-6 right-4 sm:-bottom-8 sm:right-8 lg:-right-6"
          >
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
              className="flex items-center gap-3.5 rounded-[20px] border border-pink/15 bg-white/90 px-4 py-3.5 shadow-[0_24px_50px_-24px_rgba(227,29,147,0.55)] backdrop-blur sm:px-5 sm:py-4"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-pink text-yellow">
                <BadgeCheck className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </span>
              <span className="leading-tight">
                <span className="block text-[22px] font-bold tracking-[0.5px] text-pink">≥99%</span>
                <span className="block text-[11px] font-semibold uppercase tracking-[1.5px] text-blue">
                  HPLC purity · every lot
                </span>
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Copy ──────────────────────────────────────────────────── */}
        <motion.div
          variants={stagger}
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="pt-4 lg:pt-0"
        >
          <motion.h2
            id="our-story-heading"
            variants={rise}
            className="text-[clamp(30px,3.6vw,50px)] font-semibold uppercase leading-[1.04] tracking-[0.5px] text-pink"
          >
            Research you can trust.{" "}
            <span className="text-blue">Science you can verify.</span>
          </motion.h2>

          <motion.p
            variants={rise}
            className="mt-6 max-w-[540px] text-[clamp(15px,1.4vw,17px)] leading-[1.75] tracking-[0.3px] text-pink/90"
          >
            {SITE_NAME}{" "}exists for laboratories that can&apos;t afford
            uncertainty. We supply research reference peptides held to clear
            scientific standards — independently tested, documented lot by lot,
            and shared openly — so every experiment begins with material you
            can stand behind.
          </motion.p>

          <ul className="mt-10 space-y-3">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <motion.li
                key={title}
                variants={rise}
                className="group relative flex items-start gap-4 rounded-[20px] border border-pink/15 bg-white p-4 transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-pink/40 hover:shadow-[0_18px_40px_-26px_rgba(227,29,147,0.6)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-5"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-pink/20 bg-pale text-pink transition-colors duration-300 group-hover:border-pink group-hover:bg-pink group-hover:text-white">
                  <Icon className="h-[22px] w-[22px]" strokeWidth={1.5} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-semibold uppercase tracking-[1.2px] text-blue">
                    {title}
                  </span>
                  <span className="mt-1.5 block text-[14px] leading-relaxed tracking-[0.2px] text-pink/85">
                    {body}
                  </span>
                </span>
              </motion.li>
            ))}
          </ul>

          <motion.div
            variants={rise}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
          >
            <Link href="/about" className="by-btn">
              Read our story
            </Link>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-1.5 text-[14px] font-semibold uppercase tracking-[1.5px] text-pink"
            >
              <span className="underline decoration-pink/30 underline-offset-[6px] transition-colors group-hover:decoration-pink">
                Explore the catalog
              </span>
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
