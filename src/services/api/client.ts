import { config } from '@/lib/config';
import type { ApiError } from '@/types';
import axios from 'axios';

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (requestConfig) => {
    // Add timestamp to requests
    if (requestConfig.headers) {
      requestConfig.headers['X-Request-Timestamp'] = new Date().toISOString();
    }

    // Log requests in development
    if (config.dev?.enableLogging) {
      console.log('API Request:', {
        method: requestConfig.method?.toUpperCase(),
        url: requestConfig.url,
        data: requestConfig.data,
      });
    }

    return requestConfig;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (config.dev.enableLogging) {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  (error) => {
    const apiError: ApiError = {
      message: 'An error occurred',
      statusCode: error.response?.status || 500,
    };

    if (error.response?.data) {
      const errorData = error.response.data;
      apiError.message = errorData.message || apiError.message;
      apiError.error = errorData.error;
      apiError.details = errorData.details;
    } else if (error.request) {
      apiError.message = 'Network error - please check your connection';
      apiError.statusCode = 0;
    } else {
      apiError.message = error.message || 'Unknown error occurred';
    }

    // Log errors in development
    if (config.dev.enableLogging) {
      console.error('API Error:', {
        status: apiError.statusCode,
        message: apiError.message,
        url: error.config?.url,
        error: apiError,
      });
    }

    return Promise.reject(apiError);
  }
);

// Generic API methods
export const api = {
  get: <T>(url: string, requestConfig?: any): Promise<T> =>
    apiClient.get(url, requestConfig).then((response) => response.data),

  post: <T>(url: string, data?: unknown, requestConfig?: any): Promise<T> =>
    apiClient.post(url, data, requestConfig).then((response) => response.data),

  put: <T>(url: string, data?: unknown, requestConfig?: any): Promise<T> =>
    apiClient.put(url, data, requestConfig).then((response) => response.data),

  patch: <T>(url: string, data?: unknown, requestConfig?: any): Promise<T> =>
    apiClient.patch(url, data, requestConfig).then((response) => response.data),

  delete: <T>(url: string, requestConfig?: any): Promise<T> =>
    apiClient.delete(url, requestConfig).then((response) => response.data),
};

// Health check function
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    await api.get('/');
    return true;
  } catch {
    return false;
  }
};

export default apiClient;
