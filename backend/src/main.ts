import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const allowedOrigins = (config.get<string>('CORS_ALLOWED_ORIGINS') || 'http://localhost:4200')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => !!s);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow server-to-server or same-origin
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
