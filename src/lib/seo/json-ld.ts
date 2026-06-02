import type { Product } from '@/types/catalog';

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: "OUDÉ Maison D'Oriente",
    address: 'Via Farini 26/D, 40124 Bologna',
    url: process.env.NEXT_PUBLIC_SITE_URL
  };
}

export function productJsonLd(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    brand: product.brand,
    image: product.image,
    description: product.shortDescription,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
    }
  };
}
