"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { ApiError, apiNewsletterSubscribe } from "@/lib/api";

type IconProps = { className?: string };

const XIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);
const LinkedinIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  </svg>
);
const FacebookIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.08 24 18.09 24 12.07z" />
  </svg>
);

const SOCIALS = [
  { icon: XIcon, label: "X", href: "https://twitter.com/luxenlabs" },
  { icon: LinkedinIcon, label: "LinkedIn", href: "https://www.linkedin.com/company/luxen" },
  { icon: FacebookIcon, label: "Facebook", href: "#" },
];

/* Thin-line pictograms in the reference's yellow trust band. */
const FlaskIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M26 6h12M28 6v18L14 50a4 4 0 0 0 3.4 6h29.2a4 4 0 0 0 3.4-6L36 24V6" />
    <path d="M21 40h22" />
  </svg>
);
const TruckIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 18h30v26H4zM34 26h11l7 8v10H34z" />
    <circle cx="17" cy="48" r="5" />
    <circle cx="44" cy="48" r="5" />
    <path d="M2 26h10M2 33h8" />
  </svg>
);
const ShieldIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M32 6 10 14v18c0 14 9.6 22.6 22 26 12.4-3.4 22-12 22-26V14z" />
    <path d="m23 31 6.5 6.5L42 25" />
  </svg>
);

const TRUST = [
  { icon: FlaskIcon, head: "≥99% Purity", sub: "HPLC verified, every batch" },
  { icon: TruckIcon, head: "Free Delivery", sub: "On orders over $250" },
  { icon: ShieldIcon, head: "Third-Party Tested", sub: "Certificate with every lot" },
];

const FOOTER_COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Customer Care",
    links: [
      { label: "Track Order", href: "/track-order" },
      { label: "Shipping Policy", href: "/shipping-policy" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Contact Us", href: "/about#contact" },
    ],
  },
  {
    title: "Company Info",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "Press Release", href: "/press-release" },
    ],
  },
  {
    title: "More Info",
    links: [
      { label: "Our Process", href: "/about#process" },
      { label: "Research Team", href: "/#team" },
      { label: "Reviews", href: "/about#testimonials" },
    ],
  },
  {
    title: "Shop",
    links: [
      { label: "Shop All", href: "/shop" },
      { label: "Retatrutide", href: "/product/retatrutide" },
      { label: "Tirzepatide", href: "/product/tirzepatide" },
      { label: "BPC-157 & TB-500", href: "/product/bpc-157-tb-500" },
      { label: "NAD+", href: "/product/nad-plus-1000mg" },
    ],
  },
];

function NewsletterForm() {
  const [email, setEmail] = useState("");
  // Honeypot: real users leave this blank; bots fill every field. Server
  // silently 200s if this is non-empty.
  const [website, setWebsite] = useState("");
  const [consent, setConsent] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setMsg({ tone: "err", text: "Please enter your email." });
      return;
    }
    if (!consent) {
      setMsg({ tone: "err", text: "Please confirm consent to subscribe." });
      return;
    }
    setBusy(true);
    try {
      const res = await apiNewsletterSubscribe({
        email: trimmed,
        consent: true,
        source: "footer",
        website,
      });
      setMsg({
        tone: "ok",
        text: res.already_subscribed
          ? "You're already subscribed — thanks!"
          : "Subscribed. Watch your inbox.",
      });
      setEmail("");
    } catch (err) {
      const text =
        err instanceof ApiError
          ? err.status === 429
            ? "Too many submissions. Please try again later."
            : err.message
          : "Could not subscribe. Please try again.";
      setMsg({ tone: "err", text });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="text-[15px] font-bold uppercase tracking-[1px] text-yellow">
        Lab updates from LUXEN: new lots, certificates and restocks
      </p>

      {/* Arrow sits inside the field's right edge, as on the reference. */}
      <form onSubmit={submit} className="relative mt-4 max-w-sm">
        <label htmlFor="footer-email" className="sr-only">
          Email
        </label>
        <input
          id="footer-email"
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={busy}
          className="by-field by-field-on-pink pr-12 disabled:opacity-60"
        />
        {/* Honeypot — hidden from users, harvested by bots. */}
        <input
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="hidden"
        />
        <button
          type="submit"
          disabled={busy}
          aria-label="Subscribe"
          className="by-icon absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center text-yellow disabled:opacity-60"
        >
          <ArrowRight size={18} />
        </button>
      </form>

      <label className="mt-3 flex max-w-sm cursor-pointer select-none items-start gap-2 text-xs leading-relaxed text-yellow/80">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-3.5 w-3.5 shrink-0 accent-[var(--yellow)]"
        />
        I agree to receive occasional updates from LUXEN.
      </label>

      {msg && (
        <p
          role="status"
          className={`mt-2 text-xs ${msg.tone === "ok" ? "text-yellow" : "text-white"}`}
        >
          {msg.text}
        </p>
      )}
    </div>
  );
}

export default function Footer() {
  return (
    <footer id="contact">
      {/* Yellow trust band — three pink line-icon columns with hairline rules */}
      <div className="bg-yellow py-14 sm:py-16">
        <Reveal className="by-page grid gap-10 text-center sm:grid-cols-3 sm:gap-0">
          {TRUST.map((t, i) => (
            <div
              key={t.head}
              className={
                i > 0
                  ? "flex flex-col items-center sm:border-l sm:border-pink/70 sm:px-6"
                  : "flex flex-col items-center sm:px-6"
              }
            >
              <t.icon className="h-14 w-14 text-pink" />
              <p className="mt-5 text-[26px] font-bold uppercase leading-none tracking-[0.6px] text-pink sm:text-[30px]">
                {t.head}
              </p>
              <p className="mt-2 text-[18px] uppercase leading-none tracking-[0.6px] text-pink sm:text-[22px]">
                {t.sub}
              </p>
            </div>
          ))}
        </Reveal>
      </div>

      {/* Pink body — link columns + newsletter */}
      <div className="bg-pink py-14">
        <div className="by-page">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <h2 className="by-nav-link mb-5 text-yellow">{col.title}</h2>
                <ul className="space-y-1">
                  {col.links.map((l) => (
                    <li key={l.href + l.label}>
                      <Link href={l.href} className="by-footer-link text-yellow">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <NewsletterForm />
          </div>

          <p className="mt-10 max-w-3xl text-xs leading-relaxed text-yellow/75">
            Independently tested research reference material, supplied for laboratory and
            analytical use only. Not intended to diagnose, treat, cure, or prevent any
            disease. Not for human or veterinary use.
          </p>
        </div>
      </div>

      {/* Yellow bottom bar — copyright left, socials right */}
      <div className="bg-yellow py-6">
        <div className="by-page flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm tracking-[0.6px] text-pink">© 2026 LUXEN</p>
          <div className="flex items-center gap-5">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="by-icon text-pink"
              >
                <s.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
