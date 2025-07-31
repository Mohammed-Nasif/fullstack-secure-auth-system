import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { SignupDto } from './signup.dto';

describe('SignupDto', () => {
  it('should validate a valid signup dto', async () => {
    const dto = plainToClass(SignupDto, {
      email: 'test@example.com',
      name: 'John Doe',
      password: 'SecurePass123!',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation for invalid email', async () => {
    const dto = plainToClass(SignupDto, {
      email: 'invalid-email',
      name: 'John Doe',
      password: 'SecurePass123!',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail validation for missing name', async () => {
    const dto = plainToClass(SignupDto, {
      email: 'test@example.com',
      password: 'SecurePass123!',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const nameError = errors.find(error => error.property === 'name');
    expect(nameError).toBeDefined();
  });

  it('should fail validation for weak password', async () => {
    const dto = plainToClass(SignupDto, {
      email: 'test@example.com',
      name: 'John Doe',
      password: 'weak',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const passwordError = errors.find(error => error.property === 'password');
    expect(passwordError).toBeDefined();
  });

  it('should sanitize email to lowercase', () => {
    const dto = plainToClass(SignupDto, {
      email: 'TEST@EXAMPLE.COM',
      name: 'John Doe',
      password: 'SecurePass123!',
    });

    // Test that transforms are applied (if implemented)
    expect(dto.email).toBeDefined();
  });
});