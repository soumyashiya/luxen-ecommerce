"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { LogoMark } from "@/components/ui/Logo";
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
const DribbbleIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="M8.5 2.5c4 5 5.5 9.5 6 18.5M2.5 9.5c8 1 13-1 16.5-4.5M21.5 13c-6-2-11-1-15 2.5" strokeLinecap="round" />
  </svg>
);
const FacebookIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.08 24 18.09 24 12.07z" />
  </svg>
);

const SOCIALS = [
  { icon: XIcon, label: "X" },
  { icon: LinkedinIcon, label: "LinkedIn" },
  { icon: DribbbleIcon, label: "Dribbble" },
  { icon: FacebookIcon, label: "Facebook" },
];

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Shop", href: "/shop" },
  { label: "Our Team", href: "/#team" },
  { label: "Contact", href: "/#contact" },
];
const UTIL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Press", href: "/press-release" },
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
      <p className="text-xl font-semibold leading-snug text-ink">
        Sign up to receive the latest news and events from us.
      </p>
      <form
        onSubmit={submit}
        className="mt-5 flex items-center gap-2 rounded-full bg-white p-1.5"
      >
        <input
          type="email"
          required
          placeholder="Your Email*"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={busy}
          className="w-full bg-transparent px-4 text-sm text-ink outline-none placeholder:text-muted disabled:opacity-60"
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
          className="rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-70"
        >
          {busy ? "Subscribing…" : "Subscribe"}
        </button>
      </form>
      <label className="mt-3 flex cursor-pointer select-none items-center gap-2 text-xs text-muted">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="h-3.5 w-3.5 rounded border border-black/20 accent-[var(--brand)]"
        />
        I agree to receive occasional updates from LUXEN.
      </label>
      {msg && (
        <p
          className={`mt-2 text-xs ${msg.tone === "ok" ? "text-brand-dark" : "text-red-600"}`}
        >
          {msg.text}
        </p>
      )}
    </div>
  );
}

export default function Footer() {
  return (
    <footer id="contact" className="bg-white pb-8 pt-16">
      <div className="container-luxen space-y-6">
        {/* Main */}
        <Reveal>
          <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            {/* Brand block */}
            <div className="grid min-h-[280px] place-items-center rounded-[24px] bg-brand">
              <span className="inline-flex items-center gap-2 text-white">
                <LogoMark className="h-9 w-9" color="#fff" />
                <span className="text-3xl font-extrabold tracking-tight">LUXEN</span>
              </span>
            </div>

            {/* Info */}
            <div className="flex flex-col justify-between gap-8 rounded-[24px] bg-surface p-8 sm:p-10">
              <div className="grid gap-8 sm:grid-cols-2">
                <p className="max-w-xs text-[15px] leading-relaxed text-muted">
                  LUXEN supplies premium, independently tested research peptides for
                  laboratories worldwide. Research use only — not for human consumption.
                </p>
                <NewsletterForm />
              </div>

              <div className="flex flex-wrap gap-x-7 gap-y-3 border-t border-black/10 pt-6 text-sm font-medium text-ink">
                {FOOTER_LINKS.map((l) => (
                  <Link key={l.label} href={l.href} className="transition-colors hover:text-brand">
                    {l.label}
                  </Link>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted">
                <span>Copyright © 2026 LUXEN</span>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {UTIL_LINKS.map((l) => (
                    <Link key={l.label} href={l.href} className="transition-colors hover:text-brand">
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Socials */}
        <Reveal>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="group grid h-32 place-items-center rounded-[24px] bg-surface transition-colors hover:bg-brand"
              >
                <s.icon className="h-9 w-9 text-brand transition-colors group-hover:text-white" />
              </a>
            ))}
          </div>
        </Reveal>

        <div className="pt-4 text-center text-xs text-muted">
          Independently tested · Research reference material · For laboratory and analytical
          use only. Not intended to diagnose, treat, cure, or prevent any disease. Not for human
          or veterinary use.
        </div>
      </div>
    </footer>
  );
}
