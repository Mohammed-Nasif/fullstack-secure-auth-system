import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import { SECURITY_CONFIG, LoggerMiddleware, ContentTypeMiddleware, API_ENDPOINTS } from '@common';
import { validationSchema } from './config/validation.config';
import { getDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),

    ThrottlerModule.forRoot([SECURITY_CONFIG.RATE_LIMITS.GLOBAL]),

    AuthModule,
    UsersModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ContentTypeMiddleware)
      .forRoutes(`${API_ENDPOINTS.AUTH.BASE}/*`)
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
