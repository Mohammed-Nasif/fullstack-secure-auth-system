export const AUTH_MESSAGES = {
  SIGNUP_SUCCESS: 'User created successfully',
  SIGNIN_SUCCESS: 'Logged in successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
  REFRESH_SUCCESS: 'Token refreshed successfully',
  PROFILE_SUCCESS: 'Profile retrieved successfully',
  EMAIL_EXISTS: 'Email is already in use',
  INVALID_CREDENTIALS: 'Invalid credentials',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token',
  REFRESH_TOKEN_NOT_FOUND: 'Refresh token not found',
  INTERNAL_ERROR: 'Internal server error',
} as const;

export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Invalid email format',
  NAME_REQUIRED: 'Name is required',
  NAME_MIN_LENGTH: 'Name must be at least 3 characters',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters long',
  PASSWORD_PATTERN: 'Password must contain at least one letter, one number, and one special character',
  INVALID_INPUT_HTML: 'Invalid input detected. HTML tags and script content are not allowed in this field.',
} as const;

export const HEALTH_MESSAGES = {
  SYSTEM_HEALTHY: 'System is healthy',
  SECURITY_ACTIVE: 'Security features active',
  DATABASE_CONNECTED: 'Database connection is healthy',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
} as const;