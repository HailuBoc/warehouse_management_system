import { useMutation } from '@tanstack/react-query';
import { transferApi } from '../api/transfers.js';
import { TransferRequest } from '../types/index.js';
import { useRefreshProducts } from './useProducts.js';

export const useTransfer = () => {
  const refreshProducts = useRefreshProducts();

  return useMutation({
    mutationFn: (request: TransferRequest) => transferApi.transfer(request),
    onSuccess: () => {
      refreshProducts();
    },
  });
};
