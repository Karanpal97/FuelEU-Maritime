/**
 * API Client Base
 */
import axios, { AxiosInstance, AxiosResponse } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        throw error;
      }
    );
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.get(url, { params });
    if (!response.data.success) {
      throw new Error(response.data.error || 'API request failed');
    }
    return response.data.data as T;
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.post(url, data);
    if (!response.data.success) {
      throw new Error(response.data.error || 'API request failed');
    }
    return response.data.data as T;
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.put(url, data);
    if (!response.data.success) {
      throw new Error(response.data.error || 'API request failed');
    }
    return response.data.data as T;
  }

  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.delete(url);
    if (!response.data.success) {
      throw new Error(response.data.error || 'API request failed');
    }
    return response.data.data as T;
  }
}

export const apiClient = new ApiClient();

