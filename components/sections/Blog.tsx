"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { POSTS } from "@/lib/data";
import { blurUp, inView, revealRight, stagger } from "@/lib/motion";

export default function Blog() {
  return (
    <section id="blog" className="bg-white py-24">
      <div className="container-luxen">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <Reveal>
              <Eyebrow>RESEARCH NOTES</Eyebrow>
            </Reveal>
            <Reveal variants={blurUp}>
              <h2 className="by-h-section mt-5">
                From the lab:
                <br /> notes &amp; insights
              </h2>
            </Reveal>
          </div>
          <Reveal>
            <Button href="#blog" variant="primary">
              MORE RESEARCH NOTES
            </Button>
          </Reveal>
        </div>

        <motion.div
          variants={stagger(0.14)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-14 grid gap-7 md:grid-cols-3"
        >
          {POSTS.map((p) => (
            <motion.article key={p.title} variants={revealRight} className="group">
              <div className="relative aspect-[4/3.4] overflow-hidden rounded-[20px]">
                <Image
                  src={p.img}
                  alt={p.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width:768px) 32vw, 100vw"
                />
                <div className="absolute bottom-4 right-4 grid h-16 w-16 place-items-center rounded-2xl bg-white text-center leading-none">
                  <span className="text-2xl font-extrabold text-ink">{p.date.day}</span>
                  <span className="text-[10px] font-semibold tracking-wide text-muted">
                    {p.date.dow}
                  </span>
                </div>
              </div>
              <span className="mt-5 inline-block rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white">
                {p.category}
              </span>
              <h3 className="mt-4 max-w-sm text-xl font-bold leading-snug text-ink transition-colors group-hover:text-brand">
                {p.title}
              </h3>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
