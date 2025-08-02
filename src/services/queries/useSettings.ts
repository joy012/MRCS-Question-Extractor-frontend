import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  GET_BACKUPS,
  GET_LOGS,
  GET_SETTINGS,
  GET_STORAGE_USAGE,
  GET_SYSTEM_INFO,
} from '../../lib/query-keys';
import { SettingsService } from '../api';

// Get system settings
export const useGetSettingsQuery = () => {
  return useQuery({
    queryKey: [GET_SETTINGS],
    queryFn: () => SettingsService.getSettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get system information
export const useGetSystemInfoQuery = () => {
  return useQuery({
    queryKey: [GET_SYSTEM_INFO],
    queryFn: () => SettingsService.getSystemInfo(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get storage usage
export const useGetStorageUsageQuery = () => {
  return useQuery({
    queryKey: [GET_STORAGE_USAGE],
    queryFn: () => SettingsService.getStorageUsage(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get backups
export const useGetBackupsQuery = () => {
  return useQuery({
    queryKey: [GET_BACKUPS],
    queryFn: () => SettingsService.listBackups(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get logs
export const useGetLogsQuery = (level?: string, limit?: number) => {
  return useQuery({
    queryKey: [GET_LOGS, level, limit],
    queryFn: () => SettingsService.getLogs(level, limit),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Update settings mutation
export const useUpdateSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: any) => SettingsService.updateSettings(settings),
    onSuccess: () => {
      // Invalidate settings queries
      queryClient.invalidateQueries({ queryKey: [GET_SETTINGS] });
    },
  });
};

// Reset settings mutation
export const useResetSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => SettingsService.resetSettings(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_SETTINGS] });
    },
  });
};

// Upload PDF mutation
export const useUploadPdfMutation = () => {
  return useMutation({
    mutationFn: (file: File) => SettingsService.uploadPdf(file),
  });
};

// Export data mutation
export const useExportDataMutation = () => {
  return useMutation({
    mutationFn: (format: 'json' | 'csv' | 'pdf') =>
      SettingsService.exportData(format),
  });
};

// Clear cache mutation
export const useClearCacheMutation = () => {
  return useMutation({
    mutationFn: () => SettingsService.clearCache(),
  });
};

// Reset database mutation
export const useResetDatabaseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => SettingsService.resetDatabase(),
    onSuccess: () => {
      // Invalidate all queries since database is reset
      queryClient.invalidateQueries();
    },
  });
};

// Delete questions mutation
export const useDeleteQuestionsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => SettingsService.deleteQuestions(),
    onSuccess: () => {
      // Invalidate questions-related queries
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
};

// Create backup mutation
export const useCreateBackupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => SettingsService.createBackup(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_BACKUPS] });
    },
  });
};

// Restore backup mutation
export const useRestoreBackupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => SettingsService.restoreBackup(id),
    onSuccess: () => {
      // Invalidate all queries since backup restoration affects everything
      queryClient.invalidateQueries();
    },
  });
};

// Test connections mutation
export const useTestConnectionsMutation = () => {
  return useMutation({
    mutationFn: () => SettingsService.testConnections(),
  });
};
