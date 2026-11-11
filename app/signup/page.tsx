"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";

const COUNTRIES = [
  "United Kingdom",
  "Ireland",
  "France",
  "Germany",
  "Netherlands",
  "Spain",
  "Italy",
  "Belgium",
  "Sweden",
  "Denmark",
  "Norway",
  "Finland",
  "United States",
  "Canada",
  "Australia",
  "New Zealand",
  "Japan",
  "Singapore",
  "Other",
];

const INPUT =
  "by-field placeholder:text-pink/50";

function passwordStrength(pw: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["Too short", "Weak", "Fair", "Good", "Strong"] as const;
  return { score: score as 0 | 1 | 2 | 3 | 4, label: labels[score] };
}

export default function SignUpPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    nationality: "",
    country: "United Kingdom",
    password: "",
    confirm: "",
  });
  const [agree, setAgree] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = useMemo(() => passwordStrength(form.password), [form.password]);
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      // Server requires min 6; UX asks for 8, so this only trips edge cases.
      setError("Password must be at least 6 characters.");
      return;
    }
    if (strength.score < 2) {
      setError("Please choose a stronger password (8+ chars, mixed case, numbers).");
      return;
    }
    if (!agree) {
      setError("Please accept the terms to continue.");
      return;
    }
    setBusy(true);
    try {
      await register({
        name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
        email: form.email.trim(),
        password: form.password,
        date_of_birth: form.dateOfBirth,
        nationality: form.nationality.trim(),
        country_of_residence: form.country,
      });
      router.push("/");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not create your account. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-pale lg:grid lg:grid-cols-[1fr_1.1fr]">
      {/* Left — Form column */}
      <section className="relative flex min-h-screen flex-col px-6 py-8 sm:px-10 lg:px-16 lg:py-12">
        {/* Top row */}
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
          <p className="text-[0.65rem] uppercase tracking-[0.28em] text-pink">Get started</p>
          <h1 className="by-h-product mt-2">
            Create your account
          </h1>
          <p className="mt-3 text-sm text-pink/75">
            Order research-grade peptides, track shipments, and download certificates of analysis.
          </p>

          <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-pink/75">
                  First name
                </span>
                <input
                  className={INPUT}
                  required
                  autoComplete="given-name"
                  maxLength={50}
                  placeholder="Alex"
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-pink/75">
                  Last name
                </span>
                <input
                  className={INPUT}
                  required
                  autoComplete="family-name"
                  maxLength={50}
                  placeholder="Kim"
                  value={form.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-pink/75">
                Email
              </span>
              <input
                className={INPUT}
                required
                type="email"
                autoComplete="email"
                placeholder="you@lab.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-pink/75">
                Date of birth
              </span>
              <input
                className={INPUT}
                required
                type="date"
                autoComplete="bday"
                value={form.dateOfBirth}
                onChange={(e) => set("dateOfBirth", e.target.value)}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-pink/75">
                  Nationality
                </span>
                <input
                  className={INPUT}
                  required
                  maxLength={64}
                  placeholder="e.g. British"
                  value={form.nationality}
                  onChange={(e) => set("nationality", e.target.value)}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-pink/75">
                  Country of residence
                </span>
                <select
                  className={INPUT}
                  required
                  autoComplete="country-name"
                  value={form.country}
                  onChange={(e) => set("country", e.target.value)}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-pink/75">
                Password
              </span>
              <div className="relative">
                <input
                  className={`${INPUT} pr-12`}
                  required
                  type={showPwd ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={8}
                  placeholder="At least 8 characters"
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
              {form.password && (
                <div className="mt-2">
                  <div className="grid grid-cols-4 gap-1.5">
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full transition-colors ${
                          i < strength.score ? "bg-pink" : "bg-pink/15"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1.5 text-xs text-pink/75">{strength.label}</p>
                </div>
              )}
            </label>

            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-pink/75">
                Confirm password
              </span>
              <input
                className={INPUT}
                required
                type={showPwd ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat password"
                value={form.confirm}
                onChange={(e) => set("confirm", e.target.value)}
              />
            </label>

            <label className="mt-1 flex cursor-pointer select-none items-start gap-2.5 text-sm text-pink/75">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border border-pink/30 accent-[var(--pink)]"
              />
              <span>
                I confirm materials are for laboratory R&amp;D use only and agree to the{" "}
                <Link href="#" className="text-pink hover:text-pink-dark">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-pink hover:text-pink-dark">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

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
              {busy ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-pink/75">
            Already have an account?{" "}
            <Link href="/signin" className="font-semibold text-pink hover:text-pink-dark">
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-[0.65rem] uppercase tracking-[0.22em] text-pink/75 lg:text-left">
          For laboratory R&amp;D use only · Not for human or veterinary consumption
        </p>
      </section>

      {/* Right — Visual panel: model photo (the photo half of a 3:1 split
          banner, cropped onto him) with the pitch over a blue scrim at the
          foot. */}
      <aside className="relative hidden overflow-hidden bg-blue lg:sticky lg:top-0 lg:block lg:h-screen lg:self-start">
        <Image
          src="/images/about-page/everylot.png"
          alt="Smiling man in a blue shirt in front of colour-blocked panels"
          fill
          priority
          sizes="(min-width:1024px) 55vw, 0vw"
          className="object-cover object-[80%_center]"
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
            Why researchers choose LUXEN
          </div>

          <div className="mt-auto">
            <h2 className="max-w-[560px] text-[clamp(26px,2.4vw,38px)] font-bold uppercase leading-[1.1] tracking-[0.5px] text-yellow">
              Pharmaceutical rigor, in every batch.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-yellow/80">
              Every batch is independently HPLC-verified and documented to the milligram — so your
              research stays reproducible from lot to lot.
            </p>
          </div>
        </div>
      </aside>
    </main>
  );
}
