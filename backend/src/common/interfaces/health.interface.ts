export interface DatabaseHealth {
  database: string;
  type: string;
  status: 'healthy' | 'unhealthy';
  responseTime?: string | null;
  host?: string;
  port?: number;
  dbName?: string;
  collections?: string[] | null;
  error?: string;
}

export interface SystemHealth {
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
  security: Record<string, string>;
}

export interface DetailedHealth extends SystemHealth {
  security: any;
  database: DatabaseHealth;
  checks: {
    system: boolean;
    database: boolean;
    security: boolean;
  };
}