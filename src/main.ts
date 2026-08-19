import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import dns from 'node:dns';

dns.setServers([
  '8.8.8.8',
  '8.8.4.4',
]);

async function main() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }));
  await app.listen(process.env.PORT ?? 3000);
}
main();
