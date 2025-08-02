import type { Intake } from '../types/question';
import { apiClient } from './client';

export interface CreateIntakeDto {
  name: string;
  type: 'JANUARY' | 'APRIL_MAY' | 'SEPTEMBER';
  displayName: string;
  description?: string;
  order?: number;
  color?: string;
  icon?: string;
  isActive?: boolean;
}

export interface UpdateIntakeDto {
  displayName?: string;
  description?: string;
  order?: number;
  color?: string;
  icon?: string;
  isActive?: boolean;
}

export const intakesApi = {
  // Get all intakes
  getAll: async (): Promise<Intake[]> => {
    const response = await apiClient.get('/intakes/all');
    return response.data;
  },

  // Get intake by ID
  getById: async (id: string): Promise<Intake> => {
    const response = await apiClient.get(`/intakes/${id}`);
    return response.data;
  },

  // Create new intake
  create: async (intakeData: CreateIntakeDto): Promise<Intake> => {
    const response = await apiClient.post('/intakes', intakeData);
    return response.data;
  },

  // Update intake
  update: async (id: string, intakeData: UpdateIntakeDto): Promise<Intake> => {
    const response = await apiClient.put(`/intakes/${id}`, intakeData);
    return response.data;
  },

  // Delete intake
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/intakes/${id}`);
  },

  // Reset intakes to default
  reset: async (): Promise<{ message: string }> => {
    const response = await apiClient.post('/intakes/reset');
    return response.data;
  },
};
