import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SanitizeEmail, EnsureString } from '@common';

/**
 * Data Transfer Object for user authentication/login
 *
 * This DTO handles user sign-in with basic validation:
 * - Email format validation (must match registered email)
 * - Password minimum length (actual validation against hash happens in service)
 *
 * Security Features:
 * - Email sanitization and normalization
 * - Object injection prevention
 * - No password sanitization (preserves exact input for hash comparison)
 *
 * @example
 * ```typescript
 * const loginData: SignInDto = {
 *   email: 'john@example.com',
 *   password: 'userProvidedPassword'
 * };
 * ```
 */
export class SigninDto {
  /**
   * Registered user's email address
   *
   * Validation Rules:
   * - Must be a valid email format
   * - Required field (cannot be empty)
   * - Automatically converted to lowercase for consistency
   *
   * Security Features:
   * - Email sanitization applied
   * - Protected against object injection
   * - Used for user lookup in authentication process
   */
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Registered user email address',
    format: 'email',
  })
  @SanitizeEmail()
  @EnsureString()
  @IsEmail()
  email!: string;

  /**
   * User's password for authentication
   *
   * Validation Rules:
   * - Minimum 8 characters (basic length check)
   * - Required field (cannot be empty)
   *
   * Security Notes:
   * - No sanitization applied (preserves exact input)
   * - Compared against bcrypt hash during authentication
   * - Never stored or logged in plain text
   * - Rate limiting applied at controller level
   */
  @ApiProperty({
    example: 'Pa$$word123!',
    description: 'User password (must match validation rules)',
    minLength: 8,
  })
  @EnsureString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;
}
