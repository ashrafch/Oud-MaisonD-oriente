export type Category = {
  name: string;
  slug: string;
  description: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  categories: string[];
  image: string;
  stock: number;
  intensity: string;
  duration: string;
  gender: 'uomo' | 'donna' | 'unisex';
  tags: string[];
  rating?: number;
  reviewCount?: number;
  seoTitle?: string;
  seoDescription?: string;
  shortDescription: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
};
