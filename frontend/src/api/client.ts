import axios, { AxiosInstance } from 'axios';
import { ApiResponse } from '../types/index.js';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const client: AxiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.error) {
      return Promise.reject(error.response.data.error);
    }
    return Promise.reject({
      code: 'NETWORK_ERROR',
      message: error.message || 'An error occurred',
    });
  }
);

export default client;
