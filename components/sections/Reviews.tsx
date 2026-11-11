"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BadgeCheck, Star } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import SplitReveal from "@/components/ui/SplitReveal";
import { Button } from "@/components/ui/Button";
import { REVIEWS, REVIEW_SUMMARY, type Review } from "@/lib/data";
import { DUR, EASE, fadeUp, inView, stagger } from "@/lib/motion";

/* Star row. Same treatment as `Testimonials` — solid fill, no stroke — except
   unfilled stars drop to 25% rather than being omitted, so a 4-star review
   still reads as four-of-five instead of just "four stars". */
function Stars({
  rating,
  size,
  label,
}: {
  rating: number;
  size: number;
  label?: string;
}) {
  return (
    <div
      className="flex gap-1 text-pink"
      role="img"
      aria-label={label ?? `Rated ${rating} out of 5`}
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

/* Star-distribution bars. Each row animates its fill width in on first view;
   the bars themselves are presentation, so the percentage is carried by the
   row's `aria-label` instead of by the geometry. */
function Distribution() {
  return (
    <ul className="mt-6 max-w-sm space-y-2">
      {REVIEW_SUMMARY.distribution.map((pct, i) => {
        const stars = 5 - i;
        return (
          <li
            key={stars}
            className="flex items-center gap-3"
            aria-label={`${stars} stars, ${pct} percent of reviews`}
          >
            <span className="w-3 text-[13px] tabular-nums text-pink" aria-hidden>
              {stars}
            </span>
            <Star
              size={12}
              fill="currentColor"
              strokeWidth={0}
              className="shrink-0 text-pink"
              aria-hidden
            />
            <span
              className="h-[6px] flex-1 overflow-hidden rounded-full bg-pink/15"
              aria-hidden
            >
              <motion.span
                className="block h-full rounded-full bg-pink"
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={inView}
                transition={{ duration: DUR.xl, ease: EASE, delay: i * 0.06 }}
              />
            </span>
            <span
              className="w-9 text-right text-[13px] tabular-nums text-pink"
              aria-hidden
            >
              {pct}%
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function ReviewCard({ r }: { r: Review }) {
  return (
    <motion.article
      variants={fadeUp}
      className="flex flex-col rounded-[12px] bg-yellow p-7"
    >
      <div className="flex items-start justify-between gap-3">
        <Stars rating={r.rating} size={15} />
        {r.verified && (
          <span className="by-badge inline-flex shrink-0 items-center gap-1.5">
            <BadgeCheck size={12} strokeWidth={2.6} aria-hidden />
            Verified
          </span>
        )}
      </div>

      <p className="mt-4 text-[15px] leading-relaxed tracking-[0.6px] text-pink">
        &ldquo;{r.quote}&rdquo;
      </p>

      <p className="mt-4 text-[13px] tracking-[0.6px] text-pink/70">{r.product}</p>

      <div className="mt-auto flex items-center gap-3 border-t border-pink/20 pt-5">
        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
          <Image src={r.avatar} alt="" fill className="object-cover" sizes="44px" />
        </span>
        <div className="min-w-0">
          <p className="by-card-title text-[15px]">{r.name}</p>
          <p className="mt-0.5 text-[13px] leading-snug tracking-[0.6px] text-pink">
            {r.role} · {r.date}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

export default function Reviews() {
  return (
    <section id="reviews" className="relative bg-pale py-16 sm:py-20">
      <div className="by-page relative grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        {/* Left summary — pinned while the review cards scroll past, matching
            the intro column in `Team` directly below. */}
        <div className="lg:sticky lg:top-[200px] lg:self-start">
          <Reveal>
            <Eyebrow>Reviews</Eyebrow>
          </Reveal>

          {/* Deliberately not "What researchers say about us" — that is the
              `/about` marquee's heading, and repeating it verbatim on both
              pages would read as a copy-paste. */}
          <SplitReveal as="h2" className="by-h-section mt-4">
            Trusted by
            <br /> research teams
          </SplitReveal>

          <Reveal>
            <div className="mt-6 flex items-end gap-4">
              <p className="text-[64px] font-bold leading-none tracking-[1.06px] text-pink">
                {REVIEW_SUMMARY.score}
              </p>
              <div className="pb-1">
                <Stars
                  rating={Math.round(REVIEW_SUMMARY.score)}
                  size={17}
                  label={`Rated ${REVIEW_SUMMARY.score} out of 5`}
                />
                <p className="mt-1.5 text-[13px] tracking-[0.6px] text-pink">
                  {REVIEW_SUMMARY.count} verified reviews
                </p>
              </div>
            </div>
          </Reveal>

          <Distribution />

          <Reveal delay={0.1}>
            <Button href="/shop" variant="primary" className="mt-7">
              Shop all
            </Button>
          </Reveal>
        </div>

        {/* Card grid */}
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="grid gap-1 sm:grid-cols-2 lg:gap-2"
        >
          {REVIEWS.map((r) => (
            <ReviewCard key={r.quote} r={r} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
