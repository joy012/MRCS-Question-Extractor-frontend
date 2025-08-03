import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invalidateQueries, queryKeys } from '../../lib/query-client';
import {
  GET_EXTRACTION_LOGS,
  GET_EXTRACTION_SUMMARY,
  GET_PDFS,
} from '../../lib/query-keys';
import {
  ExtractionService,
  type StartExtractionRequest,
} from '../api/extraction';

// Get available PDFs
export const useGetPdfsQuery = () => {
  return useQuery({
    queryKey: [GET_PDFS],
    queryFn: ExtractionService.listPdfs,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get extraction status
export const useGetExtractionStatusQuery = () => {
  return useQuery({
    queryKey: queryKeys.extraction.status(),
    queryFn: ExtractionService.getStatus,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

// Get extraction statistics
export const useGetExtractionStatisticsQuery = () => {
  return useQuery({
    queryKey: queryKeys.extraction.statistics(),
    queryFn: ExtractionService.getStatistics,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

// Get extraction logs
export const useGetExtractionLogsQuery = () => {
  return useQuery({
    queryKey: [GET_EXTRACTION_LOGS],
    queryFn: ExtractionService.getLogs,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

// Get PDF info
export const useGetPdfInfoQuery = () => {
  return useQuery({
    queryKey: queryKeys.extraction.pdfInfo(),
    queryFn: ExtractionService.getPdfInfo,
    staleTime: 5 * 60 * 1000, // 5 minutes - PDF info doesn't change often
  });
};

// Get Ollama health
export const useGetOllamaHealthQuery = () => {
  return useQuery({
    queryKey: queryKeys.extraction.ollamaHealth(),
    queryFn: ExtractionService.getOllamaHealth,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

// Validate system
export const useValidateSystemQuery = () => {
  return useQuery({
    queryKey: queryKeys.extraction.validation(),
    queryFn: ExtractionService.validateExtraction,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

// Get extraction summary
export const useGetExtractionSummaryQuery = () => {
  return useQuery({
    queryKey: [GET_EXTRACTION_SUMMARY],
    queryFn: ExtractionService.getExtractionSummary,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

// Start extraction mutation
export const useStartExtractionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: StartExtractionRequest) => {
      try {
        const result = await ExtractionService.startExtraction(params);
        return result;
      } catch (error) {
        console.error('Extraction failed:', error);
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
      console.log('Extraction completed:', data);

      // Invalidate and refetch extraction-related queries
      invalidateQueries.extraction.all();
      invalidateQueries.questions.all();
    },
    onError: (error) => {
      console.error('Extraction error:', error);

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

// Stop extraction mutation
export const useStopExtractionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        const result = await ExtractionService.stopExtraction();
        return result;
      } catch (error) {
        console.error('Stop extraction failed:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Extraction stopped:', data);

      // Invalidate and refetch extraction-related queries
      invalidateQueries.extraction.all();
    },
    onError: (error) => {
      console.error('Stop extraction error:', error);
    },
    onSettled: () => {
      // Always refetch status after completion
      queryClient.invalidateQueries({
        queryKey: queryKeys.extraction.status(),
      });
    },
  });
};

// Continue extraction mutation
export const useContinueExtractionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        const result = await ExtractionService.continueExtraction();
        return result;
      } catch (error) {
        console.error('Continue extraction failed:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Extraction continued:', data);

      // Invalidate and refetch extraction-related queries
      invalidateQueries.extraction.all();
    },
    onError: (error) => {
      console.error('Continue extraction error:', error);
    },
    onSettled: () => {
      // Always refetch status after completion
      queryClient.invalidateQueries({
        queryKey: queryKeys.extraction.status(),
      });
    },
  });
};

// Clear extraction state mutation
export const useClearExtractionStateMutation = () => {
  return useMutation({
    mutationFn: ExtractionService.clearExtractionState,
    onSuccess: () => {
      invalidateQueries.extraction.all();
      invalidateQueries.questions.all();
    },
  });
};
