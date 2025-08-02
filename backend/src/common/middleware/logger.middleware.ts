import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';
import { getStatusText } from '@common';

/**
 * HTTP Request/Response Logger Middleware
 * 
 * Features:
 * - Colored console output for better readability
 * - Request timing and response size tracking
 * - User context logging (when authenticated)
 * - Different log levels based on response status
 * - Truncated user agent for cleaner logs
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('User-Agent') || '';
    const startTime = Date.now();
    const userId = (req as any).user?.userId || 'anonymous';
    const userEmail = (req as any).user?.email || '';

    this.logRequest(method, originalUrl, ip ?? 'unknown', userAgent, userId, userEmail);

    const originalEnd = res.end;
    const self = this;
    
    res.end = function (this: Response, ...args: any[]) {
      const duration = Date.now() - startTime;
      const { statusCode } = res;
      const contentLength = res.get('content-length') || '0';

      const logMessage = LoggerMiddleware.formatResponse(method, originalUrl, statusCode, duration, contentLength, userId);
      
      if (statusCode >= 500) {
        self.logger.error(logMessage);
      } else if (statusCode >= 400) {
        self.logger.error(logMessage);
      } else if (statusCode >= 300) {
        self.logger.warn(logMessage);
      } else {
        self.logger.log(logMessage);
      }

      return originalEnd.apply(this, [...args] as [chunk: any, encoding: BufferEncoding, cb?: (() => void) | undefined]);
    } as any;

    next();
  }

  /**
   * Logs incoming request details with user context
   */
  private logRequest(method: string, url: string, ip: string, userAgent: string, userId: string, email: string) {
    const cleanIp = ip?.replace('::ffff:', '') || 'unknown';
    const shortUserAgent = userAgent.substring(0, 50) + (userAgent.length > 50 ? '...' : '');
    const methodColor = this.getMethodColor(method);
    const arrow = chalk.cyan('→');

    const context = [
      `ip: ${chalk.gray(cleanIp)}`,
      userId !== 'anonymous' ? `user: ${chalk.blue(userId)}` : null,
      email ? `email: ${chalk.cyan(email)}` : null,
      `agent: ${chalk.gray(shortUserAgent)}`
    ].filter(Boolean).join(' | ');

    this.logger.log(`${arrow} ${methodColor} ${chalk.white(url)} | ${context}`);
  }

  /**
   * Formats response log with performance metrics
   */
  private static formatResponse(method: string, url: string, statusCode: number, duration: number, size: string, userId: string): string {
    const { color, icon, statusText } = LoggerMiddleware.getStatusInfo(statusCode);
    const methodColor = LoggerMiddleware.getMethodColorStatic(method);

    const context = [
      `${chalk.dim('duration')}: ${LoggerMiddleware.getDurationColor(duration)}`,
      `${chalk.dim('size')}: ${chalk.gray(size)}`,
      userId !== 'anonymous' ? `${chalk.dim('user')}: ${chalk.blue(userId)}` : null
    ].filter(Boolean).join(' | ');

    return `${icon} ${methodColor} ${chalk.white(url)} ${color} ${chalk.dim(`(${statusText})`)} | ${context}`.trim();
  }

  /**
   * Returns colored HTTP method for console output
   */
  private getMethodColor(method: string): string {
    return LoggerMiddleware.getMethodColorStatic(method);
  }

  /**
   * Static version of method color for response formatting
   */
  private static getMethodColorStatic(method: string): string {
    switch (method) {
      case 'GET': return chalk.green(method);
      case 'POST': return chalk.yellow(method);
      case 'PUT': return chalk.blue(method);
      case 'PATCH': return chalk.cyan(method);
      case 'DELETE': return chalk.red(method);
      default: return chalk.gray(method);
    }
  }

  /**
   * Returns status code styling with icons
   */
  private static getStatusInfo(statusCode: number): { color: string; icon: string; statusText: string } {
    const statusText = getStatusText(statusCode);
    
    if (statusCode >= 500) {
      return { color: chalk.red.bold(statusCode.toString()), icon: chalk.red('🔥'), statusText };
    } else if (statusCode >= 400) {
      return { color: chalk.yellow.bold(statusCode.toString()), icon: chalk.yellow('❌'), statusText };
    } else if (statusCode >= 300) {
      return { color: chalk.blue.bold(statusCode.toString()), icon: chalk.blue('↻'), statusText };
    } else {
      return { color: chalk.green.bold(statusCode.toString()), icon: chalk.green('✓'), statusText };
    }
  }

  /**
   * Returns duration-based color coding
   */
  private static getDurationColor(duration: number): string {
    if (duration > 2000) return chalk.red.bold(`${duration}ms`);
    if (duration > 1000) return chalk.yellow.bold(`${duration}ms`);
    if (duration > 500) return chalk.blue(`${duration}ms`);
    return chalk.green(`${duration}ms`);
  }
}