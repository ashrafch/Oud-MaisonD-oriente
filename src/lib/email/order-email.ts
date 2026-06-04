import type { CartItem, CustomerDraft } from '@/lib/cart/store';
import { formatPrice } from '@/lib/cart/store';
import type { Product } from '@/types/catalog';

type OrderEmailInput = {
  orderId: string;
  customer: CustomerDraft;
  items: CartItem[];
  products: Product[];
  total: number;
  subtotal: number;
  discount: number;
  shipping: number;
};

export async function sendOrderEmails(input: OrderEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_EMAIL_FROM || 'OUDE Maison D Oriente <ordini@oude.example>';
  const ownerEmails = getOwnerEmails();
  if (!apiKey || ownerEmails.length === 0) return { skipped: true };

  const html = renderOrderHtml(input);
  const results = await Promise.allSettled([
    sendEmail({ apiKey, from, to: input.customer.email, subject: `Ordine ricevuto ${input.orderId}`, html }),
    sendEmail({ apiKey, from, to: ownerEmails, subject: `Nuovo ordine ${input.orderId}`, html })
  ]);
  results.forEach((result) => {
    if (result.status === 'rejected') console.error('Order email failed', result.reason);
  });
  return { skipped: false };
}

function getOwnerEmails() {
  const emails = [process.env.ORDER_NOTIFICATION_EMAIL]
    .flatMap((value) => value?.split(',') ?? [])
    .map((email) => email.trim())
    .filter(Boolean);
  return [...new Set(emails)];
}

async function sendEmail({
  apiKey,
  from,
  to,
  subject,
  html
}: {
  apiKey: string;
  from: string;
  to: string | string[];
  subject: string;
  html: string;
}) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ from, to, subject, html })
  });
  if (!response.ok) throw new Error(`Email non inviata: ${response.status}`);
}

function renderOrderHtml(input: OrderEmailInput) {
  const rows = input.items.map((item) => {
    const product = input.products.find((entry) => entry.id === item.productId);
    return `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;">${escapeHtml(product?.name ?? item.productId)} x ${item.quantity}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${formatPrice((product?.price ?? 0) * item.quantity)}</td></tr>`;
  }).join('');

  return `
    <div style="font-family:Arial,sans-serif;color:#231b17;line-height:1.6;">
      <h1 style="font-family:Georgia,serif;">Ordine ricevuto</h1>
      <p>Ciao ${escapeHtml(input.customer.fullName)}, abbiamo ricevuto la tua richiesta ordine.</p>
      <p><strong>Numero ordine:</strong> ${escapeHtml(input.orderId)}</p>
      <p>Il negozio verifichera disponibilita, dati di spedizione e modalita di pagamento. Riceverai conferma prima della preparazione.</p>
      <h2 style="font-family:Georgia,serif;">Riepilogo</h2>
      <table style="width:100%;border-collapse:collapse;">${rows}</table>
      <p>Subtotale: ${formatPrice(input.subtotal)}<br/>Sconto: -${formatPrice(input.discount)}<br/>Spedizione: ${input.shipping ? formatPrice(input.shipping) : 'Gratis'}<br/><strong>Totale: ${formatPrice(input.total)}</strong></p>
      <h2 style="font-family:Georgia,serif;">Spedizione</h2>
      <p>${escapeHtml(input.customer.address)}, ${escapeHtml(input.customer.zip)} ${escapeHtml(input.customer.city)}<br/>Telefono: ${escapeHtml(input.customer.phone)}</p>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char] ?? char);
}
