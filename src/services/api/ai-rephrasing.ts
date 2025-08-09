import type {
  AiRephrasingSettings,
  AiRephrasingStatistics,
  AiRephrasingStatus,
  StartAiRephrasingRequest,
} from '@/types';
import { api } from './client';

export class AiRephrasingService {
  // Get AI rephrasing settings
  static async getSettings(): Promise<AiRephrasingSettings> {
    return api.get<AiRephrasingSettings>('/ai-rephrasing/settings');
  }

  // Start AI rephrasing process
  static async startRephrasing(
    params: StartAiRephrasingRequest
  ): Promise<{ message: string; settingsId: string }> {
    return api.post<{ message: string; settingsId: string }>(
      '/ai-rephrasing/start',
      params
    );
  }

  // Stop AI rephrasing process
  static async stopRephrasing(): Promise<{ message: string }> {
    return api.post<{ message: string }>('/ai-rephrasing/stop');
  }

  // Get AI rephrasing status
  static async getStatus(): Promise<AiRephrasingStatus> {
    return api.get<AiRephrasingStatus>('/ai-rephrasing/status');
  }

  // Get AI rephrasing statistics
  static async getStatistics(): Promise<AiRephrasingStatistics> {
    return api.get<AiRephrasingStatistics>('/ai-rephrasing/statistics');
  }

  // Get AI rephrasing logs
  static async getLogs(): Promise<{ logs: string[] }> {
    return api.get<{ logs: string[] }>('/ai-rephrasing/logs');
  }

  // Clear AI rephrasing logs
  static async clearLogs(): Promise<{ message: string }> {
    return api.delete<{ message: string }>('/ai-rephrasing/logs');
  }

  // Reset AI rephrasing settings
  static async resetSettings(): Promise<{ message: string }> {
    return api.post<{ message: string }>('/ai-rephrasing/reset');
  }

  // Get questions for rephrasing
  static async getQuestionsForRephrasing(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{
    questions: Array<{
      id: string;
      question: string;
      aiRephrasedTitle?: string;
      hasAiRephrasedTitle: boolean;
      rephrasingAddedAt?: string;
      rephrasingModel?: string;
      status: string;
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return api.get('/ai-rephrasing/questions', { params });
  }

  // Update question rephrasing
  static async updateQuestionRephrasing(
    questionId: string,
    aiRephrasedTitle: string
  ): Promise<{ message: string }> {
    return api.put<{ message: string }>(
      `/ai-rephrasing/questions/${questionId}/rephrasing`,
      { aiRephrasedTitle }
    );
  }

  // Reset question processing
  static async resetQuestionProcessing(
    questionId: string
  ): Promise<{ message: string }> {
    return api.post<{ message: string }>(
      `/ai-rephrasing/questions/${questionId}/reset`
    );
  }

  // Test rephrasing generation
  static async testRephrasingGeneration(questionId: string): Promise<{
    message: string;
    rephrasedTitle?: string;
    prompt?: string;
  }> {
    return api.post<{
      message: string;
      rephrasedTitle?: string;
      prompt?: string;
    }>(`/ai-rephrasing/questions/${questionId}/test`);
  }

  // Get AI rephrasing summary (combines multiple queries)
  static async getRephrasingSummary(): Promise<{
    status: AiRephrasingStatus;
    statistics: AiRephrasingStatistics;
    settings: AiRephrasingSettings;
  }> {
    const [status, statistics, settings] = await Promise.all([
      this.getStatus(),
      this.getStatistics(),
      this.getSettings(),
    ]);

    return {
      status,
      statistics,
      settings,
    };
  }
}
