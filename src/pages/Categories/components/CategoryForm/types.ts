import { z } from 'zod';

// Category validation schema
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .regex(
      /^[a-z0-9-]+$/,
      'Name must contain only lowercase letters, numbers, and hyphens'
    ),
  displayName: z.string().min(1, 'Display name is required'),
  type: z.enum(['BASIC', 'CLINICAL']),
  isActive: z.boolean().optional(),
});

// Update schema (partial version)
export const updateCategorySchema = categorySchema.partial();

// Form data types
export type CategoryFormData = z.infer<typeof categorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;
