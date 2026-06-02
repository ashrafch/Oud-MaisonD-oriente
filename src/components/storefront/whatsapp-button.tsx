import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '393331234567';
  return (
    <a aria-label="Contatta su WhatsApp" className="fixed bottom-5 right-5 z-40 rounded-full bg-sage p-4 text-white shadow-soft" href={`https://wa.me/${number}`}>
      <MessageCircle size={24} />
    </a>
  );
}
