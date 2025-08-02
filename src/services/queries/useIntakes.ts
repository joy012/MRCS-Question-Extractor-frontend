import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invalidateQueries, queryKeys } from '../../lib/query-client';
import type { Intake } from '../../types/question';
import type { CreateIntakeDto, UpdateIntakeDto } from '../api/intakes';
import { intakesApi } from '../api/intakes';

export const useGetIntakesQuery = () => {
  return useQuery({
    queryKey: queryKeys.intakes.all,
    queryFn: intakesApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetIntakeQuery = (id: string) => {
  return useQuery({
    queryKey: queryKeys.intakes.byId(id),
    queryFn: () => intakesApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetIntakesOptionsQuery = () => {
  const { data: intakes, isLoading, error } = useGetIntakesQuery();

  const options =
    intakes?.map((intake: Intake) => ({
      value: intake.id,
      label: intake.displayName,
      color: intake.color,
      icon: intake.icon,
    })) || [];

  return {
    options,
    isLoading,
    error,
  };
};

// Create intake mutation
export const useCreateIntakeMutation = () => {
  return useMutation({
    mutationFn: (data: CreateIntakeDto) => intakesApi.create(data),
    onSuccess: () => {
      invalidateQueries.intakes.all();
    },
  });
};

// Update intake mutation
export const useUpdateIntakeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIntakeDto }) =>
      intakesApi.update(id, data),
    onSuccess: (_, { id }) => {
      invalidateQueries.intakes.all();
      queryClient.invalidateQueries({
        queryKey: queryKeys.intakes.byId(id),
      });
    },
  });
};

// Delete intake mutation
export const useDeleteIntakeMutation = () => {
  return useMutation({
    mutationFn: (id: string) => intakesApi.delete(id),
    onSuccess: () => {
      invalidateQueries.intakes.all();
    },
  });
};

// Reset intakes mutation
export const useResetIntakesMutation = () => {
  return useMutation({
    mutationFn: () => intakesApi.reset(),
    onSuccess: () => {
      invalidateQueries.intakes.all();
    },
  });
};
