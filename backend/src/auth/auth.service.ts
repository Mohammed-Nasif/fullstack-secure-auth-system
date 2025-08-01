import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../users/users.repository';
import { SignupDto } from './dtos/signup.dto';
import { SigninDto } from './dtos/signin.dto';
import { Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { SECURITY_CONFIG, AUTH_MESSAGES } from '@common';

/**
 * Authentication Service
 * 
 * Handles all authentication-related operations including:
 * - User registration with secure password hashing
 * - User authentication with credential validation
 * - JWT token generation and refresh token management
 * - Secure logout with token invalidation
 * 
 * Security Features:
 * - bcrypt password hashing with configurable rounds
 * - JWT access/refresh token pair implementation
 * - Refresh token rotation for enhanced security
 * - Comprehensive input validation and sanitization
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Registers a new user with the provided credentials.
   * 
   * Process:
   * 1. Validates email uniqueness
   * 2. Hashes password with bcrypt
   * 3. Creates user record
   * 4. Generates JWT token pair
   * 5. Stores hashed refresh token
   * 
   * @param SignupDto - Data transfer object containing user registration details (email, password, etc.).
   * @returns An object containing authentication tokens, and basic user information.
   * @throws {ConflictException} If the email is already registered.
   */
  async signup(SignupDto: SignupDto) {
    const { password } = SignupDto;

    const hashedPassword = await bcrypt.hash(password, SECURITY_CONFIG.BCRYPT_ROUNDS);
    
    try {
      const newUser = await this.usersRepository.create({
        ...SignupDto,
        password: hashedPassword,
      });

      const tokens = await this.generateTokens(
        (newUser._id as Types.ObjectId).toString(), 
        newUser.email
      );
      
      const hashedRt = await bcrypt.hash(tokens.refresh_token, SECURITY_CONFIG.BCRYPT_ROUNDS);
      await this.usersRepository.updateRefreshToken(
        (newUser._id as Types.ObjectId).toString(), 
        hashedRt
      );

      return {
        tokens,
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
        },
      };
    } catch (error: any) {
      if (error.code === 11000 || error.message?.includes('duplicate key')) {
        throw new ConflictException(AUTH_MESSAGES.EMAIL_EXISTS);
      }
      
      throw error;
    }
  }

  /**
   * Authenticates user credentials
   * 
   * Process:
   * 1. Validates user exists
   * 2. Compares password hash
   * 3. Generates new token pair
   * 4. Updates refresh token
   * 
   * @param signinDto - User login credentials
   * @returns Authentication tokens
   * @throws UnauthorizedException - Invalid credentials
   */
  async signin(signInDto: SigninDto) {
    const { email, password } = signInDto;

    const user = await this.usersRepository.findByEmail(email);
    if (!user) throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);

    const tokens = await this.generateTokens((user._id as Types.ObjectId).toString(), user.email);
    const hashedRt = await bcrypt.hash(tokens.refresh_token, SECURITY_CONFIG.BCRYPT_ROUNDS);
    await this.usersRepository.updateRefreshToken((user._id as Types.ObjectId).toString(), hashedRt);

    return { access_token: tokens.access_token, refresh_token: tokens.refresh_token };
  }

  /**
   * Refreshes access token using refresh token
   * 
   * Security:
   * - Validates refresh token hash
   * - Generates new token pair
   * - Rotates refresh token
   * 
   * @param userId - User identifier
   * @param refreshToken - Current refresh token
   * @returns New authentication tokens
   * @throws UnauthorizedException - Invalid refresh token
   */
  async refreshToken(userId: string, rt: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user || !user.hashedRefreshToken)
      throw new ForbiddenException('Access denied');

    const rtMatches = await bcrypt.compare(rt, user.hashedRefreshToken);
    if (!rtMatches) throw new ForbiddenException(AUTH_MESSAGES.INVALID_REFRESH_TOKEN);

    const tokens = await this.generateTokens(userId, user.email);
    const hashedRt = await bcrypt.hash(tokens.refresh_token, SECURITY_CONFIG.BCRYPT_ROUNDS);
    await this.usersRepository.updateRefreshToken(userId, hashedRt);

    return tokens;
  }

  /**
   * Securely logs out user
   * 
   * Process:
   * 1. Invalidates refresh token
   * 2. Clears stored refresh token hash
   * 
   * @param userId - User identifier
   */
  async logout(userId: string): Promise<void> {
    await this.usersRepository.removeRefreshToken(userId);
  }

  /**
   * Generates JWT access and refresh token pair
   * 
   * @param userId - User identifier
   * @param email - User email
   * @returns Token pair with expiration info
   */
  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN');
    const jwtRefreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    const jwtRefreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN');

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: jwtSecret,
        expiresIn: jwtExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: jwtRefreshSecret,
        expiresIn: jwtRefreshExpiresIn,
      }),
    ]);

    return { access_token, refresh_token };
  }

  /**
   * Refreshes tokens using a refresh token from cookie.
   * Extracts userId from the refresh token payload and calls the existing refresh logic.
   *
   * @param refreshToken - The refresh token from the cookie
   * @returns A promise that resolves to an object containing new authentication tokens
   * @throws {UnauthorizedException} If the refresh token is invalid or expired
   */
  async refreshTokenFromCookie(refreshToken: string) {
    try {
      const jwtRefreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
      
      // Verify and decode the refresh token to get userId
      const payload = this.jwtService.verify(refreshToken, {
        secret: jwtRefreshSecret,
      });
      
      const userId = payload.sub;
      
      // Use the existing refresh logic
      return this.refreshToken(userId, refreshToken);
    } catch (error) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
    }
  }
}
