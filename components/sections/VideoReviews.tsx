"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BadgeCheck, Pause, Play, Star } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SplitReveal from "@/components/ui/SplitReveal";
import { VIDEO_REVIEWS, type VideoReview } from "@/lib/data";

/* ---------------------------------------------------------------------------
   Video reviews — four 9:16 buyer clips.

   Nothing autoplays: each card rests on its poster behind a play button and
   only runs when the viewer asks. That keeps four simultaneous video decodes
   off the page, means `preload="metadata"` is enough until someone presses
   play, and sidesteps the whole prefers-reduced-motion question — there is no
   motion until it is requested.

   An IntersectionObserver still pauses a playing card once it leaves the
   viewport, so scrolling away stops the decode rather than leaving it running.

   The clips carry no audio track, so play/pause is the only control there is.
--------------------------------------------------------------------------- */

function Stars({ rating }: { rating: number }) {
  return (
    <div
      className="flex gap-1 text-pink"
      role="img"
      aria-label={`Rated ${rating} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          fill="currentColor"
          strokeWidth={0}
          className={i < rating ? undefined : "text-pink/25"}
          aria-hidden
        />
      ))}
    </div>
  );
}

function Card({ r }: { r: VideoReview }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  /* Pause on exit only — this never starts playback. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) el.pause();
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggle = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  }, []);

  return (
    <article className="w-[72vw] shrink-0 snap-start sm:w-[44vw] lg:w-auto">
      {/* The clips are 9:16, which makes for a very tall card. The box is
          pinned to 4:5 and the video cropped into it instead. 32% biases the
          crop upward: faces sit high in these frames and the carton sits low,
          and a centred crop clips foreheads before it clips the box. */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-[12px] bg-yellow">
        <video
          ref={ref}
          src={r.src}
          poster={r.poster}
          aria-label={r.alt}
          muted
          loop
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          width={420}
          height={754}
          className="h-full w-full object-cover [object-position:center_32%]"
        />

        {/* One control, two sizes: a full-cover target with a centred disc
            while paused, shrinking to a corner pill once it is running so it
            stops covering the person talking. */}
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? `Pause video: ${r.alt}` : `Play video: ${r.alt}`}
          className={
            playing
              ? "by-icon absolute bottom-3 left-3 flex h-11 w-11 min-h-0 items-center justify-center rounded-full bg-pink text-yellow focus-visible:outline-yellow"
              : "group absolute inset-0 flex min-h-0 items-center justify-center bg-blue/15 focus-visible:outline-yellow"
          }
        >
          {playing ? (
            <Pause size={14} fill="currentColor" strokeWidth={0} aria-hidden />
          ) : (
            <span className="by-icon flex h-14 w-14 items-center justify-center rounded-full bg-pink text-yellow">
              {/* Nudged right so the triangle looks centred in the disc. */}
              <Play
                size={18}
                fill="currentColor"
                strokeWidth={0}
                className="translate-x-[1px]"
                aria-hidden
              />
            </span>
          )}
        </button>
      </div>

      <div className="mt-3">
        <Stars rating={r.rating} />
        <h3 className="by-card-title mt-2 text-[14px]">{r.product}</h3>
        <span className="by-badge mt-2.5 inline-flex items-center gap-1.5">
          <BadgeCheck size={12} strokeWidth={2.6} aria-hidden />
          Verified buyer
        </span>
      </div>
    </article>
  );
}

export default function VideoReviews() {
  return (
    <section id="video-reviews" className="bg-pale py-16 sm:py-20">
      <div className="by-page">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SplitReveal as="h2" className="by-h-section">
            See it in use
          </SplitReveal>
          <Reveal>
            <p className="text-[15px] uppercase tracking-[1px] text-blue">
              Clips from verified buyers
            </p>
          </Reveal>
        </div>

        {/* Snap rail on small screens; at `lg` a four-column grid that spans
            the full container, so the cards grow to fill the row instead of
            leaving empty space on the right. */}
        <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:pb-0">
          {VIDEO_REVIEWS.map((r) => (
            <Card key={r.slug} r={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
