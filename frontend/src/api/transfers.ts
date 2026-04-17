import client from './client.js';
import { TransferRequest, TransferResponse, ApiResponse } from '../types/index.js';

export const transferApi = {
  transfer: async (request: TransferRequest): Promise<TransferResponse> => {
    const response = await client.post<ApiResponse<TransferResponse>>(
      '/transfer',
      request
    );
    if (!response.data.data) {
      throw new Error('Transfer failed');
    }
    return response.data.data;
  },
};
