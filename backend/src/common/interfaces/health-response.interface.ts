export interface SystemHealthResponse {
  status: string;
  timestamp: string;
  uptime: string;
  environment: string;
  version: string;
  system: {
    platform: string;
    arch: string;
    nodeVersion: string;
    cpus: number;
    memory: {
      total: string;
      free: string;
      used: string;
      usage: string;
    };
    process: {
      heapTotal: string;
      heapUsed: string;
      external: string;
      rss: string;
    };
  };
  security: SecurityInfoResponse;
}

export interface SecurityInfoResponse {
  message: string;
  features: string[];
  cookieSettings: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: string;
    maxAge: {
      accessToken: string;
      refreshToken: string;
    };
  };
  rateLimits: {
    global: string;
    signup: string;
    signin: string;
  };
  environment: {
    nodeEnv: string;
    isProduction: boolean;
    port: number;
    frontendUrl: string;
  };
}

export interface DatabaseHealthResponse {
  database: 'connected' | 'disconnected' | 'connecting' | 'disconnecting' | 'error' | 'unknown';
  type: string;
  status: 'healthy' | 'unhealthy';
  responseTime?: string | null;
  host?: string;
  port?: number;
  dbName?: string;
  collections?: string[] | null;
  error?: string;
}

export interface DetailedHealthResponse {
  status: string;
  timestamp: string;
  uptime: string;
  environment: string;
  version: string;
  system: SystemHealthResponse['system'];
  security: SecurityInfoResponse;
  database: DatabaseHealthResponse;
  checks: {
    system: boolean;
    database: boolean;
    security: boolean;
  };
}

export interface BasicHealthResponse {
  status: string;
  timestamp: string;
}