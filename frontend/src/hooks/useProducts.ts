import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../api/products.js';
import { Product, ProductWithStatus } from '../types/index.js';

const PRODUCTS_QUERY_KEY = ['products'];

export const useProducts = () => {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: productApi.getAll,
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useProductsWithStatus = () => {
  const { data: products, ...rest } = useProducts();

  const productsWithStatus: ProductWithStatus[] | undefined = products?.map(
    (product) => ({
      ...product,
      status:
        product.warehouseAQty >= product.reorderLevel &&
        product.warehouseBQty >= product.reorderLevel
          ? 'ok'
          : 'shortage',
    })
  );

  return { data: productsWithStatus, ...rest };
};

export const useRefreshProducts = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
};
