import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AiRephrasingService } from '../api/ai-rephrasing';

// Query keys
export const aiRephrasingKeys = {
  all: ['ai-rephrasing'] as const,
  settings: () => [...aiRephrasingKeys.all, 'settings'] as const,
  status: () => [...aiRephrasingKeys.all, 'status'] as const,
  statistics: () => [...aiRephrasingKeys.all, 'statistics'] as const,
  logs: () => [...aiRephrasingKeys.all, 'logs'] as const,
  summary: () => [...aiRephrasingKeys.all, 'summary'] as const,
  questions: (params?: { page?: number; limit?: number; status?: string }) =>
    [...aiRephrasingKeys.all, 'questions', params] as const,
};

// Hooks
export const useGetAiRephrasingSettingsQuery = () => {
  return useQuery({
    queryKey: aiRephrasingKeys.settings(),
    queryFn: AiRephrasingService.getSettings,
    staleTime: 30000, // 30 seconds
    refetchInterval: (query) => {
      // Refetch more frequently if processing
      return query.state.data?.isActive ? 5000 : 30000;
    },
  });
};

export const useGetAiRephrasingStatusQuery = () => {
  return useQuery({
    queryKey: aiRephrasingKeys.status(),
    queryFn: AiRephrasingService.getStatus,
    refetchInterval: (query) => {
      // Refetch more frequently if processing
      return query.state.data?.status === 'processing' ? 30000 : false;
    },
  });
};

export const useGetAiRephrasingStatisticsQuery = (
  refetchPeriodically?: boolean
) => {
  return useQuery({
    queryKey: aiRephrasingKeys.statistics(),
    queryFn: AiRephrasingService.getStatistics,
    refetchInterval: refetchPeriodically ? 30000 : false,
  });
};

export const useGetAiRephrasingLogsQuery = (refetchPeriodically?: boolean) => {
  return useQuery({
    queryKey: aiRephrasingKeys.logs(),
    queryFn: AiRephrasingService.getLogs,
    refetchInterval: refetchPeriodically ? 30000 : false,
  });
};

export const useGetAiRephrasingSummaryQuery = () => {
  return useQuery({
    queryKey: aiRephrasingKeys.summary(),
    queryFn: AiRephrasingService.getRephrasingSummary,
    staleTime: 15000, // 15 seconds
    refetchInterval: (query) => {
      // Refetch more frequently if processing
      return query.state.data?.status?.status === 'processing' ? 5000 : 15000;
    },
  });
};

export const useGetQuestionsForRephrasingQuery = (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  return useQuery({
    queryKey: aiRephrasingKeys.questions(params),
    queryFn: () => AiRephrasingService.getQuestionsForRephrasing(params),
    staleTime: 30000, // 30 seconds
  });
};

// Mutations
export const useStartAiRephrasingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { model?: string }) =>
      AiRephrasingService.startRephrasing(params),
    onSuccess: (data) => {
      toast.success(data.message || 'AI rephrasing started successfully');
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: aiRephrasingKeys.all });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to start AI rephrasing');
    },
  });
};

export const useStopAiRephrasingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AiRephrasingService.stopRephrasing,
    onSuccess: (data) => {
      toast.success(data.message || 'AI rephrasing stopped successfully');
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: aiRephrasingKeys.all });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to stop AI rephrasing');
    },
  });
};

export const useResetAiRephrasingSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AiRephrasingService.resetSettings,
    onSuccess: (data) => {
      toast.success(
        data.message || 'AI rephrasing settings reset successfully'
      );
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: aiRephrasingKeys.all });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to reset AI rephrasing settings');
    },
  });
};

export const useClearAiRephrasingLogsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AiRephrasingService.clearLogs,
    onSuccess: (data) => {
      toast.success(data.message || 'AI rephrasing logs cleared successfully');
      // Invalidate and refetch logs
      queryClient.invalidateQueries({ queryKey: aiRephrasingKeys.logs() });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to clear AI rephrasing logs');
    },
  });
};

export const useUpdateQuestionRephrasingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questionId,
      aiRephrasedTitle,
    }: {
      questionId: string;
      aiRephrasedTitle: string;
    }) =>
      AiRephrasingService.updateQuestionRephrasing(
        questionId,
        aiRephrasedTitle
      ),
    onSuccess: (data) => {
      toast.success(data.message || 'Question rephrasing updated successfully');
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: aiRephrasingKeys.all });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update question rephrasing');
    },
  });
};

export const useResetQuestionProcessingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionId: string) =>
      AiRephrasingService.resetQuestionProcessing(questionId),
    onSuccess: (data) => {
      toast.success(data.message || 'Question processing reset successfully');
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: aiRephrasingKeys.all });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to reset question processing');
    },
  });
};

export const useTestRephrasingGenerationMutation = () => {
  return useMutation({
    mutationFn: (questionId: string) =>
      AiRephrasingService.testRephrasingGeneration(questionId),
    onSuccess: (data) => {
      if (data.rephrasedTitle) {
        toast.success('Rephrasing test completed successfully');
      } else {
        toast.info(data.message || 'Rephrasing test completed');
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to test rephrasing generation');
    },
  });
};
