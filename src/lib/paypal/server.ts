type PayPalEnvironment = 'sandbox' | 'live';

type PayPalRequestOptions = {
  method?: 'GET' | 'POST';
  path: string;
  body?: unknown;
};

export function isPayPalConfigured() {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

export function getPayPalEnvironment(): PayPalEnvironment {
  return process.env.PAYPAL_ENVIRONMENT === 'live' ? 'live' : 'sandbox';
}

export function getPayPalBaseUrl() {
  return getPayPalEnvironment() === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
}

export async function paypalRequest<T>({ method = 'POST', path, body }: PayPalRequestOptions): Promise<T> {
  const accessToken = await getPayPalAccessToken();
  const response = await fetch(`${getPayPalBaseUrl()}${path}`, {
    method,
    headers: {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(getPayPalErrorMessage(payload, response.status));
  }
  return payload as T;
}

export async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error('PayPal non configurato');

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      authorization: `Basic ${credentials}`,
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  const payload = await response.json().catch(() => null) as { access_token?: string; error_description?: string } | null;
  if (!response.ok || !payload?.access_token) {
    throw new Error(payload?.error_description ?? 'Token PayPal non ottenuto');
  }
  return payload.access_token;
}

export function paypalAmount(value: number) {
  return Math.max(0, value).toFixed(2);
}

function getPayPalErrorMessage(payload: unknown, status: number) {
  if (typeof payload === 'object' && payload && 'message' in payload && typeof payload.message === 'string') return payload.message;
  return `Errore PayPal ${status}`;
}
