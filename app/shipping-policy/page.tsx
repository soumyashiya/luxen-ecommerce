import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/legal/LegalLayout";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: `How ${SITE_NAME} packages, ships, and tracks research reference peptide orders.`,
  alternates: { canonical: "/shipping-policy" },
};

export default function ShippingPolicyPage() {
  return (
    <LegalLayout eyebrow="Legal" title="Shipping Policy" updated="July 31, 2026">
      <LegalSection title="Overview">
        <p>
          {SITE_NAME} ships research reference material using cold-chain packaging designed to
          keep every batch stable from our facility to your lab bench.
        </p>
      </LegalSection>

      <LegalSection title="Processing Time">
        <p>
          Orders placed and confirmed before 2:00 PM on a business day are typically dispatched
          the same day. Orders placed after the cutoff, or on weekends and holidays, are
          processed on the next business day.
        </p>
      </LegalSection>

      <LegalSection title="Shipping Methods & Delivery Estimates">
        <ul>
          <li>Standard tracked shipping: 2–5 business days</li>
          <li>Expedited tracked shipping: 1–2 business days (where available)</li>
        </ul>
        <p>
          Delivery estimates are provided in good faith and are not guaranteed — carrier delays,
          customs processing, and weather can affect transit time once a package leaves our
          facility.
        </p>
      </LegalSection>

      <LegalSection title="Cold-Chain Packaging">
        <p>
          Temperature-sensitive research material ships with insulated packaging and cold packs
          sized for the expected transit time. Store your order in a refrigerator (2–8°C)
          immediately upon arrival.
        </p>
      </LegalSection>

      <LegalSection title="International Shipping">
        <p>
          Where international shipping is available, the recipient is responsible for any customs
          duties, import taxes, or fees levied by the destination country. Research reference
          material may be restricted or require additional documentation in some jurisdictions —
          please confirm local import regulations before ordering.
        </p>
      </LegalSection>

      <LegalSection title="Tracking Your Order">
        <p>
          You&rsquo;ll receive a tracking number by email as soon as your order ships. You can also
          view order status from your account dashboard.
        </p>
      </LegalSection>

      <LegalSection title="Lost or Delayed Packages">
        <p>
          If your tracking shows no movement for more than 5 business days, or your order hasn&rsquo;t
          arrived within the estimated window, contact us and we&rsquo;ll investigate with the carrier
          and arrange a resolution.
        </p>
      </LegalSection>

      <LegalSection title="Contact Us">
        <p>
          Shipping questions can be sent to{" "}
          <a href="mailto:support@luxen.co" className="font-semibold text-brand hover:underline">
            support@luxen.co
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
