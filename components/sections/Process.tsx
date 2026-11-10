"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import Eyebrow from "@/components/ui/Eyebrow";
import { PROCESS, IMG } from "@/lib/data";
import { EASE, inView, stagger } from "@/lib/motion";

type Step = (typeof PROCESS)[number];

const cardClass =
  "relative flex min-h-[200px] w-full flex-col rounded-[12px] bg-yellow px-6 py-8 text-left sm:px-7";

function CardBody({ p }: { p: Step }) {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute right-5 top-3 text-7xl font-bold leading-none text-pink/15"
      >
        {p.num}
      </span>
      <span className="text-[13px] font-bold uppercase tracking-[1px] text-pink">
        {p.step}
      </span>
      <h3 className="by-card-title mt-1">{p.title}</h3>
      <p className="mt-3 text-sm leading-relaxed tracking-[0.6px] text-pink">{p.desc}</p>
    </>
  );
}

function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inView}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <Eyebrow light center>
        Our process
      </Eyebrow>
      <h2 className="by-h-band mt-4 text-yellow">
        From order to lab
        <br /> step by step
      </h2>
    </motion.div>
  );
}

// Desktop card: rises from below into its slot during its slice of scroll.
function ProcessCard({ p, i, progress }: { p: Step; i: number; progress: MotionValue<number> }) {
  const start = i * 0.26;
  const end = start + 0.32;
  // Comes from off-screen bottom → settles into place (no fade, just glide).
  const y = useTransform(progress, [start, end], [460, 0]);
  return (
    <motion.div style={{ y }} className={cardClass}>
      <CardBody p={p} />
    </motion.div>
  );
}

// Mobile / tablet card: simple fade-up on scroll into view (no pinning).
function StaticCard({ p }: { p: Step }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 36 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
      }}
      className={cardClass}
    >
      <CardBody p={p} />
    </motion.div>
  );
}

/* Flat blue field with the lab photo held well back — the reference uses
   solid colour bands, never textures or glows. */
function Backdrop() {
  return (
    <div aria-hidden className="absolute inset-0 opacity-20 mix-blend-luminosity">
      <Image src={IMG.process} alt="" fill className="object-cover" sizes="100vw" />
    </div>
  );
}

// Desktop: full-height pinned panel; cards reveal one-by-one then release.
function DesktopProcess() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.5 });

  return (
    // Tall track = scroll room to reveal all three cards before release.
    <section ref={ref} className="relative h-[320vh] bg-blue">
      <div className="sticky top-0 h-screen overflow-hidden bg-blue">
        <Backdrop />
        <div className="by-page relative flex h-full flex-col items-center justify-center text-center">
          <Header />
          <div className="mt-10 grid w-full max-w-5xl gap-2 lg:grid-cols-3">
            {PROCESS.map((p, i) => (
              <ProcessCard key={p.num} p={p} i={i} progress={smoothProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Mobile / tablet: plain stacked section that can never clip.
function MobileProcess() {
  return (
    <section className="relative overflow-hidden bg-blue">
      <Backdrop />
      <div className="by-page relative flex flex-col items-center py-20 text-center sm:py-24">
        <Header />
        <motion.div
          variants={stagger(0.14)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-10 grid w-full max-w-xl gap-2 sm:grid-cols-2"
        >
          {PROCESS.map((p) => (
            <StaticCard key={p.num} p={p} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default function Process() {
  // Default to mobile for SSR so the first client render matches the server.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isDesktop ? <DesktopProcess /> : <MobileProcess />;
}
