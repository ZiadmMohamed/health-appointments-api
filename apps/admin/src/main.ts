import { NestFactory } from '@nestjs/core';
import { AdminModule } from './admin.module';
import { ErrorHandlingInterceptor } from '@app/common/interceptor/error-handler.interceptor';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  
  const app = await NestFactory.create(AdminModule);
  const configService = app.get(ConfigService);

  app.useGlobalInterceptors(new ErrorHandlingInterceptor());
  const port = configService.get<number>('PORT') || 3000;

  try {
    await app.listen(port);
    console.log(`🚀 Admin Server is running on port ${port}`);
  } catch (error) {
    console.error(`❌ Error starting server: ${error}`);
    process.exit(1); 
  }
}
bootstrap().catch((err) => {
  console.error('Critical error during bootstrap:', err);
  process.exit(1);
});