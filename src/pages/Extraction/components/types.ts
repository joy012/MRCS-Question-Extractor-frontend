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
