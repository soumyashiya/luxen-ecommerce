"use client";

import { useEffect, useId, useRef, type RefObject } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import type { Product } from "@/lib/data";
import { EASE } from "@/lib/motion";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type Props = {
  product: Product;
  open: boolean;
  onClose: () => void;
  /* Element that opened the dialog — focus goes back here on close. */
  returnFocusRef?: RefObject<HTMLElement | null>;
};

/**
 * Assay certificate dialog — a wide split panel. The left (blue) side carries
 * the headline assay figure; the right (pale) side carries the compound rows
 * and the link out to the published Janoshik report. Opens only from an
 * explicit trigger on the product page; every figure comes from
 * `product.analysis`.
 */
export default function JanoshikModal({ product, open, onClose, returnFocusRef }: Props) {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const eyebrowId = useId();
  const titleId = useId();
  const descId = useId();

  // Scroll lock, Escape, focus trap, focus return.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    // `html` uses overflow-x: clip, so a body-only lock wouldn't propagate.
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const returnTo =
      returnFocusRef?.current ?? (document.activeElement as HTMLElement | null);
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
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
  }, [open, onClose, returnFocusRef]);

  const { analysis } = product;
  if (!analysis) return null;

  const fade = { duration: reduceMotion ? 0 : 0.25, ease: EASE };
  const rise = { duration: reduceMotion ? 0 : 0.4, ease: EASE };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="assay-dialog"
          data-lenis-prevent
          className="fixed inset-0 z-[100] grid place-items-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fade}
        >
          {/* Backdrop — click to dismiss. Pink would vanish on this page, so
              the scrim is the deep blue. */}
          <div
            aria-hidden="true"
            onClick={onClose}
            className="absolute inset-0 bg-blue/60 backdrop-blur-[2px]"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${eyebrowId} ${titleId}`}
            aria-describedby={descId}
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            transition={rise}
            className="relative grid max-h-[calc(100dvh-2rem)] w-full max-w-[860px] overflow-y-auto overscroll-contain rounded-[12px] bg-pale md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:overflow-hidden"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close assay results"
              className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-pale text-pink ring-1 ring-pink/25 transition-colors duration-[var(--dur)] ease-[var(--ease)] hover:bg-pink hover:text-yellow"
            >
              <X size={18} aria-hidden="true" />
            </button>

            {/* Left — the headline figure on the deep blue panel */}
            <div className="flex flex-col justify-between gap-10 bg-blue px-7 pb-7 pt-8 text-pale md:px-10 md:py-10">
              <p className="text-xs font-medium uppercase tracking-[2px] text-yellow/85">
                Third-party assay
              </p>

              {/* Container for the figure: its size tracks this column's width
                  (cqi), so a long reading like "99.21%" never spills into the
                  next column. */}
              <div className="@container min-w-0">
                {analysis.purity ? (
                  <>
                    <p className="whitespace-nowrap text-[min(104px,25cqi)] font-bold leading-[0.9] tracking-[-0.03em] text-yellow tabular-nums">
                      {analysis.purity}
                    </p>
                    <p className="mt-4 text-base leading-snug text-pale">
                      purity, independently assayed
                    </p>
                  </>
                ) : (
                  /* Blends carry no single purity figure on the report — lead
                     with each compound's verified content instead. */
                  <>
                    <ul className="space-y-2">
                      {analysis.compounds.map((c) => (
                        <li key={c.compound} className="flex items-baseline gap-3">
                          <span className="shrink-0 text-[min(56px,16cqi)] font-bold leading-none tracking-[-0.02em] text-yellow tabular-nums">
                            {c.verifiedContent}
                          </span>
                          <span className="text-sm text-pale/80">{c.compound}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-base leading-snug text-pale">
                      verified content, independently assayed
                    </p>
                  </>
                )}
              </div>

              <dl className="grid grid-cols-2 gap-4 border-t border-pale/20 pt-5 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-[1px] text-pale/65">Batch</dt>
                  <dd className="mt-1 font-medium text-pale">{analysis.batchNumber}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[1px] text-pale/65">
                    Fill volume
                  </dt>
                  <dd className="mt-1 font-medium text-pale">{analysis.fillVolume}</dd>
                </div>
              </dl>
            </div>

            {/* Right — product, attribution, compound rows, report link */}
            <div className="flex flex-col px-7 pb-7 pt-8 md:overflow-y-auto md:px-10 md:py-10">
              <p
                id={eyebrowId}
                className="pr-12 text-xs font-medium uppercase tracking-[2px] text-blue"
              >
                Assay certificate
              </p>
              <h2
                id={titleId}
                className="mt-2 pr-12 text-[22px] font-bold uppercase leading-tight tracking-[1px] text-pink md:text-[26px]"
              >
                {product.title}
              </h2>
              <p id={descId} className="mt-3 text-sm leading-relaxed text-pink/80">
                Tested by Janoshik Analytical, an independent third-party lab. Figures
                are taken from the published batch report.
              </p>

              <table className="mt-6 w-full text-left text-sm">
                <caption className="sr-only">Compounds measured in this batch</caption>
                <thead>
                  <tr className="border-b border-pink/30">
                    <th scope="col" className="pb-2 text-xs font-medium text-pink/70">
                      Compound
                    </th>
                    <th scope="col" className="pb-2 text-xs font-medium text-pink/70">
                      Per mL
                    </th>
                    <th scope="col" className="pb-2 text-right text-xs font-medium text-pink/70">
                      Verified
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.compounds.map((c) => (
                    <tr key={c.compound} className="border-b border-pink/15">
                      <th scope="row" className="py-3 pr-3 font-bold text-pink">
                        {c.compound}
                      </th>
                      <td className="py-3 pr-3 text-pink/80 tabular-nums">
                        {c.concentration}
                      </td>
                      <td className="py-3 text-right font-bold text-pink tabular-nums">
                        {c.verifiedContent}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="mt-3 text-xs leading-relaxed text-pink/70">
                Concentration is measured per mL; verified content is the total assayed
                mass across the {analysis.fillVolume} fill.
              </p>

              <div className="mt-auto pt-7">
                {product.janoshikUrl && (
                  <a
                    href={product.janoshikUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="by-btn by-btn-soft w-full sm:w-auto"
                  >
                    View full report
                    <ExternalLink size={14} aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
                <p className="mt-4 text-[11px] leading-relaxed text-pink/70">
                  For research purposes only. Not intended for human or veterinary use.
                  Not intended to diagnose, treat, cure, or prevent any disease.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
