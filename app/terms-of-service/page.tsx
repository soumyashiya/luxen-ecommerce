import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/legal/LegalLayout";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms and conditions governing use of the ${SITE_NAME} website and purchase of research reference material.`,
  alternates: { canonical: "/terms-of-service" },
};

export default function TermsOfServicePage() {
  return (
    <LegalLayout eyebrow="Legal" title="Terms of Service" updated="July 31, 2026">
      <LegalSection title="Acceptance of Terms">
        <p>
          By accessing or using the {SITE_NAME} website, you agree to be bound by these Terms of
          Service. If you do not agree, please do not use our site or place an order.
        </p>
      </LegalSection>

      <LegalSection title="Eligibility">
        <p>
          By using this site you confirm that you are at least 18 years old, legally able to enter
          into binding contracts, and purchasing solely on behalf of a laboratory, institution, or
          research organization for legitimate research purposes.
        </p>
      </LegalSection>

      <LegalSection title="Research Use Only">
        <p>
          Every product sold on {SITE_NAME} is a research reference material supplied strictly for
          laboratory, analytical, and in-vitro research use. Our products are{" "}
          <strong>not intended for human or veterinary use</strong>, and are not intended to
          diagnose, treat, cure, or prevent any disease. You are solely responsible for ensuring
          your use of any product complies with applicable laws and regulations in your
          jurisdiction.
        </p>
      </LegalSection>

      <LegalSection title="Account Registration">
        <p>
          Some features require an account. You are responsible for maintaining the
          confidentiality of your login credentials and for all activity under your account.
          Notify us immediately of any unauthorized use.
        </p>
      </LegalSection>

      <LegalSection title="Orders & Payment">
        <p>
          All orders are subject to acceptance and availability. Prices are listed in USD and may
          change without notice. We reserve the right to refuse or cancel any order at our
          discretion, including in cases of suspected fraud or misuse.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable Use">
        <p>You agree not to:</p>
        <ul>
          <li>Misrepresent yourself or the intended use of any product</li>
          <li>Resell products for human or veterinary consumption</li>
          <li>Interfere with or disrupt the security or performance of our website</li>
          <li>Use automated means to scrape or access the site without permission</li>
        </ul>
      </LegalSection>

      <LegalSection title="Intellectual Property">
        <p>
          All content on this site — including text, graphics, logos, and product photography —
          is the property of {SITE_NAME} or its licensors and may not be reproduced without prior
          written consent.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of Liability">
        <p>
          To the fullest extent permitted by law, {SITE_NAME} shall not be liable for any indirect,
          incidental, or consequential damages arising from the use or misuse of our products or
          website. Our total liability for any claim is limited to the amount paid for the product
          giving rise to the claim.
        </p>
      </LegalSection>

      <LegalSection title="Governing Law">
        <p>
          These Terms are governed by the laws of the jurisdiction in which {SITE_NAME} is
          registered, without regard to conflict-of-law principles.
        </p>
      </LegalSection>

      <LegalSection title="Changes to These Terms">
        <p>
          We may revise these Terms from time to time. Continued use of the site after changes are
          posted constitutes acceptance of the updated Terms.
        </p>
      </LegalSection>

      <LegalSection title="Contact Us">
        <p>
          Questions about these Terms can be sent to{" "}
          <a href="mailto:support@luxen.co" className="font-semibold text-brand hover:underline">
            support@luxen.co
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
