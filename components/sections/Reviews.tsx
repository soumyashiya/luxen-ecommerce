"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SplitReveal from "@/components/ui/SplitReveal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { REVIEWS, REVIEW_SUMMARY, type Review } from "@/lib/data";
import { DUR, EASE, inView } from "@/lib/motion";

/* ---------------------------------------------------------------------------
   Reviews — one featured review on a full-height yellow slab, paired with the
   rest as a hairline-separated stack on the pale ground.

   The slab-plus-stack split does the work a uniform card grid can't: it gives
   the section a focal point and a density change, so it reads as a peak in the
   scroll without needing a dark band to get there.

   Quote copy is set in `--blue`, not `--pink`. Blue is already the site's
   secondary ink (`by-card-title`, `.eyebrow`) and it is the only one that
   clears WCAG AA here — pink on pale is 3.87:1 and pink on yellow is 3.76:1,
   where blue is 12.0:1 and 11.7:1 respectively. Pink stays on the heading and
   the stars, where it is display-scale or graphic.
--------------------------------------------------------------------------- */

function Stars({
  rating,
  size = 15,
  className,
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("flex h-fit gap-1 text-pink", className)}
      role="img"
      aria-label={`Rated ${rating} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          fill="currentColor"
          strokeWidth={0}
          className={i < rating ? undefined : "text-pink/25"}
          aria-hidden
        />
      ))}
    </div>
  );
}

function Byline({
  r,
  size,
}: {
  r: Review;
  /** 44px on the slab, 36px in the stack. */
  size: 44 | 36;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="relative shrink-0 overflow-hidden rounded-full"
        style={{ height: size, width: size }}
      >
        <Image
          src={r.avatar}
          alt=""
          fill
          className="object-cover"
          sizes={`${size}px`}
        />
      </span>
      <div className="min-w-0">
        <p className="text-[13px] font-medium uppercase leading-tight tracking-[1px] text-blue">
          {r.name}
        </p>
        <p className="mt-1.5 text-[13px] leading-snug tracking-[0.6px] text-blue/70">
          {r.role}
        </p>
        <p className="text-[13px] leading-snug tracking-[0.6px] text-blue/70">
          {r.product} · {r.date}
        </p>
      </div>
    </div>
  );
}

/* The one authored moment: stack rows arrive on a short rise as their rule
   draws in. Only `transition` branches on the motion preference —
   `useReducedMotion` is null on the server, so branching `initial` or
   `whileInView` would desync hydration and can strand a row invisible. */
function useArrival(i: number) {
  const reduce = useReducedMotion();
  return {
    rule: {
      initial: { scaleX: 0 },
      whileInView: { scaleX: 1 },
      viewport: inView,
      transition: reduce
        ? { duration: 0 }
        : { duration: DUR.xl, ease: EASE, delay: i * 0.07 },
    },
    body: {
      initial: { opacity: 0, y: 12 },
      whileInView: { opacity: 1, y: 0 },
      viewport: inView,
      transition: reduce
        ? { duration: 0 }
        : { duration: DUR.long, ease: EASE, delay: i * 0.07 + 0.08 },
    },
  };
}

function StackRow({ r, i }: { r: Review; i: number }) {
  const a = useArrival(i + 1);

  return (
    <li className="relative">
      {/* An element rather than a border-top, so it can draw in. */}
      <motion.span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-left bg-pink/20"
        {...a.rule}
      />
      <motion.div className="flex flex-col gap-4 py-7 sm:py-8" {...a.body}>
        <Stars rating={r.rating} size={14} />
        <p className="text-[16px] leading-[1.7] tracking-[0.4px] text-blue">
          &ldquo;{r.quote}&rdquo;
        </p>
        <Byline r={r} size={36} />
      </motion.div>
    </li>
  );
}

export default function Reviews() {
  const [featured, ...rest] = REVIEWS;
  const a = useArrival(0);

  return (
    <section id="reviews" className="bg-pale py-20 sm:py-28">
      <div className="by-page">
        {/* The aggregate is a factual meta line sharing the heading's
            baseline — deliberately not a stat block. */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SplitReveal
            as="h2"
            className="text-[clamp(32px,5vw,52px)] font-normal uppercase leading-[1.1] tracking-[0.6px] text-pink"
          >
            From the bench
          </SplitReveal>
          <Reveal>
            <p className="text-[15px] uppercase tracking-[1px] text-blue tabular-nums">
              {REVIEW_SUMMARY.score} / 5 · {REVIEW_SUMMARY.count} verified orders
            </p>
          </Reveal>
        </div>

        {/* `items-start` rather than the default stretch: the slab holds one
            quote and the stack holds four, so matching their heights only
            buys a tall void inside whichever column runs short. Letting each
            size to its own content is what makes the asymmetry read as
            editorial instead of as a layout bug. */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-10">
          {/* Sticky, so the slab travels beside the stack instead of leaving
              the left column dead for its lower half. `items-start` keeps the
              figure at its content height while its grid area still spans the
              full row, which is the room sticky needs to travel — the same
              arrangement `Team` uses directly below. */}
          <motion.figure
            className="rounded-[12px] bg-yellow p-9 sm:p-11 lg:sticky lg:top-[200px] lg:self-start"
            {...a.body}
          >
            <Stars rating={featured.rating} size={18} />
            <blockquote className="mt-7 text-[clamp(23px,2.7vw,34px)] leading-[1.35] tracking-[0.2px] text-blue">
              &ldquo;{featured.quote}&rdquo;
            </blockquote>
            <figcaption className="pt-10">
              <Byline r={featured} size={44} />
            </figcaption>
          </motion.figure>

          {/* The rest, as a stack */}
          <ul className="border-b border-pink/20">
            {rest.map((r, i) => (
              <StackRow key={r.quote} r={r} i={i} />
            ))}
          </ul>
        </div>

        <div className="mt-12 flex sm:justify-end">
          <Button href="/shop" variant="primary">
            Shop all
          </Button>
        </div>
      </div>
    </section>
  );
}
