"use client";

import { createElement, useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  children: ReactNode;
  /** Retained for API compatibility; the reference has no per-word stagger. */
  stagger?: number;
  delay?: number;
  /** visibility ratio that triggers the reveal */
  amount?: number;
};

/**
 * Heading reveal.
 *
 * The reference site animates every element with exactly one motion — its
 * `slideIn` keyframe: a 2rem rise plus a fade over .6s on
 * `cubic-bezier(0, 0, .3, 1)`. There is no word-splitting and no blur
 * anywhere on the site, so this applies that single reveal to the heading
 * as a whole.
 *
 * The node is held in state rather than a ref so the observer effect can
 * depend on it directly — no ref is read during render. Reduced motion is
 * handled in CSS (`globals.css` pins `.by-reveal` to full opacity), so
 * there's no media-query branch here.
 */
export default function SplitReveal({
  as = "h2",
  className,
  children,
  delay = 0,
  amount = 0.2,
}: Props) {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!node) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: amount },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [node, amount]);

  return createElement(
    as,
    {
      ref: setNode,
      className: cn("by-reveal", shown && "is-in", className),
      style: delay ? { animationDelay: `${delay}s` } : undefined,
    },
    children,
  );
}
