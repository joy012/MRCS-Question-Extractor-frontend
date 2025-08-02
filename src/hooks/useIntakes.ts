import { useQuery } from '@tanstack/react-query';
import { intakesApi } from '../api/intakes';
import type { Intake } from '../types/question';

export const useIntakes = () => {
  return useQuery({
    queryKey: ['intakes'],
    queryFn: intakesApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useIntake = (id: string) => {
  return useQuery({
    queryKey: ['intakes', id],
    queryFn: () => intakesApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useIntakesOptions = () => {
  const { data: intakes, isLoading, error } = useIntakes();

  const options =
    intakes?.map((intake: Intake) => ({
      value: intake._id,
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
