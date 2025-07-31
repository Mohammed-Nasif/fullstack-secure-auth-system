import { ConfigService } from '@nestjs/config';
import { parseDuration } from './parseDuration.util';
import { EnvironmentUtils } from '../constants/environment.constants';

/**
 * Cookie configuration interface for HTTP-only authentication cookies
 */
export interface CookieConfig {
  /** Prevents JavaScript access to cookie (XSS protection) */
  httpOnly: boolean;
  /** Cookie expiration time in milliseconds */
  maxAge: number;
  /** Controls cross-site request inclusion (CSRF protection) */
  sameSite: 'lax' | 'strict' | 'none';
  /** Requires HTTPS in production (secure transmission) */
  secure: boolean;
}

/**
 * Creates configuration for JWT access token cookies
 * @param configService - NestJS configuration service instance
 * @returns Cookie configuration object for access tokens
 * 
 * @example
 * ```typescript
 * const config = getAccessTokenCookieConfig(configService);
 * res.cookie('access_token', token, config);
 * ```
 */
export const getAccessTokenCookieConfig = (configService: ConfigService): CookieConfig => {
  const accessExpiry = configService.get<string>('JWT_EXPIRES_IN');
  const nodeEnv = configService.get<string>('NODE_ENV') as string;
  
  return {
    httpOnly: true,
    maxAge: parseDuration(accessExpiry as string),
    sameSite: 'lax',
    secure: EnvironmentUtils.isProduction(nodeEnv),
  };
};

/**
 * Creates configuration for JWT refresh token cookies
 * @param configService - NestJS configuration service instance
 * @returns Cookie configuration object for refresh tokens
 * 
 * @example
 * ```typescript
 * const config = getRefreshTokenCookieConfig(configService);
 * res.cookie('refresh_token', token, config);
 * ```
 */
export const getRefreshTokenCookieConfig = (configService: ConfigService): CookieConfig => {
  const refreshExpiry = configService.get<string>('JWT_REFRESH_EXPIRES_IN');
  const nodeEnv = configService.get<string>('NODE_ENV') as string;
  
  return {
    httpOnly: true,
    maxAge: parseDuration(refreshExpiry as string),
    sameSite: 'lax',
    secure: EnvironmentUtils.isProduction(nodeEnv),
  };
};

/**
 * Creates configuration for clearing authentication cookies
 * Used during logout to properly remove cookies from client
 * @param configService - NestJS configuration service instance
 * @returns Partial cookie configuration for cookie clearing
 * 
 * @example
 * ```typescript
 * const clearConfig = getClearCookieConfig(configService);
 * res.clearCookie('access_token', clearConfig);
 * res.clearCookie('refresh_token', clearConfig);
 * ```
 */
export const getClearCookieConfig = (configService: ConfigService): Partial<CookieConfig> => {
  const nodeEnv = configService.get<string>('NODE_ENV') as string;

  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: EnvironmentUtils.isProduction(nodeEnv),
  };
};