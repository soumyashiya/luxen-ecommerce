"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FlaskConical, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IMG } from "@/lib/data";
import { EASE } from "@/lib/motion";

const AVATARS = [IMG.av1, IMG.av2, IMG.av4];

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[100svh] w-full overflow-hidden bg-navy">
      {/* Background image — LCP. Let next/image negotiate AVIF/WebP,
          give it `priority` + high fetchPriority, and size accurately so
          the browser picks a tight srcset rung instead of the largest. */}
      <Image
        src={IMG.heroPeople}
        alt="LUXEN researchgrade peptides for laboratory R&D"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        quality={80}
        className="object-cover object-center"
      />
      {/* Neutral fade at the bottom only — no blue shade — so the white
          headline stays readable over the photo. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

      {/* Floating lab-verified badge */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -6 }}
        animate={{ opacity: 1, y: 0, rotate: -8 }}
        transition={{ delay: 0.6, duration: 0.9, ease: EASE }}
        className="absolute left-[4%] top-[26%] hidden md:block"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-2xl backdrop-blur"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand text-white">
            <FlaskConical size={18} />
          </span>
          <div className="leading-tight">
            <div className="text-lg font-extrabold text-ink">≥99% Purity</div>
            <div className="text-xs font-medium text-muted">Independently lab tested</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom content */}
      <div className="container-luxen absolute inset-x-0 bottom-0 pb-12 sm:pb-16">
        <div className="flex flex-col gap-7 sm:gap-10 lg:flex-row lg:items-end lg:justify-between">
          {/* Heading + CTAs */}
          <div className="max-w-2xl">
            <motion.h1
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
              }}
              className="h-display text-white text-[clamp(2.75rem,8vw,5.6rem)]"
            >
              {["Research Grade", "Reference Peptides"].map((line) => (
                <span key={line} className="block overflow-hidden">
                  <motion.span
                    variants={{
                      hidden: { y: "110%" },
                      show: { y: "0%", transition: { duration: 0.9, ease: EASE } },
                    }}
                    className="block"
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7, ease: EASE }}
              className="mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-4"
            >
              <Button href="#services" variant="primary">
                BROWSE CATALOG
              </Button>
              <Button href="#about" variant="white" withArrow>
                ABOUT LUXEN
              </Button>
            </motion.div>
          </div>

          {/* Supporting block */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: EASE }}
            className="max-w-sm lg:pb-2"
          >
            <p className="text-[15px] leading-relaxed text-white/85 sm:text-[17px]">
              Premium research reference peptides for laboratory and in-vitro analytical work 
              independently tested and documented to the milligram. For research use only; not
              for human or veterinary use.
            </p>
            <div className="mt-5 flex items-center gap-4 sm:mt-6 sm:gap-6">
              <div className="shrink-0">
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <div className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
                  4.9 <span className="text-sm font-medium text-white/60 sm:text-base">/4.9</span>
                </div>
              </div>
              <div className="h-10 w-px shrink-0 bg-white/20 sm:h-12" />
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {AVATARS.map((a) => (
                    <span
                      key={a}
                      className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-navy sm:h-10 sm:w-10"
                    >
                      <Image src={a} alt="" fill className="object-cover" sizes="40px" />
                    </span>
                  ))}
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-lg font-bold text-white ring-2 ring-navy sm:h-10 sm:w-10">
                    +
                  </span>
                </div>
                <span className="max-w-[8.5rem] text-xs leading-snug text-white/75 sm:max-w-none sm:text-sm">
                  Trusted by 500+ research labs globally
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Checker ribbon */}
      <div className="checker absolute inset-x-0 bottom-0" />
    </section>
  );
}
