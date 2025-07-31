import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import {
  SystemHealthResponse,
  SecurityInfoResponse,
  DatabaseHealthResponse,
  DetailedHealthResponse,
} from '@common';

/**
 * Health Monitoring Service
 * 
 * Provides comprehensive system health checks including:
 * - Basic application status
 * - Database connectivity verification
 * - Security configuration overview
 * - Detailed system diagnostics
 * 
 * Used by load balancers and monitoring systems
 */
@Injectable()
export class HealthService {
  constructor(
    private readonly configService: ConfigService,
    @InjectConnection() private readonly mongoConnection: Connection,
  ) {}

  /**
   * Basic health check for load balancers
   * @returns Simple health status
   */
  getSystemHealth(): SystemHealthResponse {
    const memoryUsage = process.memoryUsage();
    const systemMemory = os.totalmem();
    const freeMemory = os.freemem();
    
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: this.formatUptime(process.uptime()),
      environment: this.configService.get<string>('NODE_ENV') || 'development',
      version: this.getPackageVersion(),
      system: {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        cpus: os.cpus().length,
        memory: {
          total: this.formatBytes(systemMemory),
          free: this.formatBytes(freeMemory),
          used: this.formatBytes(systemMemory - freeMemory),
          usage: `${(((systemMemory - freeMemory) / systemMemory) * 100).toFixed(2)}%`
        },
        process: {
          heapTotal: this.formatBytes(memoryUsage.heapTotal),
          heapUsed: this.formatBytes(memoryUsage.heapUsed),
          external: this.formatBytes(memoryUsage.external),
          rss: this.formatBytes(memoryUsage.rss)
        }
      },
      security: this.getSecurityInfo()
    };
  }

  /**
   * Database connectivity and performance check
   * @returns Database connection status and metrics
   */
  async getDatabaseHealth(): Promise<DatabaseHealthResponse> {
    const host = this.configService.get<string>('MONGO_HOST') || 'localhost';
    const port = this.configService.get<number>('MONGO_PORT') || 27017;
    const dbName = this.configService.get<string>('MONGO_DB_NAME') || 'nest-auth';

    // Check connection state
    const connectionStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    const connectionState = connectionStates[this.mongoConnection.readyState as 0 | 1 | 2 | 3] || 'unknown';

    if (this.mongoConnection.readyState !== 1) {
      return {
        database: connectionState as DatabaseHealthResponse['database'],
        type: 'MongoDB',
        status: 'unhealthy',
        responseTime: null,
        host,
        port,
        dbName,
        collections: null,
      };
    }

    try {
      const startTime = Date.now();
      if (!this.mongoConnection.db || !this.mongoConnection.db.admin) {
        throw new Error('MongoDB connection or admin interface is undefined');
      }
      await this.mongoConnection.db.admin().ping();
      const responseTime = `${Date.now() - startTime}ms`;

      // Get collections list
      const collections = await this.mongoConnection.db.listCollections().toArray();
      const collectionNames = collections.map(col => col.name);

      return {
        database: 'connected',
        type: 'MongoDB',
        status: 'healthy',
        responseTime,
        host,
        port,
        dbName,
        collections: collectionNames,
      };
    } catch (error) {
      return {
        database: 'error',
        type: 'MongoDB',
        status: 'unhealthy',
        error: (error as Error).message,
        responseTime: null,
      };
    }
  }

  /**
   * Security configuration overview
   * @returns Active security features and settings
   */
  getSecurityInfo(): SecurityInfoResponse {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    const isProduction = nodeEnv === 'production';
    
    return {
      message: 'Security features active',
      features: [
        '🛡️ Helmet security headers',
        '⏱️ Rate limiting (100 requests/minute, 5 requests/minute, 10 requests/minute)',
        '🧹 Input sanitization & XSS protection',
        '🍪 Secure HTTP-only cookies with SameSite',
        '🔒 CSRF protection via SameSite cookies',
        '📏 Request size limits (1MB)',
        '📋 Content-type validation',
        '🚨 Global exception handling',
        '📝 Request logging',
        '✅ Input validation with class-validator'
      ],
      cookieSettings: {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: {
          accessToken: this.configService.get<string>('JWT_EXPIRES_IN') || '15m',
          refreshToken: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
        },
      },
      rateLimits: {
        global: '100 requests/minute',
        signup: '5 requests/minute',
        signin: '10 requests/minute'
      },
      environment: {
        nodeEnv: nodeEnv || 'development',
        isProduction,
        port: this.configService.get<number>('PORT') || 3000,
        frontendUrl: this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'
      }
    };
  }

  /**
   * Comprehensive system diagnostics
   * @returns Detailed system information and metrics
   */
  async getDetailedHealth(): Promise<DetailedHealthResponse> {
    const systemHealth = this.getSystemHealth();
    const databaseHealth = await this.getDatabaseHealth();

    return {
      status: systemHealth.status,
      timestamp: systemHealth.timestamp,
      uptime: systemHealth.uptime,
      environment: systemHealth.environment,
      version: systemHealth.version,
      system: systemHealth.system,
      security: systemHealth.security,
      database: databaseHealth,
      checks: {
        system: true,
        database: databaseHealth.status === 'healthy',
        security: true,
      },
    };
  }

  /**
   * Format uptime seconds into human readable format
   */
  private formatUptime(uptimeSeconds: number): string {
    const days = Math.floor(uptimeSeconds / 86400);
    const hours = Math.floor((uptimeSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0) parts.push(`${seconds}s`);

    return parts.join(' ') || '0s';
  }

  /**
   * Format bytes into human readable format
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  /**
   * Get package version from package.json
   */
  private getPackageVersion(): string {
    try {
      const packagePath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      return packageJson.version || '1.0.0';
    } catch (error) {
      return '1.0.0';
    }
  }
}