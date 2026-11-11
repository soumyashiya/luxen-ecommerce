# Home-page review section

**Date:** 2026-11-11
**Status:** Approved, ready for implementation

## Goal

Add a customer-review section to the LUXEN home page that supplies social proof
through an aggregate rating summary plus a wall of individual verified reviews.

The site already has `components/sections/Testimonials.tsx` — a hover-pausing
marquee of yellow pull-quote cards — but it runs only on `/about`. Reusing it on
the home page was rejected: the two pages would carry an identical section, and
a looping marquee is weaker proof than a rating summary with per-review detail.

## Non-goals

- No change to `Testimonials.tsx` or to `/about`.
- No carousel, no autoplay, no slider controls.
- No new design tokens, no additions to `app/globals.css`.
- No new npm dependencies.
- No review-submission form, no review API, no star-rating input.

## Design system constraints

Lifted from `app/globals.css`. The section introduces nothing new.

| Token | Value |
| --- | --- |
| `--pink` | `#e31d93` |
| `--yellow` | `#fcf298` |
| `--yellow-deep` | `#f6e86a` |
| `--pale` | `#ffeef7` |
| `--blue` | `#000f9f` |
| Card radius | `12px` (`--radius-xl2`) |
| Button radius | `7px` (`--btn-radius`) |
| Body rhythm | `1.8` line-height, `0.6px` tracking |

Utility classes used: `by-page`, `by-h-section`, `by-card-title`, `by-badge`,
`by-card`. Primitives used: `Reveal`, `Eyebrow`, `SplitReveal`, `Button`.
Motion helpers used: `fadeUp`, `stagger`, `inView` from `lib/motion.ts`.

## Placement

Between `<ShopByRow />` and `<Team />` in `app/page.tsx`.

```
Hero
Bestsellers           (pale)
Welcome to the lab    (banner)
Research Catalog      (pale)
Retatrutide 40mg      (banner)
Buy more, save more   (banner)
Shop by               (pale)
Reviews               (pale + yellow cards)   <- new
Our scientists        (pale)
Welcome band          (yellow)
Newsletter            (pale)
Footer                (pink)
```

Narrative order: products, then shop-by-concern, then customer proof, then
scientist proof, then the welcome band and newsletter.

Surface is `bg-pale`, matching `ShopByRow` and `Team` on either side. The yellow
cards supply the internal contrast, so three consecutive pale bands still read
as distinct blocks.

## Architecture

Three changes. No shared state, no new abstractions.

| File | Change |
| --- | --- |
| `lib/data.ts` | Add `REVIEW_SUMMARY` and `REVIEWS` exports after `TESTIMONIALS` |
| `components/sections/Reviews.tsx` | New client component |
| `app/page.tsx` | Import and render between `<ShopByRow />` and `<Team />` |

### Data: `lib/data.ts`

Two new exports, placed immediately after the existing `TESTIMONIALS` array so
related content stays together. `TESTIMONIALS` itself is left untouched, which
keeps `/about` working unchanged.

```ts
/* PLACEHOLDER aggregates — not derived from real orders. Replace with
   real figures before launch. */
export const REVIEW_SUMMARY = {
  score: 4.9,
  count: 248,
  /* Percent of reviews at 5, 4, 3, 2, 1 stars. Must sum to 100. */
  distribution: [82, 14, 3, 1, 0],
};

export const REVIEWS = [
  {
    quote: string,
    name: string,       // renders in by-card-title (blue)
    role: string,       // e.g. "Cell Biology Lab"
    avatar: string | null,
    rating: number,     // 1–5
    date: string,       // e.g. "Oct 2026"
    verified: boolean,
    product: string,    // e.g. "Glow GHK-Cu"
  },
  // ...6 entries
];
```

Six entries: the four existing testimonial quotes, re-attributed with the new
fields, plus two new quotes written in the same voice.

**Avatar supply — corrected 2026-11-11.** An earlier draft of this spec claimed
only four portraits existed and designed an initials-disc fallback for entries
five and six. That was wrong: `IMG` also carries `av1`–`av5`
(`her-review-profile.webp`, `hero-review-profile2.webp`, `3`, `4`; `av1` and
`av5` point at the same file), giving **seven unique faces**. All six reviews
therefore get real portraits — `test1`–`test4` for the first four, `av2` and
`av3` for the last two. `avatar` is a required `string`; there is no fallback
and no `null` case.

If real review data later includes reviewers without photos, an initials
fallback will need adding then. It is not built speculatively here, because
nothing currently exercises it.

### Component: `components/sections/Reviews.tsx`

`"use client"` — required for the framer-motion stagger and bar animation.

Structure mirrors `Team.tsx` deliberately. The two sections sit back-to-back on
the same pale surface, so a matching skeleton makes the pale run read as a
rhythm rather than an accident.

The heading is "Trusted by research teams", deliberately different from the
`/about` marquee's "What researchers say about us" — the same headline on both
pages would read as a copy-paste.

```
<section id="reviews" className="relative bg-pale py-16 sm:py-20">
  <div className="by-page relative grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">

    {/* Left — sticky summary */}
    <div className="lg:sticky lg:top-[200px] lg:self-start">
      <Reveal><Eyebrow>Reviews</Eyebrow></Reveal>
      <SplitReveal as="h2" className="by-h-section mt-4">
        Trusted by
        <br /> research teams
      </SplitReveal>
      <Reveal>  {/* score lockup: 4.9 + stars + count */}
      <Reveal>  {/* distribution bars, <ul> of 5 rows */}
      <Reveal delay={0.1}>
        <Button href="/shop" variant="primary" className="mt-7">Shop all</Button>
      </Reveal>
    </div>

    {/* Right — card grid */}
    <motion.div
      variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={inView}
      className="grid gap-1 sm:grid-cols-2 lg:gap-2">
      {REVIEWS.map(r => <ReviewCard key={...} r={r} />)}
    </motion.div>

  </div>
</section>
```

Two local helper components, not exported:

- `Stars({ rating, size })` — the `lucide-react` `Star` row. Matches
  `Testimonials.tsx` exactly: `fill="currentColor" strokeWidth={0}`,
  `text-pink`. Unfilled stars render at `text-pink/25`.
- `ReviewCard({ r })` — one `motion.article` with `variants={fadeUp}`.

### Element treatments

| Element | Treatment |
| --- | --- |
| Section | `bg-pale py-16 sm:py-20` |
| Card | `bg-yellow rounded-[12px] p-7`, flex column, pink ink |
| Score `4.9` | `text-pink text-[64px] font-bold leading-none tracking-[1.06px]` |
| Score stars | `Star size={17}`, `text-pink` |
| Review count | `text-[13px] tracking-[0.6px] text-pink` |
| Distribution track | `h-[6px] rounded-full bg-pink/15` |
| Distribution fill | `h-full rounded-full bg-pink`, width `0 → N%` on in-view |
| Verified chip | `by-badge` + `BadgeCheck` icon at `size={12}` |
| Card stars | `Star size={15}`, `text-pink` |
| Quote | `text-[15px] leading-relaxed tracking-[0.6px] text-pink` |
| Card divider | `border-t border-pink/20`, above the reviewer row |
| Avatar | `h-11 w-11 rounded-full overflow-hidden`, `sizes="44px"` |
| Reviewer name | `by-card-title` (blue, 17.5px) |
| Role / date / product | `text-[13px] tracking-[0.6px] text-pink` |

**Contrast note.** The product line was briefly set to `text-pink/70` for
hierarchy. Measured against the yellow card that is **2.81:1** — worse than
the site's own pink-on-yellow baseline of **3.76:1**, which already fails
WCAG AA for small text. It is full `text-pink`; the 13px size carries the
de-emphasis instead. The 3.76:1 baseline is a pre-existing brand-level
constraint affecting every yellow card on the site and is not addressed here.

### Responsive behaviour

| Breakpoint | Layout |
| --- | --- |
| `< 640px` | Single column throughout. Summary above cards, cards stacked. |
| `640–1023px` | Summary above cards. Cards in 2 columns. |
| `>= 1024px` | Two-column grid `0.85fr 1.15fr`. Summary sticky at `top-[200px]`. |

Gutters come from `by-page`: 50px desktop, 30px under 990px.

### Accessibility

- `<section id="reviews">`; each review is an `<article>`.
- Star rows carry `role="img"` and `aria-label="Rated 5 out of 5"`. The
  individual `Star` icons are `aria-hidden`.
- The distribution is a `<ul>`; each `<li>` is labelled
  `"5 stars, 82 percent of reviews"`. The bars themselves are `aria-hidden`
  presentation.
- Avatars use `alt=""` — decorative, since the name is adjacent text. The
  initials fallback is `aria-hidden` for the same reason.
- The `BadgeCheck` icon is `aria-hidden`; "Verified" is real text beside it.
- Colour pairings in use are already shipped elsewhere on the site: pink on
  yellow (cards), pink on pale (section), blue on yellow (`by-card-title`),
  yellow on pink (`by-badge`).

### Motion

- Section and card reveals use the site's single `fadeUp` motion — 2rem rise
  plus fade over 0.6s on `cubic-bezier(0, 0, .3, 1)`.
- Cards stagger at `0.08s` under `stagger(0.08)`.
- Distribution bars animate width from `0` to their percentage when scrolled
  into view, `once: true`.
- Reduced motion: **partially honoured, and that is a pre-existing site-wide
  gap, not a property of this section.** `globals.css` pins `.by-reveal` to
  full opacity, so `SplitReveal` headings do stop. framer-motion does **not**
  honour `prefers-reduced-motion` by default — its `MotionConfigContext`
  defaults to `reducedMotion: "never"`
  (`node_modules/framer-motion/dist/es/context/MotionConfigContext.mjs:10`),
  and nothing in this app wraps the tree in `<MotionConfig>`. So every
  framer-motion reveal on the site — `Team`, `CollectionRow`, this section's
  card stagger and bar fills — still animates under reduced motion. Verified
  in-browser on 2026-11-11: cards measured at opacity 0.978 mid-fade with
  `prefers-reduced-motion: reduce` active.

  Fixing this properly is one line in `app/layout.tsx` — wrapping children in
  `<MotionConfig reducedMotion="user">` — which corrects the whole site at
  once. It is deliberately **out of scope** for this section, because it
  changes motion behaviour on every page.

## Error handling

Static content, no network, no user input — so there is nothing to fail at
runtime. Two defensive choices instead:

- `avatar` is typed `string | null`; the card branches on it rather than
  assuming a file exists.
- `distribution` is read by index, so a malformed array renders short bars
  rather than throwing. The "must sum to 100" rule is a comment, not a runtime
  assertion — this is authored content, not user data.

## Testing

The repo has no test runner, so verification is manual:

1. `npm run build` — must compile with no TypeScript errors.
2. `npm run dev`, load `/`, confirm the section renders between "Shop by" and
   "Our scientists".
3. Check the three breakpoints: 375px, 768px, 1440px.
4. Confirm the sticky summary pins on desktop and releases at the section end.
5. Confirm `/about` still renders its testimonial marquee unchanged.
6. Keyboard-tab to the "Shop all" button and confirm the pink focus ring.
7. Toggle OS reduced-motion and confirm nothing animates.

## Open items

`REVIEW_SUMMARY.score`, `.count` and `.distribution`, together with every
`verified: true` flag and every `date`, are placeholder values. They present
fabricated figures as genuine customer feedback and must be replaced with real
data before this page goes live. They are deliberately isolated in one
commented block in `lib/data.ts` to make that swap trivial.
