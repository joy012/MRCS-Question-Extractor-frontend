import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invalidateQueries, queryKeys } from '../../lib/query-client';
import {
  GET_QUESTIONS_BY_CATEGORY,
  GET_QUESTIONS_BY_INTAKE,
  GET_QUESTIONS_BY_STATUS,
  GET_QUESTIONS_BY_YEAR,
  GET_RECENT_QUESTIONS,
} from '../../lib/query-keys';
import type {
  CreateQuestionData,
  QuestionSearchParams,
  QuestionStatus,
  UpdateQuestionData,
} from '../../types';
import { QuestionsService } from '../api';

// Get questions with pagination and filtering
export const useGetQuestionsQuery = (params: QuestionSearchParams = {}) => {
  return useQuery({
    queryKey: queryKeys.questions.list(params),
    queryFn: () => QuestionsService.getQuestions(params),
  });
};

// Get a single question
export const useGetQuestionQuery = (id: string) => {
  return useQuery({
    queryKey: queryKeys.questions.byId(id),
    queryFn: () => QuestionsService.getQuestion(id),
    enabled: !!id,
  });
};

// Get question statistics
export const useGetQuestionStatisticsQuery = () => {
  return useQuery({
    queryKey: queryKeys.questions.statistics(),
    queryFn: QuestionsService.getStatistics,
    staleTime: 5 * 60 * 1000,
  });
};

// Get categories
export const useGetQuestionCategoriesQuery = () => {
  return useQuery({
    queryKey: queryKeys.questions.categories(),
    queryFn: QuestionsService.getCategories,
    staleTime: 10 * 60 * 1000,
  });
};

// Get years
export const useGetQuestionYearsQuery = () => {
  return useQuery({
    queryKey: queryKeys.questions.years(),
    queryFn: QuestionsService.getYears,
    staleTime: 10 * 60 * 1000,
  });
};

// Get intakes
export const useGetQuestionIntakesQuery = () => {
  return useQuery({
    queryKey: queryKeys.questions.intakes(),
    queryFn: QuestionsService.getIntakes,
    staleTime: 10 * 60 * 1000,
  });
};

// Create question mutation
export const useCreateQuestionMutation = () => {
  return useMutation({
    mutationFn: (data: CreateQuestionData) =>
      QuestionsService.createQuestion(data),
    onSuccess: () => {
      invalidateQueries.questions.all();
    },
  });
};

// Create multiple questions mutation
export const useCreateQuestionsMutation = () => {
  return useMutation({
    mutationFn: (data: CreateQuestionData[]) =>
      QuestionsService.createQuestions(data),
    onSuccess: () => {
      invalidateQueries.questions.all();
    },
  });
};

// Update question mutation
export const useUpdateQuestionMutation = () => {
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
export const useDeleteQuestionMutation = () => {
  return useMutation({
    mutationFn: (id: string) => QuestionsService.deleteQuestion(id),
    onSuccess: () => {
      invalidateQueries.questions.all();
    },
  });
};

// Update question status mutation
export const useUpdateQuestionStatusMutation = () => {
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
export const useBulkUpdateStatusMutation = () => {
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
export const useGetRecentQuestionsQuery = (limit: number = 10) => {
  return useQuery({
    queryKey: [GET_RECENT_QUESTIONS, limit],
    queryFn: () => QuestionsService.getRecentQuestions(limit),
    staleTime: 2 * 60 * 1000,
  });
};

// Get questions by category
export const useGetQuestionsByCategoryQuery = (
  categoryId: string,
  options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
) => {
  return useQuery({
    queryKey: [GET_QUESTIONS_BY_CATEGORY, categoryId, options],
    queryFn: () => QuestionsService.getQuestionsByCategory(categoryId, options),
    enabled: !!categoryId,
  });
};

// Get questions by year
export const useGetQuestionsByYearQuery = (
  year: number,
  options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
) => {
  return useQuery({
    queryKey: [GET_QUESTIONS_BY_YEAR, year, options],
    queryFn: () => QuestionsService.getQuestionsByYear(year, options),
  });
};

// Get questions by intake
export const useGetQuestionsByIntakeQuery = (
  intakeId: string,
  options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
) => {
  return useQuery({
    queryKey: [GET_QUESTIONS_BY_INTAKE, intakeId, options],
    queryFn: () => QuestionsService.getQuestionsByIntake(intakeId, options),
    enabled: !!intakeId,
  });
};

// Get questions by status
export const useGetQuestionsByStatusQuery = (
  status: QuestionStatus,
  options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
) => {
  return useQuery({
    queryKey: [GET_QUESTIONS_BY_STATUS, status, options],
    queryFn: () => QuestionsService.getQuestionsByStatus(status, options),
  });
};
