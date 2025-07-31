import { InternalServerErrorException } from '@nestjs/common';

/**
 * Error handler decorator that converts unknown errors to InternalServerErrorException
 * Logging is handled by the global exception filter - no duplicate logging here
 */
export function HandleErrors(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    try {
      return await method.apply(this, args);
    } catch (error) {
      // Re-throw known NestJS exceptions (they'll be handled by exception filter)
      if (
        typeof error === 'object' &&
        error !== null &&
        'constructor' in error &&
        typeof (error as any).constructor?.name === 'string' &&
        (error as any).constructor.name.includes('Exception')
      ) {
        throw error;
      }
      
      // Convert unknown errors to internal server error
      // The exception filter will handle logging this properly
      throw new InternalServerErrorException('Internal server error');
    }
  };

  return descriptor;
}