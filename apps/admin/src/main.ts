import { NestFactory } from '@nestjs/core';
import { AdminModule } from './admin.module';
import { ErrorHandlingInterceptor } from '@app/common/interceptor/error-handler.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AdminModule);

  app.useGlobalInterceptors(new ErrorHandlingInterceptor());

  await app.listen(process.env.ADMIN_PORT ?? 3001);
}
bootstrap();
