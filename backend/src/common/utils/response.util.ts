import { HttpStatus } from '@nestjs/common';

/**
 * Standard API response interface for consistent response formatting
 * @template T - Type of the data payload
 */
export interface ApiResponse<T = any> {
  /** HTTP status code */
  statusCode: number;
  /** Response message */
  message: string;
  /** Optional data payload */
  data?: T;
  /** Optional user information (for auth responses) */
  user?: any;
  /** ISO timestamp of response */
  timestamp?: string;
}

/**
 * Creates a standardized success response
 * @template T - Type of the data payload
 * @param message - Success message to display
 * @param data - Optional data to include in response
 * @param statusCode - HTTP status code (defaults to 200)
 * @returns Standardized API response object
 *
 * @example
 * ```typescript
 * return createSuccessResponse('User found', userData);
 * // Returns: { statusCode: 200, message: 'User found', data: userData, timestamp: '...' }
 * ```
 */
export const createSuccessResponse = <T>(
  message: string,
  data?: T,
  statusCode = HttpStatus.OK
): ApiResponse<T> => {
  return {
    statusCode,
    message,
    ...(data && { data }),
    timestamp: new Date().toISOString(),
  };
};

/**
 * Creates a standardized created response (HTTP 201)
 * @template T - Type of the data payload
 * @param message - Success message to display
 * @param user - Optional user information for auth responses
 * @returns Standardized API response object
 *
 * @example
 * ```typescript
 * return createCreatedResponse('User registered successfully', newUser);
 * // Returns: { statusCode: 201, message: '...', user: newUser, timestamp: '...' }
 * ```
 */
export const createCreatedResponse = <T>(
  message: string,
  user?: any
): ApiResponse<T> => {
  return {
    statusCode: HttpStatus.CREATED,
    message,
    ...(user && { user }),
    timestamp: new Date().toISOString(),
  };
};

/**
 * Creates a standardized error response
 * @param message - Error message to display
 * @param statusCode - HTTP status code (defaults to 500)
 * @returns Standardized API error response
 *
 * @example
 * ```typescript
 * return createErrorResponse('User not found', HttpStatus.NOT_FOUND);
 * // Returns: { statusCode: 404, message: 'User not found', timestamp: '...' }
 * ```
 */
export const createErrorResponse = (
  message: string,
  statusCode = HttpStatus.INTERNAL_SERVER_ERROR
): ApiResponse => {
  return {
    statusCode,
    message,
    timestamp: new Date().toISOString(),
  };
};