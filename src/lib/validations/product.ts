import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  categoryId: z.string().uuid().optional(),
  status: z.enum(['draft', 'published', 'hidden', 'sold_out'])
});

export type ProductInput = z.infer<typeof productSchema>;

const boundedText = z.string().max(500);
export const adminProductSchema = z.object({
  id: z.string().max(100),
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/),
  brand: boundedText,
  price: z.number().positive().max(100000),
  compareAtPrice: z.number().nonnegative().max(100000).optional(),
  stock: z.number().int().min(0).max(1000000),
  category: boundedText,
  categories: z.array(boundedText).max(30),
  image: z.string().max(2048).refine(value => value.startsWith('/brand/') || /^https:\/\//.test(value)),
  intensity: boundedText,
  duration: boundedText,
  gender: z.enum(['uomo', 'donna', 'unisex']),
  tags: z.array(boundedText).max(50),
  seoTitle: boundedText.optional(),
  seoDescription: boundedText.optional(),
  shortDescription: z.string().max(5000),
  notes: z.object({
    top: z.array(boundedText).max(30),
    heart: z.array(boundedText).max(30),
    base: z.array(boundedText).max(30)
  })
});
