import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/legal/LegalLayout";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: `${SITE_NAME}'s refund and returns policy for research reference peptides.`,
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicyPage() {
  return (
    <LegalLayout eyebrow="Legal" title="Refund Policy" updated="July 31, 2026">
      <LegalSection title="Overview">
        <p>
          We want every research lab to be confident in what they order from {SITE_NAME}. This
          policy explains when a return or refund is available for research reference material
          purchased through our website.
        </p>
      </LegalSection>

      <LegalSection title="Eligibility for Returns">
        <p>
          You may request a return within <strong>7 days</strong> of delivery, provided the
          product is:
        </p>
        <ul>
          <li>Unused and unopened, in its original sealed packaging</li>
          <li>In the same condition it was received, with all labels and seals intact</li>
          <li>Accompanied by your order number</li>
        </ul>
      </LegalSection>

      <LegalSection title="Non-Returnable Items">
        <p>
          Because our research materials require cold-chain handling, the following cannot be
          returned once shipped:
        </p>
        <ul>
          <li>Any item that has been opened, punctured, or removed from cold storage</li>
          <li>Products past the 7-day return window</li>
          <li>Custom or bulk research orders arranged directly with our team</li>
        </ul>
      </LegalSection>

      <LegalSection title="How to Request a Refund">
        <p>
          Email{" "}
          <a href="mailto:support@luxen.co" className="font-semibold text-brand hover:underline">
            support@luxen.co
          </a>{" "}
          with your order number and the reason for the return. Our team will confirm eligibility
          and provide return instructions within 2 business days.
        </p>
      </LegalSection>

      <LegalSection title="Refund Processing">
        <p>
          Once we receive and inspect the returned item, we will notify you of the outcome. Approved
          refunds are issued to the original payment method within 5–10 business days. Original
          shipping costs are non-refundable unless the return is due to our error.
        </p>
      </LegalSection>

      <LegalSection title="Damaged or Incorrect Orders">
        <p>
          If your order arrives damaged, incomplete, or incorrect, contact us within 48 hours of
          delivery with photos of the item and packaging. We will arrange a replacement or full
          refund at no additional cost to you.
        </p>
      </LegalSection>

      <LegalSection title="Contact Us">
        <p>
          For any question about a return or refund, reach us at{" "}
          <a href="mailto:support@luxen.co" className="font-semibold text-brand hover:underline">
            support@luxen.co
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
