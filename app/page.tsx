import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/sections/Hero";
import CollectionRow from "@/components/sections/CollectionRow";
import PromoBanner from "@/components/sections/PromoBanner";
import ShopByRow from "@/components/sections/ShopByRow";
import Testimonials from "@/components/sections/Testimonials";
import VideoReviews from "@/components/sections/VideoReviews";
import Team from "@/components/sections/Team";
import WelcomeBand from "@/components/sections/WelcomeBand";
import Newsletter from "@/components/sections/Newsletter";
import Footer from "@/components/sections/Footer";
import { getProduct, type Product } from "@/lib/data";

/* Hand-picked Bestsellers order. */
const BESTSELLERS = [
  "glow-ghk-cu",
  "tesamorelin-20mg",
  "retatrutide-40mg",
  "cjc-1295-10mg",
]
  .map(getProduct)
  .filter((p): p is Product => Boolean(p));

/* Hand-picked Research Catalog order. Listed by slug rather than sliced out
   of SERVICES so reordering the catalog can't silently change this row. */
const RESEARCH_CATALOG = [
  "tirzepatide",
  "glow-ghk-cu",
  "retatrutide-40mg",
  "cjc-1295-10mg",
]
  .map(getProduct)
  .filter((p): p is Product => Boolean(p));

/* ---------------------------------------------------------------------------
   Homepage sections, in order:

     1  image banner        (hero)
     2  featured collection (bestsellers)
     3  image banner        (welcome to the lab)
     4  featured collection (research catalog)
     5  image banner        (product launch)
     6  image banner        (offer)
     7  shop-by row
     8  testimonials        (quote marquee, shared with `/about`)
     9  video reviews       (four 9:16 buyer clips)
    10  our scientists
    11  rich text band
    12  newsletter
    13  footer              (trust bar → link columns → bottom bar)

   Four banners and two collections. Departs from the reference in two ways:
   its third collection ("Research Kits") is hidden, and the team section runs
   here as well as on `/about`.
--------------------------------------------------------------------------- */
export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="main">
        <Hero />

        <CollectionRow
          id="bestsellers"
          title="Bestsellers"
          products={BESTSELLERS}
          priority
          largeMedia
        />

        {/* Lead-banner treatment, matching the reference: the artwork fills
            the band untinted and the pink lockup sits on its left half —
            badge, stacked headline, rule-flanked strapline, solid CTA and an
            italic footnote. The model holds the right half, so `imageSide`
            puts the copy opposite her. */}
        <PromoBanner
          /* Untinted, so the tone only backs the band while the artwork
             loads — a pale field rather than a saturated one keeps that
             first paint close to the photo. */
          tone="periwinkle"
          layout="background"
          scrim={false}
          ink="pink"
          badge="New"
          face="tech"
          title={["Welcome to", "the lab"]}
          sub="Every batch, independently verified"
          subRules
          cta={{ label: "Shop now", href: "/shop" }}
          note="*Every lot ships with a third-party certificate of analysis covering identity, purity and content."
          image="/images/welcomelab3.png"
          imageAlt="Model holding a Glow pre-filled research pen against a field of bubbles"
          imageSide="right"
          /* Desktop shows the artwork whole, so this only steers the narrow
             mobile crop — onto the clean bubble field, since the centred copy
             has no scrim under it and the model's face swallows pink type. */
          imagePosition="25% center"
        />

        {/* Hover artwork scoped to this row. Glow, Retatrutide 40mg and CJC
            also run in Bestsellers, where they keep their own packshots.
            retatrutide-40mg is absent here — there's no `reta-hover` file, so
            it falls back to `product.hover`. */}
        <CollectionRow
          title="Research Catalog"
          products={RESEARCH_CATALOG}
          viewAllHref="/shop"
          largeMedia
          hoverImages={{
            tirzepatide: "/images/hover/trize-hover.png",
            "glow-ghk-cu": "/images/hover/glow-hover.png",
            "cjc-1295-10mg": "/images/hover/cjc-hover.png",
          }}
        />

        {/* Background treatment: the artwork is the band rather than a cutout
            beside the copy. The model holds the right, so the lockup takes the
            clean marble field on the left — bright enough (~#fbcee7) that pink
            display type clears contrast without a scrim. */}
        <PromoBanner
          /* Only backs the band while the artwork loads; a pale field keeps
             that first paint close to the photo. */
          tone="periwinkle"
          layout="background"
          scrim={false}
          ink="pink"
          badge="New"
          brand="LUXEN"
          title={["NAD+", "1000mg"]}
          sub="Sealed lots for identity & purity work"
          cta={{ label: "Shop now", href: "/product/nad-plus-1000mg" }}
          image="/images/new-retatrutide.png"
          imageAlt="Model holding an NAD+ pre-filled research pen against a pink marble field"
          imageSide="right"
          /* Desktop shows the artwork whole, so this only steers the narrow
             mobile crop onto the clean field — the centred copy has no scrim
             under it there and the model's face swallows pink type. */
          imagePosition="20% center"
        />

        {/* Background treatment: the artwork bakes its own field, and that
            field is `--yellow` to within 2/255 — so it meets the band's own
            `tone` seamlessly and needs no scrim. The four cartons hold the
            left, so the lockup takes the clean right half. No `ink` override:
            the yellow tone already resolves to pink type with a yellow-on-pink
            CTA, which is the right pairing here. */}
        <PromoBanner
          tone="yellow"
          layout="background"
          scrim={false}
          title={["Buy more,", "save more"]}
          hero="4+ Kits"
          sub="Unlock volume pricing"
          cta={{ label: "Shop all", href: "/shop" }}
          image="/images/buymore.png"
          imageAlt="Four research reference cartons — NAD+, Retatrutide, Tirzepatide and Glow — arranged on a lemon field"
          imageSide="left"
          /* Desktop shows the artwork whole, so this only steers the narrow
             mobile crop. It lands on the clean right half: the centred copy
             has no scrim under it there, and any nearer crop slices the
             cartons mid-pack. */
          imagePosition="100% center"
        />

        <ShopByRow />

        {/* Customer proof ahead of team proof — the same marquee `/about`
            runs, so the two pages share one set of quotes. */}
        <Testimonials />

        {/* Buyer-shot video, after the written quotes: the clips are the
            harder evidence, so they land closest to the team section. */}
        <VideoReviews />

        {/* "Our scientists" — the same section `/about` runs, placed with the
            other storytelling block. Its CTA points back to `/about` for the
            fuller team. */}
        <Team />

        <WelcomeBand />

        <Newsletter />
      </main>

      <Footer />
    </>
  );
}
