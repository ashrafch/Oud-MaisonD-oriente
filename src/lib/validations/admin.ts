import { z } from 'zod';

const optionalId = z.string().uuid().or(z.literal('')).optional().transform(value => value || undefined);
const slug = z.string().trim().min(1).max(200).regex(/^[a-z0-9-]+$/);
const taxonomy = z.object({
  id: optionalId,
  name: z.string().trim().min(2).max(200),
  slug,
  description: z.string().max(5000)
});
export const categorySchema = taxonomy.extend({
  isVisible: z.boolean(),
  sortOrder: z.number().int().min(0).max(10000)
});
export const collectionSchema = taxonomy;
export const contentSchema = z.object({
  slug: z.enum(['about', 'contact', 'shipping', 'returns', 'privacy', 'terms', 'faq']),
  title: z.string().trim().min(1).max(200),
  body: z.string().max(100000)
});
export const marketingSchema = z.object({
  id: optionalId,
  productId: optionalId,
  channel: z.enum(['Instagram', 'TikTok', 'WhatsApp']),
  caption: z.string().trim().min(1).max(10000),
  hashtags: z.array(z.string().max(100)).max(50),
  status: z.enum(['draft', 'scheduled', 'published']),
  scheduledAt: z.string().datetime().optional(),
  productName: z.string().max(200).optional()
}).refine(value => value.status !== 'scheduled' || !!value.scheduledAt);
export const uuidSchema = z.string().uuid();
