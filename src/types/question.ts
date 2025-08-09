import type { PaginatedResponse } from './common';

export const QuestionStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export type QuestionStatus =
  (typeof QuestionStatus)[keyof typeof QuestionStatus];

export interface QuestionOptions {
  A: string;
  B: string;
  C: string;
  D: string;
  E: string;
}

export type CorrectAnswer = 'A' | 'B' | 'C' | 'D' | 'E';

export interface AiMetadata {
  confidence?: number;
  extractedBy?: string;
  sourceFile?: string;
  extractedAt?: string;
  aiModel?: string;
  processingTime?: number;
  rawExtraction?: any;
}

export interface Intake {
  id: string;
  name: string;
  type: string;
  displayName: string;
  description: string;
  questionCount: number;
  isActive: boolean;
  order: number;
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  displayName: string;
  type: string;
  description: string;
  questionCount: number;
  isActive: boolean;
  order: number;
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  question: string;
  aiRephrasedTitle?: string;
  options: QuestionOptions;
  correctAnswer: CorrectAnswer;
  description?: string;
  year: number;
  intake: Intake;
  categories: Category[];
  explanation?: string;
  status: QuestionStatus;
  aiMetadata?: AiMetadata;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionData {
  question: string;
  aiRephrasedTitle?: string;
  options: QuestionOptions;
  correctAnswer: CorrectAnswer;
  description?: string;
  year: number;
  intake: string;
  categories: string[];
  explanation?: string;
  status?: QuestionStatus;
  aiMetadata?: AiMetadata;
}

export type UpdateQuestionData = Partial<CreateQuestionData>;

export interface QuestionFilters {
  categories?: string[];
  year?: number;
  intake?: string;
  status?: QuestionStatus;
  explanation?: 'all' | 'with_explanation' | 'without_explanation';
  search?: string;
  rephrasing?: 'all' | 'with_rephrasing' | 'without_rephrasing';
}

export interface QuestionSearchParams extends QuestionFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type QuestionsResponse = PaginatedResponse<Question>;

export interface QuestionStatistics {
  total: number;
  byCategory: Record<string, number>;
  byYear: Record<number, number>;
  byIntake: Record<string, number>;
  byStatus: Record<QuestionStatus, number>;
  averageConfidence: number;
}

export interface CategoryInfo {
  id: string;
  category: string;
  count: number;
  percentage: number;
}

export interface YearInfo {
  year: number;
  count: number;
  percentage: number;
}

export interface IntakeInfo {
  id: string;
  intake: string;
  count: number;
  percentage: number;
}

export interface StatusInfo {
  status: QuestionStatus;
  count: number;
  percentage: number;
}

export interface BulkActionRequest {
  questionIds: string[];
  action: 'delete' | 'updateStatus';
  data?: {
    status?: QuestionStatus;
  };
}

export interface BulkActionResponse {
  success: boolean;
  processed: number;
  failed: number;
  errors?: string[];
  message: string;
}
