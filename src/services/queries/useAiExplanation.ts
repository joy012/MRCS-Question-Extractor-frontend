import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AiExplanationService } from '../api/ai-explanation';

// Query keys
export const aiExplanationKeys = {
  all: ['ai-explanation'] as const,
  settings: () => [...aiExplanationKeys.all, 'settings'] as const,
  status: () => [...aiExplanationKeys.all, 'status'] as const,
  statistics: () => [...aiExplanationKeys.all, 'statistics'] as const,
  logs: () => [...aiExplanationKeys.all, 'logs'] as const,
  summary: () => [...aiExplanationKeys.all, 'summary'] as const,
};

// Hooks
export const useGetAiExplanationSettingsQuery = () => {
  return useQuery({
    queryKey: aiExplanationKeys.settings(),
    queryFn: AiExplanationService.getSettings,
    staleTime: 30000, // 30 seconds
    refetchInterval: (query) => {
      // Refetch more frequently if processing
      return query.state.data?.isActive ? 5000 : 30000;
    },
  });
};

export const useGetAiExplanationStatusQuery = () => {
  return useQuery({
    queryKey: aiExplanationKeys.status(),
    queryFn: AiExplanationService.getStatus,
    staleTime: 5000, // 5 seconds
    refetchInterval: (query) => {
      // Refetch more frequently if processing
      return query.state.data?.status === 'processing' ? 2000 : 10000;
    },
  });
};

export const useGetAiExplanationStatisticsQuery = () => {
  return useQuery({
    queryKey: aiExplanationKeys.statistics(),
    queryFn: AiExplanationService.getStatistics,
    staleTime: 60000, // 1 minute
  });
};

export const useGetAiExplanationLogsQuery = () => {
  return useQuery({
    queryKey: aiExplanationKeys.logs(),
    queryFn: AiExplanationService.getLogs,
    staleTime: 10000, // 10 seconds
    refetchInterval: (query) => {
      // Refetch more frequently if processing
      return query.state.data?.logs && query.state.data.logs.length > 0
        ? 5000
        : 10000;
    },
  });
};

export const useGetAiExplanationSummaryQuery = () => {
  return useQuery({
    queryKey: aiExplanationKeys.summary(),
    queryFn: AiExplanationService.getExplanationSummary,
    staleTime: 15000, // 15 seconds
    refetchInterval: (query) => {
      // Refetch more frequently if processing
      return query.state.data?.status?.status === 'processing' ? 5000 : 15000;
    },
  });
};

// Mutations
export const useStartAiExplanationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AiExplanationService.startExplanation,
    onSuccess: (data) => {
      toast.success(data.message || 'AI explanation started successfully');
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: aiExplanationKeys.all });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to start AI explanation');
    },
  });
};

export const useStopAiExplanationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AiExplanationService.stopExplanation,
    onSuccess: (data) => {
      toast.success(data.message || 'AI explanation stopped successfully');
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: aiExplanationKeys.all });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to stop AI explanation');
    },
  });
};

export const useUpdateQuestionExplanationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questionId,
      explanation,
    }: {
      questionId: string;
      explanation: string;
    }) =>
      AiExplanationService.updateQuestionExplanation(questionId, explanation),
    onSuccess: (data) => {
      toast.success(
        data.message || 'Question explanation updated successfully'
      );
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: aiExplanationKeys.all });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update question explanation');
    },
  });
};

export const useResetAiExplanationSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AiExplanationService.resetSettings,
    onSuccess: (data) => {
      toast.success(
        data.message || 'AI explanation settings reset successfully'
      );
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: aiExplanationKeys.all });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to reset AI explanation settings');
    },
  });
};
