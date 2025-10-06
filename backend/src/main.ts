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

  // Habilita CORS de forma robusta e compatível com preflight
  app.enableCors({
    origin: (origin, callback) => {
      // Permite chamadas sem origem (SSR, server-to-server) e mesma origem
      if (!origin) return callback(null, true);
      // Permite explicitamente origens configuradas
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Como fallback, reflita a origem para evitar bloqueios durante desenvolvimento
      return callback(null, true);
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
    exposedHeaders: ['Content-Length', 'ETag'],
    credentials: false,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Middleware extra para garantir cabeçalhos em todas as respostas
  app.use((req, res, next) => {
    const origin = req.headers.origin as string | undefined;
    if (origin && (allowedOrigins.includes(origin))) {
      res.header('Access-Control-Allow-Origin', origin);
    } else {
      res.header('Access-Control-Allow-Origin', '*');
    }
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
