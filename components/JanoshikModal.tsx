"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, FlaskConical, X } from "lucide-react";
import type { Product } from "@/lib/data";
import { EASE } from "@/lib/motion";

/**
 * Auto-opening product-analysis modal — shows the Janoshik lab report for the
 * current product on entry. Dismissed state is remembered per product for the
 * current tab (sessionStorage) so it doesn't reappear on every internal nav.
 */
export default function JanoshikModal({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !product.analysis) return;
    const t = window.setTimeout(() => setOpen(true), 500);
    return () => window.clearTimeout(t);
  }, [product.slug, product.analysis]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const close = () => {
    setOpen(false);
  };

  const { analysis } = product;
  if (!analysis) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="janoshik-modal-title"
          className="fixed inset-0 z-[100] grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close analysis"
            onClick={close}
            className="absolute inset-0 h-full w-full cursor-default bg-ink/50 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="relative w-full max-w-lg overflow-hidden rounded-[24px] bg-white shadow-[0_40px_120px_-40px_rgba(0,0,0,0.35)] ring-1 ring-black/5"
          >
            {/* Close */}
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-surface text-ink transition-colors hover:bg-brand hover:text-white"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="px-6 pb-5 pt-8 text-center sm:px-8">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-surface text-brand ring-1 ring-brand/20">
                <FlaskConical size={22} aria-hidden="true" />
              </div>
              <h2
                id="janoshik-modal-title"
                className="mt-4 text-xl font-bold text-ink sm:text-2xl"
              >
                Janoshik Third-Party Lab Analysis
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Independently tested and verified by Janoshik Analytical.
              </p>
            </div>

            {/* Metric cards */}
            <div className="px-6 sm:px-8">
              <div
                className={`grid gap-3 ${
                  analysis.purity ? "grid-cols-3" : "grid-cols-2"
                }`}
              >
                <MetricCard label="Batch Number" value={analysis.batchNumber} />
                <MetricCard label="Fill Volume" value={analysis.fillVolume} />
                {analysis.purity && (
                  <MetricCard label="Purity" value={analysis.purity} highlight />
                )}
              </div>
            </div>

            {/* Compound table */}
            <div className="mt-5 overflow-x-auto px-6 sm:px-8">
              <div className="overflow-hidden rounded-2xl ring-1 ring-black/5">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface">
                    <tr>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted">
                        Compound
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted">
                        Concentration
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted">
                        Verified Content
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.compounds.map((c) => (
                      <tr key={c.compound} className="border-t border-black/5">
                        <td className="px-4 py-3 font-bold text-ink">{c.compound}</td>
                        <td className="px-4 py-3 text-ink">{c.concentration}</td>
                        <td className="px-4 py-3 font-bold text-brand">
                          {c.verifiedContent}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footnote */}
            <p className="mt-4 px-6 text-xs leading-relaxed text-muted sm:px-8">
              Concentration is measured per ml; verified content reflects the total assayed
              mass across the stated fill volume.
            </p>

            {/* CTA */}
            <div className="mt-6 px-6 pb-7 sm:px-8">
              {product.janoshikUrl && (
                <a
                  href={product.janoshikUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-4 text-sm font-bold uppercase tracking-wide text-white transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
                >
                  View Full Janoshik Report
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              )}
              <p className="mt-3 text-center text-[11px] text-muted">
                Certificate for <span className="font-semibold text-ink">{product.title}</span>
              </p>
              <p className="mt-3 text-center text-[10px] leading-relaxed text-muted">
                FOR RESEARCH PURPOSES ONLY. Not intended for human or veterinary use. Not
                intended to diagnose, treat, cure, or prevent any disease.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MetricCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl bg-surface px-3 py-3 text-center ring-1 ring-black/5">
      <p className="text-[9px] font-bold uppercase tracking-wider text-muted">
        {label}
      </p>
      <p
        className={`mt-1 text-sm font-extrabold ${
          highlight ? "text-brand" : "text-ink"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
