"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/sections/Footer";
import { useCart, formatUSD } from "@/lib/cart";
import { ApiError, apiCreateUserOrder, apiValidatePromo } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const COUNTRIES = [
  "United Kingdom",
  "Ireland",
  "France",
  "Germany",
  "Netherlands",
  "Spain",
  "Other (EU)",
];

const INPUT =
  "by-field placeholder:text-pink/50";

type OrderResult = {
  orderNumber: string;
  total: number;
  customerName: string;
  customerEmail: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, clear } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    postcode: "",
    country: "United Kingdom",
  });

  // Prefill from signed-in user (best-effort — user shape may only expose "name")
  useEffect(() => {
    if (!user) return;
    setForm((f) => {
      const patch: Partial<typeof f> = {};
      if (!f.email && user.email) patch.email = user.email;
      if (!f.firstName && !f.lastName && user.name) {
        const [first, ...rest] = user.name.trim().split(/\s+/);
        patch.firstName = first ?? "";
        patch.lastName = rest.join(" ");
      }
      if (!f.phone && user.phone) patch.phone = user.phone;
      if (!f.country && user.country_of_residence) patch.country = user.country_of_residence;
      return Object.keys(patch).length ? { ...f, ...patch } : f;
    });
  }, [user]);

  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<{ code: string; percent: number } | null>(null);
  const [promoMsg, setPromoMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);
  const [placing, setPlacing] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const discount = promo ? Math.round((subtotal * promo.percent) / 100 * 100) / 100 : 0;
  const total = Math.max(0, subtotal - discount);

  // Redirect to cart if empty
  useEffect(() => {
    if (lines.length === 0 && !showModal) {
      const t = setTimeout(() => router.push("/cart"), 200);
      return () => clearTimeout(t);
    }
  }, [lines.length, router, showModal]);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const [promoBusy, setPromoBusy] = useState(false);
  const applyPromo = async () => {
    const code = promoInput.trim();
    if (!code) {
      setPromoMsg({ tone: "err", text: "Enter a code." });
      return;
    }
    setPromoBusy(true);
    setPromoMsg(null);
    try {
      const res = await apiValidatePromo(code);
      setPromo({ code: code.toUpperCase(), percent: res.percent });
      setPromoMsg({ tone: "ok", text: `${res.percent}% off applied.` });
    } catch (err) {
      setPromo(null);
      if (err instanceof ApiError && err.status === 404) {
        setPromoMsg({ tone: "err", text: "Invalid code." });
      } else {
        setPromoMsg({
          tone: "err",
          text: err instanceof ApiError ? err.message : "Could not validate code.",
        });
      }
    } finally {
      setPromoBusy(false);
    }
  };

  const removePromo = () => {
    setPromo(null);
    setPromoInput("");
    setPromoMsg(null);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setPlacing(true);
    try {
      const line1 = form.address1.trim();
      const line2 = form.address2.trim();
      const res = await apiCreateUserOrder({
        email: form.email.trim(),
        customerName: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
        phone: form.phone.trim(),
        address: line2 ? `${line1}, ${line2}` : line1,
        city: form.city.trim(),
        postcode: form.postcode.trim(),
        country: form.country,
        itemsArray: lines.map((l) => ({
          name: l.product.title,
          quantity: l.qty,
          unitPrice: l.product.price,
          sku: l.product.slug,
        })),
        subtotal,
        discountAmount: discount,
        total,
        promoCode: promo?.code ?? null,
        promoDiscount: promo?.percent,
        payment_method: "manual",
      });

      // Fires the shared-email order confirmation using the order details the
      // backend echoes back — not the raw form fields — so the email always
      // reflects what was actually persisted. Best-effort: a failure here
      // must never surface as a checkout error.
      fetch("/api/send-order-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: res.customerName, email: res.customerEmail },
          order: {
            orderNumber: res.orderNumber,
            currency: res.currency,
            items: res.items.map((it) => ({
              name: it.name,
              quantity: it.quantity,
              price: it.unitPrice,
            })),
            subtotal: res.subtotal,
            shipping: 0,
            tax: 0,
            discount: res.discountAmount,
            total: res.total,
            shippingAddress: [
              res.shippingAddress,
              res.shippingCity,
              res.shippingPostcode,
              res.shippingCountry,
            ]
              .filter(Boolean)
              .join(", "),
          },
        }),
      }).catch((err) => console.error("[checkout] order confirmation email failed:", err));

      setOrderResult({
        orderNumber: res.orderNumber,
        total: res.total,
        customerName: res.customerName,
        customerEmail: res.customerEmail,
      });
      setShowModal(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not place your order. Please check your details and try again.",
      );
    } finally {
      setPlacing(false);
    }
  };

  const closeAndContinue = () => {
    setShowModal(false);
    clear();
    router.push("/");
  };

  return (
    <>
      <SiteHeader />

      <main className="relative z-10 bg-pale pb-20 pt-10">
        <div className="by-page pb-24">
          {/* Header */}
          <div className="border-b border-pink/20 pb-8">
            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-pink">Checkout</p>
            <h1 className="by-h-product mt-2">
              Complete your order
            </h1>
            <Link
              href="/cart"
              className="mt-3 inline-block text-sm text-pink hover:text-pink-dark"
            >
              ← Back to cart
            </Link>
          </div>

          {/* Research-only compliance banner */}
          <div className="mt-6 rounded-[12px] border-l-4 border-pink bg-yellow p-4 text-sm leading-relaxed text-pink">
            <p className="font-bold uppercase tracking-wide text-pink">
              Research reference material
            </p>
            <p className="mt-1 text-pink/75">
              By proceeding with this purchase, you acknowledge that these products are intended
              solely for laboratory research purposes and are not intended for human or veterinary
              use. These products are not intended to diagnose, treat, cure, or prevent any
              disease.
            </p>
          </div>

          <form onSubmit={submit} className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
            {/* Left — form */}
            <div className="flex flex-col gap-10">
              <section>
                <h2 className="text-xl font-bold text-pink">Contact</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <input
                    className={INPUT}
                    required
                    maxLength={50}
                    placeholder="First name"
                    value={form.firstName}
                    onChange={(e) => set("firstName", e.target.value)}
                  />
                  <input
                    className={INPUT}
                    required
                    maxLength={50}
                    placeholder="Last name"
                    value={form.lastName}
                    onChange={(e) => set("lastName", e.target.value)}
                  />
                  <input
                    className={INPUT}
                    required
                    maxLength={50}
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                  <input
                    className={INPUT}
                    required
                    maxLength={50}
                    type="tel"
                    placeholder="Mobile number"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                  />
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-pink">Delivery address</h2>
                <div className="mt-5 grid gap-4">
                  <input
                    className={INPUT}
                    required
                    maxLength={100}
                    placeholder="Address line 1"
                    value={form.address1}
                    onChange={(e) => set("address1", e.target.value)}
                  />
                  <input
                    className={INPUT}
                    maxLength={100}
                    placeholder="Address line 2 (optional)"
                    value={form.address2}
                    onChange={(e) => set("address2", e.target.value)}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      className={INPUT}
                      required
                      maxLength={50}
                      placeholder="City"
                      value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                    />
                    <input
                      className={INPUT}
                      required
                      maxLength={20}
                      placeholder="Postcode"
                      value={form.postcode}
                      onChange={(e) => set("postcode", e.target.value)}
                    />
                  </div>
                  <select
                    className={INPUT}
                    value={form.country}
                    onChange={(e) => set("country", e.target.value)}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </section>

              <p className="text-xs text-pink/75">
                For laboratory R&amp;D use only · Not for human or veterinary consumption.
              </p>
            </div>

            {/* Right — summary */}
            <aside className="h-fit rounded-[var(--radius-xl2)] border border-pink/20 bg-yellow p-7 lg:sticky lg:top-28">
              <h2 className="text-xl font-bold text-pink">Order summary</h2>

              <ul className="mt-6 flex flex-col gap-4 border-b border-pink/20 pb-6">
                {lines.map((l) => (
                  <li key={l.product.slug} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0">
                      <div className="h-full w-full overflow-hidden rounded-[7px] border border-pink/20 bg-pale">
                        <Image
                          src={l.product.card ?? l.product.img}
                          alt={l.product.title}
                          width={64}
                          height={64}
                          className="h-full w-full object-contain p-1.5"
                        />
                      </div>
                      <span className="absolute -right-2 -top-2 z-10 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-ink px-1 text-[0.65rem] font-semibold text-yellow shadow-sm ring-2 ring-surface">
                        {l.qty}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-pink">{l.product.title}</p>
                      <p className="text-xs text-pink/75">Research peptide</p>
                    </div>
                    <p className="text-sm text-pink">{formatUSD(l.lineTotal)}</p>
                  </li>
                ))}
              </ul>

              {/* Discount */}
              <div className="mt-5">
                {promo ? (
                  <div className="flex items-center justify-between rounded-[12px] border border-pink/30 bg-pale px-4 py-3 text-sm">
                    <span className="text-pink">
                      <span className="font-semibold">{promo.code}</span>{" "}
                      <span className="text-pink/75">· {promo.percent}% off</span>
                    </span>
                    <button
                      type="button"
                      onClick={removePromo}
                      className="text-xs uppercase tracking-[0.2em] text-pink/75 hover:text-pink"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex items-stretch gap-2">
                    <input
                      className={INPUT}
                      placeholder="Discount code"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          applyPromo();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={applyPromo}
                      disabled={promoBusy}
                      className="rounded-[12px] border border-pink/20 bg-pale px-5 text-sm text-pink transition-colors hover:border-pink/40 disabled:opacity-60"
                    >
                      {promoBusy ? "…" : "Apply"}
                    </button>
                  </div>
                )}
                {promoMsg && (
                  <p
                    className={`mt-2 text-xs ${
                      promoMsg.tone === "ok" ? "text-pink" : "text-red-600"
                    }`}
                  >
                    {promoMsg.text}
                  </p>
                )}
              </div>

              {/* Totals */}
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-pink/75">Subtotal</dt>
                  <dd className="text-pink">{formatUSD(subtotal)}</dd>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-pink/75">Discount</dt>
                    <dd className="text-pink">−{formatUSD(discount)}</dd>
                  </div>
                )}
                <div className="my-4 h-px bg-pink/15" />
                <div className="flex justify-between text-lg font-bold">
                  <dt className="text-pink">Total</dt>
                  <dd className="text-pink">{formatUSD(total)}</dd>
                </div>
              </dl>

              {error && (
                <p className="mt-4 rounded-[12px] border border-red-300 bg-red-50 px-4 py-2 text-xs text-red-700">
                  {error}
                </p>
              )}

              <p className="mt-6 text-[11px] leading-relaxed text-pink/75">
                By placing this order you acknowledge that these products are research reference
                material, intended solely for laboratory research and not for human or veterinary
                use. They are not intended to diagnose, treat, cure, or prevent any disease.
              </p>

              <button
                type="submit"
                disabled={placing || lines.length === 0}
                className="by-btn mt-4 w-full"
              >
                {placing ? "Placing order…" : "Place Order"}
              </button>

              <Link
                href="/cart"
                className="mt-4 block text-center text-sm text-pink hover:text-pink-dark"
              >
                Back to cart
              </Link>
            </aside>
          </form>
        </div>
      </main>

      <Footer />

      {/* Order placed modal */}
      <AnimatePresence>
        {showModal && orderResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
            onClick={closeAndContinue}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md overflow-hidden rounded-[var(--radius-xl2)] bg-pale p-8 text-center shadow-[0_40px_80px_-20px_rgba(0,131,195,0.35)]"
            >
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-pink text-yellow">
                <Check size={28} strokeWidth={3} />
              </div>
              <h3 className="by-h-section mt-6">Order placed</h3>
              <p className="mt-2 text-sm text-pink/75">
                Thanks {orderResult.customerName.split(" ")[0] || "researcher"} — we&apos;ve received
                your order. A confirmation will be sent to{" "}
                <span className="text-pink">{orderResult.customerEmail || "your inbox"}</span>.
              </p>

              <div className="mt-6 rounded-[12px] border border-pink/20 bg-yellow p-4 text-left">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-pink/75">
                  <span>Order #</span>
                  <span className="text-pink">{orderResult.orderNumber}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-base font-bold">
                  <span className="text-pink">Order total</span>
                  <span className="text-pink">{formatUSD(orderResult.total)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={closeAndContinue}
                className="by-btn mt-7 w-full"
              >
                Continue shopping
              </button>

              <p className="mt-5 text-[0.65rem] uppercase tracking-[0.22em] text-pink/75">
                For laboratory R&amp;D use only
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
