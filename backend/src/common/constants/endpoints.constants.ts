/**
 * API endpoint constants
 * Used for consistent routing across controllers and documentation
 */
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    BASE: 'auth',
    SIGNUP: 'signup',
    SIGNIN: 'signin',
    LOGOUT: 'logout',
    REFRESH_TOKEN: 'refresh-token',
    PROFILE: 'profile',
  },
  
  // Health monitoring endpoints
  HEALTH: {
    BASE: 'health',
    SECURITY: 'security',
    DATABASE: 'database',
    DETAILED: 'detailed',
    SYSTEM: 'system',
  },
  
  // API documentation
  DOCS: {
    BASE: 'api',
  },
} as const;

/**
 * Utility functions for building endpoint paths
 */
export const EndpointUtils = {
  /**
   * Builds full authentication endpoint path
   * @param endpoint - Auth endpoint name
   * @returns Full endpoint path
   */
  buildAuthPath: (endpoint?: keyof typeof API_ENDPOINTS.AUTH): string => {
    if (!endpoint || endpoint === 'BASE') {
      return API_ENDPOINTS.AUTH.BASE;
    }
    return `${API_ENDPOINTS.AUTH.BASE}/${API_ENDPOINTS.AUTH[endpoint]}`;
  },
  
  /**
   * Builds full health endpoint path
   * @param endpoint - Health endpoint name
   * @returns Full endpoint path
   */
  buildHealthPath: (endpoint?: keyof typeof API_ENDPOINTS.HEALTH): string => {
    if (!endpoint || endpoint === 'BASE') {
      return API_ENDPOINTS.HEALTH.BASE;
    }
    return `${API_ENDPOINTS.HEALTH.BASE}/${API_ENDPOINTS.HEALTH[endpoint]}`;
  },
} as const;