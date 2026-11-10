"use client";

const TEXT = "INDEPENDENTLY LAB TESTED · RESEARCH GRADE PURITY";

/* Scrolling ribbon — pink field, yellow display type, in the reference's
   flat-colour band idiom. */
export default function Marquee() {
  const items = Array.from({ length: 8 });
  return (
    <section className="overflow-hidden bg-pink py-5" aria-hidden>
      <div
        className="flex w-max animate-marquee items-center gap-10"
        style={{ ["--marquee-duration" as string]: "28s" }}
      >
        {items.map((_, i) => (
          <span
            key={i}
            className="whitespace-nowrap text-[clamp(2rem,5vw,4rem)] font-bold uppercase leading-none tracking-[0.6px] text-yellow"
          >
            {TEXT}
            <span className="mx-8 text-pale">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
