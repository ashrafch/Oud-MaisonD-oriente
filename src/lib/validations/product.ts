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
