import type { Status } from './common';

// Extraction status and progress types
export interface ExtractionStatus {
  status: Status;
  isProcessing: boolean;
  canContinue: boolean;
  currentPage?: number;
  currentBatch?: {
    start: number;
    end: number;
    current: number;
  };
  processedPages: number[];
  failedPages: number[];
  totalQuestions: number;
  progressPercentage: number;
  lastProcessedAt?: string;
  lastError?: string;
  startedAt?: string;
  estimatedCompletion?: string;
  statistics?: ExtractionStatistics;
}

export interface ExtractionStatistics {
  averageQuestionsPerPage?: number;
  averageConfidence?: number;
  processingTimePerPage?: number;
  totalProcessingTime?: number;
  questionsPerMinute?: number;
  successRate?: number;
}

export interface ExtractionProgress {
  extractionId: string;
  status: string;
  currentPage: number;
  totalPages: number;
  progressPercentage: number;
  totalProcessed: number;
  totalQuestions: number;
  processedPages: number[];
  failedPages: number[];
  lastError?: string;
  lastProcessedAt?: string;
  statistics?: ExtractionStatistics;
  batchInfo?: {
    currentBatchStart?: number;
    currentBatchEnd?: number;
    batchSize?: number;
    estimatedTimeRemaining?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Extraction job types for Bull queue
export interface CreateExtractionJobDto {
  startPage: number;
  endPage: number;
  batchSize?: number;
  userId?: string;
  forceReextract?: boolean;
}

export interface JobStatus {
  jobId: string;
  status: string;
  progress: number;
  processedPages: number;
  failedPages: number;
  questionsExtracted: number;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  processingTime?: number;
}

export interface QueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  timestamp: string;
}

// Legacy types for backward compatibility
export interface BatchExtractionRequest {
  startPage?: number;
  endPage?: number;
  batchSize?: number;
  forceReextract?: boolean;
}

export interface BatchExtractionResponse {
  message: string;
  status: string;
  timestamp: string;
}

export interface SinglePageExtractionResponse {
  pageNumber: number;
  questionsExtracted: number;
  questionsCreated: number;
  questionsUpdated: number;
  processingTime: number;
  timestamp: string;
}

export interface FailedPage {
  pageNumber: number;
  error: string;
  timestamp: string;
}

export interface RetryFailedPagesResponse {
  retriedPages: number[];
  totalRetried: number;
  timestamp: string;
}

export interface ValidationResult {
  pdf: {
    valid: boolean;
    message: string;
    details?: {
      totalPages: number;
      fileSize: number;
      fileName: string;
    };
  };
  ollama: {
    healthy: boolean;
    message: string;
  };
  ready: boolean;
}

export interface PdfInfo {
  filename: string;
  totalPages: number;
  fileSize: number;
  lastModified: string;
}

export interface OllamaHealth {
  healthy: boolean;
  message: string;
  timestamp: string;
}
