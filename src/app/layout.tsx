import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';

const sans = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: "OUDE Maison D'Oriente",
    template: "%s | OUDE Maison D'Oriente"
  },
  description: 'Ecommerce boutique per profumi arabi, oud, musk, attar, bakhoor e gift box.',
  openGraph: {
    title: "OUDE Maison D'Oriente",
    description: 'Profumi arabi selezionati, eleganti e accessibili.',
    images: ['/brand/oude-logo.jpg']
  },
  manifest: '/manifest.json'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${sans.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
