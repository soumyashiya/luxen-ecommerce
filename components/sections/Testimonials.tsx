"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import SplitReveal from "@/components/ui/SplitReveal";
import { TESTIMONIALS } from "@/lib/data";

function Card({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <article className="flex w-[84vw] shrink-0 flex-col rounded-[12px] bg-yellow p-7 sm:w-[420px]">
      <div className="flex gap-1 text-pink">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={17} fill="currentColor" strokeWidth={0} aria-hidden />
        ))}
      </div>

      <p className="mt-4 text-[15px] leading-relaxed tracking-[0.6px] text-pink">
        &ldquo;{t.quote}&rdquo;
      </p>

      <div className="mt-auto flex items-center gap-3 pt-7">
        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
          <Image src={t.avatar} alt="" fill className="object-cover" sizes="44px" />
        </span>
        <p className="by-card-title text-[15px]">{t.name}</p>
      </div>
    </article>
  );
}

export default function Testimonials() {
  const loop = [...TESTIMONIALS, ...TESTIMONIALS];
  return (
    <section id="testimonials" className="overflow-hidden bg-pale py-16 sm:py-20">
      <div className="by-page">
        <Reveal className="flex flex-col items-center text-center">
          <Eyebrow center>Testimonials</Eyebrow>
          <SplitReveal as="h2" className="by-h-band mt-4">
            What researchers say about us
          </SplitReveal>
        </Reveal>
      </div>

      <div className="group relative mt-10 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
        <div
          className="flex w-max animate-marquee gap-2 group-hover:[animation-play-state:paused]"
          style={{ ["--marquee-duration" as string]: "40s" }}
        >
          {loop.map((t, i) => (
            <Card key={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
