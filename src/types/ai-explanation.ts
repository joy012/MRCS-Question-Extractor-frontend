export interface AiExplanationSettings {
  id: string;
  isActive: boolean;
  model: string;
  totalQuestions: number;
  processedQuestions: number;
  skippedQuestions: number;
  failedQuestions: number;
  lastProcessedQuestion?: string;
  lastProcessedAt?: string;
  startedAt?: string;
  stoppedAt?: string;
  status: 'idle' | 'processing' | 'completed' | 'stopped' | 'failed';
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StartAiExplanationRequest {
  model?: string;
}

export interface StopAiExplanationRequest {
  // No additional parameters needed
}

export interface AiExplanationStatus {
  isActive: boolean;
  status: 'idle' | 'processing' | 'completed' | 'stopped' | 'failed';
  model: string;
  totalQuestions: number;
  processedQuestions: number;
  skippedQuestions: number;
  failedQuestions: number;
  progress: number;
  lastProcessedQuestion?: string;
  lastProcessedAt?: string;
  startedAt?: string;
  stoppedAt?: string;
  error?: string;
  estimatedTimeRemaining?: number;
}

export interface AiExplanationStatistics {
  totalQuestions: number;
  questionsWithExplanation: number;
  questionsWithoutExplanation: number;
  explanationCoverage: number;
  questionsProcessedToday: number;
  questionsProcessedThisWeek: number;
  successRate: number;
  lastExplanationAdded?: string;
  modelUsage: Record<string, number>;
}
