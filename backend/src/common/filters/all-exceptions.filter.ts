import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import chalk from 'chalk';
import { createErrorResponse } from '../utils/response.util';
import { HttpStatusUtil } from '../utils/http-status.util';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || exception.message;
      } else {
        message = exceptionResponse as string;
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }

    this.logError(request, status, message, exception);
    response.status(status).json(createErrorResponse(message, status));
  }

  private logError(request: Request, status: number, message: string, exception: unknown) {
    const { method, url, ip } = request;
    const cleanIp = ip?.replace('::ffff:', '') || 'unknown';
    const userAgent = request.get('User-Agent')?.substring(0, 50) || 'unknown';
    const userId = (request as any).user?.userId || 'anonymous';

    const { color: statusColor, icon, statusText } = this.getErrorInfo(status);
    const methodColor = this.getMethodColor(method);
    
    const context = [
      `ip: ${chalk.gray(cleanIp)}`,
      userId !== 'anonymous' ? `user: ${chalk.blue(userId)}` : null,
      `agent: ${chalk.gray(userAgent)}`
    ].filter(Boolean).join(' | ');

    const logMessage = `${icon} ${methodColor} ${chalk.white(url)} ${statusColor} ${chalk.dim(`(${statusText})`)} - ${chalk.white(message)} | ${context}`;
    
    if (status >= 500) {
      this.logger.error(logMessage, exception instanceof Error ? exception.stack : undefined);
    } else if (status >= 400) {
      this.logger.error(logMessage);
    } else if (status >= 300) {
      this.logger.warn(logMessage);
    } else {
      this.logger.log(logMessage);
    }
  }

  private getErrorInfo(status: number): { color: string; icon: string; statusText: string } {
    const statusText = HttpStatusUtil.getStatusText(status);
    
    if (status >= 500) {
      return { color: chalk.red.bold(status.toString()), icon: chalk.red('🔥'), statusText };
    } else if (status >= 400) {
      return { color: chalk.yellow.bold(status.toString()), icon: chalk.yellow('❌'), statusText };
    } else if (status >= 300) {
      return { color: chalk.blue.bold(status.toString()), icon: chalk.blue('↻'), statusText };
    } else {
      return { color: chalk.green.bold(status.toString()), icon: chalk.green('✓'), statusText };
    }
  }

  private getMethodColor(method: string): string {
    switch (method) {
      case 'GET': return chalk.green(method);
      case 'POST': return chalk.yellow(method);
      case 'PUT': return chalk.blue(method);
      case 'PATCH': return chalk.cyan(method);
      case 'DELETE': return chalk.red(method);
      default: return chalk.gray(method);
    }
  }
}