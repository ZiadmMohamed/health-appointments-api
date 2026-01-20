import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from './config/app.config';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfigApp } from '@app/common/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get config & app service
  const configService = app.get(ConfigService);
  const appConfig = configService.get<IAppConfig>('app');

  // Set global API prefix
  app.setGlobalPrefix(`${appConfig?.apiPrefix}/${appConfig?.apiVersion}`);

  // Swagger setup
  if (appConfig?.env !== 'production') {
    const documentBuilder = SwaggerModule.createDocument(
      app,
      swaggerConfigApp(),
    );
    SwaggerModule.setup('api', app, documentBuilder);
  }

  // Start server
  const port = appConfig?.port || 3000;
  await app.listen(port);

  console.log(
    `🚀 Healthy Appointment API is running on: ${await app.getUrl()}`,
  );
  console.log(`📝 API Documentation: ${await app.getUrl()}/api`);
  console.log(`🌐 Environment: ${appConfig?.env}`);
  console.log(appConfig);
}
bootstrap();
