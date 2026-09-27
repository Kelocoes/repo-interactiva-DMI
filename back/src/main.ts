import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import { join } from 'path';
import * as fs from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Asegurar que la carpeta de subidas existe antes de servir archivos estáticos
  const uploadsPath = join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }

  // Servir archivos estáticos subidos (/uploads/stores/...)
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });

  // Habilitar CORS para permitir peticiones desde Vite u otros clientes
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Limitar el tamaño de payload a 10MB para prevenir ataques DoS o payloads gigantes
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));

  // Habilitar validaciones automáticas con class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Servidor backend NestJS corriendo en http://localhost:${port}`);
  console.log(`📂 Archivos estáticos servidos en http://localhost:${port}/uploads/`);
}
bootstrap();
