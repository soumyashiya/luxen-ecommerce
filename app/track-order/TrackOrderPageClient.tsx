"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  Mail,
  MapPin,
  Package,
  Search,
  Truck,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/sections/Footer";
import Eyebrow from "@/components/ui/Eyebrow";
import {
  ApiError,
  apiGetOrderByNumber,
  apiGetOrdersByEmail,
  type OrderRecord,
} from "@/lib/api";
import {
  formatMoney,
  formatOrderDate,
  orderNumberOf,
  pickNumber,
  pickString,
  statusTone,
  toneClasses,
} from "@/lib/orders";

type Mode = "number" | "email";
type OrderDetail = { order: OrderRecord; items: OrderRecord[]; payments: OrderRecord[] };

function StatusPill({ status }: { status: string }) {
  if (!status) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${toneClasses(
        statusTone(status),
      )}`}
    >
      {status}
    </span>
  );
}

function OrderDetailCard({ detail, onBack }: { detail: OrderDetail; onBack?: () => void }) {
  const { order, items, payments } = detail;
  const orderNumber = orderNumberOf(order);
  const status = pickString(order, "status");
  const paymentStatus = pickString(order, "payment_status", "paymentStatus");
  const tracking = pickString(order, "tracking_number", "trackingNumber");
  const currency = pickString(order, "currency") || "USD";
  const subtotal = pickNumber(order, "subtotal");
  const discount = pickNumber(order, "discount_amount", "discountAmount");
  const total = pickNumber(order, "total");
  const name = pickString(order, "customer_name", "customerName");
  const email = pickString(order, "customer_email", "customerEmail", "email");
  const address = pickString(order, "shipping_address", "address");
  const city = pickString(order, "shipping_city", "city");
  const postcode = pickString(order, "shipping_postcode", "postcode", "shipping_zip");
  const country = pickString(order, "shipping_country", "country");
  const date = formatOrderDate(order);
  const lastPayment = payments?.[0];

  return (
    <div className="mt-8 rounded-[28px] border border-black/10 bg-white p-6 sm:p-8">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-brand"
        >
          <ArrowLeft size={15} /> Back to results
        </button>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Order</p>
          <h2 className="text-2xl font-extrabold text-ink">#{orderNumber}</h2>
          {date && <p className="mt-1 text-sm text-muted">Placed {date}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill status={status} />
          <StatusPill status={paymentStatus} />
        </div>
      </div>

      {tracking && (
        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-surface p-4">
          <Truck size={18} className="shrink-0 text-brand" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted">
              Tracking number
            </p>
            <p className="text-sm font-bold text-ink">{tracking}</p>
          </div>
        </div>
      )}

      {items?.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-black/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface">
              <tr>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted">
                  Item
                </th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted">
                  Qty
                </th>
                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-muted">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i} className="border-t border-black/5">
                  <td className="px-4 py-3 font-semibold text-ink">
                    {pickString(it, "name", "title") || "Item"}
                  </td>
                  <td className="px-4 py-3 text-ink">{pickNumber(it, "quantity", "qty") || 1}</td>
                  <td className="px-4 py-3 text-right font-semibold text-ink">
                    {formatMoney(
                      pickNumber(it, "line_total", "total_price", "unit_price", "unitPrice"),
                      currency,
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="space-y-1 text-sm">
          <p className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span className="font-semibold text-ink">{formatMoney(subtotal, currency)}</span>
          </p>
          {discount > 0 && (
            <p className="flex justify-between text-muted">
              <span>Discount</span>
              <span className="font-semibold text-ink">-{formatMoney(discount, currency)}</span>
            </p>
          )}
          <p className="flex justify-between border-t border-black/10 pt-2 text-base font-bold text-ink">
            <span>Total</span>
            <span>{formatMoney(total, currency)}</span>
          </p>
          {lastPayment && (
            <p className="pt-1 text-xs text-muted">
              Payment via {pickString(lastPayment, "provider", "payment_method") || "manual"}
            </p>
          )}
        </div>

        {(name || address || city) && (
          <div className="space-y-1 text-sm">
            <p className="flex items-center gap-1.5 font-bold text-ink">
              <MapPin size={14} className="text-muted" /> Shipping to
            </p>
            {name && <p className="text-ink">{name}</p>}
            {email && <p className="text-muted">{email}</p>}
            {address && <p className="text-muted">{address}</p>}
            <p className="text-muted">
              {[city, postcode, country].filter(Boolean).join(", ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPageClient() {
  const [mode, setMode] = useState<Mode>("number");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [orderList, setOrderList] = useState<OrderRecord[] | null>(null);

  const reset = () => {
    setError(null);
    setDetail(null);
    setOrderList(null);
  };

  const loadOrder = async (orderNumber: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGetOrderByNumber(orderNumber);
      setDetail(res);
      setOrderList(null);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.status === 404
            ? "We couldn't find an order with that number. Double-check it and try again."
            : err.message
          : "Something went wrong looking up that order.",
      );
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    reset();

    if (mode === "number") {
      await loadOrder(trimmed);
      return;
    }

    setLoading(true);
    try {
      const res = await apiGetOrdersByEmail(trimmed);
      if (!res.orders?.length) {
        setError("No orders found for that email address.");
      } else {
        setOrderList(res.orders);
      }
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Something went wrong looking up your orders.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SiteHeader />

      <main id="main" className="pb-24 pt-28">
        <div className="container-luxen max-w-2xl">
          <Eyebrow>Account</Eyebrow>
          <h1 className="h-display mt-4 text-[clamp(2rem,4vw,3.2rem)]">Track Your Order</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            Look up your order status, tracking number, and shipment details using your order
            number, or find every order tied to your email address.
          </p>

          {/* Mode toggle */}
          <div className="mt-6 inline-flex rounded-full border border-black/10 bg-surface p-1">
            {(
              [
                { id: "number" as const, label: "Order Number" },
                { id: "email" as const, label: "Email Address" },
              ]
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setMode(t.id);
                  setQuery("");
                  reset();
                }}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                  mode === t.id ? "bg-brand text-white" : "text-muted hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type={mode === "email" ? "email" : "text"}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={mode === "number" ? "e.g. ORD-1001" : "you@example.com"}
                aria-label={mode === "number" ? "Order number" : "Email address"}
                required
                className="w-full rounded-full border border-black/10 bg-white py-3.5 pl-11 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-brand/40"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {mode === "number" ? "Track Order" : "Find Orders"}
            </button>
          </form>

          {error && (
            <div className="mt-5 flex items-start gap-2 rounded-2xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-600/20">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Order number result */}
          {detail && (
            <OrderDetailCard
              detail={detail}
              onBack={orderList ? () => setDetail(null) : undefined}
            />
          )}

          {/* Email result: list, or a single detail view when one is opened */}
          {orderList && !detail && (
            <div className="mt-8 space-y-3">
              {orderList.map((row, i) => {
                const num = orderNumberOf(row);
                const status = pickString(row, "status");
                const total = pickNumber(row, "total");
                const currency = pickString(row, "currency") || "USD";
                const date = formatOrderDate(row);
                return (
                  <button
                    key={num || i}
                    type="button"
                    onClick={() => loadOrder(num)}
                    className="flex w-full items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white p-5 text-left transition-colors hover:border-brand/40"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface text-brand">
                        <Package size={18} />
                      </span>
                      <div>
                        <p className="font-bold text-ink">#{num}</p>
                        {date && <p className="text-xs text-muted">{date}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusPill status={status} />
                      <span className="font-bold text-ink">{formatMoney(total, currency)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Fallback contact CTA */}
          <div className="mt-10 flex flex-col items-start gap-3 rounded-2xl border border-dashed border-black/15 p-5">
            <p className="text-sm text-muted">
              Can't find your order, or something looks off? Our support team can help directly.
            </p>
            <a
              href="mailto:support@luxen.co"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:underline"
            >
              <Mail size={15} /> support@luxen.co
            </a>
          </div>

          <Link
            href="/cart"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-brand"
          >
            <ArrowLeft size={14} /> Back to your cart
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
