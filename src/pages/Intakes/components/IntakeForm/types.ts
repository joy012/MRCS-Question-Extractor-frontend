import { z } from 'zod';

// Intake validation schema
export const intakeSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .regex(
      /^[a-z0-9-]+$/,
      'Name must contain only lowercase letters, numbers, and hyphens'
    ),
  type: z.enum(['JANUARY', 'APRIL_MAY', 'SEPTEMBER']),
  displayName: z.string().min(1, 'Display name is required'),
  isActive: z.boolean().optional(),
});

// Update schema (partial version)
export const updateIntakeSchema = intakeSchema.partial();

// Form data types
export type IntakeFormData = z.infer<typeof intakeSchema>;
export type UpdateIntakeFormData = z.infer<typeof updateIntakeSchema>;
