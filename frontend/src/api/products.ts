import client from './client.js';
import { Product, ApiResponse } from '../types/index.js';

export const productApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await client.get<ApiResponse<Product[]>>('/products');
    return response.data.data || [];
  },

  getById: async (id: number): Promise<Product> => {
    const response = await client.get<ApiResponse<Product>>(`/products/${id}`);
    if (!response.data.data) {
      throw new Error('Product not found');
    }
    return response.data.data;
  },
};
