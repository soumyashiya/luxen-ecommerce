import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/sections/Footer";
import AboutStory from "@/components/sections/AboutStory";
import Testimonials from "@/components/sections/Testimonials";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Us",
  description: `Why ${SITE_NAME} exists: research reference peptides that arrive with proof — independently tested, documented lot by lot and shipped with a certificate of analysis.`,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    url: "/about",
    title: `About Us | ${SITE_NAME}`,
    description: `Why ${SITE_NAME} exists: research reference peptides that arrive with proof.`,
  },
};

/* Editorial brand-story page (see `AboutStory`). Testimonials stay at the
   end because the nav's "Reviews" link points at `/about#testimonials`. */
export default function AboutPage() {
  return (
    <>
      <SiteHeader />

      <main id="main">
        <AboutStory />
        <Testimonials />
      </main>

      <Footer />
    </>
  );
}
