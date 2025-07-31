import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { SigninDto } from './signin.dto';

class TestSigninDto {
  email!: string;
  password!: string;
}

describe('SigninDto', () => {
  const createSigninDto = (overrides: Partial<SigninDto> = {}): SigninDto => {
    const dto = plainToClass(SigninDto, {
      email: 'test@example.com',
      password: 'SecurePass123!',
      ...overrides,
    });
    return dto;
  };

  describe('email validation', () => {
    it('should pass with valid email', async () => {
      const dto = createSigninDto({ email: 'user@example.com' });
      const errors = await validate(dto);
      const emailErrors = errors.filter(error => error.property === 'email');
      expect(emailErrors).toHaveLength(0);
    });

    it('should fail with invalid email format', async () => {
      const dto = createSigninDto({ email: 'invalid-email' });
      const errors = await validate(dto);
      const emailErrors = errors.filter(error => error.property === 'email');
      expect(emailErrors).toHaveLength(1);
    });

    it('should fail with empty email', async () => {
      const dto = createSigninDto({ email: '' });
      const errors = await validate(dto);
      const emailErrors = errors.filter(error => error.property === 'email');
      expect(emailErrors.length).toBeGreaterThan(0);
    });
  });

  describe('password validation', () => {
    it('should pass with any non-empty password', async () => {
      const dto = createSigninDto({ password: 'anypassword' });
      const errors = await validate(dto);
      const passwordErrors = errors.filter(error => error.property === 'password');
      expect(passwordErrors).toHaveLength(0);
    });

    it('should fail with empty password', async () => {
      const dto = createSigninDto({ password: '' });
      const errors = await validate(dto);
      const passwordErrors = errors.filter(error => error.property === 'password');
      expect(passwordErrors.length).toBeGreaterThan(0);
    });
  });

  describe('complete validation', () => {
    it('should pass with valid credentials', async () => {
      const dto = createSigninDto();
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  it('should be defined', () => {
    expect(TestSigninDto).toBeDefined();
  });

  it('should create instance with valid data', () => {
    const dto = plainToClass(TestSigninDto, {
      email: 'test@example.com',
      password: 'password123',
    });
    
    expect(dto.email).toBe('test@example.com');
    expect(dto.password).toBe('password123');
  });

  it('should validate email format', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test('test@example.com')).toBe(true);
    expect(emailRegex.test('invalid-email')).toBe(false);
  });
});