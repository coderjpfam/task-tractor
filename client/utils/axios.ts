/**
 * Axios instance configuration
 */

import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosError } from 'axios';

// API base URL - should be configured via environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Create axios instance with default configuration
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
// Queue to store failed requests while refreshing
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

/**
 * Request interceptor - Add auth token to requests
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle common errors and token refresh
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Return the response data directly
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Handle common error cases
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;
        const errorData = data as { error?: string; message?: string } | undefined;
        
        // Handle 401 Unauthorized - Try to refresh token
        // Skip refresh logic for auth endpoints that shouldn't trigger refresh (to prevent infinite loops)
        const isAuthEndpoint = originalRequest?.url?.includes('/auth/refresh') || 
                                originalRequest?.url?.includes('/auth/verify-token') ||
                                originalRequest?.url?.includes('/auth/login');
        
        if (status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers && token) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        // Check if refresh token exists
        if (typeof window !== 'undefined') {
          const refreshToken = localStorage.getItem('refreshToken');
          
          if (!refreshToken) {
            // No refresh token, clear everything and redirect
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            isRefreshing = false;
            processQueue(new Error('No refresh token available'), null);
            
            // Redirect to signin if not already there
            if (window.location.pathname !== '/signin') {
              window.location.href = '/signin';
            }
            
            const errorMessage = errorData?.error || errorData?.message || 'Authentication required';
            return Promise.reject(new Error(errorMessage));
          }

          try {
            // Lazy import to avoid circular dependency
            const { store } = await import('@/store');
            const { refreshTokenThunk } = await import('@/store/auth/authThunks');
            
            // Attempt to refresh the token
            const result = await store.dispatch(refreshTokenThunk());
            
            if (refreshTokenThunk.fulfilled.match(result)) {
              // Token refreshed successfully
              const newAccessToken = result.payload.access_token;
              
              // Update the original request with new token
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              }
              
              isRefreshing = false;
              processQueue(null, newAccessToken);
              
              // Retry the original request
              return axiosInstance(originalRequest);
            } else {
              // Refresh failed
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              isRefreshing = false;
              processQueue(new Error('Token refresh failed'), null);
              
              // Redirect to signin if not already there
              if (window.location.pathname !== '/signin') {
                window.location.href = '/signin';
              }
              
              return Promise.reject(new Error('Token refresh failed'));
            }
          } catch (refreshError) {
            // Refresh error
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            isRefreshing = false;
            processQueue(refreshError as Error, null);
            
            // Redirect to signin if not already there
            if (window.location.pathname !== '/signin') {
              window.location.href = '/signin';
            }
            
            return Promise.reject(refreshError);
          }
        }
      }
      
      // Extract error message from response
      const errorMessage = errorData?.error || errorData?.message || 'An error occurred';
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      // Something else happened
      return Promise.reject(new Error(error.message || 'An error occurred'));
    }
  }
);

export default axiosInstance;
