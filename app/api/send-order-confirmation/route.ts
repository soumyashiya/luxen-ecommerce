import { existsSync } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

// shared-email/ is deployed outside this project and sits at a different depth
// per environment: ../shared-email in a local checkout, but /var/www/shared-email
// on the VPS, where the app root is itself nested (/var/www/luxen/app/). A
// hardcoded relative import can only ever be correct in one of the two — the
// previous "5 dirs up" fix worked on the VPS at the cost of breaking every local
// build (and silently no-ops if the deployed layout doesn't actually match that
// guess). So resolve it at runtime by walking up from the app root until found.
//
// The import is dynamic and turbopackIgnore'd because Turbopack cannot resolve a
// computed specifier, and does not resolve modules outside its root at all.

type SendOrderConfirmationBody = {
  customer: { name: string; email: string };
  order: Record<string, unknown>;
};

type SendResult = {
  success: boolean;
  messageId?: string;
  provider?: string;
  error?: string;
};

type SharedEmailModule = {
  sendOrderConfirmationEmail: (params: {
    domain: string;
    customer: SendOrderConfirmationBody['customer'];
    order: SendOrderConfirmationBody['order'];
  }) => Promise<SendResult>;
};

function findSharedEmail(): string {
  let dir = process.cwd();
  for (;;) {
    const candidate = path.join(dir, 'shared-email', 'order-email.js');
    if (existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error(
        `shared-email/order-email.js not found in any ancestor of ${process.cwd()}`,
      );
    }
    dir = parent;
  }
}

let sharedEmail: Promise<SharedEmailModule> | null = null;

function loadSharedEmail(): Promise<SharedEmailModule> {
  sharedEmail ??= import(
    /* turbopackIgnore: true */ /* webpackIgnore: true */
    pathToFileURL(findSharedEmail()).href
  ) as Promise<SharedEmailModule>;
  return sharedEmail;
}

export async function POST(request: Request) {
  const { customer, order } = (await request.json()) as SendOrderConfirmationBody;

  let sendOrderConfirmationEmail: SharedEmailModule['sendOrderConfirmationEmail'];
  try {
    ({ sendOrderConfirmationEmail } = await loadSharedEmail());
  } catch (err) {
    // A missing shared-email/ is a deployment fault, not an upstream mail
    // failure — report it as such instead of hiding it behind a 502.
    const error = err instanceof Error ? err.message : String(err);
    console.error('[send-order-confirmation] shared-email not loadable:', error);
    return Response.json({ success: false, error }, { status: 500 });
  }

  const result = await sendOrderConfirmationEmail({
    domain: request.headers.get('host') ?? '',
    customer,
    order,
  });

  return Response.json(result, { status: result.success ? 200 : 502 });
}
