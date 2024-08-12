import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:4200',
      'https://localhost:4300',
      'http://localhost:5000',
    ],
    credentials: true,
  });
  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();
