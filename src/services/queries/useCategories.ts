import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invalidateQueries, queryKeys } from '../../lib/query-client';
import { GET_CATEGORY } from '../../lib/query-keys';
import { CategoriesService } from '../api';
import type { CreateCategoryDto, UpdateCategoryDto } from '../api/categories';

// Get all categories
export const useGetCategoriesQuery = () => {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => CategoriesService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get category by ID
export const useGetCategoryQuery = (id: string) => {
  return useQuery({
    queryKey: [GET_CATEGORY, id],
    queryFn: () => CategoriesService.getCategoryById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get basic categories
export const useGetBasicCategoriesQuery = () => {
  return useQuery({
    queryKey: queryKeys.categories.basic(),
    queryFn: () => CategoriesService.getBasicCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get clinical categories
export const useGetClinicalCategoriesQuery = () => {
  return useQuery({
    queryKey: queryKeys.categories.clinical(),
    queryFn: () => CategoriesService.getClinicalCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get category statistics
export const useGetCategoryStatsQuery = () => {
  return useQuery({
    queryKey: queryKeys.categories.stats(),
    queryFn: () => CategoriesService.getCategoryStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get active category names
export const useGetActiveCategoryNamesQuery = () => {
  return useQuery({
    queryKey: queryKeys.categories.names(),
    queryFn: () => CategoriesService.getActiveCategoryNames(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Create category mutation
export const useCreateCategoryMutation = () => {
  return useMutation({
    mutationFn: (data: CreateCategoryDto) =>
      CategoriesService.createCategory(data),
    onSuccess: () => {
      invalidateQueries.categories.all();
    },
  });
};

// Update category mutation
export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
      CategoriesService.updateCategory(id, data),
    onSuccess: (_, { id }) => {
      invalidateQueries.categories.all();
      queryClient.invalidateQueries({
        queryKey: [GET_CATEGORY, id],
      });
    },
  });
};

// Delete category mutation
export const useDeleteCategoryMutation = () => {
  return useMutation({
    mutationFn: (id: string) => CategoriesService.deleteCategory(id),
    onSuccess: () => {
      invalidateQueries.categories.all();
    },
  });
};

// Reset categories mutation
export const useResetCategoriesMutation = () => {
  return useMutation({
    mutationFn: () => CategoriesService.resetCategories(),
    onSuccess: () => {
      invalidateQueries.categories.all();
    },
  });
};

// Seed categories mutation
export const useSeedCategoriesMutation = () => {
  return useMutation({
    mutationFn: () => CategoriesService.seedCategories(),
    onSuccess: () => {
      invalidateQueries.categories.all();
    },
  });
};
