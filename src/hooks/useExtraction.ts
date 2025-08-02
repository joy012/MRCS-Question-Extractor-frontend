import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExtractionService } from '../api';
import { invalidateQueries, queryKeys } from '../lib/query-client';
import type { BatchExtractionRequest } from '../types';

// Get extraction status
export const useExtractionStatus = () => {
  return useQuery({
    queryKey: queryKeys.extraction.status(),
    queryFn: ExtractionService.getExtractionStatus,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

// Get detailed progress
export const useExtractionProgress = () => {
  return useQuery({
    queryKey: queryKeys.extraction.progress(),
    queryFn: ExtractionService.getDetailedProgress,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

// Get extraction statistics
export const useExtractionStatistics = () => {
  return useQuery({
    queryKey: queryKeys.extraction.statistics(),
    queryFn: ExtractionService.getStatistics,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

// Get failed pages
export const useFailedPages = () => {
  return useQuery({
    queryKey: queryKeys.extraction.failedPages(),
    queryFn: ExtractionService.getFailedPages,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

// Get PDF info
export const usePdfInfo = () => {
  return useQuery({
    queryKey: queryKeys.extraction.pdfInfo(),
    queryFn: ExtractionService.getPdfInfo,
    staleTime: 5 * 60 * 1000, // 5 minutes - PDF info doesn't change often
  });
};

// Get Ollama health
export const useOllamaHealth = () => {
  return useQuery({
    queryKey: queryKeys.extraction.ollamaHealth(),
    queryFn: ExtractionService.getOllamaHealth,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

// Validate system
export const useValidateSystem = () => {
  return useQuery({
    queryKey: queryKeys.extraction.validation(),
    queryFn: ExtractionService.validateExtraction,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

// Get extraction summary
export const useExtractionSummary = () => {
  return useQuery({
    queryKey: ['extraction', 'summary'],
    queryFn: ExtractionService.getExtractionSummary,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

// Start batch extraction mutation
export const useStartBatchExtraction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params?: BatchExtractionRequest) => {
      try {
        const result = await ExtractionService.startBatchExtraction(params);
        return result;
      } catch (error) {
        console.error('Batch extraction failed:', error);
        throw error;
      }
    },
    onMutate: async () => {
      // Optimistic update - set processing state immediately
      await queryClient.setQueryData(
        queryKeys.extraction.status(),
        (old: any) => ({
          ...old,
          isProcessing: true,
          status: 'processing',
        })
      );
    },
    onSuccess: (data) => {
      console.log('Batch extraction completed:', data);

      // Invalidate and refetch extraction-related queries
      invalidateQueries.extraction.all();
      invalidateQueries.questions.all();
    },
    onError: (error) => {
      console.error('Batch extraction error:', error);

      // Revert optimistic update on error
      queryClient.invalidateQueries({
        queryKey: queryKeys.extraction.status(),
      });
    },
    onSettled: () => {
      // Always refetch status after completion
      queryClient.invalidateQueries({
        queryKey: queryKeys.extraction.status(),
      });
    },
  });
};

// Stop batch extraction mutation
export const useStopBatchExtraction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        const result = await ExtractionService.stopBatchExtraction();
        return result;
      } catch (error) {
        console.error('Stop batch extraction failed:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Batch extraction stopped:', data);

      // Invalidate and refetch extraction-related queries
      invalidateQueries.extraction.all();
    },
    onError: (error) => {
      console.error('Stop batch extraction error:', error);
    },
    onSettled: () => {
      // Always refetch status after completion
      queryClient.invalidateQueries({
        queryKey: queryKeys.extraction.status(),
      });
    },
  });
};

// Extract single page mutation
export const useExtractSinglePage = () => {
  return useMutation({
    mutationFn: ({
      pageNumber,
      force = false,
    }: {
      pageNumber: number;
      force?: boolean;
    }) => ExtractionService.extractSinglePage(pageNumber, force),
    onSuccess: () => {
      invalidateQueries.extraction.all();
      invalidateQueries.questions.all();
    },
  });
};

// Reset extraction mutation
export const useResetExtraction = () => {
  return useMutation({
    mutationFn: ExtractionService.resetExtraction,
    onSuccess: () => {
      invalidateQueries.extraction.all();
      invalidateQueries.questions.all();
    },
  });
};

// Retry failed page mutation
export const useRetryFailedPage = () => {
  return useMutation({
    mutationFn: (pageNumber: number) =>
      ExtractionService.retryFailedPage(pageNumber),
    onSuccess: () => {
      invalidateQueries.extraction.all();
      invalidateQueries.questions.all();
    },
  });
};

// Retry all failed pages mutation
export const useRetryAllFailedPages = () => {
  return useMutation({
    mutationFn: ExtractionService.retryAllFailedPages,
    onSuccess: () => {
      invalidateQueries.extraction.all();
      invalidateQueries.questions.all();
    },
  });
};
