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

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  /**
   * Registers a new user with the provided credentials.
   * 
   * - Checks if the email is already in use and throws a `ConflictException` if so.
   * - Hashes the user's password before storing.
   * - Creates the user in the repository.
   * - Generates access and refresh tokens for the new user.
   * - Hashes and stores the refresh token.
   * 
   * @param SignupDto - Data transfer object containing user registration details (email, password, etc.).
   * @returns An object containing authentication tokens, and basic user information.
   * @throws {ConflictException} If the email is already registered.
   */
  async signup(SignupDto: SignupDto) {
    const { email, password } = SignupDto;

    const emailExists = await this.usersRepository.existsByEmail(email);
    if (emailExists) {
      throw new ConflictException(AUTH_MESSAGES.EMAIL_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, SECURITY_CONFIG.BCRYPT_ROUNDS);
    const newUser = await this.usersRepository.create({
      ...SignupDto,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens((newUser._id as Types.ObjectId).toString(), newUser.email);
    const hashedRt = await bcrypt.hash(tokens.refresh_token, SECURITY_CONFIG.BCRYPT_ROUNDS);
    await this.usersRepository.updateRefreshToken((newUser._id as Types.ObjectId).toString(), hashedRt);

    return {
      tokens,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      },
    };
  }

  /**
   * Authenticates a user with the provided credentials.
   *
   * @param signInDto - Data transfer object containing the user's email and password.
   * @returns An object containing the access and refresh tokens if authentication is successful.
   * @throws UnauthorizedException If the credentials are invalid or authentication fails.
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
   * Refreshes the authentication tokens for a user.
   *
   * This method verifies the provided refresh token (`rt`) against the stored hashed refresh token
   * for the user identified by `userId`. If the token is valid, it generates new access and refresh tokens,
   * hashes the new refresh token, and updates it in the user's record.
   *
   * @param userId - The unique identifier of the user requesting token refresh.
   * @param rt - The refresh token provided by the user.
   * @returns A promise that resolves to an object containing new authentication tokens.
   * @throws {ForbiddenException} If the user does not exist, does not have a stored refresh token,
   *         or if the provided refresh token is invalid.
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
   * Logs out the user by removing their refresh token from the repository.
   *
   * @param userId - The unique identifier of the user to log out.
   * @returns A promise that resolves when the refresh token has been removed.
   */
  async logout(userId: string) {
    await this.usersRepository.removeRefreshToken(userId);
  }

  /**
   * Generates JWT access and refresh tokens for a given user.
   *
   * @param userId - The unique identifier of the user.
   * @param email - The email address of the user.
   * @returns An object containing the generated `access_token` and `refresh_token`.
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
