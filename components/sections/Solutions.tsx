"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import {
  ArrowUpRight,
  Atom,
  Dna,
  Droplet,
  FlaskConical,
  Microscope,
  TestTube,
  type LucideIcon,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import SplitReveal from "@/components/ui/SplitReveal";
import { SERVICES } from "@/lib/data";

const ICONS: Record<string, LucideIcon> = {
  flask: FlaskConical,
  atom: Atom,
  dna: Dna,
  microscope: Microscope,
  droplet: Droplet,
  "test-tube": TestTube,
};

export default function Solutions() {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const halfWidth = useRef(0);
  const [paused, setPaused] = useState(false);

  // Cards are rendered twice so the loop is seamless.
  const items = [...SERVICES, ...SERVICES];

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        // Total scroll width covers both copies; one copy is half of that (plus the trailing gap).
        halfWidth.current = (trackRef.current.scrollWidth + 24) / 2;
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useAnimationFrame((_, delta) => {
    if (paused || !halfWidth.current) return;
    const speed = 60; // px per second
    let next = x.get() - (speed * delta) / 1000;
    // Wrap around once the first copy has fully scrolled past.
    if (next <= -halfWidth.current) next += halfWidth.current;
    x.set(next);
  });

  return (
    <section id="services" className="overflow-hidden bg-pale py-16 sm:py-20">
      <div className="by-page">
        <Reveal className="flex flex-col items-center text-center">
          <Eyebrow center>Research catalog</Eyebrow>
          <SplitReveal as="h2" className="by-h-band mt-4">
            Engineered for research precision
          </SplitReveal>
        </Reveal>
      </div>

      {/* Auto-scrolling carousel */}
      <div
        className="mt-10 cursor-grab overflow-hidden active:cursor-grabbing"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
      >
        <motion.div
          ref={trackRef}
          style={{ x }}
          drag="x"
          dragConstraints={trackRef}
          dragElastic={0.05}
          onDragStart={() => setPaused(true)}
          onDragEnd={() => setPaused(false)}
          className="flex w-max gap-2 px-[max(30px,calc((100vw-1600px)/2))]"
        >
          {items.map((s, i) => {
            const Icon = ICONS[s.icon] ?? FlaskConical;
            return (
              <motion.article
                key={`${s.title}-${i}`}
                className="by-card group grid w-[84vw] shrink-0 grid-cols-1 gap-6 rounded-[12px] bg-yellow p-5 sm:w-[620px] sm:grid-cols-[240px_1fr] sm:p-6"
              >
                <div className="relative aspect-square overflow-hidden rounded-[12px] bg-pale">
                  <Image
                    src={s.img}
                    alt={s.title}
                    fill
                    draggable={false}
                    className="by-media-zoom object-contain p-4"
                    sizes="240px"
                  />
                </div>
                <div className="flex flex-col">
                  <Icon size={32} strokeWidth={1.6} aria-hidden className="text-pink" />
                  <h3 className="by-card-title mt-3 text-left text-[19px]">{s.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed tracking-[0.6px] text-pink">
                    {s.desc}
                  </p>
                  <Link
                    href={`/product/${s.slug}`}
                    draggable={false}
                    className="by-btn mt-auto w-fit pt-0"
                  >
                    Explore more
                    <ArrowUpRight size={16} strokeWidth={2.6} aria-hidden />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
