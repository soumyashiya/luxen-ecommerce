/* Human-readable copy for the `verdict.reasons` codes returned by the
   payment-verification microservice (see payment.md). Only the codes that
   explain a rejection are listed — positive/match codes aren't shown to the
   customer. */
export const REJECTION_REASON_LABELS: Record<string, string> = {
  amount_mismatch: "The amount in the screenshot didn't match your order total.",
  payee_missing_or_mismatch: "We couldn't find the payee name in the screenshot.",
  sort_code_not_found: "We couldn't find the sort code in the screenshot.",
  account_number_not_found: "We couldn't find the account number in the screenshot.",
  bank_signals_missing: "The screenshot doesn't look like a bank transfer confirmation.",
  ocr_confidence_low: "The image was too blurry or low-resolution to read clearly.",
};

/** Filters a verdict's `reasons` down to the ones worth showing a customer. */
export function explainRejection(reasons: string[] | undefined): string[] {
  if (!reasons) return [];
  return reasons.map((r) => REJECTION_REASON_LABELS[r]).filter((label): label is string => Boolean(label));
}
