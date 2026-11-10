"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { ApiError, apiNewsletterSubscribe } from "@/lib/api";

/* ---------------------------------------------------------------------------
   Newsletter — the reference's `newsletter` section: pale pink field, centred
   pink heading, two lines of centred copy, and a single inline email field
   with a square border and an arrow submit tucked inside the right edge.

   Posts through the same `apiNewsletterSubscribe` endpoint and honeypot the
   footer form already uses — presentation only, no new backend surface.
--------------------------------------------------------------------------- */
export default function Newsletter() {
  const [email, setEmail] = useState("");
  // Honeypot: real users leave this blank; bots fill every field. Server
  // silently 200s if this is non-empty.
  const [website, setWebsite] = useState("");
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
    setBusy(true);
    try {
      const res = await apiNewsletterSubscribe({
        email: trimmed,
        consent: true,
        source: "homepage",
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
    <section className="bg-pale py-16 sm:py-20">
      <Reveal className="by-page flex flex-col items-center text-center">
        <h2 className="by-h-band">Sign up for lab updates &amp; new lots</h2>

        <p className="mt-5 max-w-[640px] text-[clamp(14px,1.6vw,17px)] leading-relaxed tracking-[0.6px] text-pink">
          Be the first to hear about new batches, published certificates of
          analysis and restocks when you join our mailing list.
        </p>

        {/* Single bordered field with the submit arrow tucked inside its
            right edge, exactly as on the reference. */}
        <form onSubmit={submit} className="relative mt-7 w-full max-w-[360px]">
          <label htmlFor="newsletter-email" className="sr-only">
            Email
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={busy}
            className="by-field pr-12 text-left disabled:opacity-60"
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
            className="by-icon absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center text-pink disabled:opacity-60"
          >
            <ArrowRight size={18} />
          </button>
        </form>

        {msg && (
          <p
            role="status"
            className={`mt-3 text-sm tracking-[0.6px] ${
              msg.tone === "ok" ? "text-blue" : "text-pink"
            }`}
          >
            {msg.text}
          </p>
        )}
      </Reveal>
    </section>
  );
}
