"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/sections/Footer";
import { useCart, formatUSD } from "@/lib/cart";

export default function CartPageClient() {
  const { lines, count, subtotal, setQty, remove, clear } = useCart();
  const router = useRouter();
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <>
      <SiteHeader />

      <main id="main" className="relative z-10 min-h-[70vh] bg-pale pb-20 pt-10">
        <div className="by-page pb-24">
          {/* Page header */}
          <div className="flex items-end justify-between border-b border-pink/20 pb-8">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-pink">Your Cart</p>
              <h1 className="by-h-product mt-2">
                {lines.length ? `${count} ${count === 1 ? "item" : "items"}` : "Cart is empty"}
              </h1>
            </div>
            <Link
              href="/shop"
              className="hidden text-sm text-pink transition-colors hover:text-pink-dark md:inline-block"
            >
              ← Back to Catalog
            </Link>
          </div>

          {/* Research-only compliance banner */}
          {lines.length > 0 && (
            <div className="mt-6 rounded-[12px] border-l-4 border-pink bg-yellow p-4 text-sm leading-relaxed text-pink">
              <p className="font-bold uppercase tracking-wide text-pink">
                Research reference material
              </p>
              <p className="mt-1 text-pink/75">
                By proceeding with this purchase, you acknowledge that these products are
                intended solely for laboratory research purposes and are not intended for human
                or veterinary use. These products are not intended to diagnose, treat, cure, or
                prevent any disease.
              </p>
            </div>
          )}

          {lines.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
              {/* Items */}
              <div>
                <ul className="flex flex-col gap-4">
                  {lines.map((l) => (
                    <li
                      key={l.product.slug}
                      className="flex flex-col gap-4 rounded-[var(--radius-xl2)] border border-pink/20 bg-pale p-5 sm:flex-row sm:items-center"
                    >
                      <Link
                        href={`/product/${l.product.slug}`}
                        className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[12px] bg-yellow"
                      >
                        <Image
                          src={l.product.card ?? l.product.img}
                          alt={l.product.title}
                          fill
                          loading="lazy"
                          className="object-contain p-3"
                          sizes="112px"
                        />
                      </Link>

                      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                        <div>
                          <p className="text-[0.6rem] uppercase tracking-[0.22em] text-pink/75">
                            Research peptide
                          </p>
                          <Link
                            href={`/product/${l.product.slug}`}
                            className="mt-1 block text-lg font-bold text-pink hover:text-pink"
                          >
                            {l.product.title}
                          </Link>
                          <p className="mt-1 text-xs text-pink/75">{formatUSD(l.product.price)} each</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                          <div
                            className="flex items-center border border-pink/55"
                            role="group"
                            aria-label={`Quantity for ${l.product.title}`}
                          >
                            <button
                              type="button"
                              onClick={() => setQty(l.product.slug, l.qty - 1)}
                              className="grid h-10 w-10 place-items-center text-pink hover:text-pink"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-sm font-semibold" aria-live="polite">
                              {l.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQty(l.product.slug, l.qty + 1)}
                              className="grid h-10 w-10 place-items-center text-pink hover:text-pink"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <p className="w-20 text-right text-base font-bold text-pink">
                            {formatUSD(l.lineTotal)}
                          </p>
                          <button
                            type="button"
                            onClick={() => remove(l.product.slug)}
                            className="text-xs uppercase tracking-[0.2em] text-pink/75 hover:text-pink"
                            aria-label={`Remove ${l.product.title} from cart`}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={clear}
                    className="text-xs uppercase tracking-[0.2em] text-pink/75 hover:text-pink"
                  >
                    Clear cart
                  </button>
                </div>
              </div>

              {/* Summary */}
              <aside
                className="h-fit rounded-[var(--radius-xl2)] border border-pink/20 bg-yellow p-7 lg:sticky lg:top-28"
                aria-labelledby="order-summary-heading"
              >
                <h2 id="order-summary-heading" className="text-xl font-bold text-pink">
                  Order summary
                </h2>

                <dl className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-pink/75">Subtotal</dt>
                    <dd className="text-pink">{formatUSD(subtotal)}</dd>
                  </div>
                  <div className="my-4 h-px bg-pink/15" role="separator" />
                  <div className="flex justify-between text-lg font-bold">
                    <dt className="text-pink">Total</dt>
                    <dd className="text-pink">{formatUSD(total)}</dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={() => router.push("/checkout")}
                  className="by-btn mt-7 w-full"
                >
                  Checkout
                </button>

                <Link
                  href="/shop"
                  className="mt-4 block text-center text-sm text-pink hover:text-pink-dark"
                >
                  Continue shopping
                </Link>

                <p className="mt-7 border-t border-pink/20 pt-5 text-center text-[0.65rem] uppercase tracking-[0.22em] text-pink/75">
                  For laboratory research use only · Not for human or veterinary use
                </p>
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

function EmptyCart() {
  return (
    <div className="mt-16 flex flex-col items-center justify-center rounded-[var(--radius-xl2)] border border-pink/20 bg-yellow py-20 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-pale text-pink">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L21 8H6" />
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="18" cy="20" r="1.5" />
        </svg>
      </div>
      <p className="mt-5 text-xl font-bold text-pink">No research products yet</p>
      <p className="mt-2 max-w-sm text-sm text-pink/75">
        Explore our catalogue and add a compound to get started.
      </p>
      <Link
        href="/shop"
        className="by-btn mt-8"
      >
        Continue shopping
      </Link>
    </div>
  );
}
