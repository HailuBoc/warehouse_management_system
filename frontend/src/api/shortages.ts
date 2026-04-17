import client from './client.js';
import { Shortage, ApiResponse } from '../types/index.js';

export const shortageApi = {
  getShortages: async (): Promise<Shortage[]> => {
    const response = await client.get<ApiResponse<Shortage[]>>(
      '/report/shortages'
    );
    return response.data.data || [];
  },
};
