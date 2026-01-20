import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfigApp = () =>
  new DocumentBuilder()
    .setTitle('Healthy Public API')
    .setDescription('Version 1 API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

export const swaggerConfigAdmin = () =>
  new DocumentBuilder()
    .setTitle('Healthy Admin API')
    .setDescription('Version 1 API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
