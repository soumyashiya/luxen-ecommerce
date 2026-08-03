'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  AlertCircle,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Hash,
  Landmark,
  Loader2,
  Package,
  Tag,
  UploadCloud,
  Wallet,
  XCircle,
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/sections/Footer';
import Reveal from '@/components/ui/Reveal';
import { paymentCapture, type CaptureValidateResponse, ApiError } from '@/lib/api';
import { explainRejection } from '@/lib/paymentVerification';
import { formatUSD } from '@/lib/cart';
import { pick, pickNumber, pickString } from '@/lib/orders';
import { fadeUp, stagger } from '@/lib/motion';
import { cn } from '@/lib/utils';

type UploadStatus = 'idle' | 'uploading' | 'received' | 'rejected' | 'pending';

const INPUT =
  'w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-brand focus:outline-none';

export default function PaymentCapturePage() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const [data, setData] = useState<CaptureValidateResponse | null>(null);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadError, setUploadError] = useState('');
  const [rejectionReasons, setRejectionReasons] = useState<string[]>([]);
  const [screenshotUrl, setScreenshotUrl] = useState('');

  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    paymentCapture
      .validate(token)
      .then((res) => setData(res))
      .catch((err) => {
        const msg =
          err instanceof ApiError && (err.status === 400 || err.status === 404)
            ? 'This payment link is invalid or has expired.'
            : err instanceof Error
              ? err.message
              : 'Failed to load payment details.';
        setLoadError(msg);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const applyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    if (!code || promoLoading) return;
    setPromoLoading(true);
    setPromoError('');
    try {
      await paymentCapture.applyPromo(token, code);
      const fresh = await paymentCapture.validate(token);
      setData(fresh);
      setPromoInput('');
    } catch (err) {
      setPromoError(err instanceof Error ? err.message : 'Could not apply promo.');
    } finally {
      setPromoLoading(false);
    }
  };

  const uploadScreenshot = async () => {
    if (!file || uploadStatus === 'uploading') return;
    setUploadStatus('uploading');
    setUploadError('');
    setRejectionReasons([]);
    try {
      const res = await paymentCapture.upload(token, file);
      setUploadStatus(res.payment_status);
      setScreenshotUrl(res.screenshotUrl);
      if (res.verification_error) setUploadError(res.verification_error);
      if (res.payment_status === 'rejected') {
        setRejectionReasons(explainRejection(res.verification?.verdict.reasons));
      }
    } catch (err) {
      setUploadStatus('idle');
      setUploadError(err instanceof Error ? err.message : 'Upload failed.');
    }
  };

  const pickFile = (f: File | null | undefined) => {
    if (f) setFile(f);
  };

  const copyField = (key: string, value: string) => {
    navigator.clipboard?.writeText(value).then(() => {
      setCopiedField(key);
      setTimeout(() => setCopiedField((k) => (k === key ? null : k)), 1600);
    });
  };

  if (loading) {
    return (
      <>
        <SiteHeader />
        <main className="relative z-10 pt-28 lg:pt-32">
          <div className="container-luxen flex min-h-[50vh] items-center justify-center py-24">
            <Loader2 className="h-7 w-7 animate-spin text-brand" strokeWidth={2.4} />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (loadError || !data) {
    return (
      <>
        <SiteHeader />
        <main className="relative z-10 pt-28 lg:pt-32">
          <div className="container-luxen flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-red-50">
              <AlertCircle className="h-8 w-8 text-red-500" strokeWidth={2} />
            </div>
            <h1 className="h-display mt-6 text-3xl text-ink lg:text-4xl">Link unavailable</h1>
            <p className="mt-3 max-w-md text-sm text-muted">
              {loadError || 'Payment link not found.'}
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const order = data.order as Record<string, unknown>;
  const total = Number(order.total ?? 0);
  const orderNumber = String(order.order_number ?? '');

  if (uploadStatus === 'received') {
    return (
      <>
        <SiteHeader />
        <main className="relative z-10 pt-28 lg:pt-32">
          <div className="container-luxen flex min-h-[55vh] flex-col items-center justify-center py-24 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-brand/10">
              <CheckCircle2 className="h-8 w-8 text-brand" strokeWidth={2} />
            </div>
            <p className="mt-6 text-[0.65rem] uppercase tracking-[0.28em] text-brand">
              Order {orderNumber}
            </p>
            <h1 className="h-display mt-2 text-4xl text-ink lg:text-5xl">Payment confirmed</h1>
            <p className="mt-4 max-w-md text-sm text-muted">
              Thank you — your transfer was verified and your order is being prepared.
            </p>
            {screenshotUrl && (
              <a
                href={screenshotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-xs text-brand underline underline-offset-4 hover:text-brand-dark"
              >
                View uploaded screenshot ↗
              </a>
            )}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/track-order"
                className="rounded-full bg-brand px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark"
              >
                Track order
              </Link>
              <Link
                href="/"
                className="rounded-full border border-black/15 px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:border-brand/40"
              >
                Back to home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SiteHeader />

      <main className="relative z-10 pt-28 lg:pt-32">
        <div className="container-luxen pb-24">
          <Reveal>
            <div className="border-b border-black/10 pb-8">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-brand">
                Complete payment
              </p>
              <h1 className="h-display mt-2 text-4xl tracking-[-0.02em] text-ink lg:text-5xl">
                Order {orderNumber}
              </h1>
              <p className="mt-3 max-w-xl text-sm text-muted">
                Transfer the total below to the account, then upload a screenshot of your
                transfer so we can confirm it.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
            {/* Left — order summary + amount + bank details */}
            <div className="flex flex-col gap-6">
              {data.items.length > 0 && (
                <Reveal className="rounded-[var(--radius-xl2)] border border-black/10 bg-white p-6">
                  <h2 className="flex items-center gap-2 text-sm font-bold text-ink">
                    <Package size={15} className="text-brand" /> Order summary
                  </h2>
                  <ul className="mt-4 flex flex-col divide-y divide-black/5">
                    {data.items.map((it, i) => (
                      <li key={i} className="flex items-center justify-between gap-4 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-ink">
                            {pickString(it, 'name', 'title')}
                          </p>
                          <p className="text-xs text-muted">
                            Qty {pickNumber(it, 'quantity', 'qty') || 1} ·{' '}
                            {formatUSD(pickNumber(it, 'unit_price', 'unitPrice', 'price'))} each
                          </p>
                        </div>
                        <p className="shrink-0 text-sm text-ink">
                          {formatUSD(pickNumber(it, 'line_total', 'lineTotal') || pickNumber(it, 'unit_price', 'unitPrice', 'price') * (pickNumber(it, 'quantity', 'qty') || 1))}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-1 flex flex-col gap-2 border-t border-black/10 pt-4 text-sm">
                    {pick(order, 'subtotal') != null && (
                      <div className="flex justify-between text-muted">
                        <span>Subtotal</span>
                        <span>{formatUSD(pickNumber(order, 'subtotal'))}</span>
                      </div>
                    )}
                    {pickNumber(order, 'discount_amount', 'discountAmount') > 0 && (
                      <div className="flex justify-between text-muted">
                        <span>Discount</span>
                        <span>−{formatUSD(pickNumber(order, 'discount_amount', 'discountAmount'))}</span>
                      </div>
                    )}
                  </div>
                </Reveal>
              )}

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="rounded-[var(--radius-xl2)] bg-brand p-7 text-white"
              >
                <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/70">
                  <Wallet size={14} strokeWidth={2.4} /> Amount due
                </p>
                <p className="mt-3 text-4xl font-extrabold tracking-tight">{formatUSD(total)}</p>
              </motion.div>

              <motion.div
                variants={stagger(0.06)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="flex flex-col gap-3 rounded-[var(--radius-xl2)] border border-black/10 bg-surface p-6"
              >
                <BankRow
                  icon={Building2}
                  label="Payee"
                  value={data.bank.payeeName}
                  onCopy={() => copyField('payeeName', data.bank.payeeName)}
                  copied={copiedField === 'payeeName'}
                />
                <BankRow
                  icon={Hash}
                  label="Reference"
                  value={data.bank.reference}
                  mono
                  onCopy={() => copyField('reference', data.bank.reference)}
                  copied={copiedField === 'reference'}
                />
                <BankRow
                  icon={Landmark}
                  label="Sort code"
                  value={data.bank.sortCode}
                  mono
                  onCopy={() => copyField('sortCode', data.bank.sortCode)}
                  copied={copiedField === 'sortCode'}
                />
                <BankRow
                  icon={Hash}
                  label="Account number"
                  value={data.bank.accountNumber}
                  mono
                  onCopy={() => copyField('accountNumber', data.bank.accountNumber)}
                  copied={copiedField === 'accountNumber'}
                />
              </motion.div>

              {data.allowPromo && (
                <Reveal className="rounded-[var(--radius-xl2)] border border-black/10 bg-white p-6">
                  <h2 className="flex items-center gap-2 text-sm font-bold text-ink">
                    <Tag size={15} className="text-brand" /> Promo code
                  </h2>
                  <div className="mt-4 flex gap-2">
                    <input
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value);
                        setPromoError('');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          applyPromo();
                        }
                      }}
                      placeholder="Enter code"
                      className={cn(INPUT, 'uppercase tracking-wide')}
                    />
                    <button
                      type="button"
                      onClick={applyPromo}
                      disabled={promoLoading}
                      className="shrink-0 rounded-2xl border border-black/10 bg-white px-5 text-sm font-semibold text-ink transition-colors hover:border-brand/40 disabled:opacity-60"
                    >
                      {promoLoading ? '…' : 'Apply'}
                    </button>
                  </div>
                  {promoError && <p className="mt-2 text-xs text-red-600">{promoError}</p>}
                </Reveal>
              )}
            </div>

            {/* Right — upload proof */}
            <Reveal className="h-fit rounded-[var(--radius-xl2)] border border-black/10 bg-surface p-7 lg:sticky lg:top-28">
              <h2 className="flex items-center gap-2 text-xl font-bold text-ink">
                <UploadCloud size={20} className="text-brand" /> Upload payment screenshot
              </h2>
              <p className="mt-2 text-sm text-muted">PNG, JPG, or PDF · max 25 MB.</p>

              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  pickFile(e.dataTransfer.files?.[0]);
                }}
                className={cn(
                  'mt-5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors',
                  dragOver ? 'border-brand bg-brand/5' : 'border-black/15 bg-white hover:border-brand/40',
                )}
              >
                <UploadCloud
                  size={28}
                  strokeWidth={1.6}
                  className={dragOver ? 'text-brand' : 'text-muted'}
                />
                {file ? (
                  <p className="text-sm font-semibold text-ink">{file.name}</p>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-ink">
                      Drop your screenshot here, or browse
                    </p>
                    <p className="text-xs text-muted">Click to select a file</p>
                  </>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => pickFile(e.target.files?.[0])}
                  className="hidden"
                />
              </label>

              {uploadError && (
                <StatusBanner tone="error" icon={XCircle}>
                  {uploadError}
                </StatusBanner>
              )}
              {uploadStatus === 'pending' && (
                <StatusBanner tone="pending" icon={Clock}>
                  Screenshot received. Verification is queued; we&rsquo;ll email you with the
                  result.
                </StatusBanner>
              )}
              {uploadStatus === 'rejected' && (
                <StatusBanner tone="error" icon={XCircle}>
                  <p>
                    We couldn&rsquo;t verify this screenshot. Please re-upload a clearer image of
                    the transfer.
                  </p>
                  {rejectionReasons.length > 0 && (
                    <ul className="mt-2 list-disc space-y-1 pl-4">
                      {rejectionReasons.map((reason) => (
                        <li key={reason}>{reason}</li>
                      ))}
                    </ul>
                  )}
                </StatusBanner>
              )}

              <button
                type="button"
                onClick={uploadScreenshot}
                disabled={!file || uploadStatus === 'uploading'}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand py-4 text-sm font-bold uppercase tracking-wide text-white shadow-[0_8px_24px_-10px_rgba(0,131,195,0.7)] transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
              >
                {uploadStatus === 'uploading' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Uploading…
                  </>
                ) : (
                  'Submit screenshot'
                )}
              </button>
            </Reveal>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

function BankRow({
  icon: Icon,
  label,
  value,
  mono = false,
  onCopy,
  copied,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white px-4 py-3.5"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface text-brand">
          <Icon size={16} strokeWidth={2.2} />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-muted">{label}</p>
          <p className={cn('truncate text-sm font-semibold text-ink', mono && 'font-mono tracking-wide')}>
            {value}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onCopy}
        aria-label={`Copy ${label}`}
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-brand"
      >
        {copied ? <Check size={15} className="text-brand" /> : <Copy size={15} />}
      </button>
    </motion.div>
  );
}

function StatusBanner({
  tone,
  icon: Icon,
  children,
}: {
  tone: 'success' | 'pending' | 'error';
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) {
  const styles = {
    success: 'border-brand/30 bg-brand/5 text-ink',
    pending: 'border-amber-400/40 bg-amber-50 text-ink',
    error: 'border-red-300 bg-red-50 text-red-700',
  } as const;
  const iconColor = {
    success: 'text-brand',
    pending: 'text-amber-500',
    error: 'text-red-500',
  } as const;

  return (
    <div className={cn('mt-4 flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-[13px] font-medium', styles[tone])}>
      <Icon size={16} className={cn('mt-0.5 shrink-0', iconColor[tone])} />
      <span>{children}</span>
    </div>
  );
}
