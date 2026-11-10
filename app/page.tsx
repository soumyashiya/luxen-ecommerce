import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/sections/Hero";
import CollectionRow from "@/components/sections/CollectionRow";
import PromoBanner from "@/components/sections/PromoBanner";
import ShopByRow from "@/components/sections/ShopByRow";
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
     8  our scientists
     9  rich text band
    10  newsletter
    11  footer              (trust bar → link columns → bottom bar)

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
          title={["Welcome to", "the lab"]}
          sub="Every batch, independently verified"
          subRules
          cta={{ label: "Shop now", href: "/shop" }}
          note="*Every lot ships with a third-party certificate of analysis covering identity, purity and content."
          image="/images/welcomlab2.png"
          imageAlt="Model holding a Glow pre-filled research pen against a field of bubbles"
          imageSide="right"
          imagePosition="70% center"
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

        <PromoBanner
          tone="periwinkle"
          badge="New"
          title={["Retatrutide", "40mg"]}
          sub="Higher-fill lots for identity & purity work"
          cta={{ label: "Shop now", href: "/product/retatrutide-40mg" }}
          image="/images/promo/reta-box.png"
          imageAlt="Retatrutide 40mg research reference carton"
          imageSide="right"
        />

        <PromoBanner
          tone="yellow"
          title={["Buy more,", "save more"]}
          sub="Volume pricing on 4+ research kits"
          cta={{ label: "Shop all", href: "/shop" }}
          image="/images/promo/carton-matching-pen.png"
          imageAlt="Research reference carton with matching pre-filled pen"
          imageSide="left"
        />

        <ShopByRow />


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
