import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/legal/LegalLayout";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} collects, uses, and protects your personal data.`,
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout eyebrow="Legal" title="Privacy Policy" updated="July 31, 2026">
      <LegalSection title="Overview">
        <p>
          {SITE_NAME} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) supplies research
          reference peptides to laboratories and qualified research professionals. This policy
          explains what personal data we collect when you use our website or place an order,
          how we use it, and the choices and rights you have over it.
        </p>
      </LegalSection>

      <LegalSection title="Information We Collect">
        <p>We collect information you provide directly to us, including:</p>
        <ul>
          <li>Name, email address, and phone number</li>
          <li>Billing and shipping address</li>
          <li>Order history and correspondence with our support team</li>
          <li>Account credentials, if you create an account</li>
        </ul>
        <p>
          We also automatically collect limited technical data — such as IP address, browser
          type, device information, and pages visited — to keep the site secure and improve
          performance.
        </p>
      </LegalSection>

      <LegalSection title="How We Use Your Information">
        <ul>
          <li>To process and fulfil orders, including shipping and support communication</li>
          <li>To create and manage your account</li>
          <li>To send order confirmations, shipping updates, and — with your consent — newsletter emails</li>
          <li>To detect, prevent, and investigate fraud or abuse</li>
          <li>To comply with legal and regulatory obligations</li>
        </ul>
      </LegalSection>

      <LegalSection title="Cookies & Tracking">
        <p>
          We use strictly necessary cookies to keep you signed in and to remember items in your
          cart. We do not use cookies for third-party advertising.
        </p>
      </LegalSection>

      <LegalSection title="Third-Party Service Providers">
        <p>
          We share data only with service providers that help us run the business — payment
          processing, shipping and logistics, email delivery, and independent laboratory testing
          partners. These providers are contractually bound to protect your data and may use it
          only to perform the services we request. We do not sell or rent your personal data to
          third parties.
        </p>
      </LegalSection>

      <LegalSection title="Data Retention">
        <p>
          We retain order and account data for as long as your account is active, and for a
          reasonable period afterward to meet accounting, tax, and legal obligations. You can
          request deletion of your account data at any time, subject to those obligations.
        </p>
      </LegalSection>

      <LegalSection title="Your Rights">
        <p>Depending on your location, you may have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Withdraw consent to marketing communications at any time</li>
        </ul>
        <p>To exercise any of these rights, contact us using the details below.</p>
      </LegalSection>

      <LegalSection title="Data Security">
        <p>
          We use industry-standard technical and organizational safeguards — including encrypted
          connections and access controls — to protect your data from unauthorized access, loss,
          or misuse.
        </p>
      </LegalSection>

      <LegalSection title="Children's Privacy">
        <p>
          Our products and services are intended solely for research professionals aged 18 and
          over. We do not knowingly collect personal data from anyone under 18.
        </p>
      </LegalSection>

      <LegalSection title="Changes to This Policy">
        <p>
          We may update this policy from time to time. Material changes will be reflected by
          updating the &ldquo;Last updated&rdquo; date at the top of this page.
        </p>
      </LegalSection>

      <LegalSection title="Contact Us">
        <p>
          Questions about this policy or your data? Email us at{" "}
          <a href="mailto:support@luxen.co" className="font-semibold text-brand hover:underline">
            support@luxen.co
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
