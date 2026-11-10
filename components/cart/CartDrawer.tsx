"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart, formatUSD } from "@/lib/cart";
import { EASE, DUR } from "@/lib/motion";

export default function CartDrawer() {
  const { isOpen, closeCart, lines, count, subtotal, setQty, remove } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DUR.medium, ease: EASE }}
          className="fixed inset-0 z-[80]"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-blue/45" onClick={closeCart} />

          {/* Panel — square corners and a pale-pink field, per the reference. */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: DUR.long, ease: EASE }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-pale"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-pink px-6 py-5">
              <h2 className="flex items-center gap-2.5 text-lg font-bold uppercase tracking-[1px] text-yellow">
                <ShoppingBag size={20} aria-hidden />
                Your Cart
                {count > 0 && <span className="by-badge by-badge-yellow">{count}</span>}
              </h2>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="by-icon grid h-10 w-10 place-items-center text-yellow"
              >
                <X size={20} />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
                <ShoppingBag size={36} className="text-pink/50" aria-hidden />
                <p className="text-[15px] uppercase tracking-[1px] text-pink">
                  Your cart is empty.
                </p>
                <Link href="/shop" onClick={closeCart} className="by-btn">
                  Browse Catalog
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 divide-y divide-pink/15 overflow-y-auto px-6">
                  {lines.map((l) => (
                    <div key={l.product.slug} className="flex gap-4 py-5">
                      <Link
                        href={`/product/${l.product.slug}`}
                        onClick={closeCart}
                        className="relative h-24 w-20 shrink-0"
                      >
                        <Image
                          src={l.product.card ?? l.product.img}
                          alt={l.product.title}
                          fill
                          className="object-contain p-1.5"
                          sizes="80px"
                        />
                      </Link>

                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/product/${l.product.slug}`}
                            onClick={closeCart}
                            className="by-card-title text-[15px] leading-snug hover:underline hover:underline-offset-[0.3rem]"
                          >
                            {l.product.title}
                          </Link>
                          <button
                            onClick={() => remove(l.product.slug)}
                            aria-label={`Remove ${l.product.title}`}
                            className="by-icon shrink-0 text-pink"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <span className="mt-1 text-xs tracking-[0.6px] text-pink/70">
                          {formatUSD(l.product.price)} each
                        </span>

                        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                          <div className="flex items-center border border-pink/55">
                            <button
                              onClick={() => setQty(l.product.slug, l.qty - 1)}
                              aria-label="Decrease quantity"
                              className="grid h-9 w-9 place-items-center text-pink transition-colors hover:bg-pink hover:text-yellow"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-9 text-center text-sm font-bold text-pink">
                              {l.qty}
                            </span>
                            <button
                              onClick={() => setQty(l.product.slug, l.qty + 1)}
                              aria-label="Increase quantity"
                              className="grid h-9 w-9 place-items-center text-pink transition-colors hover:bg-pink hover:text-yellow"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="by-price">{formatUSD(l.lineTotal)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-pink/20 px-6 py-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm uppercase tracking-[1px] text-pink">
                      Subtotal
                    </span>
                    <span className="by-price text-lg">{formatUSD(subtotal)}</span>
                  </div>
                  <Link href="/checkout" onClick={closeCart} className="by-btn w-full">
                    Checkout
                  </Link>
                  <button
                    onClick={closeCart}
                    className="by-link mt-3 w-full text-[13px] font-bold uppercase tracking-[1px] text-pink"
                  >
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
