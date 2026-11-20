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
  description: 'Scopri i profumi arabi di OUDÉ Maison D’Oriente: oud, note dolci e floreali. Acquista online o visita la boutique in Via Farini 26/D a Bologna.',
  openGraph: {
    title: "OUDE Maison D'Oriente",
    description: 'Profumi arabi, online e nella nostra boutique a Bologna. Scopri il catalogo e chiedici un consiglio.',
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
