/**
 * HTTP Status utility functions for consistent status text mapping
 */

const STATUS_TEXTS: Record<number, string> = {
  // 2xx Success
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  204: 'No Content',
  
  // 3xx Redirection
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  304: 'Not Modified',
  
  // 4xx Client Error
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  
  // 5xx Server Error
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
};

/**
 * Gets the status text for a given HTTP status code
 * @param statusCode - HTTP status code
 * @returns Status text or 'Unknown Status' if not found
 */
export const getStatusText = (statusCode: number): string => {
  return STATUS_TEXTS[statusCode] || 'Unknown Status';
};

/**
 * Checks if status code indicates an error (4xx or 5xx)
 * @param statusCode - HTTP status code
 * @returns True if status code is 400 or higher
 */
export const isError = (statusCode: number): boolean => {
  return statusCode >= 400;
};

/**
 * Checks if status code indicates a server error (5xx)
 * @param statusCode - HTTP status code
 * @returns True if status code is 500 or higher
 */
export const isServerError = (statusCode: number): boolean => {
  return statusCode >= 500;
};

/**
 * Checks if status code indicates a client error (4xx)
 * @param statusCode - HTTP status code
 * @returns True if status code is between 400 and 499
 */
export const isClientError = (statusCode: number): boolean => {
  return statusCode >= 400 && statusCode < 500;
};