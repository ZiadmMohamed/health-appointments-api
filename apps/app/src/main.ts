import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const appConfig = configService.get<IAppConfig>('app');

  app.setGlobalPrefix(`${appConfig?.apiPrefix}/${appConfig?.apiVersion}`);

  const port = appConfig?.port || 3000;
  await app.listen(port);

  console.log(
    `🚀 Healthy Appointment API is running on: ${await app.getUrl()}`,
  );
  console.log(`📝 API Documentation: ${await app.getUrl()}/api`);
  console.log(`🌐 Environment: ${appConfig?.env}`);
  console.log(appConfig);
}
bootstrap().catch(console.error);
