"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { ComponentProps } from "react";

/* The reference has exactly one button shape — 47px tall, 7px radius,
   15px/700 uppercase at 1px tracking — in three colourways. Hover inverts
   fill and text over .2s; there is no magnetic pull and no scale-up. */
type Variant = "primary" | "dark" | "ghostPill" | "white" | "yellow" | "soft";

const variants: Record<Variant, string> = {
  /* Pink fill, yellow ink — the default across pale surfaces. */
  primary: "by-btn",
  /* On pink surfaces (header, footer) the fill flips to yellow. */
  yellow: "by-btn by-btn-yellow",
  white: "by-btn by-btn-yellow",
  dark: "by-btn by-btn-yellow",
  /* Outlined: pale fill, pink ink — the reference's PDP add-to-cart. */
  soft: "by-btn by-btn-soft",
  ghostPill: "by-btn by-btn-soft",
};

export function Button({
  children,
  variant = "primary",
  className,
  withArrow = false,
  ...props
}: {
  variant?: Variant;
  withArrow?: boolean;
} & ComponentProps<"a">) {
  return (
    <a className={cn(variants[variant], className)} {...props}>
      {children}
      {withArrow && (
        <ArrowUpRight
          size={16}
          strokeWidth={2.6}
          className="by-arrow"
          aria-hidden
        />
      )}
    </a>
  );
}

/* Same surface treatment for real <button> elements. */
export function ButtonEl({
  children,
  variant = "primary",
  className,
  withArrow = false,
  ...props
}: {
  variant?: Variant;
  withArrow?: boolean;
} & ComponentProps<"button">) {
  return (
    <button className={cn(variants[variant], className)} {...props}>
      {children}
      {withArrow && (
        <ArrowUpRight
          size={16}
          strokeWidth={2.6}
          className="by-arrow"
          aria-hidden
        />
      )}
    </button>
  );
}
