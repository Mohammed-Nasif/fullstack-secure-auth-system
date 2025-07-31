/**
 * HTTP Status utility for consistent status text mapping
 */
export class HttpStatusUtil {
  private static readonly STATUS_TEXTS: Record<number, string> = {
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

  static getStatusText(statusCode: number): string {
    return this.STATUS_TEXTS[statusCode] || 'Unknown Status';
  }

  static isError(statusCode: number): boolean {
    return statusCode >= 400;
  }

  static isServerError(statusCode: number): boolean {
    return statusCode >= 500;
  }

  static isClientError(statusCode: number): boolean {
    return statusCode >= 400 && statusCode < 500;
  }
}