import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import express from 'express';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: false });
  const config = app.get(ConfigService);

  const uploadsDir = config.get<string>('MEDIA_UPLOAD_DIR') || join(process.cwd(), 'uploads');
  if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });
  app.use('/uploads', express.static(uploadsDir));

  app.setGlobalPrefix('api');

  // Server-side validation for every request body / query / param.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Centralized error handling + structured request logging.
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // CORS for the existing static frontend.
  const origins = (config.get<string>('CORS_ORIGIN') || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({
    origin: origins.length ? origins : true,
    credentials: true,
  });

  // OpenAPI / Swagger docs at /api/docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ИНДУСТРИЯ ЗДОРОВЬЯ API')
    .setDescription('REST API для платформы «ИНДУСТРИЯ ЗДОРОВЬЯ»')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = config.get<number>('PORT') || 4000;
  await app.listen(port);
  Logger.log(`ИНДУСТРИЯ ЗДОРОВЬЯ API running on http://localhost:${port}/api (docs: /api/docs)`, 'Bootstrap');
}
bootstrap();
