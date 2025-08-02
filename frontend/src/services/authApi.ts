import axios from 'axios';
import { SignupData, SigninData, User, ApiResponse } from '../types/auth.types';

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json'; // To match the backend expectations

// Flag to prevent infinite loops during token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

// Callback for handling authentication failures
let onAuthFailure: (() => void) | null = null;
let onTokenRefreshSuccess: (() => void) | null = null;

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Response interceptor to handle token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if the request is to signup, signin, or refresh-token endpoints
    const isAuthEndpoint = originalRequest.url?.includes('/auth/signup') || 
                          originalRequest.url?.includes('/auth/signin') || 
                          originalRequest.url?.includes('/auth/refresh-token');
    
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return axios(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post('/auth/refresh-token', {});
        processQueue(null, 'token');
        
        // Call the success callback if set
        if (onTokenRefreshSuccess) {
          onTokenRefreshSuccess();
        }
        
        return axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Call the auth failure callback if set
        if (onAuthFailure) {
          onAuthFailure();
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Function to set the auth failure callback
export const setAuthFailureCallback = (callback: () => void) => {
  onAuthFailure = callback;
};

// Function to set the token refresh success callback
export const setTokenRefreshSuccessCallback = (callback: (() => void) | null) => {
  onTokenRefreshSuccess = callback;
};

export const authApi = {
  signup: async (data: SignupData): Promise<User> => {
    const response = await axios.post<ApiResponse<User>>('/auth/signup', data);
    return response.data.data!;
  },

  signin: async (data: SigninData): Promise<void> => {
    await axios.post<ApiResponse>('/auth/signin', data);
  },

  logout: async (): Promise<void> => {
    // Clear any ongoing token refresh attempts on logout
    isRefreshing = false;
    failedQueue = [];
    await axios.post('/auth/logout', {});
  },

  refreshToken: async (): Promise<void> => {
    await axios.post('/auth/refresh-token', {});
  },

  getProfile: async (): Promise<User> => {
    const response = await axios.get<ApiResponse<User>>('/auth/profile');
    if (!response.data.data) {
      throw new Error('No user data');
    }
    return response.data.data;
  },
};