import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/seo";

/* Standalone mark — a ringed slash, echoing the reference's Ø-for-O glyph. */
export function LogoMark({
  className,
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden>
      <circle cx="20" cy="20" r="14" stroke={color} strokeWidth="5.5" />
      <path
        d="M27.5 12.5 12.5 27.5"
        stroke={color}
        strokeWidth="5.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* Wordmark. The reference's logo is purely typographic: a heavy geometric
   sans, set large, uppercase and centred, in yellow on the pink header. */
export function Logo({
  className,
  textClassName,
  mark,
}: {
  className?: string;
  textClassName?: string;
  /* Accepted for API compatibility with existing call sites. */
  mark?: string;
}) {
  void mark;
  return (
    <span className={cn("inline-flex items-center", className)}>
      <span
        className={cn(
          "font-bold uppercase leading-none",
          /* Starts small enough to clear the icon cluster at 360px, then
             scales up to the reference's 44px lockup on desktop. */
          "text-[22px] tracking-[0.02em] sm:text-[clamp(26px,4.4vw,44px)]",
          textClassName,
        )}
      >
        {SITE_NAME}
      </span>
    </span>
  );
}
