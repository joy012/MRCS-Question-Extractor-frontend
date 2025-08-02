import { useQuery } from '@tanstack/react-query';
import { CategoriesService } from '../api';
import { queryKeys } from '../lib/query-client';

// Get all categories
export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => CategoriesService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get basic categories
export const useBasicCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories.basic(),
    queryFn: () => CategoriesService.getBasicCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get clinical categories
export const useClinicalCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories.clinical(),
    queryFn: () => CategoriesService.getClinicalCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get category statistics
export const useCategoryStats = () => {
  return useQuery({
    queryKey: queryKeys.categories.stats(),
    queryFn: () => CategoriesService.getCategoryStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get active category names
export const useActiveCategoryNames = () => {
  return useQuery({
    queryKey: queryKeys.categories.names(),
    queryFn: () => CategoriesService.getActiveCategoryNames(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
