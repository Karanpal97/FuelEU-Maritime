/**
 * API Client Base - Enhanced Error Handling
 */
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

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

    // Response interceptor for better error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<{ error?: string; message?: string }>) => {
        // Log error for debugging
        console.error('API Error:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          message: error.response?.data?.error || error.response?.data?.message || error.message,
        });
        
        // Re-throw the error with axios error object intact
        // This preserves status code and response data
        throw error;
      }
    );
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.get(url, { params });
      if (!response.data.success) {
        throw new Error(response.data.error || 'API request failed');
      }
      return response.data.data as T;
    } catch (error) {
      // Re-throw axios errors to preserve status codes
      throw error;
    }
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.post(url, data);
      if (!response.data.success) {
        throw new Error(response.data.error || 'API request failed');
      }
      return response.data.data as T;
    } catch (error) {
      throw error;
    }
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.put(url, data);
      if (!response.data.success) {
        throw new Error(response.data.error || 'API request failed');
      }
      return response.data.data as T;
    } catch (error) {
      throw error;
    }
  }

  async delete<T>(url: string): Promise<T> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.delete(url);
      if (!response.data.success) {
        throw new Error(response.data.error || 'API request failed');
      }
      return response.data.data as T;
    } catch (error) {
      throw error;
    }
  }
}

export const apiClient = new ApiClient();

