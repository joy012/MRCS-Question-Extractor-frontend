import type {
  AiExplanationSettings,
  AiExplanationStatistics,
  AiExplanationStatus,
  StartAiExplanationRequest,
} from '@/types';
import { api } from './client';

export class AiExplanationService {
  // Get AI explanation settings
  static async getSettings(): Promise<AiExplanationSettings> {
    return api.get<AiExplanationSettings>('/ai-explanation/settings');
  }

  // Start AI explanation process
  static async startExplanation(
    params: StartAiExplanationRequest
  ): Promise<{ message: string; settingsId: string }> {
    return api.post<{ message: string; settingsId: string }>(
      '/ai-explanation/start',
      params
    );
  }

  // Stop AI explanation process
  static async stopExplanation(): Promise<{ message: string }> {
    return api.post<{ message: string }>('/ai-explanation/stop');
  }

  // Get current AI explanation status
  static async getStatus(): Promise<AiExplanationStatus> {
    return api.get<AiExplanationStatus>('/ai-explanation/status');
  }

  // Get AI explanation statistics
  static async getStatistics(): Promise<AiExplanationStatistics> {
    return api.get<AiExplanationStatistics>('/ai-explanation/statistics');
  }

  // Update explanation for a specific question
  static async updateQuestionExplanation(
    questionId: string,
    explanation: string
  ): Promise<{ message: string }> {
    return api.put<{ message: string }>(
      `/ai-explanation/questions/${questionId}/explanation`,
      { explanation }
    );
  }

  // Get AI explanation logs
  static async getLogs(): Promise<{ logs: string[] }> {
    return api.get<{ logs: string[] }>('/ai-explanation/logs');
  }

  // Reset AI explanation settings
  static async resetSettings(): Promise<{ message: string }> {
    return api.delete<{ message: string }>('/ai-explanation/reset');
  }

  // Get AI explanation summary (combines multiple queries)
  static async getExplanationSummary(): Promise<{
    status: AiExplanationStatus;
    statistics: AiExplanationStatistics;
    settings: AiExplanationSettings;
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

export default AiExplanationService;
