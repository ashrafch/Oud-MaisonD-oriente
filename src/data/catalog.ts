import type { Category, Product } from '@/types/catalog';

export const categories: Category[] = [
  { name: 'Uomo', slug: 'uomo', description: 'Fragranze maschili decise, legnose e strutturate.' },
  { name: 'Donna', slug: 'donna', description: 'Fragranze femminili eleganti, floreali e sensuali.' },
  { name: 'Unisex', slug: 'unisex', description: 'Fragranze versatili e contemporanee per lui e per lei.' },
  { name: 'Oud & Legnosi', slug: 'oud', description: 'Oud, legni preziosi e scie orientali intense.' },
  { name: 'Gourmand & Dolci', slug: 'gourmand', description: 'Vaniglia, caramello, datteri e note golose avvolgenti.' },
  { name: 'Set Regalo', slug: 'set-regalo', description: 'Cofanetti e idee regalo curate.' },
  { name: 'Casa & Profumatori', slug: 'casa', description: 'Profumatori per ambienti e bakhoor per la casa.' }
];

export const products: Product[] = [
  {
    id: 'oud-sultan',
    slug: 'oud-sultan',
    name: 'Oud Sultan',
    brand: 'OUDÉ Selection',
    price: 89,
    compareAtPrice: 109,
    category: 'oud',
    categories: ['oud'],
    image: '/brand/botanical-identity.jpg',
    stock: 12,
    intensity: 'Intenso',
    duration: '8-10 ore',
    gender: 'unisex',
    tags: ['bestseller', 'luxury'],
    shortDescription: 'Oud caldo e regale con ambra, spezie scure e legno levigato.',
    notes: { top: ['Zafferano', 'Pepe rosa'], heart: ['Oud', 'Rosa damascena'], base: ['Ambra', 'Legno di sandalo'] }
  },
  {
    id: 'musk-al-tahara',
    slug: 'musk-al-tahara',
    name: 'Musk Al Tahara',
    brand: 'Maison D’Oriente',
    price: 34,
    category: 'musk',
    categories: ['musk'],
    image: '/brand/oude-logo.jpg',
    stock: 30,
    intensity: 'Morbido',
    duration: '5-7 ore',
    gender: 'unisex',
    tags: ['nuovo', 'daily'],
    shortDescription: 'Musk bianco pulito, cremoso e delicato per una scia intima.',
    notes: { top: ['Cotone bianco'], heart: ['Musk puro'], base: ['Vaniglia chiara', 'Talco'] }
  },
  {
    id: 'amber-night',
    slug: 'amber-night',
    name: 'Amber Night',
    brand: 'OUDÉ Selection',
    price: 59,
    category: 'unisex',
    categories: ['unisex'],
    image: '/brand/location-card.png',
    stock: 9,
    intensity: 'Caldo',
    duration: '7-9 ore',
    gender: 'unisex',
    tags: ['sera', 'gift'],
    shortDescription: 'Ambra resinosa, vaniglia scura e spezie dolci da sera.',
    notes: { top: ['Cannella', 'Dattero'], heart: ['Ambra'], base: ['Vaniglia', 'Benzoino'] }
  },
  {
    id: 'rose-arabia',
    slug: 'rose-arabia',
    name: 'Rose Arabia',
    brand: 'Maison D’Oriente',
    price: 49,
    category: 'attar',
    categories: ['attar'],
    image: '/brand/botanical-identity.jpg',
    stock: 18,
    intensity: 'Floreale',
    duration: '6-8 ore',
    gender: 'donna',
    tags: ['romantico'],
    shortDescription: 'Rosa orientale, miele leggero e musk per una firma elegante.',
    notes: { top: ['Litchi'], heart: ['Rosa', 'Geranio'], base: ['Musk', 'Miele'] }
  },
  {
    id: 'bakhoor-royal-wood',
    slug: 'bakhoor-royal-wood',
    name: 'Bakhoor Royal Wood',
    brand: 'OUDÉ Rituals',
    price: 27,
    category: 'bakhoor',
    categories: ['bakhoor'],
    image: '/brand/location-card.png',
    stock: 22,
    intensity: 'Avvolgente',
    duration: 'Ambiente',
    gender: 'unisex',
    tags: ['rituale'],
    shortDescription: 'Legni aromatici e resine per profumare casa con calore boutique.',
    notes: { top: ['Incenso'], heart: ['Oud affumicato'], base: ['Resine', 'Ambra'] }
  },
  {
    id: 'gift-box-arabian-collection',
    slug: 'gift-box-arabian-collection',
    name: 'Gift Box Arabian Collection',
    brand: 'OUDÉ',
    price: 119,
    category: 'set-regalo',
    categories: ['set-regalo'],
    image: '/brand/oude-logo.jpg',
    stock: 7,
    intensity: 'Curato',
    duration: 'Varie',
    gender: 'unisex',
    tags: ['gift', 'premium'],
    shortDescription: 'Una selezione regalo con oud, musk, attar e rituale bakhoor.',
    notes: { top: ['Agrumi dolci'], heart: ['Rosa', 'Oud'], base: ['Musk', 'Ambra'] }
  }
];

export const featuredProducts = products.filter((product) => product.tags.includes('bestseller') || product.tags.includes('gift') || product.tags.includes('nuovo'));
