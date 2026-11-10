"use client";

import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import SplitReveal from "@/components/ui/SplitReveal";
import { Button } from "@/components/ui/Button";
import { BRAND_LOGOS, IMG } from "@/lib/data";
import { SITE_NAME } from "@/lib/seo";

function LogoRow() {
  const items = [...BRAND_LOGOS, ...BRAND_LOGOS];
  return (
    <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div
        className="flex w-max animate-marquee gap-2"
        style={{ ["--marquee-duration" as string]: "32s" }}
      >
        {items.map((name, i) => (
          <div
            key={i}
            className="grid h-[76px] w-[176px] shrink-0 place-items-center rounded-[12px] bg-yellow text-[15px] font-bold uppercase tracking-[1px] text-pink"
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Discover() {
  return (
    <section id="about" className="relative overflow-hidden bg-pale py-16 sm:py-20">
      <div className="by-page relative">
        <Reveal>
          <p className="text-center text-[clamp(18px,2.4vw,26px)] font-bold uppercase tracking-[0.6px] text-pink">
            Trusted by 150+ research labs worldwide
          </p>
        </Reveal>
        <LogoRow />

        <div className="mt-16 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left */}
          <div>
            <Reveal>
              <Eyebrow>About {SITE_NAME}</Eyebrow>
            </Reveal>
            <SplitReveal as="h2" className="by-h-section mt-4">
              Discover {SITE_NAME}
            </SplitReveal>
            <Reveal>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed tracking-[0.6px] text-pink">
                At {SITE_NAME}, we develop and supply premium research reference peptides for
                laboratory and in-vitro analytical work. Every compound is synthesised to
                research-grade standards and independently verified for identity, purity, and
                content — so scientists can characterize their reagents with confidence. For
                research use only — not intended to diagnose, treat, cure, or prevent any
                disease. Not for human or veterinary use.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <Button href="/shop" variant="primary" className="mt-7">
                Browse catalog
              </Button>
            </Reveal>

            <div className="my-8 h-px w-full bg-pink/20" />

            <div className="grid gap-7 sm:grid-cols-2">
              {[
                {
                  t: "Independently Tested",
                  d: "Every batch is third-party lab verified for purity, content, and identity.",
                },
                {
                  t: "Research-Grade Purity",
                  d: "≥99% HPLC-verified peptides for reproducible laboratory measurements.",
                },
              ].map((f, i) => (
                <Reveal key={f.t} delay={i * 0.1}>
                  <h3 className="by-card-title">{f.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed tracking-[0.6px] text-pink">
                    {f.d}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[12px] bg-pink p-3 pl-4 text-yellow">
                <div className="flex items-center gap-3">
                  <span className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-yellow/40">
                    <Image
                      src={IMG.alex}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </span>
                  <div className="leading-tight">
                    <div className="text-[15px] font-bold uppercase tracking-[1px]">
                      Dr. Elena Voss
                    </div>
                    <div className="text-sm tracking-[0.6px] text-yellow/85">
                      Head of Peptide Synthesis
                    </div>
                  </div>
                </div>
                <a href="#appointment" className="by-btn by-btn-yellow">
                  Request a quote
                </a>
              </div>
            </Reveal>
          </div>

          {/* Right image */}
          <Reveal className="relative">
            <div className="relative aspect-[4/4.5] w-full overflow-hidden rounded-[12px] bg-yellow">
              <Image
                src={IMG.discover}
                alt={`${SITE_NAME} laboratory with analytical equipment`}
                fill
                className="object-cover"
                sizes="(min-width:1024px) 45vw, 100vw"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
