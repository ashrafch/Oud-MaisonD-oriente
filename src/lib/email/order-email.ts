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

  const customerHtml = renderCustomerOrderHtml(input);
  const ownerHtml = renderOwnerOrderHtml(input);
  const results = await Promise.allSettled([
    sendEmail({ apiKey, from, to: input.customer.email, subject: `Abbiamo ricevuto il tuo ordine ${input.orderId}`, html: customerHtml }),
    sendEmail({ apiKey, from, to: ownerEmails, subject: `Nuovo ordine da gestire ${input.orderId}`, html: ownerHtml })
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

function renderCustomerOrderHtml(input: OrderEmailInput) {
  const rows = input.items.map((item) => {
    const product = findProduct(input.products, item.productId);
    return `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;">${escapeHtml(product?.name ?? item.productId)} x ${item.quantity}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${formatPrice((product?.price ?? 0) * item.quantity)}</td></tr>`;
  }).join('');

  return `
    <div style="margin:0;background:#fbf5ec;padding:28px 16px;font-family:Arial,sans-serif;color:#231b17;line-height:1.6;">
      <div style="max-width:620px;margin:0 auto;background:#fffaf2;border:1px solid #eadcc8;padding:28px;">
      <p style="margin:0 0 12px;text-transform:uppercase;letter-spacing:2px;font-size:12px;color:#741d12;font-weight:700;">OUDE Maison D Oriente</p>
      <h1 style="margin:0 0 18px;font-family:Georgia,serif;font-size:32px;line-height:1.1;">Ordine ricevuto</h1>
      <p>Ciao ${escapeHtml(input.customer.fullName)}, grazie per la tua richiesta ordine.</p>
      <p><strong>Numero ordine:</strong> ${escapeHtml(input.orderId)}</p>
      <p>Il negozio verifichera disponibilita dei prodotti, dati di spedizione e modalita di pagamento. Riceverai una conferma prima della preparazione.</p>
      <h2 style="font-family:Georgia,serif;font-size:24px;">Riepilogo ordine</h2>
      <table style="width:100%;border-collapse:collapse;">${rows}</table>
      <p>Subtotale: ${formatPrice(input.subtotal)}<br/>Sconto: -${formatPrice(input.discount)}<br/>Spedizione: ${input.shipping ? formatPrice(input.shipping) : 'Gratis'}<br/><strong>Totale: ${formatPrice(input.total)}</strong></p>
      <h2 style="font-family:Georgia,serif;font-size:24px;">Spedizione</h2>
      <p>${escapeHtml(input.customer.address)}, ${escapeHtml(input.customer.zip)} ${escapeHtml(input.customer.city)}<br/>Telefono: ${escapeHtml(input.customer.phone)}</p>
      <p style="margin-top:24px;color:#6b5a52;font-size:14px;">Questa email conferma la ricezione della richiesta. Il pagamento online non e ancora attivo: il negozio ti contattera per completare l ordine.</p>
      </div>
    </div>
  `;
}

function renderOwnerOrderHtml(input: OrderEmailInput) {
  const rows = input.items.map((item) => {
    const product = findProduct(input.products, item.productId);
    return `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;">${escapeHtml(product?.name ?? item.productId)}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${formatPrice((product?.price ?? 0) * item.quantity)}</td></tr>`;
  }).join('');

  return `
    <div style="font-family:Arial,sans-serif;color:#231b17;line-height:1.6;">
      <h1 style="font-family:Georgia,serif;">Nuovo ordine da gestire</h1>
      <p><strong>Numero ordine:</strong> ${escapeHtml(input.orderId)}</p>
      <p><strong>Cliente:</strong> ${escapeHtml(input.customer.fullName)}<br/>
      <strong>Email:</strong> ${escapeHtml(input.customer.email)}<br/>
      <strong>Telefono:</strong> ${escapeHtml(input.customer.phone)}</p>
      <p><strong>Indirizzo:</strong> ${escapeHtml(input.customer.address)}, ${escapeHtml(input.customer.zip)} ${escapeHtml(input.customer.city)}</p>
      ${input.customer.notes ? `<p><strong>Note cliente:</strong><br/>${escapeHtml(input.customer.notes)}</p>` : ''}
      <h2 style="font-family:Georgia,serif;">Prodotti</h2>
      <table style="width:100%;border-collapse:collapse;">
        <thead><tr><th style="text-align:left;">Prodotto</th><th>Qta</th><th style="text-align:right;">Totale</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p>Subtotale: ${formatPrice(input.subtotal)}<br/>Sconto: -${formatPrice(input.discount)}<br/>Spedizione: ${input.shipping ? formatPrice(input.shipping) : 'Gratis'}<br/><strong>Totale: ${formatPrice(input.total)}</strong></p>
      <div style="margin-top:20px;padding:14px;background:#fbf5ec;border:1px solid #eadcc8;">
        <strong>Azioni consigliate:</strong>
        <ol>
          <li>Verificare disponibilita prodotti.</li>
          <li>Confermare indirizzo e modalita di pagamento con il cliente.</li>
          <li>Aggiornare lo stato ordine nel pannello admin.</li>
        </ol>
      </div>
    </div>
  `;
}

function findProduct(products: Product[], productId: string) {
  return products.find((entry) => entry.id === productId || entry.slug === productId);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char] ?? char);
}
