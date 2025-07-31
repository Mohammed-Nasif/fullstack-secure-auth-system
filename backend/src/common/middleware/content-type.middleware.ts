import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ContentTypeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    // Only check POST/PUT/PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      const contentType = req.get('Content-Type');
      
      // Ensure JSON content type for API endpoints
      if (!contentType || !contentType.includes('application/json')) {
        throw new BadRequestException('Content-Type must be application/json');
      }
    }
    
    next();
  }
}