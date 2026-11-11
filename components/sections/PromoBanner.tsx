"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   Promo banner — the reference's `responsive_image_banner`: a full-bleed
   520px colour field with a product cutout on one side and a large uppercase
   headline plus a solid CTA on the other.

   The live site bakes these into flat JPGs. Rebuilding them as real markup
   keeps them crisp at every breakpoint, translatable, and editable.

   Two layouts:
     `split`       — the default. Transparent cutout in one half, copy in the
                     other, on a flat colour field.
     `background`  — artwork that carries its own scene fills the whole band
                     and the lockup sits on it, matching the reference's lead
                     banner: badge, stacked display headline, rule-flanked
                     strapline, solid CTA, italic footnote.
--------------------------------------------------------------------------- */

type Tone = "teal" | "periwinkle" | "yellow" | "pink" | "blue";

/* Each tone fixes the field colour plus the ink used for the headline and
   the CTA, so contrast stays correct without per-use overrides.

   `scrim` / `overInk` are the `background` layout's equivalents: the scrim is
   the same field at partial alpha, which lightens light tones and darkens
   dark ones — so the ink over it is re-picked rather than inherited. */
const TONES: Record<
  Tone,
  {
    field: string;
    ink: string;
    sub: string;
    btn: string;
    badge: string;
    scrim: string;
    overInk: string;
  }
> = {
  teal: {
    field: "bg-[#0e9e86]",
    ink: "text-yellow",
    sub: "text-yellow/90",
    btn: "bg-yellow text-pink hover:bg-pink hover:text-yellow",
    badge: "bg-yellow text-[#0e9e86]",
    scrim: "bg-[#0e9e86]/70",
    overInk: "text-blue",
  },
  periwinkle: {
    field: "bg-[#f7e2ef]",
    ink: "text-[#5b6fd4]",
    sub: "text-[#5b6fd4]",
    btn: "bg-[#5b6fd4] text-[#f7e2ef] hover:bg-[#f7e2ef] hover:text-[#5b6fd4] hover:ring-1 hover:ring-[#5b6fd4]",
    badge: "bg-[#5b6fd4] text-[#f7e2ef]",
    scrim: "bg-[#f7e2ef]/75",
    overInk: "text-[#5b6fd4]",
  },
  yellow: {
    field: "bg-yellow",
    ink: "text-pink",
    sub: "text-pink",
    btn: "bg-pink text-yellow hover:bg-pale hover:text-pink",
    badge: "bg-pink text-yellow",
    scrim: "bg-yellow/80",
    overInk: "text-pink",
  },
  pink: {
    field: "bg-pink",
    ink: "text-yellow",
    sub: "text-yellow/90",
    btn: "bg-yellow text-pink hover:bg-pale hover:text-pink",
    badge: "bg-yellow text-pink",
    scrim: "bg-pink/75",
    overInk: "text-yellow",
  },
  blue: {
    field: "bg-[#000f9f]",
    ink: "text-yellow",
    sub: "text-yellow/90",
    btn: "bg-yellow text-[#000f9f] hover:bg-pale hover:text-[#000f9f]",
    badge: "bg-yellow text-[#000f9f]",
    scrim: "bg-[#000f9f]/70",
    overInk: "text-yellow",
  },
};

/* An explicit ink overrides the tone's — for a `background` banner the type
   sits on the artwork, not the field, so the colour is a property of the
   photo rather than of the tone. One entry carries the whole lockup: type,
   strapline rules, badge and CTA, so they can't drift apart. */
type Ink = "pink" | "blue" | "yellow";

const INKS: Record<
  Ink,
  { text: string; rule: string; badge: string; btn: string }
> = {
  pink: {
    text: "text-pink",
    rule: "bg-pink",
    badge: "bg-pink text-pale",
    btn: "bg-pink text-pale hover:bg-pale hover:text-pink",
  },
  blue: {
    text: "text-blue",
    rule: "bg-blue",
    badge: "bg-blue text-yellow",
    btn: "bg-blue text-yellow hover:bg-yellow hover:text-blue",
  },
  yellow: {
    text: "text-yellow",
    rule: "bg-yellow",
    badge: "bg-yellow text-pink",
    btn: "bg-yellow text-pink hover:bg-pink hover:text-yellow",
  },
};

export default function PromoBanner({
  tone = "teal",
  badge,
  title,
  brand,
  face,
  hero,
  sub,
  subRules = false,
  note,
  cta,
  image,
  imageAlt,
  imageSide = "left",
  layout = "split",
  imagePosition = "center",
  scrim = true,
  ink,
  priority = false,
}: {
  tone?: Tone;
  badge?: string;
  /* Each entry renders on its own line, matching the stacked display
     lockups the reference uses in these banners. */
  title: string[];
  /* Switches to the offer lockup: `title` becomes a single kicker line and
     this renders beneath it at display size (e.g. "Save 25%"). Centred. */
  hero?: string;
  /* Switches to the product lockup: this renders as a heavy wordmark above
     `title`, which drops to a lighter weight as the product name. */
  brand?: string;
  /* "tech" sets the headline and strapline in the squared display face,
     with the larger badge and CTA that lockup calls for. */
  face?: "tech";
  sub?: string;
  /* Flanks the strapline with short rules, as the reference's lead banner
     does. Only legible over a quiet surface, so it pairs with `background`. */
  subRules?: boolean;
  /* Small italic footnote under the CTA — the reference's asterisk line. */
  note?: string;
  cta?: { label: string; href: string };
  image: string;
  imageAlt: string;
  /* Which half the artwork's subject occupies; the copy takes the other. */
  imageSide?: "left" | "right";
  layout?: "split" | "background";
  /* `background` only — CSS `object-position`, for steering a narrow mobile
     crop of wide artwork onto the part that carries the subject. */
  imagePosition?: string;
  /* `background` only. `true` tints the whole band in the tone; `"pale"`
     washes only the copy side in `--pale`, fading out before the artwork's
     subject — for scenes busy enough to swallow the type where the lockup
     sits; `false` shows the artwork untouched. */
  scrim?: boolean | "pale";
  /* Overrides the tone's ink for the whole lockup. */
  ink?: Ink;
  priority?: boolean;
}) {
  const t = TONES[tone];
  const i = ink ? INKS[ink] : null;

  const inkText = i?.text ?? (layout === "background" ? t.overInk : t.ink);
  const subText = i?.text ?? (layout === "background" ? t.overInk : t.sub);
  const badgeClass = i?.badge ?? t.badge;
  const btnClass = i?.btn ?? t.btn;
  const tech = face === "tech";
  /* Lockups whose badge and CTA scale up with the display type. */
  const large = Boolean(brand) || tech;

  /* Desktop only — once the strapline wraps, the rules strand at the line
     box's edges instead of flanking the text. */
  const rule = (
    <span
      aria-hidden
      className={cn(
        "hidden shrink-0 lg:block",
        tech ? "h-[2px] w-[1.6em]" : "h-px w-8",
        i?.rule ?? "bg-current",
      )}
    />
  );

  const copy = (
    <>
      {badge && (
        <span
          className={cn(
            large
              ? "mb-3 inline-block rounded-[4px] px-[0.45em] py-[0.18em] text-[clamp(20px,2.2vw,40px)] font-medium uppercase italic leading-none tracking-[1px]"
              : "mb-4 inline-block px-4 py-1.5 text-[15px] font-bold uppercase italic leading-none tracking-[1px]",
            badgeClass,
          )}
        >
          {badge}
        </span>
      )}

      {brand ? (
        /* Product lockup: a heavy brand wordmark over the product name set a
           weight lighter, so the two read as maker and item. */
        <h2 className={cn("uppercase", inkText)}>
          <span className="block text-[clamp(44px,5.4vw,100px)] font-bold leading-[1] tracking-[1px]">
            {brand}
          </span>
          <span className="mt-1 block text-[clamp(34px,4.1vw,76px)] font-medium leading-[1.02] tracking-[0.5px]">
            {title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </span>
        </h2>
      ) : hero ? (
        /* Offer lockup: the title runs as one kicker line, the hero line is
           the oversized focal point, the strapline closes it at kicker size. */
        <h2 className={cn("font-bold uppercase", inkText)}>
          <span className="block text-[clamp(24px,3.4vw,56px)] leading-[1.05] tracking-[0.5px]">
            {title.join(" ")}
          </span>
          <span className="mt-1 block whitespace-nowrap text-[clamp(56px,9.4vw,156px)] leading-[0.95] tracking-[-0.5px]">
            {hero}
          </span>
        </h2>
      ) : (
        <h2
          className={cn(
            tech
              ? "font-[family-name:var(--font-tech)] text-[clamp(42px,6.2vw,116px)] font-normal uppercase leading-[0.98] tracking-[1px]"
              : "text-[clamp(30px,5.6vw,62px)] font-bold uppercase leading-[1.05] tracking-[0.6px]",
            inkText,
          )}
        >
          {title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
      )}

      {sub && brand ? (
        <p
          className={cn(
            "mx-auto mt-3 max-w-[28em] text-[clamp(16px,1.6vw,30px)] font-semibold uppercase leading-[1.1] tracking-[0.5px] lg:mx-0",
            subText,
          )}
        >
          {sub}
        </p>
      ) : sub && hero ? (
        <p
          className={cn(
            "mt-2 text-[clamp(20px,3vw,50px)] font-bold uppercase leading-[1.05] tracking-[0.5px]",
            subText,
          )}
        >
          {sub}
        </p>
      ) : sub && (
        <p
          className={cn(
            tech
              ? "mt-5 font-[family-name:var(--font-tech)] text-[clamp(18px,1.75vw,34px)] font-normal uppercase leading-snug tracking-[0.5px] lg:inline-flex lg:whitespace-nowrap"
              : "mt-4 text-[clamp(15px,2vw,22px)] font-bold uppercase leading-snug tracking-[0.6px]",
            subRules &&
              "flex items-center justify-center gap-3 lg:justify-start",
            subText,
          )}
        >
          {subRules && rule}
          {sub}
          {subRules && rule}
        </p>
      )}

      {cta && (
        <Link
          href={cta.href}
          className={cn(
            large
              ? "mt-8 inline-flex min-h-[clamp(52px,5.2vw,96px)] items-center justify-center rounded-[10px] px-[1.1em] text-[clamp(18px,2.3vw,42px)] font-medium uppercase tracking-[1px]"
              : "mt-7 inline-flex min-h-[47px] items-center justify-center rounded-[7px] px-9 text-[clamp(15px,1.6vw,22px)] font-bold uppercase tracking-[1px]",
            "transition-colors duration-[var(--dur)] ease-[var(--ease)]",
            btnClass,
          )}
        >
          {cta.label}
        </Link>
      )}

      {note && (
        <p
          className={cn(
            hero
              ? "mt-5 text-[clamp(10px,0.8vw,14px)] font-semibold uppercase leading-relaxed tracking-[0.4px]"
              : "mt-6 max-w-sm text-[11px] italic leading-relaxed tracking-[0.4px]",
            hero ? "mx-auto" : "mx-auto lg:mx-0",
            subText,
          )}
        >
          {note}
        </p>
      )}
    </>
  );

  /* Background layout — the artwork is the band. Its height tracks the
     artwork's own ~2.77:1 ratio (36.05vw) so a full-width `cover` never
     crops the scene on desktop, with a floor and a ceiling so the copy
     always fits and ultrawide doesn't run away. */
  if (layout === "background") {
    return (
      <section className={cn("by-banner relative overflow-hidden", t.field)}>
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority={priority}
          sizes="100vw"
          className="by-banner-zoom object-cover"
          style={{ objectPosition: imagePosition }}
        />
        {/* Legibility wash. Below `lg` the copy is centred over a narrow crop,
            so it takes a flat veil; from `lg` it's a one-sided gradient. It
            holds near-solid across the copy half and dissolves between 44%
            and 64% — past whatever the artwork parks behind the lockup, and
            clear of its subject. Fading *through* a product leaves it half
            ghosted, which reads as a smudge rather than as depth. */}
        {scrim === "pale" ? (
          <div
            aria-hidden
            className={cn(
              "absolute inset-0 bg-pale/85 lg:bg-transparent",
              imageSide === "right"
                ? "lg:bg-[linear-gradient(90deg,#ffeef7_0%,rgba(255,238,247,0.95)_44%,rgba(255,238,247,0.6)_53%,rgba(255,238,247,0)_64%)]"
                : "lg:bg-[linear-gradient(270deg,#ffeef7_0%,rgba(255,238,247,0.95)_44%,rgba(255,238,247,0.6)_53%,rgba(255,238,247,0)_64%)]",
            )}
          />
        ) : scrim ? (
          <div aria-hidden className={cn("absolute inset-0", t.scrim)} />
        ) : null}

        <div
          className={cn(
            "by-page relative grid items-center py-14 sm:py-16",
            "lg:min-h-[clamp(420px,36.05vw,760px)] lg:grid-cols-2 lg:gap-12 lg:py-0",
          )}
        >
          <Reveal
            className={cn(
              hero ? "text-center" : "text-center lg:text-left",
              imageSide === "left" ? "lg:col-start-2" : "lg:col-start-1",
            )}
          >
            {copy}
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("by-banner relative overflow-hidden", t.field)}>
      <div
        className={cn(
          "by-page grid items-center gap-8 py-12 sm:py-14 lg:min-h-[520px] lg:grid-cols-2 lg:gap-12 lg:py-0",
        )}
      >
        {/* Media — order flips on desktop only; on mobile the copy leads. */}
        <Reveal
          className={cn(
            "relative order-2 h-[220px] sm:h-[300px] lg:h-[440px]",
            imageSide === "left" ? "lg:order-1" : "lg:order-2",
          )}
        >
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority={priority}
            sizes="(min-width:990px) 45vw, 90vw"
            className="by-banner-zoom object-contain object-center drop-shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
          />
        </Reveal>

        {/* Copy */}
        <Reveal
          className={cn(
            "order-1 text-center lg:text-left",
            imageSide === "left" ? "lg:order-2" : "lg:order-1",
          )}
        >
          {copy}
        </Reveal>
      </div>
    </section>
  );
}
