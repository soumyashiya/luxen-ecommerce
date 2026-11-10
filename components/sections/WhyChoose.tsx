"use client";

import { motion } from "framer-motion";
import { FlaskConical, ShieldCheck, Snowflake, Truck, type LucideIcon } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import SplitReveal from "@/components/ui/SplitReveal";
import { WHY } from "@/lib/data";
import { fadeUp, inView, stagger } from "@/lib/motion";

const ICONS: Record<string, LucideIcon> = {
  flask: FlaskConical,
  snowflake: Snowflake,
  truck: Truck,
  shield: ShieldCheck,
};

export default function WhyChoose() {
  return (
    <section className="bg-pale py-16 sm:py-20">
      <div className="by-page">
        <div className="grid items-end gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <Reveal>
              <Eyebrow>Why choose us</Eyebrow>
            </Reveal>
            <SplitReveal as="h2" className="by-h-section mt-4">
              Your trusted partner in
              <br className="hidden sm:block" /> research reference peptides
            </SplitReveal>
          </div>
          <Reveal>
            <p className="text-[15px] leading-relaxed tracking-[0.6px] text-pink lg:pb-2">
              Independently tested and documented to the milligram — built for laboratories
              that need reproducible reference material for analytical work.
            </p>
          </Reveal>
        </div>

        {/* Four yellow tiles on an 8px gutter, matching the reference's grid. */}
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-10 grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4 lg:gap-2"
        >
          {WHY.map((f) => {
            const Icon = ICONS[f.icon] ?? FlaskConical;
            return (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="group rounded-[12px] bg-yellow p-7"
              >
                <Icon
                  size={40}
                  strokeWidth={1.6}
                  aria-hidden
                  className="text-pink transition-transform duration-[var(--dur-long)] ease-[var(--ease)] group-hover:-translate-y-1"
                />
                <h3 className="by-card-title mt-7">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed tracking-[0.6px] text-pink">
                  {f.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
