import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from './config/app.config';
import { SwaggerModule } from '@nestjs/swagger';
import { appSwaggerConfig, setSwaggerConfig } from '@app/common/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const appConfig = configService.get<IAppConfig>('app');

  app.setGlobalPrefix(`${appConfig?.apiPrefix}/${appConfig?.apiVersion}`);

  // Swagger setup
  if (appConfig?.env !== 'production') {
    const documentBuilder = SwaggerModule.createDocument(
      app,
      setSwaggerConfig(appSwaggerConfig),
    );
    SwaggerModule.setup('api', app, documentBuilder);
  }

  const port = appConfig?.port || 3000;
  await app.listen(port);

  console.log(
    `🚀 Healthy Appointment API is running on: ${await app.getUrl()}`,
  );
  console.log(`📝 API Documentation: ${await app.getUrl()}/api`);
  console.log(`🌐 Environment: ${appConfig?.env}`);
}
bootstrap().catch(console.error);
