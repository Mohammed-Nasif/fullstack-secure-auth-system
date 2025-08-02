export interface SignupData {
  email: string;
  name: string;
  password: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface ApiResponse<T = unknown> {
  statusCode: number;
  message: string;
  data?: T;
  timestamp: string;
}

export interface AuthHookReturn {
  signup: (data: SignupData) => Promise<{ success: boolean; user?: User }>;
  signin: (data: SigninData) => Promise<{ success: boolean }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<{ success: boolean }>;
  getProfile: () => Promise<User | null>;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}