import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/legal/LegalLayout";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Press Release",
  description: `${SITE_NAME} announces an expanded catalog of independently lab-tested research reference peptides.`,
  alternates: { canonical: "/press-release" },
};

export default function PressReleasePage() {
  return (
    <LegalLayout eyebrow="Press" title={`${SITE_NAME} Expands Research Peptide Catalog`}>
      <p className="text-xs font-bold uppercase tracking-wider text-pink">
        For Immediate Release — July 31, 2026
      </p>

      <LegalSection title="LUXEN Expands Its Research Reference Peptide Catalog with New Batch-Verified Compounds">
        <p>
          {SITE_NAME}, a supplier of independently tested research reference peptides for
          laboratory and in-vitro analytical work, today announced an expansion of its catalog to
          include additional batch-verified compounds, alongside a redesigned online shop built
          for faster browsing and clearer access to certificate-of-analysis data.
        </p>
        <p>
          Every {SITE_NAME} batch is manufactured and independently characterized before it reaches
          a customer&rsquo;s bench, with HPLC-verified purity and full batch traceability. The
          expanded catalog continues that standard, giving research teams a wider set of reference
          materials without compromising on documentation.
        </p>
        <p>
          &ldquo;Reproducibility starts with knowing exactly what&rsquo;s in the vial,&rdquo; said a
          spokesperson for {SITE_NAME}. &ldquo;As we grow the catalog, our priority stays the same —
          every batch ships with the documentation a research team needs to trust their results.&rdquo;
        </p>
      </LegalSection>

      <LegalSection title={`About ${SITE_NAME}`}>
        <p>
          {SITE_NAME} supplies premium, independently tested research reference peptides for
          laboratories worldwide. Products are supplied strictly for laboratory and analytical
          research — not for human or veterinary use, and not intended to diagnose, treat, cure, or
          prevent any disease.
        </p>
      </LegalSection>

      <LegalSection title="Media Contact">
        <p>
          <a href="mailto:support@luxen.co" className="font-semibold text-pink hover:underline">
            support@luxen.co
          </a>
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
