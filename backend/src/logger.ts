import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import chalk from 'chalk';
import * as path from 'path';

/**
 * Custom formatter with chalk colors for different log levels
 */
const colorizedFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, context, stack, ...meta }) => {
    // Color coding for different log levels
    let coloredLevel: string;
    switch (level) {
      case 'error':
        coloredLevel = chalk.red.bold('ERROR');
        break;
      case 'warn':
        coloredLevel = chalk.yellow.bold('WARN ');
        break;
      case 'info':
        coloredLevel = chalk.green.bold('INFO ');
        break;
      case 'http':
        coloredLevel = chalk.magenta.bold('HTTP ');
        break;
      case 'debug':
        coloredLevel = chalk.cyan.bold('DEBUG');
        break;
      default:
        coloredLevel = chalk.gray.bold(level.toUpperCase());
    }

    // Color the timestamp
    const coloredTimestamp = chalk.gray(`[${timestamp}]`);
    
    // Color the context if provided
    const coloredContext = context ? chalk.blue(`[${context}]`) : '';
    
    // Build the base log message
    let logMessage = `${coloredTimestamp} ${coloredLevel} ${coloredContext} ${message}`;
    
    // Add metadata if present (for request logging)
    if (Object.keys(meta).length > 0) {
      const metaString = Object.entries(meta)
        .map(([key, value]) => `${chalk.dim(key)}: ${chalk.white(value)}`)
        .join(' | ');
      logMessage += ` ${chalk.dim('|')} ${metaString}`;
    }
    
    // Add stack trace for errors
    if (stack) {
      logMessage += `\n${chalk.red(stack)}`;
    }
    
    return logMessage;
  })
);

/**
 * File format without colors (for log files)
 */
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

export const winstonConfig: WinstonModuleOptions = {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transports: [
    // Console transport with colors
    new winston.transports.Console({
      format: colorizedFormat,
    }),
    
    // File transports for production (without colors)
    ...(process.env.NODE_ENV === 'production' ? [
      // Error logs
      new winston.transports.File({
        filename: path.join('logs', 'error.log'),
        level: 'error',
        format: fileFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
      // Combined logs
      new winston.transports.File({
        filename: path.join('logs', 'combined.log'),
        format: fileFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
    ] : []),
  ],
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, message, stack }) => {
          return chalk.red.bold(`[${timestamp}] UNCAUGHT EXCEPTION: ${message}\n${stack}`);
        })
      ),
    }),
    ...(process.env.NODE_ENV === 'production' ? [
      new winston.transports.File({
        filename: path.join('logs', 'exceptions.log'),
        format: fileFormat,
      }),
    ] : []),
  ],
  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, message, stack }) => {
          return chalk.red.bold(`[${timestamp}] UNHANDLED REJECTION: ${message}\n${stack}`);
        })
      ),
    }),
    ...(process.env.NODE_ENV === 'production' ? [
      new winston.transports.File({
        filename: path.join('logs', 'rejections.log'),
        format: fileFormat,
      }),
    ] : []),
  ],
};
