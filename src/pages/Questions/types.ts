import type { CategoryInfo, IntakeInfo, Question, YearInfo } from '../../types';

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
  question: Question;
  onEdit: (question: Question) => void;
  onDelete: (questionId: string) => void;
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
  explanationFilter: string;
  onExplanationFilterChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (value: 'asc' | 'desc') => void;
  categories?: CategoryInfo[];
  intakes?: IntakeInfo[];
  years?: YearInfo[];
  rephrasingFilter: string;
  onRphrasingFilterChange: (value: string) => void;
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
  onEdit: (question: Question) => void;
  onDelete: (questionId: string) => void;
}

// Filter state
export interface FilterState {
  searchTerm: string;
  statusFilter: string;
  categoryFilter: string;
  intakeFilter: string;
  yearFilter: string;
  confidenceFilter: string;
  explanationFilter: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  currentPage: number;
  itemsPerPage: number;
  rephrasingFilter: string;
}

// URL params updates
export type UrlParamsUpdates = Record<string, string | number>;
