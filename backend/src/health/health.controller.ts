import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { API_ENDPOINTS, BasicHealthResponse } from '@common';

/**
 * Health Controller
 *
 *    SECURITY NOTE: These endpoints are currently PUBLIC
 *    TODO: Implement role-based access control (RBAC) before production:
 *    - /health → PUBLIC (basic status for load balancers)
 *    - /health/security → ADMIN only
 *    - /health/database → ADMIN only
 *    - /health/detailed → ADMIN only
 *
 * Enhancement: Add roles (USER, ADMIN) and permissions system
 */
@ApiTags('Health & Monitoring')
@Controller(API_ENDPOINTS.HEALTH.BASE)
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({
    summary: 'Basic health check',
    description: 'PUBLIC endpoint - consider protecting in production'
  })
  getHealth(): BasicHealthResponse {
    // TODO: Return minimal info only for public access
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }

  @Get(API_ENDPOINTS.HEALTH.SECURITY)
  @ApiOperation({
    summary: 'Security features overview',
    description: 'TODO: Protect with ADMIN role in production'
  })
  getSecurityInfo() {
    return this.healthService.getSecurityInfo();
  }

  @Get(API_ENDPOINTS.HEALTH.DATABASE)
  @ApiOperation({
    summary: 'Database connectivity check',
    description: 'TODO: Protect with ADMIN role in production'
  })
  async getDatabaseHealth() {
    return await this.healthService.getDatabaseHealth();
  }

  @Get(API_ENDPOINTS.HEALTH.DETAILED)
  @ApiOperation({
    summary: 'Comprehensive system status',
    description: 'TODO: Protect with ADMIN role in production'
  })
  async getDetailedHealth() {
    return await this.healthService.getDetailedHealth();
  }
}