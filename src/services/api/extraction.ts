import type { OllamaHealth, PdfInfo, ValidationResult } from '@/types';
import { api } from './client';

export interface ExtractionState {
  status: 'idle' | 'processing' | 'completed' | 'failed' | 'stopped';
  selectedPdf: string;
  progress: number;
  totalPages: number;
  processedPages: number;
  failedPages: number[];
  logs: string[];
  startTime?: Date;
  endTime?: Date;
  error?: string;
  extractedQuestions: number;
  questionsPerPage: Record<number, number>;
  verifiedQuestions: number;
  updatedQuestions: number;
  skippedQuestions: number;
  extractionId?: string;
  model?: string;
  startPage?: number;
  maxPages?: number;
  overwrite?: boolean;
}

export interface StartExtractionRequest {
  filename: string;
  model?: string;
  startPage?: number;
  maxPages?: number;
  overwrite?: boolean;
}

export class ExtractionService {
  // List all available PDFs
  static async listPdfs(): Promise<string[]> {
    return api.get<string[]>('/extraction/pdfs');
  }

  // Start extraction for a selected PDF
  static async startExtraction(
    params: StartExtractionRequest
  ): Promise<{ message: string; extractionId: string }> {
    return api.post<{ message: string; extractionId: string }>(
      '/extraction/start',
      params
    );
  }

  // Stop extraction
  static async stopExtraction(): Promise<{ message: string }> {
    return api.delete<{ message: string }>('/extraction/stop');
  }

  // Get current extraction status
  static async getStatus(): Promise<ExtractionState> {
    return api.get<ExtractionState>('/extraction/status');
  }

  // Get extraction logs
  static async getLogs(): Promise<{ logs: string[] }> {
    return api.get<{ logs: string[] }>('/extraction/logs');
  }

  // Get extraction statistics
  static async getStatistics(): Promise<{
    status: string;
    selectedPdf: string;
    progress: number;
    processedPages: number;
    totalPages: number;
    failedPages: number[];
    extractedQuestions: number;
    verifiedQuestions: number;
    updatedQuestions: number;
    skippedQuestions: number;
    questionsPerPage: Record<number, number>;
    duration: number;
    startTime: Date | null;
    endTime: Date | null;
    error: string | null;
  }> {
    return api.get('/extraction/statistics');
  }

  // Get queue status
  static async getQueueStatus(): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
  }> {
    return api.get('/extraction/queue-status');
  }

  // Clear extraction state
  static async clearExtractionState(): Promise<{ message: string }> {
    return api.delete<{ message: string }>('/extraction/clear');
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

  // Validate PDF and Ollama connectivity
  static async validateExtraction(): Promise<ValidationResult> {
    return api.get<ValidationResult>('/extraction/validate');
  }

  // Get extraction summary (combines multiple queries)
  static async getExtractionSummary(): Promise<{
    status: ExtractionState;
    statistics: any;
    queueStatus: any;
  }> {
    const [status, statistics, queueStatus] = await Promise.all([
      this.getStatus(),
      this.getStatistics(),
      this.getQueueStatus(),
    ]);

    return {
      status,
      statistics,
      queueStatus,
    };
  }
}

export default ExtractionService;
