import type { OrderRecord } from "@/lib/api";

/** Reads the first present key among several possible casings/aliases. */
export function pick(row: OrderRecord | null | undefined, ...keys: string[]): unknown {
  if (!row) return undefined;
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== "") return row[key];
  }
  return undefined;
}

export function pickString(row: OrderRecord | null | undefined, ...keys: string[]): string {
  const v = pick(row, ...keys);
  return v == null ? "" : String(v);
}

export function pickNumber(row: OrderRecord | null | undefined, ...keys: string[]): number {
  const v = pick(row, ...keys);
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : 0;
}

export function orderNumberOf(row: OrderRecord | null | undefined): string {
  return pickString(row, "order_number", "orderNumber", "orderId", "order_id");
}

export function formatMoney(amount: number, currency?: string): string {
  const symbol = currency && currency.toUpperCase() !== "USD" ? `${currency.toUpperCase()} ` : "$";
  return `${symbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatOrderDate(row: OrderRecord | null | undefined): string {
  const raw = pickString(row, "created_at", "createdAt", "createdAtIso");
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

type StatusTone = "neutral" | "good" | "warn" | "bad";

const STATUS_TONE: Record<string, StatusTone> = {
  pending: "warn",
  processing: "warn",
  paid: "good",
  received: "good",
  shipped: "good",
  delivered: "good",
  completed: "good",
  success: "good",
  cancelled: "bad",
  canceled: "bad",
  failed: "bad",
  declined: "bad",
  rejected: "bad",
  refunded: "neutral",
};

export function statusTone(status: string): StatusTone {
  return STATUS_TONE[status.trim().toLowerCase()] ?? "neutral";
}

export function toneClasses(tone: StatusTone): string {
  switch (tone) {
    case "good":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20";
    case "warn":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20";
    case "bad":
      return "bg-red-50 text-red-700 ring-1 ring-red-600/20";
    default:
      return "bg-surface text-muted ring-1 ring-black/10";
  }
}
