import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QuestionsService } from '../api';
import { invalidateQueries, queryKeys } from '../lib/query-client';
import type {
  CreateQuestionData,
  QuestionSearchParams,
  QuestionStatus,
  UpdateQuestionData,
} from '../types';

// Get questions with pagination and filtering
export const useQuestions = (params: QuestionSearchParams = {}) => {
  return useQuery({
    queryKey: queryKeys.questions.list(params),
    queryFn: () => QuestionsService.getQuestions(params),
  });
};

// Get a single question
export const useQuestion = (id: string) => {
  return useQuery({
    queryKey: queryKeys.questions.byId(id),
    queryFn: () => QuestionsService.getQuestion(id),
    enabled: !!id,
  });
};

// Get question statistics
export const useQuestionStatistics = () => {
  return useQuery({
    queryKey: queryKeys.questions.statistics(),
    queryFn: QuestionsService.getStatistics,
    staleTime: 5 * 60 * 1000,
  });
};

// Get categories
export const useQuestionCategories = () => {
  return useQuery({
    queryKey: queryKeys.questions.categories(),
    queryFn: QuestionsService.getCategories,
    staleTime: 10 * 60 * 1000,
  });
};

// Get years
export const useQuestionYears = () => {
  return useQuery({
    queryKey: queryKeys.questions.years(),
    queryFn: QuestionsService.getYears,
    staleTime: 10 * 60 * 1000,
  });
};

// Get intakes
export const useQuestionIntakes = () => {
  return useQuery({
    queryKey: queryKeys.questions.intakes(),
    queryFn: QuestionsService.getIntakes,
    staleTime: 10 * 60 * 1000,
  });
};

// Create question mutation
export const useCreateQuestion = () => {
  return useMutation({
    mutationFn: (data: CreateQuestionData) =>
      QuestionsService.createQuestion(data),
    onSuccess: () => {
      invalidateQueries.questions.all();
    },
  });
};

// Create multiple questions mutation
export const useCreateQuestions = () => {
  return useMutation({
    mutationFn: (data: CreateQuestionData[]) =>
      QuestionsService.createQuestions(data),
    onSuccess: () => {
      invalidateQueries.questions.all();
    },
  });
};

// Update question mutation
export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQuestionData }) =>
      QuestionsService.updateQuestion(id, data),
    onSuccess: (_, { id }) => {
      invalidateQueries.questions.all();
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.byId(id),
      });
    },
  });
};

// Delete question mutation
export const useDeleteQuestion = () => {
  return useMutation({
    mutationFn: (id: string) => QuestionsService.deleteQuestion(id),
    onSuccess: () => {
      invalidateQueries.questions.all();
    },
  });
};

// Update question status mutation
export const useUpdateQuestionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: QuestionStatus }) =>
      QuestionsService.updateQuestionStatus(id, status),
    onSuccess: (_, { id }) => {
      invalidateQueries.questions.all();
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.byId(id),
      });
    },
  });
};

// Bulk update status mutation
export const useBulkUpdateStatus = () => {
  return useMutation({
    mutationFn: ({
      questionIds,
      status,
    }: {
      questionIds: string[];
      status: QuestionStatus;
    }) => QuestionsService.bulkUpdateStatus(questionIds, status),
    onSuccess: () => {
      invalidateQueries.questions.all();
    },
  });
};

// Get recent questions
export const useRecentQuestions = (limit: number = 10) => {
  return useQuery({
    queryKey: ['questions', 'recent', limit],
    queryFn: () => QuestionsService.getRecentQuestions(limit),
    staleTime: 2 * 60 * 1000,
  });
};

// Get questions by category
export const useQuestionsByCategory = (
  categoryId: string,
  options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
) => {
  return useQuery({
    queryKey: ['questions', 'category', categoryId, options],
    queryFn: () => QuestionsService.getQuestionsByCategory(categoryId, options),
    enabled: !!categoryId,
  });
};

// Get questions by year
export const useQuestionsByYear = (
  year: number,
  options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
) => {
  return useQuery({
    queryKey: ['questions', 'year', year, options],
    queryFn: () => QuestionsService.getQuestionsByYear(year, options),
  });
};

// Get questions by intake
export const useQuestionsByIntake = (
  intakeId: string,
  options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
) => {
  return useQuery({
    queryKey: ['questions', 'intake', intakeId, options],
    queryFn: () => QuestionsService.getQuestionsByIntake(intakeId, options),
    enabled: !!intakeId,
  });
};

// Get questions by status
export const useQuestionsByStatus = (
  status: QuestionStatus,
  options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
) => {
  return useQuery({
    queryKey: ['questions', 'status', status, options],
    queryFn: () => QuestionsService.getQuestionsByStatus(status, options),
  });
};
