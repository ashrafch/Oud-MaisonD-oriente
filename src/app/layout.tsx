import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: "OUDÉ Maison D'Oriente",
    template: "%s | OUDÉ Maison D'Oriente"
  },
  description: 'Ecommerce boutique per profumi arabi, oud, musk, attar, bakhoor e gift box.',
  openGraph: {
    title: "OUDÉ Maison D'Oriente",
    description: 'Profumi arabi selezionati, eleganti e accessibili.',
    images: ['/brand/oude-logo.jpg']
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
