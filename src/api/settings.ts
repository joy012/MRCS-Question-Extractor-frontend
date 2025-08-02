import { api } from './client';

export interface SystemInfo {
  version: string;
  nodeVersion: string;
  npmVersion: string;
  platform: string;
  uptime: number;
  memoryUsage: {
    total: number;
    used: number;
    free: number;
  };
  database: {
    name: string;
    collections: number;
    documents: number;
  };
}

export interface StorageUsage {
  total: number;
  used: number;
  free: number;
  percentage: number;
}

export interface BackupInfo {
  id: string;
  name: string;
  size: number;
  createdAt: string;
  description?: string;
}

export interface SettingsResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface ResetDatabaseResponse {
  message: string;
  timestamp: string;
  details: {
    deletedCollections: string[];
    preservedData: string[];
  };
}

export class SettingsService {
  // Get system settings
  static async getSettings(): Promise<any> {
    return api.get('/settings');
  }

  // Update settings
  static async updateSettings(settings: any): Promise<SettingsResponse> {
    return api.patch('/settings', settings);
  }

  // Reset settings to defaults
  static async resetSettings(): Promise<SettingsResponse> {
    return api.post('/settings/reset');
  }

  // Upload PDF file
  static async uploadPdf(file: File): Promise<SettingsResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/settings/upload-pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Export data
  static async exportData(
    format: 'json' | 'csv' | 'pdf' = 'json'
  ): Promise<Blob> {
    return api.post('/settings/export', { format });
  }

  // Clear cache
  static async clearCache(): Promise<SettingsResponse> {
    return api.delete('/settings/cache');
  }

  // Reset database (dangerous operation)
  static async resetDatabase(): Promise<ResetDatabaseResponse> {
    return api.delete('/settings/database');
  }

  // Delete questions only (dangerous operation)
  static async deleteQuestions(): Promise<ResetDatabaseResponse> {
    return api.delete('/settings/questions');
  }

  // Get system information
  static async getSystemInfo(): Promise<SystemInfo> {
    return api.get('/settings/system-info');
  }

  // Get storage usage
  static async getStorageUsage(): Promise<StorageUsage> {
    return api.get('/settings/storage-usage');
  }

  // Create backup
  static async createBackup(): Promise<SettingsResponse> {
    return api.post('/settings/backup');
  }

  // List backups
  static async listBackups(): Promise<BackupInfo[]> {
    return api.get('/settings/backups');
  }

  // Restore backup
  static async restoreBackup(id: string): Promise<SettingsResponse> {
    return api.post(`/settings/backup/${id}/restore`);
  }

  // Get logs
  static async getLogs(level?: string, limit?: number): Promise<string[]> {
    const params = new URLSearchParams();
    if (level) params.append('level', level);
    if (limit) params.append('limit', limit.toString());

    return api.get(`/settings/logs?${params.toString()}`);
  }

  // Test connections
  static async testConnections(): Promise<SettingsResponse> {
    return api.post('/settings/test-connection');
  }
}
