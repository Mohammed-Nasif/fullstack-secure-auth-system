import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SanitizeEmail, EnsureString, SanitizeText, VALIDATION_MESSAGES, PASSWORD_REGEX } from '@common';

/**
 * Data Transfer Object for creating a new user account
 * 
 * This DTO handles user registration with comprehensive validation:
 * - Email format validation and uniqueness checking
 * - Name length requirements with XSS protection
 * - Strong password requirements with pattern matching
 * 
 * Security Features:
 * - Input sanitization to prevent XSS attacks
 * - HTML tag detection and rejection
 * - Email normalization (lowercase, trimmed)
 * - Object injection prevention
 * 
 * @example
 * ```typescript
 * const userData: SignupDto = {
 *   email: 'john@example.com',
 *   name: 'John Doe',
 *   password: 'SecurePass123!'
 * };
 * ```
 */
export class SignupDto {
  /**
   * User's email address (must be unique in the system)
   * 
   * Validation Rules:
   * - Must be a valid email format
   * - Required field (cannot be empty)
   * - Automatically converted to lowercase
   * - Whitespace trimmed
   * 
   * Security Features:
   * - Email sanitization applied
   * - Protected against object injection
   */
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'User email address (must be unique)',
    format: 'email',
    minLength: 5,
    maxLength: 255,
  })
  @SanitizeEmail()
  @EnsureString()
  @IsEmail({}, { message: VALIDATION_MESSAGES.EMAIL_INVALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.EMAIL_REQUIRED })
  email!: string;

  /**
   * User's full name or display name
   * 
   * Validation Rules:
   * - Minimum 3 characters length
   * - Required field (cannot be empty)
   * - Must be a string type
   * - HTML tags not allowed (XSS protection)
   * 
   * Security Features:
   * - Text sanitization applied
   * - HTML/script tag detection
   * - Protected against object injection
   */
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user (min 3 characters, no HTML allowed)',
    minLength: 3,
    maxLength: 100,
  })
  @SanitizeText()
  @EnsureString()
  @IsString()
  @IsNotEmpty({ message: VALIDATION_MESSAGES.NAME_REQUIRED })
  @MinLength(3, { message: VALIDATION_MESSAGES.NAME_MIN_LENGTH })
  name!: string;

  /**
   * User's password (stored as bcrypt hash)
   * 
   * Validation Rules:
   * - Minimum 8 characters length
   * - Must contain at least one letter
   * - Must contain at least one number  
   * - Must contain at least one special character
   * - Required field (cannot be empty)
   * 
   * Security Features:
   * - Strong password pattern enforcement
   * - Protected against object injection
   * - Will be hashed with bcrypt before storage
   * - Original password never stored in database
   */
  @ApiProperty({
    example: 'Pa$$word123!',
    description: 'Password with minimum 8 characters, at least one letter, one number, and one special character',
    minLength: 8,
    maxLength: 128,
    pattern: PASSWORD_REGEX.source,
  })
  @EnsureString()
  @IsNotEmpty({ message: VALIDATION_MESSAGES.PASSWORD_REQUIRED })
  @MinLength(8, { message: VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH })
  @Matches(PASSWORD_REGEX, {
    message: VALIDATION_MESSAGES.PASSWORD_PATTERN,
  })
  password!: string;
}
