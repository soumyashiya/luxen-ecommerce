# Home-page Review Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `Reviews` section to the LUXEN home page — a sticky aggregate-rating summary beside a grid of yellow verified-review cards — between `ShopByRow` and `Team`.

**Architecture:** Three isolated changes. Content goes in `lib/data.ts` as two new exports (`REVIEW_SUMMARY`, `REVIEWS`) plus a `Review` type. Presentation goes in one new client component, `components/sections/Reviews.tsx`, whose layout skeleton deliberately mirrors `components/sections/Team.tsx` because the two sections sit back-to-back on the same pale surface. `app/page.tsx` gains an import and one JSX line. Nothing else is touched — `Testimonials.tsx` and `/about` are left alone.

**Tech Stack:** Next.js 16.2.9 (App Router), React 19.2.4, TypeScript 5, Tailwind CSS 4, framer-motion 12.40, lucide-react 1.21.

**Spec:** `docs/superpowers/specs/2026-11-11-home-reviews-section-design.md`

---

## Testing approach — read this first

This repo has **no test runner**. `package.json` defines only `dev`, `build`, `start`, and `lint`. There is no `tests/` directory, no Jest/Vitest/Playwright config.

Do **not** add a test framework — that is out of scope for this plan and was not requested.

The red-green loop is therefore replaced by a three-gate verification run after every task:

| Gate | Command | Purpose |
| --- | --- | --- |
| Types | `npx tsc --noEmit` | Catches type errors across the whole project |
| Lint | `npm run lint` | `eslint-config-next` rules |
| Build | `npm run build` | Catches server/client boundary violations |

Task 4 is a manual visual verification pass. It is not optional — it is the only gate that catches layout and contrast problems.

## Next.js 16 constraints

Per `AGENTS.md`, the bundled docs in `node_modules/next/dist/docs/` were consulted. Two findings that matter here:

1. **`priority` on `next/image` is deprecated in Next 16** in favour of `preload`
   (`node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md:293`).
   This plan uses **neither** — the review avatars sit far below the fold and
   should load lazily. Do not add `priority` or `preload` to them.
2. **`fill` + `sizes` is unchanged.** The parent element must have
   `position: relative` (image.md:1070). The avatar markup in this plan follows
   the same pattern already shipped in `components/sections/Testimonials.tsx:24-26`.

## File structure

| File | Responsibility | Action |
| --- | --- | --- |
| `lib/data.ts` | All site content. Gains the `Review` type, `REVIEW_SUMMARY`, `REVIEWS`. | Modify — insert after `TESTIMONIALS` (ends line 581) |
| `components/sections/Reviews.tsx` | The whole section: summary column, distribution bars, card grid. Four local components, one default export. | Create |
| `app/page.tsx` | Home-page section order. | Modify — import (after line 5) + one JSX line (after line 162) |

`Reviews.tsx` holds four small components in one file rather than splitting them out. `Stars`, `Avatar`, `Distribution` and `ReviewCard` are each used only by this section and are meaningless outside it — splitting them across files would add indirection without adding a boundary. This matches how the codebase already handles section-local pieces (`Testimonials.tsx` keeps its `Card` inline).

---

### Task 1: Review content and types in `lib/data.ts`

**Files:**
- Modify: `lib/data.ts` (insert after line 581, immediately following the `TESTIMONIALS` array and before `export const POSTS`)

- [ ] **Step 1: Confirm the insertion point and the avatar constants**

Run:

```bash
sed -n '36,41p;576,584p' lib/data.ts
```

Expected output — the four avatar paths and the end of `TESTIMONIALS`:

```
  test1: "/images/testimonial-1.webp",
  test2: "/images/testimonial2.webp",
  test3: "/images/testimonial3.webp",
  test4: "/images/testimonial4.webp",
...
    quote:
      "Reproducible analytical work starts with well-documented reagents. The batch traceability and certificates give us complete peace of mind.",
    name: "Biochemistry PhD Candidate",
    avatar: IMG.test4,
  },
];

export const POSTS = [
```

If the line numbers have drifted, locate the end of `TESTIMONIALS` with
`grep -n "export const POSTS" lib/data.ts` and insert immediately above it.

- [ ] **Step 2: Insert the type, summary and reviews**

Insert this block between the closing `];` of `TESTIMONIALS` and `export const POSTS = [`:

```ts
/* ---------------------------------------------------------------------------
   Home-page reviews.

   Separate from TESTIMONIALS on purpose: `/about` runs the marquee of pull
   quotes, the home page runs a rating summary plus a wall of per-review
   detail. The four quotes shared with TESTIMONIALS are intentionally
   duplicated rather than cross-referenced, so re-editing one page's copy
   can't silently change the other's.
--------------------------------------------------------------------------- */
export type Review = {
  quote: string;
  /** Reviewer descriptor — renders in `by-card-title` (blue). */
  name: string;
  /** Lab or discipline, shown with the date underneath the name. */
  role: string;
  /** `null` renders an initials circle; only four portrait files exist. */
  avatar: string | null;
  /** 1–5. Unfilled stars render at 25% opacity. */
  rating: number;
  date: string;
  verified: boolean;
  /** Product title without the "(R&D Only)" suffix. */
  product: string;
};

/* PLACEHOLDER aggregates — these are NOT derived from real orders. Replace
   every value here, plus the `verified` flags and `date` values in REVIEWS,
   with real figures before this page goes live. */
export const REVIEW_SUMMARY = {
  score: 4.9,
  count: 248,
  /** Percent of reviews at 5, 4, 3, 2 and 1 stars. Sums to 100. */
  distribution: [82, 14, 3, 1, 0],
};

export const REVIEWS: Review[] = [
  {
    quote:
      "The certificates of analysis matched our own HPLC readings to the decimal. Reordering reference material has become the easiest part of running the lab.",
    name: "Research Associate",
    role: "Cell Biology Lab",
    avatar: IMG.test1,
    rating: 5,
    date: "Oct 2026",
    verified: true,
    product: "Glow 70mg",
  },
  {
    quote:
      "Consistent purity across batches is what we care about most for our analytical work, and the documentation confirms it every single time.",
    name: "Principal Investigator",
    role: "Peptide Chemistry",
    avatar: IMG.test2,
    rating: 5,
    date: "Oct 2026",
    verified: true,
    product: "Retatrutide 40mg",
  },
  {
    quote:
      "Transparent testing and honest documentation. Procurement of research reference material used to be a headache — now it's a two-minute task.",
    name: "Lab Procurement Manager",
    role: "Contract Research Org",
    avatar: IMG.test3,
    rating: 5,
    date: "Sep 2026",
    verified: true,
    product: "Tirzepatide 40mg",
  },
  {
    quote:
      "Reproducible analytical work starts with well-documented reagents. The batch traceability and certificates give us complete peace of mind.",
    name: "Biochemistry PhD Candidate",
    role: "University Research Group",
    avatar: IMG.test4,
    rating: 4,
    date: "Sep 2026",
    verified: true,
    product: "CJC-1295 10mg",
  },
  {
    quote:
      "Cold-chain packaging arrived intact through a July heatwave, and the lot number on the vial matched the paperwork exactly.",
    name: "Laboratory Manager",
    role: "Analytical Chemistry",
    avatar: null,
    rating: 5,
    date: "Aug 2026",
    verified: true,
    product: "Tesamorelin 20mg",
  },
  {
    quote:
      "We benchmarked three suppliers on identity and content. This was the only one where every lot came back within spec on the first pass.",
    name: "Senior Research Scientist",
    role: "Assay Development",
    avatar: null,
    rating: 5,
    date: "Aug 2026",
    verified: true,
    product: "NAD+ 1000mg",
  },
];

```

- [ ] **Step 3: Verify the types compile**

Run: `npx tsc --noEmit`

Expected: no output, exit code 0. If you see
`Type 'string' is not assignable to type 'string | null'` you have annotated
the array wrongly — the annotation must be `: Review[]` on `REVIEWS`, which
widens each `avatar` to `string | null`.

- [ ] **Step 4: Verify the distribution sums to 100**

Run:

```bash
node -e "const d=[82,14,3,1,0];console.log(d.reduce((a,b)=>a+b,0))"
```

Expected: `100`

- [ ] **Step 5: Commit**

```bash
git add lib/data.ts
git commit -m "feat(data): add REVIEWS and REVIEW_SUMMARY for home-page reviews"
```

---

### Task 2: The `Reviews` section component

**Files:**
- Create: `components/sections/Reviews.tsx`

- [ ] **Step 1: Read the two components this one mirrors**

Run:

```bash
sed -n '12,40p' components/sections/Team.tsx
sed -n '10,31p' components/sections/Testimonials.tsx
```

`Team.tsx` supplies the section skeleton to copy exactly: `relative bg-pale
py-16 sm:py-20`, the `by-page relative grid gap-10
lg:grid-cols-[0.85fr_1.15fr] lg:items-start` wrapper, and the `lg:sticky
lg:top-[200px] lg:self-start` left column. `Testimonials.tsx` supplies the
card treatment: `rounded-[12px] bg-yellow p-7`, the `Star` icon props, and the
44px avatar markup.

- [ ] **Step 2: Create the file**

Write this complete file to `components/sections/Reviews.tsx`:

```tsx
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

/* Portrait, or an initials disc when a reviewer has none. Only four portrait
   files exist, so the last two reviews fall back rather than repeat a face —
   a review wall where not everyone has a photo reads as real. */
function Avatar({ src, name }: { src: string | null; name: string }) {
  if (src) {
    return (
      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
        <Image src={src} alt="" fill className="object-cover" sizes="44px" />
      </span>
    );
  }

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

  return (
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow-deep text-[13px] font-bold tracking-[1px] text-pink"
      aria-hidden
    >
      {initials}
    </span>
  );
}

/* Star-distribution bars. Each row animates its fill width in on first view;
   the bars themselves are presentation, so the percentage is carried by the
   row's `aria-label` instead. */
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
            <span
              className="w-3 text-[13px] tabular-nums text-pink"
              aria-hidden
            >
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

      <p className="mt-4 text-[13px] tracking-[0.6px] text-pink/70">
        {r.product}
      </p>

      <div className="mt-auto flex items-center gap-3 border-t border-pink/20 pt-5">
        <Avatar src={r.avatar} name={r.name} />
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
```

- [ ] **Step 3: Verify types and lint**

Run: `npx tsc --noEmit && npm run lint`

Expected: no output from `tsc`, and `npm run lint` reports no errors for
`components/sections/Reviews.tsx`.

If `tsc` reports `Type 'readonly [0, 0, 0.3, 1]' is not assignable` on the
`ease: EASE` line, cast it: `ease: EASE as unknown as number[]`. Check first
whether the error actually appears — `lib/motion.ts` already passes `EASE` into
transition objects at line 36, so it is expected to typecheck as-is.

- [ ] **Step 4: Commit**

```bash
git add components/sections/Reviews.tsx
git commit -m "feat(sections): add Reviews section with rating summary and card grid"
```

---

### Task 3: Wire the section into the home page

**Files:**
- Modify: `app/page.tsx` (import after line 5; JSX after line 162)

- [ ] **Step 1: Add the import**

In `app/page.tsx`, the import block currently reads:

```tsx
import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/sections/Hero";
import CollectionRow from "@/components/sections/CollectionRow";
import PromoBanner from "@/components/sections/PromoBanner";
import ShopByRow from "@/components/sections/ShopByRow";
import Team from "@/components/sections/Team";
```

Insert the `Reviews` import directly after the `ShopByRow` line:

```tsx
import ShopByRow from "@/components/sections/ShopByRow";
import Reviews from "@/components/sections/Reviews";
import Team from "@/components/sections/Team";
```

- [ ] **Step 2: Render the section**

The JSX currently reads (around line 162):

```tsx
        <ShopByRow />


        {/* "Our scientists" — the same section `/about` runs, placed with the
            other storytelling block. Its CTA points back to `/about` for the
            fuller team. */}
        <Team />
```

Replace that with:

```tsx
        <ShopByRow />

        {/* Customer proof ahead of team proof. Shares `bg-pale` with the rows
            either side — the yellow cards carry the contrast, so three pale
            bands still read as three blocks. */}
        <Reviews />

        {/* "Our scientists" — the same section `/about` runs, placed with the
            other storytelling block. Its CTA points back to `/about` for the
            fuller team. */}
        <Team />
```

- [ ] **Step 3: Update the section-order comment**

The file header comment at lines 33-51 lists the homepage sections in order.
It is now wrong. In that comment block, replace these lines:

```
     7  shop-by row
     8  our scientists
     9  rich text band
    10  newsletter
    11  footer              (trust bar → link columns → bottom bar)
```

with:

```
     7  shop-by row
     8  reviews             (rating summary + review cards)
     9  our scientists
    10  rich text band
    11  newsletter
    12  footer              (trust bar → link columns → bottom bar)
```

- [ ] **Step 4: Verify the build**

Run: `npx tsc --noEmit && npm run build`

Expected: `tsc` silent; `npm run build` ends with `✓ Compiled successfully` and
a route table listing `/` as a static route. A failure here naming
`createContext` or `useState` would mean the `"use client"` directive is
missing from `Reviews.tsx` — re-check line 1.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "feat(home): render Reviews between ShopByRow and Team"
```

---

### Task 4: Manual visual verification

**Files:** none modified. This task is verification only.

This is the only gate that catches layout, contrast and sticky-positioning
problems. Do not skip it and do not report the feature complete without it.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`

Expected: `✓ Ready` with a local URL, normally `http://localhost:3000`.

- [ ] **Step 2: Check desktop layout at 1440px**

Open `http://localhost:3000` and scroll to the section after "Shop by".

Confirm all of:
- Two columns, summary left and a 2x3 card grid right.
- `4.9` renders large and pink beside five pink stars and "248 verified reviews".
- Five distribution rows read `5 / 4 / 3 / 2 / 1` top to bottom with bars at
  82%, 14%, 3%, 1% and 0%. The 1-star bar is an empty track, not a missing row.
- Bars animate from zero width when the section scrolls into view.
- Cards are yellow with pink quote text and blue reviewer names.
- Each card's "Verified" pill is pink with yellow text, top-right.
- Cards 5 and 6 ("Laboratory Manager", "Senior Research Scientist") show
  initials discs reading `LM` and `SR` on `--yellow-deep`, not broken images.
- Card 4 ("Biochemistry PhD Candidate") shows four solid stars and one faded
  star, not four stars total.
- The summary column pins while the cards scroll, then releases at the section
  end without overlapping "Our scientists".

- [ ] **Step 3: Check tablet at 768px**

Resize to 768px wide.

Confirm: summary stacks above the cards; cards stay in 2 columns; the sticky
behaviour is off; no horizontal scrollbar on `<body>`.

- [ ] **Step 4: Check mobile at 375px**

Resize to 375px wide.

Confirm: everything is one column; the `4.9` lockup does not overflow its
gutter; distribution rows keep the number, star, bar and percent on one line;
no horizontal scrollbar.

- [ ] **Step 5: Check keyboard focus**

Tab to the "Shop all" button.

Expected: a 2px pink outline at 3px offset (`globals.css:135-138`), and the
button navigates to `/shop` on Enter.

- [ ] **Step 6: Check reduced motion**

Enable the OS reduced-motion setting (Windows: Settings → Accessibility →
Visual effects → Animation effects off), hard-reload the page.

Expected: no fade-up on the heading or cards, and the distribution bars render
at their final widths rather than animating.

- [ ] **Step 7: Regression-check `/about`**

Open `http://localhost:3000/about`.

Expected: the testimonial marquee renders exactly as before — yellow pull-quote
cards scrolling right to left, pausing on hover, under the centred heading
"What researchers say about us". Task 1 did not modify `TESTIMONIALS`, so any
change here is a bug.

- [ ] **Step 8: Check the console**

Open DevTools → Console and reload `/`.

Expected: no React key warnings, no `next/image` warnings about missing
`sizes`, no hydration errors.

- [ ] **Step 9: Commit nothing, report findings**

This task produces no commits. Report the result of each step. If any check
failed, fix it, re-run the three gates from the testing section, and amend the
relevant task's commit.

---

## Out of scope

Do not do any of the following as part of this plan:

- Replacing the placeholder aggregates with real data. They are flagged in the
  spec's open items and in a comment in `lib/data.ts`; swapping them is a
  separate content task that needs real order data.
- Adding a test framework.
- Modifying `components/sections/Testimonials.tsx` or `app/about/page.tsx`.
- Adding review markup/JSON-LD for search engines. Structured review data
  asserting a 4.9 aggregate would publish the placeholder figures as machine-
  readable claims; that must wait for real data.
- Migrating the existing `priority` props on `Hero`/`CollectionRow` to Next
  16's `preload`. Real deprecation, unrelated change.
