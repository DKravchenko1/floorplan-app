import { useMutation } from '@tanstack/react-query';
import { FloorPlan, ZoningResult } from '../types';
import { generateZoning } from '../services/api';
import { queryClient } from '../services/queryClient';

export const QUERY_KEYS = {
  ZONING: 'zoning',
};

interface UseApiQueriesProps {
  onZoningSuccess: (result: ZoningResult) => void;
  onZoningError: (error: Error) => void;
}

/**
 * Хук для работы с API через React Query
 */
export const useApiQueries = ({ onZoningSuccess, onZoningError }: UseApiQueriesProps) => {
  /**
   * Мутация для генерации зонирования
   */
  const generateZoningMutation = useMutation({
    mutationFn: (floorPlan: FloorPlan) => generateZoning(floorPlan),
    onSuccess: (data) => {
      onZoningSuccess(data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ZONING] });
    },
    onError: (error: Error) => {
      onZoningError(error);
    }
  });

  return {
    generateZoningMutation,
  };
}; 