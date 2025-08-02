import { config } from '../lib/config';
import type {
  BatchExtractionRequest,
  BatchExtractionResponse,
  ExtractionProgress,
  ExtractionStatus,
  FailedPage,
  OllamaHealth,
  PdfInfo,
  RetryFailedPagesResponse,
  SinglePageExtractionResponse,
  ValidationResult,
} from '../types';
import { api } from './client';

export class ExtractionService {
  // List all available PDFs
  static async listPdfs(): Promise<string[]> {
    return api.get<string[]>('/extraction/pdfs');
  }

  // Start extraction for a selected PDF
  static async startExtraction(
    pdf: string
  ): Promise<{ message: string; extractionId: string }> {
    return api.post<{ message: string; extractionId: string }>(
      '/extraction/start',
      { pdf }
    );
  }

  // Stop extraction
  static async stopExtraction(): Promise<{ message: string }> {
    return api.delete<{ message: string }>('/extraction/stop');
  }

  // Get current extraction status
  static async getStatus(): Promise<any> {
    return api.get<any>('/extraction/status');
  }

  // Get extraction logs
  static async getLogs(): Promise<{ logs: string[] }> {
    return api.get<{ logs: string[] }>('/extraction/logs');
  }

  // Start batch extraction (10 pages by default)
  static async startBatchExtraction(
    params?: BatchExtractionRequest
  ): Promise<BatchExtractionResponse> {
    return api.post<BatchExtractionResponse>('/extraction/start-batch', params);
  }

  // Stop batch extraction
  static async stopBatchExtraction(): Promise<{ message: string }> {
    return api.post<{ message: string }>('/extraction/stop-batch');
  }

  // Extract a single page
  static async extractSinglePage(
    pageNumber: number,
    force: boolean = false
  ): Promise<SinglePageExtractionResponse> {
    const url = `/extraction/extract-page/${pageNumber}${
      force ? '?force=true' : ''
    }`;
    return api.post<SinglePageExtractionResponse>(url);
  }

  // Get current extraction status
  static async getExtractionStatus(): Promise<ExtractionStatus> {
    return api.get<ExtractionStatus>('/extraction/status');
  }

  // Get detailed progress information
  static async getDetailedProgress(): Promise<ExtractionProgress> {
    return api.get<ExtractionProgress>('/extraction/progress/detailed');
  }

  // Reset extraction progress
  static async resetExtraction(): Promise<{ message: string }> {
    return api.post<{ message: string }>('/extraction/reset');
  }

  // Get failed pages list
  static async getFailedPages(): Promise<{
    failedPages: FailedPage[];
    totalFailed: number;
    timestamp: string;
  }> {
    return api.get('/extraction/failed-pages');
  }

  // Retry a specific failed page
  static async retryFailedPage(pageNumber: number): Promise<{
    success: boolean;
    message: string;
    pageNumber: number;
  }> {
    return api.post(`/extraction/retry-failed-page/${pageNumber}`);
  }

  // Retry all failed pages
  static async retryAllFailedPages(): Promise<RetryFailedPagesResponse> {
    return api.post<RetryFailedPagesResponse>('/extraction/retry-all-failed');
  }

  // Validate PDF and Ollama connectivity
  static async validateExtraction(): Promise<ValidationResult> {
    return api.get<ValidationResult>('/extraction/validate');
  }

  // Get PDF file information
  static async getPdfInfo(): Promise<
    PdfInfo | { error: string; message: string; details: string }
  > {
    return api.get('/extraction/pdf/info');
  }

  // Get Ollama service health
  static async getOllamaHealth(): Promise<OllamaHealth> {
    return api.get<OllamaHealth>('/extraction/ollama/health');
  }

  // Get extraction statistics and performance metrics
  static async getStatistics(): Promise<{
    progress: {
      totalPages: number;
      processedPages: number;
      failedPages: number;
      remainingPages: number;
      progressPercentage: number;
    };
    questions: {
      totalExtracted: number;
      averagePerPage: number;
    };
    performance: {
      averageConfidence: number;
      processingTimePerPage: number;
      totalProcessingTime: number;
    };
    status: {
      currentStatus: string;
      isProcessing: boolean;
      canContinue: boolean;
      lastProcessedAt?: string;
      lastError?: string;
    };
    timestamp: string;
  }> {
    return api.get('/extraction/statistics');
  }

  // Get extraction summary (combines multiple queries)
  static async getExtractionSummary(): Promise<{
    status: ExtractionStatus;
    progress: ExtractionProgress;
    statistics: any;
    failedPages: FailedPage[];
  }> {
    const [status, progress, statistics, failedPagesData] = await Promise.all([
      this.getExtractionStatus(),
      this.getDetailedProgress(),
      this.getStatistics(),
      this.getFailedPages(),
    ]);

    return {
      status,
      progress,
      statistics,
      failedPages: failedPagesData.failedPages,
    };
  }
}

export default ExtractionService;
