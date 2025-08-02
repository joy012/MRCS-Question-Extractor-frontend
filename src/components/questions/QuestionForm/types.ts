import { z } from 'zod';

// Common validation constants (matching backend)
export const VALIDATION_CONSTANTS = {
  MIN_QUESTION_LENGTH: 10,
  MAX_QUESTION_LENGTH: 2000,
  MAX_OPTION_LENGTH: 1000,
  MAX_DESCRIPTION_LENGTH: 5000,
  MAX_EXPLANATION_LENGTH: 5000,
  MIN_YEAR: 2000,
  MAX_YEAR: 2030,
  MIN_CONFIDENCE: 0,
  MAX_CONFIDENCE: 100,
} as const;

// Question validation schema
export const questionSchema = z.object({
  question: z
    .string()
    .min(
      VALIDATION_CONSTANTS.MIN_QUESTION_LENGTH,
      'Question must be at least 10 characters'
    )
    .max(
      VALIDATION_CONSTANTS.MAX_QUESTION_LENGTH,
      'Question must be less than 2000 characters'
    ),
  options: z.object({
    A: z
      .string()
      .min(1, 'Option A is required')
      .max(
        VALIDATION_CONSTANTS.MAX_OPTION_LENGTH,
        'Option A must be less than 1000 characters'
      ),
    B: z
      .string()
      .min(1, 'Option B is required')
      .max(
        VALIDATION_CONSTANTS.MAX_OPTION_LENGTH,
        'Option B must be less than 1000 characters'
      ),
    C: z
      .string()
      .min(1, 'Option C is required')
      .max(
        VALIDATION_CONSTANTS.MAX_OPTION_LENGTH,
        'Option C must be less than 1000 characters'
      ),
    D: z
      .string()
      .min(1, 'Option D is required')
      .max(
        VALIDATION_CONSTANTS.MAX_OPTION_LENGTH,
        'Option D must be less than 1000 characters'
      ),
    E: z
      .string()
      .min(1, 'Option E is required')
      .max(
        VALIDATION_CONSTANTS.MAX_OPTION_LENGTH,
        'Option E must be less than 1000 characters'
      ),
  }),
  correctAnswer: z
    .enum(['A', 'B', 'C', 'D', 'E'])
    .refine((val) => val !== undefined, {
      message: 'Please select a correct answer',
    }),
  description: z
    .string()
    .max(
      VALIDATION_CONSTANTS.MAX_DESCRIPTION_LENGTH,
      'Description must be less than 5000 characters'
    )
    .optional(),
  year: z
    .number()
    .min(VALIDATION_CONSTANTS.MIN_YEAR, 'Year must be at least 2000')
    .max(VALIDATION_CONSTANTS.MAX_YEAR, 'Year must be at most 2030'),
  intake: z.string().min(1, 'Intake is required'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  explanation: z
    .string()
    .max(
      VALIDATION_CONSTANTS.MAX_EXPLANATION_LENGTH,
      'Explanation must be less than 5000 characters'
    )
    .optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  aiMetadata: z
    .object({
      confidence: z
        .number()
        .min(VALIDATION_CONSTANTS.MIN_CONFIDENCE)
        .max(VALIDATION_CONSTANTS.MAX_CONFIDENCE)
        .optional(),
    })
    .optional(),
});

// Update schema (partial version)
export const updateQuestionSchema = questionSchema.partial();

// Form data types
export type QuestionFormData = z.infer<typeof questionSchema>;
export type UpdateQuestionFormData = z.infer<typeof updateQuestionSchema>;
