/* ---------------------------------------------------------------------------
   API client for https://www.microservices.tech
   Base URL is overridable via NEXT_PUBLIC_API_URL. Auth is a JWT bearer token
   stored in localStorage (30-day expiry, HS256). Only the wallet/affiliate/
   auth-verify endpoints strictly require the token — but we send it on every
   request when present so future protected routes just work.
--------------------------------------------------------------------------- */

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://www.microservices.tech";
  // "http://localhost:5003";

export const TOKEN_KEY = "luxen-auth-token";
export const USER_KEY = "luxen-auth-user";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  date_of_birth?: string | null;
  nationality?: string | null;
  country_of_residence?: string | null;
  role?: string;
};

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable */
  }
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(USER_KEY);
  } catch {
    /* storage unavailable */
  }
}

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/** Extract a human message from any of the doc's error envelopes. */
function extractErrorMessage(data: unknown, status: number): string {
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    for (const key of ["error", "message"] as const) {
      const v = d[key];
      if (typeof v === "string" && v.trim()) return v;
    }
  }
  return `Request failed (${status})`;
}

type FetchOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | object | null;
  /** Aborts the request after this many ms. Default 20s; raise for slow endpoints (e.g. screenshot upload + OCR). */
  timeoutMs?: number;
};

const DEFAULT_TIMEOUT_MS = 20_000;

export async function apiFetch<T = unknown>(
  path: string,
  { body, headers: hIn, timeoutMs = DEFAULT_TIMEOUT_MS, signal, ...rest }: FetchOptions = {},
): Promise<T> {
  const headers = new Headers(hIn);
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let finalBody: BodyInit | null | undefined;
  if (body == null) {
    finalBody = null;
  } else if (
    body instanceof FormData ||
    body instanceof Blob ||
    body instanceof ArrayBuffer ||
    body instanceof URLSearchParams ||
    typeof body === "string"
  ) {
    finalBody = body as BodyInit;
  } else {
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    finalBody = JSON.stringify(body);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener("abort", () => controller.abort());
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...rest,
      headers,
      body: finalBody,
      signal: controller.signal,
    });
  } catch (err) {
    const aborted = (err instanceof DOMException && err.name === "AbortError") || controller.signal.aborted;
    throw new ApiError(
      aborted ? `Request timed out after ${Math.round(timeoutMs / 1000)}s` : err instanceof Error ? err.message : "Network error",
      0,
      null,
    );
  } finally {
    clearTimeout(timer);
  }

  const ct = res.headers.get("content-type") || "";
  let data: unknown = null;
  if (ct.includes("application/json")) {
    data = await res.json().catch(() => null);
  } else {
    const text = await res.text().catch(() => "");
    data = text || null;
  }

  if (!res.ok) throw new ApiError(extractErrorMessage(data, res.status), res.status, data);
  return data as T;
}

/* ---------- Endpoint wrappers ---------------------------------------- */

/** `POST /api/auth/register` */
export function apiRegister(body: {
  name: string;
  email: string;
  password: string;
  date_of_birth: string; // YYYY-MM-DD
  nationality: string;
  country_of_residence: string;
}) {
  return apiFetch<{ success: true; token: string; user: AuthUser }>(
    "/api/auth/register",
    { method: "POST", body },
  );
}

/** `POST /api/auth/login` */
export function apiLogin(email: string, password: string) {
  return apiFetch<{ success: true; token: string; user: AuthUser }>(
    "/api/auth/login",
    { method: "POST", body: { email, password } },
  );
}

/** `GET /api/auth/verify` — requires bearer */
export function apiVerify() {
  return apiFetch<{ success: true; user: AuthUser }>("/api/auth/verify");
}

/** `POST /api/auth/forgot-password` */
export function apiForgotPassword(email: string) {
  return apiFetch<{ success: true; message: string }>(
    "/api/auth/forgot-password",
    { method: "POST", body: { email } },
  );
}

/** `POST /api/promos/validate` */
export function apiValidatePromo(code: string) {
  return apiFetch<{ ok: true; valid: true; percent: number }>(
    "/api/promos/validate",
    { method: "POST", body: { code } },
  );
}

export type UserOrderItem = {
  name: string;
  quantity: number;
  unitPrice: number;
  sku: string;
};

export type UserOrderInput = {
  email: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
  itemsArray: UserOrderItem[];
  subtotal: number;
  discountAmount: number;
  total: number;
  promoCode: string | null;
  promoDiscount?: number;
  payment_method: "manual";
};

export type UserOrderResultItem = {
  name: string;
  sku: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type UserOrderResult = {
  success: true;
  orderId: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostcode: string;
  shippingCountry: string;
  currency: string;
  subtotal: number;
  discountAmount: number;
  total: number;
  items: UserOrderResultItem[];
  email_debug?: unknown;
};

/** `POST /api/user-orders` — details-only intake (no on-site payment) */
export function apiCreateUserOrder(input: UserOrderInput) {
  return apiFetch<UserOrderResult>("/api/user-orders", {
    method: "POST",
    body: input,
  });
}

/** `POST /api/newsletter/subscribe` — 5/IP/hour. `website` is a honeypot. */
export function apiNewsletterSubscribe(input: {
  email: string;
  consent: boolean;
  source?: string;
  website?: string;
}) {
  return apiFetch<{ ok: true; id?: number; already_subscribed?: boolean }>(
    "/api/newsletter/subscribe",
    { method: "POST", body: input },
  );
}

/* Order rows are returned straight from the DB — field casing/shape isn't
   pinned down in the API docs beyond the examples, so callers read them
   defensively (see lib/orders.ts `pick`). */
export type OrderRecord = Record<string, unknown>;

/** `GET /api/user-orders/:orderNumber` — full order + items + payments, no auth. */
export function apiGetOrderByNumber(orderNumber: string) {
  return apiFetch<{ order: OrderRecord; items: OrderRecord[]; payments: OrderRecord[] }>(
    `/api/user-orders/${encodeURIComponent(orderNumber)}`,
  );
}

/** `GET /api/user-orders/by-email` — up to 200 orders, newest first, no auth. */
export function apiGetOrdersByEmail(email: string) {
  return apiFetch<{ orders: OrderRecord[] }>(
    `/api/user-orders/by-email?email=${encodeURIComponent(email)}`,
  );
}

/* ---------- Manual payment capture (bank-transfer flow) --------------- */
/* Token-authorized (no bearer). See API_DOCUMENTATION (3).md §8.        */

export type BankDetails = {
  payeeName: string;
  sortCode: string;
  accountNumber: string;
  reference: string;
};

export type CaptureValidateResponse = {
  ok: true;
  order: OrderRecord;
  items: OrderRecord[];
  payments: OrderRecord[];
  allowPromo: boolean;
  bank: BankDetails;
};

export type CaptureApplyPromoResponse = {
  ok: true;
  promoCode: string;
  promoDiscountPercent: number;
  discountAmount: number;
  total: number;
};

/* Raw response body from the payment-verification microservice (see payment.md),
   forwarded as-is inside `CaptureUploadResponse.verification`. `null` when that
   service was unreachable (payment_status "pending" in that case). */
export type VerificationVerdict = {
  decision: "approved" | "rejected";
  probability: number;
  reasons: string[];
  extracted: {
    amount_candidates: number[];
    best_amount: number | null;
    expected_total: number;
    payee_expected: string;
    sort_code_expected: string;
    account_number_expected: string;
    ocr_avg_conf: number;
  };
};

export type VerificationResult = {
  order: { id: number; order_number: string; customer_email: string; total: number };
  screenshot: { filename: string; path: string };
  verdict: VerificationVerdict;
};

export type CaptureUploadResponse = {
  ok: true;
  screenshotUrl: string;
  screenshotFilename: string;
  verification: VerificationResult | null;
  payment_status: "received" | "rejected" | "pending";
  verification_error?: string;
};

export const paymentCapture = {
  /** `POST /api/payment-capture/validate` */
  validate(token: string) {
    return apiFetch<CaptureValidateResponse>("/api/payment-capture/validate", {
      method: "POST",
      body: { token },
    });
  },
  /** `POST /api/payment-capture/apply-promo` */
  applyPromo(token: string, promoCode: string) {
    return apiFetch<CaptureApplyPromoResponse>("/api/payment-capture/apply-promo", {
      method: "POST",
      body: { token, promoCode },
    });
  },
  /** `POST /api/payment-capture/upload` — multipart */
  upload(token: string, file: File) {
    const formData = new FormData();
    formData.append("token", token);
    formData.append("paymentScreenshot", file);
    return apiFetch<CaptureUploadResponse>("/api/payment-capture/upload", {
      method: "POST",
      body: formData,
      timeoutMs: 60_000,
    });
  },
};
