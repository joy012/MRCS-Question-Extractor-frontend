import type { QuestionSearchParams } from '@/types';
import { QueryClient } from '@tanstack/react-query';
import { GET_QUESTIONS } from './query-keys';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Query keys for better cache management
export const queryKeys = {
  // Questions
  questions: {
    all: [GET_QUESTIONS] as const,
    lists: () => [...queryKeys.questions.all, 'list'] as const,
    details: () => [...queryKeys.questions.all, 'detail'] as const,
    statistics: () => [...queryKeys.questions.all, 'statistics'] as const,
    categories: () => [...queryKeys.questions.all, 'categories'] as const,
    years: () => [...queryKeys.questions.all, 'years'] as const,
    intakes: () => [...queryKeys.questions.all, 'intakes'] as const,
    search: () => [...queryKeys.questions.all, 'search'] as const,
    byId: (id: string) => [...queryKeys.questions.details(), id] as const,
    byPage: (page: number) => [...queryKeys.questions.lists(), page] as const,
    list: (params: QuestionSearchParams) =>
      [
        ...queryKeys.questions.lists(),
        params.categories,
        params.intake,
        params.limit,
        params.explanation,
        params.page,
        params.search,
        params.sortBy,
        params.sortOrder,
        params.status,
        params.year,
      ] as const,
  },

  // Categories
  categories: {
    all: ['categories'] as const,
    basic: () => [...queryKeys.categories.all, 'basic'] as const,
    clinical: () => [...queryKeys.categories.all, 'clinical'] as const,
    stats: () => [...queryKeys.categories.all, 'stats'] as const,
    names: () => [...queryKeys.categories.all, 'names'] as const,
  },

  // Intakes
  intakes: {
    all: ['intakes'] as const,
    lists: () => [...queryKeys.intakes.all, 'list'] as const,
    details: () => [...queryKeys.intakes.all, 'detail'] as const,
    byId: (id: string) => [...queryKeys.intakes.details(), id] as const,
  },

  // Extraction
  extraction: {
    all: ['extraction'] as const,
    status: () => [...queryKeys.extraction.all, 'status'] as const,
    progress: () => [...queryKeys.extraction.all, 'progress'] as const,
    failedPages: () => [...queryKeys.extraction.all, 'failed-pages'] as const,
    statistics: () => [...queryKeys.extraction.all, 'statistics'] as const,
    validation: () => [...queryKeys.extraction.all, 'validation'] as const,
    pdfInfo: () => [...queryKeys.extraction.all, 'pdf-info'] as const,
    ollamaHealth: () => [...queryKeys.extraction.all, 'ollama-health'] as const,
  },
} as const;

// Helper function to invalidate related queries
export const invalidateQueries = {
  questions: {
    all: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.all }),
    lists: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.lists() }),
    statistics: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.statistics(),
      }),
    categories: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.categories(),
      }),
    years: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.years() }),
    intakes: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.intakes(),
      }),
  },

  categories: {
    all: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all }),
    basic: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.basic() }),
    clinical: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.clinical(),
      }),
    stats: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.stats() }),
    names: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.names() }),
  },

  intakes: {
    all: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.intakes.all }),
    lists: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.intakes.lists() }),
  },

  extraction: {
    all: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.extraction.all }),
    status: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.extraction.status(),
      }),
    progress: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.extraction.progress(),
      }),
    statistics: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.extraction.statistics(),
      }),
  },
} as const;

export default queryClient;
