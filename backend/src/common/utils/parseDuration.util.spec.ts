import { parseDuration } from './parseDuration.util';

describe('ParseDurationUtil', () => {
  describe('parseDuration', () => {
    it('should parse seconds', () => {
      expect(parseDuration('30s')).toBe(30 * 1000);
      expect(parseDuration('5s')).toBe(5 * 1000);
    });

    it('should parse minutes', () => {
      expect(parseDuration('5m')).toBe(5 * 60 * 1000);
      expect(parseDuration('30m')).toBe(30 * 60 * 1000);
    });

    it('should parse hours', () => {
      expect(parseDuration('2h')).toBe(2 * 60 * 60 * 1000);
      expect(parseDuration('24h')).toBe(24 * 60 * 60 * 1000);
    });

    it('should parse days', () => {
      expect(parseDuration('7d')).toBe(7 * 24 * 60 * 60 * 1000);
      expect(parseDuration('30d')).toBe(30 * 24 * 60 * 60 * 1000);
    });

    it('should throw error for invalid format', () => {
      expect(() => parseDuration('invalid')).toThrow('Invalid duration format');
      expect(() => parseDuration('5x')).toThrow('Invalid duration format');
    });

    it('should throw error for empty string', () => {
      expect(() => parseDuration('')).toThrow('Invalid duration: expected non-empty string');
    });

    it('should throw error for negative values', () => {
      expect(() => parseDuration('-1s')).toThrow('Invalid duration format');
      expect(() => parseDuration('-5m')).toThrow('Invalid duration format');
    });

    it('should handle positive values only', () => {
      expect(parseDuration('1s')).toBe(1000);
      expect(parseDuration('1m')).toBe(60000);
      expect(parseDuration('1h')).toBe(3600000);
      expect(parseDuration('1d')).toBe(86400000);
    });

    it('should throw error for zero values', () => {
      expect(() => parseDuration('0s')).toThrow('Invalid duration value');
      expect(() => parseDuration('0m')).toThrow('Invalid duration value');
      expect(() => parseDuration('0h')).toThrow('Invalid duration value');
      expect(() => parseDuration('0d')).toThrow('Invalid duration value');
    });
  });
});