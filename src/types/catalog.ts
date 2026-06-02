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
  image: string;
  stock: number;
  intensity: string;
  duration: string;
  gender: 'uomo' | 'donna' | 'unisex';
  tags: string[];
  shortDescription: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
};
