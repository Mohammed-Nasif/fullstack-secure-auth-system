export const SECURITY_CONFIG = {
  RATE_LIMITS: {
    GLOBAL: { limit: 100, ttl: 60000 },
    SIGNUP: { limit: 5, ttl: 60000 },
    SIGNIN: { limit: 10, ttl: 60000 },
  },
  REQUEST_SIZE_LIMIT: '1mb',
  BCRYPT_ROUNDS: 10,
  COOKIE_SETTINGS: {
    SAME_SITE: 'lax' as const,
    HTTP_ONLY: true,
  },
  HELMET_CSP: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"],
  }
} as const;