'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { paymentCapture, type CaptureValidateResponse, ApiError } from '@/lib/api';
import { formatPrice } from '@/components/providers/CartProvider';

type UploadStatus = 'idle' | 'uploading' | 'received' | 'rejected' | 'pending';

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
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadError, setUploadError] = useState('');

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
    try {
      const res = await paymentCapture.upload(token, file);
      setUploadStatus(res.payment_status);
      if (res.verification_error) setUploadError(res.verification_error);
    } catch (err) {
      setUploadStatus('idle');
      setUploadError(err instanceof Error ? err.message : 'Upload failed.');
    }
  };

  if (loading) {
    return (
      <div className="container-wide flex min-h-[60vh] items-center justify-center py-24">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-charcoal/20 border-t-charcoal" />
      </div>
    );
  }

  if (loadError || !data) {
    return (
      <div className="container-wide flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <h1 className="text-section font-extralight tracking-tightest text-charcoal">
          Link unavailable
        </h1>
        <p className="mt-4 max-w-md text-base font-light text-charcoal/55">
          {loadError || 'Payment link not found.'}
        </p>
      </div>
    );
  }

  const order = data.order as Record<string, unknown>;
  const total = Number(order.total ?? 0);
  const orderNumber = String(order.order_number ?? '');

  return (
    <div className="container-wide max-w-3xl py-12 md:py-20">
      <span className="eyebrow">Complete payment</span>
      <h1 className="mt-3 text-display font-extralight tracking-tightest text-charcoal">
        Order {orderNumber}
      </h1>
      <p className="mt-3 text-sm font-light text-charcoal/55">
        Transfer the total below to the account, then upload a screenshot of
        your transfer to confirm.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <BankRow label="Payee" value={data.bank.payeeName} />
        <BankRow label="Reference" value={data.bank.reference} mono />
        <BankRow label="Sort code" value={data.bank.sortCode} mono />
        <BankRow label="Account number" value={data.bank.accountNumber} mono />
        <BankRow label="Amount" value={formatPrice(total)} highlight />
      </div>

      {data.allowPromo && (
        <div className="mt-10">
          <h2 className="text-[11px] uppercase tracking-eyebrow text-charcoal/40">
            Apply promo code
          </h2>
          <div className="mt-3 flex gap-2">
            <input
              value={promoInput}
              onChange={(e) => {
                setPromoInput(e.target.value);
                setPromoError('');
              }}
              placeholder="Promo code"
              className="min-w-0 flex-1 rounded-[4px] border border-charcoal/15 bg-ivory px-4 py-3 text-sm font-light uppercase tracking-wide text-charcoal outline-none focus:border-gold"
            />
            <button
              type="button"
              onClick={applyPromo}
              disabled={promoLoading}
              className="shrink-0 rounded-[4px] border border-charcoal/20 px-5 text-[13px] font-medium text-charcoal hover:border-charcoal/50 disabled:opacity-60"
            >
              {promoLoading ? 'Applying…' : 'Apply'}
            </button>
          </div>
          {promoError && (
            <p className="mt-2 text-[12px] font-light text-red-600/80">{promoError}</p>
          )}
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-[11px] uppercase tracking-eyebrow text-charcoal/40">
          Upload payment screenshot
        </h2>
        <p className="mt-3 text-sm font-light text-charcoal/55">
          PNG, JPG, or PDF · max 25 MB.
        </p>

        <input
          ref={fileRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-4 block w-full text-sm text-charcoal/65 file:mr-4 file:rounded-full file:border-0 file:bg-charcoal file:px-5 file:py-2.5 file:text-[13px] file:font-medium file:text-ivory hover:file:bg-gold"
        />

        {uploadError && (
          <p className="mt-3 rounded-[4px] border border-red-600/20 bg-red-600/5 px-4 py-3 text-[13px] font-light text-red-600/90">
            {uploadError}
          </p>
        )}

        {uploadStatus === 'received' && (
          <p className="mt-3 rounded-[4px] border border-gold/40 bg-gold/10 px-4 py-3 text-[13px] font-medium text-charcoal">
            Payment confirmed. Thank you — your order is being prepared.
          </p>
        )}
        {uploadStatus === 'pending' && (
          <p className="mt-3 rounded-[4px] border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-[13px] font-medium text-charcoal">
            Screenshot received. Verification is queued; we’ll email you with the result.
          </p>
        )}
        {uploadStatus === 'rejected' && (
          <p className="mt-3 rounded-[4px] border border-red-600/30 bg-red-600/5 px-4 py-3 text-[13px] font-medium text-red-600/90">
            We couldn’t verify this screenshot. Please re-upload a clearer image of the transfer.
          </p>
        )}

        <button
          type="button"
          onClick={uploadScreenshot}
          disabled={!file || uploadStatus === 'uploading' || uploadStatus === 'received'}
          className="mt-6 w-full rounded-full bg-charcoal py-4 text-sm font-medium text-ivory transition-colors duration-500 hover:bg-gold disabled:cursor-not-allowed disabled:opacity-70 md:w-auto md:px-10"
        >
          {uploadStatus === 'uploading' ? 'Uploading…' : 'Submit screenshot'}
        </button>
      </div>
    </div>
  );
}

function BankRow({
  label,
  value,
  mono = false,
  highlight = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-[6px] bg-cream px-5 py-4">
      <p className="text-[10px] uppercase tracking-wider text-charcoal/40">{label}</p>
      <p
        className={`mt-1 ${mono ? 'font-mono tracking-wide' : ''} ${
          highlight ? 'text-2xl font-light text-charcoal' : 'text-base font-medium text-charcoal'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
