"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import SplitReveal from "@/components/ui/SplitReveal";
import { Button } from "@/components/ui/Button";
import { TEAM } from "@/lib/data";
import { fadeUp, inView, stagger } from "@/lib/motion";

export default function Team() {
  return (
    <section id="team" className="relative bg-pale py-16 sm:py-20">
      <div className="by-page relative grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        {/* Left intro — pinned while the portraits scroll past */}
        <div className="lg:sticky lg:top-[200px] lg:self-start">
          <Reveal>
            <Eyebrow>Our scientists</Eyebrow>
          </Reveal>
          <SplitReveal as="h2" className="by-h-section mt-4">
            Meet the people
            <br /> behind the science
          </SplitReveal>
          <Reveal>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed tracking-[0.6px] text-pink">
              Our chemists and quality specialists oversee synthesis, analytical testing, and
              compliance — so every reference compound that leaves the lab meets research-grade
              standards for identity and purity.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Button href="/about" variant="primary" className="mt-7">
              More of the team
            </Button>
          </Reveal>
        </div>

        {/* Portrait grid */}
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="grid grid-cols-2 gap-1 lg:gap-2"
        >
          {TEAM.map((d) => (
            <motion.article key={d.name} variants={fadeUp} className="by-card group">
              <div className="relative aspect-square overflow-hidden rounded-[12px] bg-yellow">
                <Image
                  src={d.img}
                  alt=""
                  fill
                  className="by-media-zoom object-cover"
                  sizes="(min-width:1024px) 24vw, 45vw"
                />
              </div>
              <p className="mt-3 text-[13px] tracking-[0.6px] text-pink">{d.role}</p>
              <h3 className="by-card-title mt-1">{d.name}</h3>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
