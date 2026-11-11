"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/lib/auth";
import { ApiError, apiForgotPassword } from "@/lib/api";

const INPUT =
  "by-field placeholder:text-pink/50";

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [forgotBusy, setForgotBusy] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }
    setBusy(true);
    try {
      await login(form.email.trim(), form.password);
      router.push("/");
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.status === 401
            ? "Invalid email or password."
            : err.message
          : "Could not sign you in. Please try again.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleForgot = async () => {
    setError(null);
    setNotice(null);
    const email = form.email.trim();
    if (!email) {
      setError("Enter your email above, then tap ‘Forgot?’ to receive a reset link.");
      return;
    }
    setForgotBusy(true);
    try {
      const res = await apiForgotPassword(email);
      setNotice(res.message);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send reset link.");
    } finally {
      setForgotBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-pale lg:grid lg:grid-cols-[1fr_1.1fr]">
      {/* Left — Form column */}
      <section className="relative flex min-h-screen flex-col px-6 py-8 sm:px-10 lg:px-16 lg:py-12">
        {/* Top row: logo + back home */}
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="LUXEN home">
            <Logo className="text-pink" mark="var(--brand)" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-pink/75 transition-colors hover:text-pink"
          >
            <ArrowLeft size={16} /> Back to site
          </Link>
        </div>

        {/* Center card */}
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <p className="text-[0.65rem] uppercase tracking-[0.28em] text-pink">Welcome back</p>
          <h1 className="by-h-product mt-2">
            Sign in
          </h1>
          <p className="mt-3 text-sm text-pink/75">
            Access your research orders, batch records, and certificates of analysis.
          </p>

          <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-pink/75">
                Email
              </span>
              <input
                className={INPUT}
                type="email"
                required
                autoComplete="email"
                placeholder="you@lab.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </label>

            <label className="block">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.22em] text-pink/75">Password</span>
                <button
                  type="button"
                  onClick={handleForgot}
                  disabled={forgotBusy}
                  className="text-xs font-semibold text-pink hover:text-pink-dark disabled:opacity-60"
                >
                  {forgotBusy ? "Sending…" : "Forgot?"}
                </button>
              </div>
              <div className="relative">
                <input
                  className={`${INPUT} pr-12`}
                  type={showPwd ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-pink/75 hover:bg-yellow hover:text-pink"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-pink/75">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border border-pink/30 accent-[var(--pink)]"
              />
              Keep me signed in on this device
            </label>

            {notice && (
              <p className="rounded-[12px] border border-pink/30 bg-pink/[0.06] px-4 py-2 text-xs text-pink-dark">
                {notice}
              </p>
            )}
            {error && (
              <p className="rounded-[12px] border border-red-300 bg-red-50 px-4 py-2 text-xs text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="by-btn mt-3 w-full"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-pink/75">
            New to LUXEN?{" "}
            <Link href="/signup" className="font-semibold text-pink hover:text-pink-dark">
              Create an account
            </Link>
          </p>
        </div>

        {/* Bottom row */}
        <p className="mt-4 text-center text-[0.65rem] uppercase tracking-[0.22em] text-pink/75 lg:text-left">
          For laboratory R&amp;D use only · Not for human or veterinary consumption
        </p>
      </section>

      {/* Right — Visual panel: model photo (the photo half of a 3:1 split
          banner, cropped onto her face and pen) with the quote over a blue
          scrim at the foot. */}
      <aside className="relative hidden overflow-hidden bg-blue lg:sticky lg:top-0 lg:block lg:h-screen lg:self-start">
        <Image
          src="/images/about-page/science.png"
          alt="Smiling model holding a Retatrutide pre-filled research pen against a lilac backdrop"
          fill
          priority
          sizes="(min-width:1024px) 55vw, 0vw"
          className="object-cover object-[20%_center]"
        />
        {/* Blue scrim rising from the foot, so the yellow copy reads over the
            photo without dimming the model's face above it. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-blue from-25% via-blue/80 to-transparent"
        />

        <div className="relative z-10 flex h-full flex-col p-14 text-yellow">
          <div className="flex w-fit items-center gap-2 rounded-full bg-blue/80 px-4 py-2 text-[0.65rem] uppercase tracking-[0.28em] text-yellow backdrop-blur-sm">
            <span className="grid h-2 w-2 place-items-center rounded-full bg-pink" />
            Research portal
          </div>

          <blockquote className="mt-auto">
            <p className="max-w-[560px] text-[clamp(22px,2vw,30px)] font-medium uppercase leading-[1.2] tracking-[0.5px] text-yellow">
              &ldquo;The certificates of analysis matched our own HPLC results to the decimal.
              Reordering has become the easiest part of running the lab.&rdquo;
            </p>
            <footer className="mt-6 text-sm text-yellow/70">
              Research Associate · Cell Biology Lab
            </footer>
          </blockquote>
        </div>
      </aside>
    </main>
  );
}
