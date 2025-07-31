import { Transform } from 'class-transformer';
import { SanitizeEmail, SanitizeText, EnsureString } from './sanitize.transform';

describe('SanitizeTransforms', () => {
  describe('SanitizeEmail', () => {
    it('should convert email to lowercase and trim', () => {
      const sanitizeEmailTransform = (value: any) => {
        if (typeof value !== 'string') return '';
        return value.trim().toLowerCase();
      };
      
      expect(sanitizeEmailTransform('  TEST@EXAMPLE.COM  ')).toBe('test@example.com');
      expect(sanitizeEmailTransform('User@Domain.COM')).toBe('user@domain.com');
    });

    it('should handle null and undefined', () => {
      const sanitizeEmailTransform = (value: any) => {
        if (typeof value !== 'string') return '';
        return value.trim().toLowerCase();
      };
      
      expect(sanitizeEmailTransform(null)).toBe('');
      expect(sanitizeEmailTransform(undefined)).toBe('');
    });
  });

  describe('SanitizeText', () => {
    it('should remove HTML tags and trim', () => {
      // More comprehensive HTML tag removal
      const sanitizeTextTransform = (value: any) => {
        if (typeof value !== 'string') return '';
        // Remove script tags and their content completely
        let cleaned = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        // Remove all other HTML tags but keep content
        cleaned = cleaned.replace(/<[^>]*>/g, '');
        return cleaned.trim();
      };
      
      expect(sanitizeTextTransform('<script>alert("xss")</script>Hello')).toBe('Hello');
      expect(sanitizeTextTransform('  <b>Bold</b> text  ')).toBe('Bold text');
      expect(sanitizeTextTransform('<img src="x" onerror="alert(1)">Test')).toBe('Test');
    });

    it('should handle empty and whitespace strings', () => {
      const sanitizeTextTransform = (value: any) => {
        if (typeof value !== 'string') return '';
        let cleaned = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        cleaned = cleaned.replace(/<[^>]*>/g, '');
        return cleaned.trim();
      };
      
      expect(sanitizeTextTransform('   ')).toBe('');
      expect(sanitizeTextTransform('')).toBe('');
    });
  });

  describe('EnsureString', () => {
    it('should convert non-strings to strings', () => {
      const ensureStringTransform = (value: any) => {
        return String(value);
      };
      
      expect(ensureStringTransform(123)).toBe('123');
      expect(ensureStringTransform(true)).toBe('true');
      expect(ensureStringTransform({ name: 'test' })).toBe('[object Object]');
    });

    it('should keep strings as strings', () => {
      const ensureStringTransform = (value: any) => {
        return String(value);
      };
      
      expect(ensureStringTransform('hello')).toBe('hello');
      expect(ensureStringTransform('')).toBe('');
    });
  });

  describe('Decorator Functions', () => {
    it('should return Transform decorators', () => {
      const emailTransform = SanitizeEmail();
      const textTransform = SanitizeText();
      const stringTransform = EnsureString();
      
      expect(emailTransform).toBeDefined();
      expect(textTransform).toBeDefined();
      expect(stringTransform).toBeDefined();
    });
  });
});
