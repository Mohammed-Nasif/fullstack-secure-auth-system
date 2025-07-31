/**
 * Application environment constants
 * Used for consistent environment checking across the application
 */
export const ENVIRONMENT = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
} as const;

/**
 * Type for environment values
 */
export type EnvironmentType = typeof ENVIRONMENT[keyof typeof ENVIRONMENT];

/**
 * Utility functions for environment checking
 */
export const EnvironmentUtils = {
  /**
   * Checks if the current environment is production
   * @param nodeEnv - Current NODE_ENV value
   * @returns true if production environment
   */
  isProduction: (nodeEnv: string): boolean => nodeEnv === ENVIRONMENT.PRODUCTION,
  
  /**
   * Checks if the current environment is development
   * @param nodeEnv - Current NODE_ENV value
   * @returns true if development environment
   */
  isDevelopment: (nodeEnv: string): boolean => nodeEnv === ENVIRONMENT.DEVELOPMENT,
  
  /**
   * Checks if the current environment is test
   * @param nodeEnv - Current NODE_ENV value
   * @returns true if test environment
   */
  isTest: (nodeEnv: string): boolean => nodeEnv === ENVIRONMENT.TEST,
} as const;