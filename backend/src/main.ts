import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './logger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as express from 'express';
import { 
  SECURITY_CONFIG, 
  AllExceptionsFilter, 
  ENVIRONMENT, 
  EnvironmentUtils,
  API_ENDPOINTS,
  EndpointUtils
} from '@common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  const configService = app.get(ConfigService);
  
  // Get all configuration values from ConfigService
  const port = configService.get<number>('PORT') as number;
  const nodeEnv = configService.get<string>('NODE_ENV') as string;
  const frontendUrl = configService.get<string>('FRONTEND_URL') as string;

  // Request size limits (prevent DoS attacks)
  app.use(express.json({ limit: SECURITY_CONFIG.REQUEST_SIZE_LIMIT }));
  app.use(express.urlencoded({ extended: true, limit: SECURITY_CONFIG.REQUEST_SIZE_LIMIT }));

  // Security headers with Helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: SECURITY_CONFIG.HELMET_CSP,
    },
    crossOriginEmbedderPolicy: false, // Allow Swagger UI to work
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true
    }
  }));

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });
  
  app.use(cookieParser());
  app.useGlobalFilters(new AllExceptionsFilter());

  // Enhanced validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      // Disable error messages in production only
      disableErrorMessages: EnvironmentUtils.isProduction(nodeEnv),
    }),
  );

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Secure Auth API')
    .setDescription('Production-ready authentication API with comprehensive security features')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'User authentication endpoints')
    .addTag('Health & Monitoring', 'System health and monitoring endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(API_ENDPOINTS.DOCS.BASE, app, document);

  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 Swagger docs available at http://localhost:${port}/${API_ENDPOINTS.DOCS.BASE}`);
  console.log(`🏥 Health checks available at:`);
  console.log(`  - http://localhost:${port}/${EndpointUtils.buildHealthPath()}`);
  console.log(`  - http://localhost:${port}/${EndpointUtils.buildHealthPath('SECURITY')}`);
  console.log(`  - http://localhost:${port}/${EndpointUtils.buildHealthPath('DATABASE')}`);
  console.log(`  - http://localhost:${port}/${EndpointUtils.buildHealthPath('DETAILED')}`);
  console.log(`🌍 Environment: ${nodeEnv}`);
  console.log(`🔗 CORS enabled for: ${frontendUrl}`);
}
bootstrap();
