import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transferApi } from '../api/transfers.js';
import { TransferRequest } from '../types/index.js';
import { SHORTAGES_QUERY_KEY } from './useShortages.js';

const PRODUCTS_QUERY_KEY = ['products'];

export const useTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: TransferRequest) => transferApi.transfer(request),
    onSuccess: () => {
      // Invalidate both so table and shortages refresh in background
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SHORTAGES_QUERY_KEY });
    },
  });
};
