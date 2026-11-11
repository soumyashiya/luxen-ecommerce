"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, ShieldCheck, X } from "lucide-react";
import { EASE } from "@/lib/motion";
import { SITE_NAME } from "@/lib/seo";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* Once per browser session: a returning tab stays quiet. */
const SEEN_KEY = "luxen-welcome-seen";
const OPEN_DELAY_MS = 700;

/* The "we believe" photo sits on a lemon backdrop; the copy column is the
   brand's deep blue, which echoes the blue of the Glow pen in her hand and
   lets yellow and pink type sit on it at full strength. */
const IMAGE = "/images/about-page/we belive.png";
const PHOTO_FIELD = "#f9eca0";

const STATS = [
  { value: "≥99%", label: "HPLC purity" },
  { value: "100%", label: "Lots tested" },
  { value: "2–8°C", label: "Cold chain" },
];

/**
 * Welcome dialog shown on a visitor's first page of the session — built
 * from the "we believe" photo: the model left, the statement right on the
 * brand's deep blue (the pen's blue), yellow type, glassy stat tiles and a
 * pink pill CTA. Stacks on small screens.
 * Copy only repeats claims the catalogue already makes.
 */
export default function WelcomeModal() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* Storage blocked — show it; worst case it shows once per page load. */
    }
    if (seen) return;
    const t = window.setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  // Scroll lock, Escape, focus trap, focus return.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const returnTo = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
      document.removeEventListener("keydown", onKey);
      returnTo?.focus?.();
    };
  }, [open, close]);

  const fade = { duration: reduceMotion ? 0 : 0.4, ease: EASE };
  const rise = { duration: reduceMotion ? 0 : 0.7, ease: EASE };

  /* Copy settles in line by line, just behind the card. */
  const list: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.08,
        delayChildren: reduceMotion ? 0 : 0.25,
      },
    },
  };
  const item: Variants = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.6, ease: EASE } },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="welcome-dialog"
          data-lenis-prevent
          className="fixed inset-0 z-[110] grid place-items-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fade}
        >
          {/* Deep, quiet scrim — the page recedes rather than tints. */}
          <div
            aria-hidden="true"
            onClick={close}
            className="absolute inset-0 bg-[#2a0a1f]/65 backdrop-blur-[6px]"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
            transition={rise}
            style={{ backgroundColor: PHOTO_FIELD }}
            className="relative grid max-h-[calc(100dvh-2rem)] w-full max-w-[1000px] overflow-y-auto overscroll-contain rounded-[18px] shadow-[0_50px_120px_-40px_rgba(0,0,0,0.75)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:overflow-hidden"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close welcome message"
              className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-white text-pink shadow-[0_8px_20px_-10px_rgba(227,29,147,0.7)] transition-[background-color,color,transform] duration-300 ease-[var(--ease)] hover:rotate-90 hover:bg-pink hover:text-yellow"
            >
              <X size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>

            {/* Photo — the model half of the banner, held on her face and the
                Glow pen. Eases out of a slight zoom as the card lands. */}
            <div className="relative h-[300px] overflow-hidden bg-[#f9eca0] sm:h-[380px] md:h-auto md:min-h-[580px]">
              <motion.div
                className="absolute inset-0"
                initial={reduceMotion ? false : { scale: 1.06 }}
                animate={{ scale: 1 }}
                transition={{ duration: reduceMotion ? 0 : 1.6, ease: EASE }}
              >
                <Image
                  src={IMAGE}
                  alt="Smiling model holding a Glow pre-filled research pen against a lemon backdrop"
                  fill
                  sizes="1800px"
                  className="object-cover object-[8%_center] md:object-[15%_center]"
                  priority
                />
              </motion.div>

              {/* Frosted caption, bottom-left. */}
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.6, ease: EASE, delay: reduceMotion ? 0 : 0.5 }}
                className="absolute bottom-5 left-5 flex items-center gap-2.5 rounded-full bg-white/80 py-2 pl-2 pr-4 text-pink shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)] backdrop-blur-md sm:bottom-6 sm:left-6"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-pink text-yellow">
                  <ShieldCheck size={15} strokeWidth={2} aria-hidden />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[1.5px]">
                  Every batch independently tested
                </span>
              </motion.div>
            </div>

            {/* Copy — flat brand blue (`--blue`, #000f9f), the same blue as the
                homepage product titles; no overlays, so it reads true. */}
            <motion.div
              variants={list}
              initial="hidden"
              animate="show"
              className="relative flex flex-col justify-center overflow-hidden bg-blue px-7 py-10 sm:px-12 md:py-14 md:pl-12 md:pr-14"
            >

              <motion.div variants={item} className="relative flex items-center gap-3">
                <span className="rounded-full bg-pink px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[2px] text-yellow">
                  Welcome
                </span>
                <span className="text-[13px] font-bold uppercase tracking-[5px] text-yellow">
                  to {SITE_NAME}
                </span>
              </motion.div>

              <motion.h2
                id={titleId}
                variants={item}
                className="relative mt-6 text-[clamp(30px,3.4vw,44px)] font-bold uppercase leading-[1] tracking-[0.5px] text-yellow"
              >
                We believe research should arrive{" "}
                <span className="relative inline-block whitespace-nowrap">
                  <span className="relative z-10">with proof.</span>
                  {/* Hand-drawn underline swash. */}
                  <svg
                    aria-hidden
                    viewBox="0 0 200 14"
                    preserveAspectRatio="none"
                    className="absolute -bottom-2 left-0 h-3 w-full text-pink"
                  >
                    <path
                      d="M2 9 C 50 2, 110 2, 198 7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </motion.h2>

              <motion.p
                id={descId}
                variants={item}
                className="relative mt-6 max-w-[400px] text-[15px] leading-[1.7] tracking-[0.3px] text-pale/85"
              >
                Not a promise on a label — a certificate you can read. Every lot is
                tested by Janoshik Analytical for identity, purity and content.
              </motion.p>

              <motion.dl variants={item} className="relative mt-7 grid grid-cols-3 gap-2.5">
                {STATS.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-[14px] bg-white/[0.07] px-3 py-3.5 text-center ring-1 ring-white/15 backdrop-blur-sm"
                  >
                    <dt className="sr-only">{s.label}</dt>
                    <dd>
                      <span className="block whitespace-nowrap text-[clamp(20px,2.2vw,26px)] font-bold leading-none tracking-[0.3px] text-yellow">
                        {s.value}
                      </span>
                      <span className="mt-1.5 block text-[10px] font-bold uppercase tracking-[1.5px] text-pale/70">
                        {s.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </motion.dl>

              <motion.div
                variants={item}
                className="relative mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center"
              >
                <Link
                  href="/shop"
                  onClick={close}
                  className="group inline-flex min-h-[54px] items-center gap-3 whitespace-nowrap rounded-full bg-pink pl-8 pr-3 text-[14px] font-bold uppercase tracking-[2px] text-yellow shadow-[0_16px_34px_-12px_rgba(227,29,147,0.9)] transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#f0389f]"
                >
                  Shop the range
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-yellow text-pink transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight size={15} aria-hidden />
                  </span>
                </Link>
                <Link
                  href="/about"
                  onClick={close}
                  className="whitespace-nowrap text-[13px] font-bold uppercase tracking-[2px] text-yellow underline decoration-yellow/35 decoration-2 underline-offset-[6px] transition-colors hover:decoration-yellow"
                >
                  View certificates
                </Link>
              </motion.div>

              <motion.p
                variants={item}
                className="relative mt-8 text-[10px] font-medium uppercase tracking-[1.5px] text-pale/55"
              >
                For research use only — not for human or veterinary use
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
