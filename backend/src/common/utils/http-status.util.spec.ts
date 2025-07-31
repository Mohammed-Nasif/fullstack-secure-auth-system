import { getStatusText, isError, isServerError, isClientError } from './http-status.util';

describe('HTTP Status Utility', () => {
  describe('getStatusText', () => {
    it('should return correct status text for 2xx codes', () => {
      expect(getStatusText(200)).toBe('OK');
      expect(getStatusText(201)).toBe('Created');
      expect(getStatusText(202)).toBe('Accepted');
      expect(getStatusText(204)).toBe('No Content');
    });

    it('should return correct status text for 3xx codes', () => {
      expect(getStatusText(300)).toBe('Multiple Choices');
      expect(getStatusText(301)).toBe('Moved Permanently');
      expect(getStatusText(302)).toBe('Found');
      expect(getStatusText(304)).toBe('Not Modified');
    });

    it('should return correct status text for 4xx codes', () => {
      expect(getStatusText(400)).toBe('Bad Request');
      expect(getStatusText(401)).toBe('Unauthorized');
      expect(getStatusText(403)).toBe('Forbidden');
      expect(getStatusText(404)).toBe('Not Found');
      expect(getStatusText(405)).toBe('Method Not Allowed');
      expect(getStatusText(409)).toBe('Conflict');
      expect(getStatusText(422)).toBe('Unprocessable Entity');
      expect(getStatusText(429)).toBe('Too Many Requests');
    });

    it('should return correct status text for 5xx codes', () => {
      expect(getStatusText(500)).toBe('Internal Server Error');
      expect(getStatusText(501)).toBe('Not Implemented');
      expect(getStatusText(502)).toBe('Bad Gateway');
      expect(getStatusText(503)).toBe('Service Unavailable');
      expect(getStatusText(504)).toBe('Gateway Timeout');
    });

    it('should return "Unknown Status" for unknown status codes', () => {
      expect(getStatusText(999)).toBe('Unknown Status');
      expect(getStatusText(100)).toBe('Unknown Status');
      expect(getStatusText(418)).toBe('Unknown Status');
    });
  });

  describe('isError', () => {
    it('should return false for 2xx and 3xx status codes', () => {
      expect(isError(200)).toBe(false);
      expect(isError(201)).toBe(false);
      expect(isError(300)).toBe(false);
      expect(isError(301)).toBe(false);
      expect(isError(399)).toBe(false);
    });

    it('should return true for 4xx status codes', () => {
      expect(isError(400)).toBe(true);
      expect(isError(404)).toBe(true);
      expect(isError(422)).toBe(true);
      expect(isError(499)).toBe(true);
    });

    it('should return true for 5xx status codes', () => {
      expect(isError(500)).toBe(true);
      expect(isError(503)).toBe(true);
      expect(isError(599)).toBe(true);
    });
  });

  describe('isServerError', () => {
    it('should return false for status codes below 500', () => {
      expect(isServerError(200)).toBe(false);
      expect(isServerError(300)).toBe(false);
      expect(isServerError(400)).toBe(false);
      expect(isServerError(404)).toBe(false);
      expect(isServerError(499)).toBe(false);
    });

    it('should return true for 5xx status codes', () => {
      expect(isServerError(500)).toBe(true);
      expect(isServerError(501)).toBe(true);
      expect(isServerError(503)).toBe(true);
      expect(isServerError(599)).toBe(true);
    });
  });

  describe('isClientError', () => {
    it('should return false for status codes below 400', () => {
      expect(isClientError(200)).toBe(false);
      expect(isClientError(300)).toBe(false);
      expect(isClientError(399)).toBe(false);
    });

    it('should return true for 4xx status codes', () => {
      expect(isClientError(400)).toBe(true);
      expect(isClientError(401)).toBe(true);
      expect(isClientError(404)).toBe(true);
      expect(isClientError(499)).toBe(true);
    });

    it('should return false for 5xx status codes', () => {
      expect(isClientError(500)).toBe(false);
      expect(isClientError(503)).toBe(false);
      expect(isClientError(599)).toBe(false);
    });
  });
});