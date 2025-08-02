import type { CategoryInfo, IntakeInfo, Question, YearInfo } from '../../types';

// Extended Question interface to include extraction metadata
export interface ExtendedQuestion extends Question {
  pageNumber?: number;
  examYear?: number;
  extractionMetadata?: {
    confidence?: number;
    manuallyVerified?: boolean;
    extractedAt?: string;
    aiModel?: string;
  };
}

// Pagination props
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

// Question card props
export interface QuestionCardProps {
  question: ExtendedQuestion;
  onEdit: (question: ExtendedQuestion) => void;
  onDelete: (questionId: string) => void;
  onApprove: (questionId: string) => void;
  onReject: (questionId: string) => void;
  serialNumber: number;
}

// Filters props
export interface QuestionsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  intakeFilter: string;
  onIntakeFilterChange: (value: string) => void;
  yearFilter: string;
  onYearFilterChange: (value: string) => void;
  confidenceFilter: string;
  onConfidenceFilterChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (value: 'asc' | 'desc') => void;
  categories?: CategoryInfo[];
  intakes?: IntakeInfo[];
  years?: YearInfo[];
}

// Statistics data
export interface QuestionsStatsTypes {
  totalQuestions: number;
  verifiedCount: number;
  pendingCount: number;
  isLoading: boolean;
}

// Question actions
export interface QuestionActions {
  onEdit: (question: ExtendedQuestion) => void;
  onDelete: (questionId: string) => void;
  onApprove: (questionId: string) => void;
  onReject: (questionId: string) => void;
}

// Filter state
export interface FilterState {
  searchTerm: string;
  statusFilter: string;
  categoryFilter: string;
  intakeFilter: string;
  yearFilter: string;
  confidenceFilter: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  currentPage: number;
  itemsPerPage: number;
}

// URL params updates
export type UrlParamsUpdates = Record<string, string | number>;
