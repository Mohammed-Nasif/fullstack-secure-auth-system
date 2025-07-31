import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

/**
 * Sanitizes email input: trims whitespace and converts to lowercase
 */
export const SanitizeEmail = () =>
  Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.trim().toLowerCase();
    }
    return value;
  });


/**
 * Sanitizes text input and detects malicious content
 * Throws error if HTML/script content is detected
 */
export const SanitizeText = () =>
  Transform(({ value }) => {
    if (typeof value === 'string') {
      // Check if input contains HTML tags or suspicious patterns
      const hasHtmlTags = /<[^>]*>/g.test(value);
      const hasSuspiciousPatterns = /javascript:|on\w+\s*=|<script|<iframe|<object|<embed/gi.test(value);

      if (hasHtmlTags || hasSuspiciousPatterns) {
        console.log('🚨 Malicious content detected, rejecting input');
        throw new BadRequestException(
          `Invalid input detected. HTML tags and script content are not allowed in this field.`
        );
      }

      // If no malicious content, just clean up whitespace
      const result = value.trim().replace(/\s+/g, ' ');
      
      return result;
    }
    return value;
  });

/**
 * Ensures value is always a string (prevents object injection)
 */
export const EnsureString = () =>
  Transform(({ value }) => {
    if (typeof value === 'string') {
      return value;
    }
    if (value === null || value === undefined) {
      return '';
    }
    return String(value);
  });
