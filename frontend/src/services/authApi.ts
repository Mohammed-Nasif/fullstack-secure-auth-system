import axios from 'axios';
import { SignupData, SigninData, User, ApiResponse } from '../types/auth.types';

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json'; // To match the backend expectations

export const authApi = {
  signup: async (data: SignupData): Promise<User> => {
    const response = await axios.post<ApiResponse<User>>('/auth/signup', data);
    return response.data.data!;
  },

  signin: async (data: SigninData): Promise<void> => {
    await axios.post<ApiResponse>('/auth/signin', data);
  },

  logout: async (): Promise<void> => {
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